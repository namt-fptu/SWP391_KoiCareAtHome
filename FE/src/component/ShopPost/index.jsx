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

const ShopPost = () => {
  const [posts, setPosts] = useState([]);
  const [value, setValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [fileList, setFileList] = useState([]);

  // Retrieve pondOwnerId from sessionStorage
  const id = sessionStorage.getItem("id");

  useEffect(() => {
    if (!id) {
      message.error("User not logged in. Unable to fetch posts.");
      return;
    }

    // Fetch posts from the API based on the logged-in user's id
    const fetchPosts = async () => {
      try {
        const response = await api.get(`Post/posts/${id}`);
        setPosts(response.data);
      } catch (error) {
        message.error("Failed to fetch post data.");
      }
    };

    fetchPosts();
  }, [id]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFileList([]);
    setImageUrl(null);
  };

  const uploadToFirebase = async (file) => {
    if (!file) return null;
    const storageRef = ref(storage, `post-images/${file.name}`);

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

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const deletePost = (index) => {
    const newPosts = posts.filter((_, i) => i !== index);
    setPosts(newPosts);
  };

  const onFinish = async (values) => {
    const file = fileList[0];
    const uploadedImageUrl = await uploadToFirebase(file);

    if (uploadedImageUrl) {
      const postData = {
        shopId: Number(id), // Use ShopId from sessionStorage
        title: values.title,
        content: values.content,
        imageUrl: uploadedImageUrl,
        advDate: new Date(),
        status: "Processing",
      };

      try {
        const response = await api.post("Adv/createAdv", postData);
        setPosts([...posts, response.data]); // Update ponds with the newly created one
        setIsModalVisible(false);
        message.success("Post information added successfully!");
      } catch (error) {
        message.error("Failed to add post information.");
      }
    } else {
      message.error("Failed to upload image.");
    }
  };

  const handleShowDetail = (post) => {
    setSelectedPost(post);
  };

  const handleDetailClose = () => {
    setSelectedPost(null);
  };

  const getShortContent = (content) => {
    const maxLength = 100; // số ký tự tóm tắt
    return content.length > maxLength
      ? content.slice(0, maxLength) + "..."
      : content;
  };

  return (
    <div className="flex-container">
      <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-8 text-white p-8">My Posts</h1>
          <div className="flex flex-col items-center">
            <Button type="primary" onClick={showModal}>
              Create Post
            </Button>
          </div>
        </div>
        <Modal
          title="Input Post"
          visible={isModalVisible}
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
                beforeUpload={handleUpload}
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
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please input Title!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Content"
              name="content"
              rules={[{ required: true, message: "Please input Content!" }]}
            >
              <Input.TextArea
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </Form.Item>

            {/* <Form.Item
              label="Link"
              name="link"
              rules={[{ required: true, message: "Please input Link!" }]}
            >
              <Input />
            </Form.Item> */}

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
              <Button onClick={handleCancel} style={{ marginLeft: "10px" }}>
                Close
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {isInfoVisible && (
          <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
            {posts.map((post, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Card
                  title={`Post: ${post.title}`}
                  extra={
                    <Button danger onClick={() => deletePost(index)}>
                      Delete
                    </Button>
                  }
                  style={{ width: 400, marginBottom: "20px" }}
                >
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      style={{ width: "100%" }}
                    />
                  )}
                  <p className="break-words whitespace-pre-wrap overflow-hidden">
                    <strong>Content:</strong> {getShortContent(post.content)}
                  </p>
                  <Button type="link" onClick={() => handleShowDetail(post)}>
                    Detail
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Popup hiển thị chi tiết */}
        {selectedPost && (
          <Modal
            title="Full Content"
            visible={!!selectedPost}
            onCancel={handleDetailClose}
            footer={[
              <Button key="close" onClick={handleDetailClose}>
                Close
              </Button>,
            ]}
          >
            {selectedPost.imageUrl && (
              <img
                src={selectedPost.imageUrl}
                alt="Post"
                style={{ width: "100%" }}
              />
            )}
            <p>
              <strong>Title:</strong> {selectedPost.title}
            </p>
            <p className="break-words whitespace-pre-wrap overflow-hidden">
              <strong>Content:</strong> {selectedPost.content}
            </p>
            {/* <p>
              <strong>Link:</strong> {selectedPost.link}
            </p> */}
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ShopPost;
