// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
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
// eslint-disable-next-line no-unused-vars
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore"; // Firestore imports
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Storage imports
import { initializeApp } from "firebase/app";

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
const db = getFirestore(app); // Firestore instance
const storage = getStorage(app); // Firebase storage instance

const ShopPost = () => {
  const [posts, setPosts] = useState([]);
  const [value, setValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [fileList, setFileList] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  // Show modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Handle image upload to Firebase storage
  const handleUpload = (file) => {
    const storageRef = ref(storage, `post-images/${file.name}`); // Reference to the image location in Firebase Storage
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        // Get the image URL after upload
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
        });
      })
      // eslint-disable-next-line no-unused-vars
      .catch((error) => {
        message.error("Failed to upload image.");
      });
    return false;
  };

  // Save post data to Firestore
  const onFinish = async (values) => {
    try {
      const post = { ...values, imageUrl }; // Combine form data with the uploaded image URL
      await addDoc(collection(db, "posts"), post); // Save to Firestore
      setPosts([...posts, post]); // Update local state with new post
      setIsModalVisible(false);
      setIsInfoVisible(true);
      message.success("Post added successfully!");
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      message.error("Failed to add post.");
    }
  };

  const deletePost = (index) => {
    const newPosts = posts.filter((_, i) => i !== index);
    setPosts(newPosts);
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
                  alt="Post"
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

            <Form.Item
              label="Link"
              name="link"
              rules={[{ required: true, message: "Please input Link!" }]}
            >
              <Input />
            </Form.Item>

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
            <p>
              <strong>Link:</strong> {selectedPost.link}
            </p>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ShopPost;
