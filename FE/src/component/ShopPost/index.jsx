// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Button, Modal, Form, Input, Card, Row, Col, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const ShopPost = () => {
  const [posts, setPosts] = useState([]);
  const [value, setValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const deletePost = (index) => {
    const newPosts = posts.filter((_, i) => i !== index);
    setPosts(newPosts);
  };

  const onFinish = (values) => {
    const formattedValues = { ...values, imageUrl };
    setPosts([...posts, formattedValues]);
    setIsModalVisible(false);
    setIsInfoVisible(true);
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
