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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
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
  const [ponds, setPonds] = useState([]); // State for storing pond data
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const [imageUrl, setImageUrl] = useState(null); // State for storing uploaded image URL
  const [fileList, setFileList] = useState([]); // State for storing uploaded files

  // Retrieve id from sessionStorage
  const id = sessionStorage.getItem("id");

  useEffect(() => {
    if (!id) {
      message.error("User not logged in. Unable to fetch ponds.");
      return;
    }

    // Fetch ponds from the API based on the logged-in user's id
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFileList([]); // Reset file list
    setImageUrl(null); // Reset image URL
  };

  const handleUpload = (file) => {
    setFileList([file]);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
    return false; // Prevent automatic upload of antd
  };

  const uploadToFirebase = async (file) => {
    if (!file) return null;
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
        pondOwnerId: Number(id), // Use pondOwnerId from sessionStorage
      };

      try {
        const response = await api.post("Pond/createPond", pondData);
        setPonds([...ponds, response.data]); // Update ponds with the newly created one
        setIsModalVisible(false);
        message.success("Pond information added successfully!");
      } catch (error) {
        message.error("Failed to add pond information.");
      }
    } else {
      message.error("Failed to upload image.");
    }
  };

  // const deletePond = async (index) => {
  //   try {
  //     const pondToDelete = ponds[index];
  //     await api.delete(`Pond/${pondToDelete.id}`); // Call API to delete pond
  //     const newPonds = ponds.filter((_, i) => i !== index);
  //     setPonds(newPonds); // Update state after deletion
  //     message.success("Pond deleted successfully!"); // Success message
  //   } catch (error) {
  //     message.error("Failed to delete pond. Please try again."); // Error message
  //   }
  // };

  return (
    <div className="flex-container">
      <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-white">My Pond</h1>
        <p className="text-white">Thông tin chi tiết về hồ cá Koi của bạn.</p>
        <div>
          <div className="flex flex-col items-center">
            <Button type="primary" onClick={showModal}>
              Input
            </Button>
          </div>

          <Modal
            title="Input Pond Information"
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Upload Image"
                name="image"
                rules={[{ required: true, message: "Please upload an image!" }]}
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
                rules={[
                  { required: true, message: "Please input Drain Count!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Skimmer Count"
                name="skimmerCount"
                rules={[
                  { required: true, message: "Please input Skimmer Count!" },
                ]}
              >
                <Input />
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
                  Add
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
              {ponds.map((pond, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    title={`Pond: ${pond.name}`}
                    // extra={<Button danger onClick={() => deletePond(index)}>Delete</Button>}
                    style={{ marginBottom: "20px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }} // Added marginBottom, boxShadow, and borderRadius
                    onClick={() => showModal(pond)} // Click handler to show details
                  >
                    {pond.imageUrl && (
                      <img
                        src={pond.imageUrl}
                        alt="Pond"
                        style={{
                          width: "100%", // Ensure image takes full width of the card
                          height: "200px", // Fixed height for uniformity
                          objectFit: "cover", // Cover the area while maintaining aspect ratio
                          borderRadius: "8px 8px 0 0", // Rounded corners for the image
                        }}
                      />
                    )}
                    <p><strong>Volume:</strong> {pond.volume || "-"}</p>
                    <p><strong>Depth:</strong> {pond.depth || "-"}</p>
                    <p><strong>Drain Count:</strong> {pond.drainCount || "-"}</p>
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
