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
  Popconfirm,
} from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import api from "../../config/axios";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIcvSZRnSTBxw8yrLcq7AqLjqNhvaUQyk",
  authDomain: "swp391-76ab5.firebaseapp.com",
  projectId: "swp391-76ab5",
  storageBucket: "swp391-76ab5.appspot.com",
  messagingSenderId: "86962001326",
  appId: "1:86962001326:web:936799b1e20348cbb8643f",
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

  const id = sessionStorage.getItem("id");

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
        message.error("Failed to fetch pond data.");
      }
    };

    fetchPonds();
  }, [id]);

  const showModal = (pond = null) => {
    setEditingPond(pond);
    if (pond) {
      setImageUrl(pond.imageUrl);
      setFileList([]);
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFileList([]);
    setImageUrl(null);
    setEditingPond(null);
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
        draimCount: Number(values.draimCount),
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
      <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-white">My Pond</h1>
        <p className="text-white">Information about your Pond.</p>
        <div>
          <div className="flex flex-col items-center">
            <Button type="primary" onClick={() => showModal()}>
              Create New Pond
            </Button>
          </div>

          <Modal
            title={editingPond ? "Edit Pond Information" : "Input Pond Information"}
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <Form layout="vertical" onFinish={onFinish} initialValues={editingPond}>
              <Form.Item
                label="Upload Image"
                name="image"
                rules={[{ required: !editingPond, message: "Please upload an image!" }]}
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
                rules={[{ required: true, message: "Please input Volume!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Depth"
                name="depth"
                rules={[{ required: true, message: "Please input Depth!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Drain Count"
                name="draimCount"
                rules={[{ required: true, message: "Please input Drain Count!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Skimmer Count"
                name="skimmerCount"
                rules={[{ required: true, message: "Please input Skimmer Count!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Pumping Capacity"
                name="pumpingCapacity"
                rules={[{ required: true, message: "Please input Pumping Capacity!" }]}
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
                    <p>Volume: {pond.volume} liters</p>
                    <p>Depth: {pond.depth} meters</p>
                    <p>Drain Count: {pond.draimCount}</p>
                    <p>Skimmer Count: {pond.skimmerCount}</p>
                    <p>Pumping Capacity: {pond.pumpingCapacity} L/min</p>
                    <div className="card-buttons">
                      {/* Update button */}
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showModal(pond)}
                        style={{ marginRight: "10px" }}
                      >
                        Update
                      </Button>
                      {/* Delete button */}
                      <Popconfirm
                        title="Are you sure you want to delete this pond?"  // This text can be changed
                        onConfirm={() => deletePond(pond.id)}
                        okText="Yes"
                        cancelText="Cancel"
                      >
                        <Button
                          type="danger"
                          icon={<DeleteOutlined />}
                        />Delete
                      </Popconfirm>
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
