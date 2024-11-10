import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Card,
  Row,
  Col,
  Upload,
  message,
  notification,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import api from "../../config/axios";
import { useAuthStore } from "../../page/(auth)/store";
import backgroud from "./../../assets/wallpaper.jpg";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const MyPond = () => {
  const [ponds, setPonds] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [editingPond, setEditingPond] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [pondToDelete, setPondToDelete] = useState(null);
  const [form] = Form.useForm();

  const { authUser } = useAuthStore();
  const id = authUser.id;

  useEffect(() => {
    if (!id) {
      message.error("User not logged in. Unable to fetch ponds.");
      return;
    }

    const fetchPonds = async () => {
      try {
        const response = await api.get(`Pond/ponds/${id}`);
        setPonds(response.data);
      } catch (error) {
        notification.error({
          message: "Pond Not Found",
          description: "Maybe there are no ponds yet. Please add one.",
          duration: 2, // Duration in seconds
        });
      }
    };

    fetchPonds();
  }, [id]);

  const showModal = (pond = null) => {
    setEditingPond(pond);

    if (pond) {
      // Set form fields with existing pond data if editing
      setImageUrl(pond.imageUrl);
      setFileList([]);
      form.setFieldsValue(pond);
    } else {
      // Reset form fields if creating a new pond
      form.resetFields();
      setFileList([]);
      setImageUrl(null);
    }

    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFileList([]);
    setImageUrl(null);
    setEditingPond(null);
    form.resetFields(); // Reset form fields on cancel
  };

  const handleUpload = (file) => {
    setFileList([file]);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const uploadToFirebase = async (file) => {
    if (!file) return imageUrl;
    const storageRef = ref(storage, `pond-images/${file.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image to Firebase: ", error);
      message.error("Image upload failed!");
      return null;
    }
  };

  const onFinish = async (values) => {
    const file = fileList[0];
    const uploadedImageUrl = await uploadToFirebase(file);

    if (uploadedImageUrl) {
      const pondData = {
        name: values.name,
        depth: Number(values.depth),
        volume: Number(values.volume),
        drainCount: Number(values.drainCount),
        skimmerCount: Number(values.skimmerCount),
        pumpingCapacity: Number(values.pumpingCapacity),
        imageUrl: uploadedImageUrl,
        pondOwnerId: Number(id),
      };

      try {
        if (editingPond) {
          await api.put(`Pond/updatePond/${editingPond.id}`, pondData);
          setPonds((prev) =>
            prev.map((pond) =>
              pond.id === editingPond.id ? { ...pond, ...pondData } : pond
            )
          );
          message.success("Pond updated successfully!");
        } else {
          const response = await api.post("Pond/createPond", pondData);
          setPonds([...ponds, response.data]);
          message.success("Pond added successfully!");
        }

        setIsModalVisible(false);
        form.resetFields();
      } catch (error) {
        message.error(
          editingPond
            ? "Failed to update pond information."
            : "Failed to add pond information."
        );
      }
    } else {
      message.error("Failed to upload image.");
    }
  };

  const deletePond = async (pondId) => {
    try {
      // Make the API call to delete the pond
      await api.delete(`Pond/deletePond/${pondId}`);

      // Update the ponds state by filtering out the deleted pond
      setPonds((prevPonds) => prevPonds.filter((pond) => pond.id !== pondId));

      // Show success message
      message.success("Pond deleted successfully!");
    } catch (error) {
      // Show error message if delete fails
      message.error("Failed to delete pond. Please try again.");
    }
  };

  return (
    <div className="flex-container">
      <div
        className="flex-1 h-full p-5 bg-gray-900 min-h-screen"
        style={{
          backgroundImage: `url(${backgroud})`, // Set the background image
          backgroundSize: "cover", // Cover the entire container
          backgroundPosition: "center", // Center the image
        }}
      >
        <h1 className="text-3xl font-bold mb-8 text-white">My Pond</h1>
        <p className="text-white">Information about your Pond.</p>
        <div>
          <div className="flex flex-col items-center">
            <Button type="primary" onClick={() => showModal()}>
              Create New Pond
            </Button>
          </div>

          <Modal
            title={
              editingPond ? "Edit Pond Information" : "Input Pond Information"
            }
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Upload Image"
                name="image"
                rules={[
                  {
                    required: !editingPond,
                    message: "Please upload an image!",
                  },
                ]}
              >
                <Upload
                  name="image"
                  listType="picture"
                  maxCount={1}
                  showUploadList={false}
                  fileList={fileList}
                  beforeUpload={handleUpload}
                  onRemove={() => setFileList([])}
                >
                  <Button icon={<UploadOutlined />}>Select Image</Button>
                </Upload>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Pond"
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                )}
              </Form.Item>

              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input Name!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Volume"
                name="volume"
                rules={[
                  { required: true, message: "Please input Volume!" },
                  {
                    validator: (_, value) => {
                      if (value && parseFloat(value) > 0) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Volume must be a number greater than 0!")
                      );
                    },
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                label="Depth"
                name="depth"
                rules={[
                  { required: true, message: "Please input Depth!" },
                  {
                    validator: (_, value) => {
                      if (value && parseFloat(value) > 0) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Depth must be a number greater than 0!")
                      );
                    },
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                label="Drain Count"
                name="drainCount"
                rules={[
                  { required: true, message: "Please input Drain Count!" },
                  {
                    validator: (_, value) => {
                      if (!value || parseInt(value, 10) > 0) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Drain Count must be greater than 0!")
                      );
                    },
                  },
                ]}
              >
                <Input type="number" min={1} />
              </Form.Item>

              <Form.Item
                label="Skimmer Count"
                name="skimmerCount"
                rules={[
                  { required: true, message: "Please input Skimmer Count!" },
                  {
                    validator: (_, value) => {
                      if (!value || parseInt(value, 10) > 0) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Skimmer Count must be greater than 0!")
                      );
                    },
                  },
                ]}
              >
                <Input type="number" min={1} />
              </Form.Item>
              <Form.Item
                label="Pumping Capacity"
                name="pumpingCapacity"
                rules={[
                  { required: true, message: "Please input Pumping Capacity!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {editingPond ? "Update" : "Add"}
                </Button>
                <Button
                  type="default"
                  onClick={handleCancel}
                  style={{ marginLeft: "10px" }}
                >
                  Close
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          {ponds.length > 0 && (
            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
              {ponds.map((pond) => (
                <Col key={pond.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    cover={<img alt={pond.name} src={pond.imageUrl} />}
                  >
                    <Card.Meta title={pond.name} />
                    <p>
                      <strong>Volume: </strong>
                      {pond.volume} liters
                    </p>
                    <p>
                      <strong>Depth: </strong>
                      {pond.depth} meters
                    </p>
                    <p>
                      <strong>Drain Count: </strong>
                      {pond.drainCount} 
                    </p>
                    <p>
                      <strong>Skimmer Count: </strong>
                      {pond.skimmerCount}
                    </p>
                    <p>
                      <strong>Pumping Capacity: </strong>
                      {pond.pumpingCapacity} L/min
                    </p>
                    <div
                      className="card-buttons"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "10px",
                      }}
                    >
                      {/* Update button */}
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showModal(pond)}
                      >
                        Update
                      </Button>
                      <Button
                        type="danger"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          setPondToDelete(pond.id);
                          setIsDeleteModalVisible(true);
                        }}
                      >
                        Delete
                      </Button>
                      {/* Modal for delete confirmation */}
                      <Modal
                        title="Confirm Deletion"
                        open={isDeleteModalVisible}
                        onOk={() => {
                          deletePond(pondToDelete);
                          setIsDeleteModalVisible(false);
                          setPondToDelete(null);
                        }}
                        onCancel={() => {
                          setIsDeleteModalVisible(false);
                          setPondToDelete(null);
                        }}
                        okText="Delete"
                        okButtonProps={{ danger: true }}
                      >
                        <p>Are you sure you want to delete this pond?</p>
                      </Modal>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPond;
