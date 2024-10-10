import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import { Button, Modal, Form, Input, Card, Row, Col, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const MyPond = () => {
  const [ponds, setPonds] = useState([]); // State for storing pond data
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const [imageUrl, setImageUrl] = useState(null); // State for storing uploaded image URL
  const [errorMessage, setErrorMessage] = useState(null); // State for error messages

  // Fetch ponds from the API
  const fetchPonds = async () => {
    try {
      const response = await api.get('Pond/createPond'); // Gọi API để lấy dữ liệu hồ
      setPonds(response.data); // Update state with the fetched data
    } catch (error) {
      console.error("Error fetching pond data:", error);
      setErrorMessage("Failed to fetch pond data. Please try again."); // Set error message
    }
  };

  useEffect(() => {
    fetchPonds(); // Call fetchPonds when component mounts
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result); // Save image as base64
      message.success(`${file.name} file uploaded successfully`);
    };
    reader.readAsDataURL(file); // Convert image file to base64
    return false; // Prevent automatic upload of antd
  };

  const deletePond = async (index) => {
    try {
      const pondToDelete = ponds[index];
      await api.delete(`Pond/${pondToDelete.id}`); // Gọi API để xóa hồ
      const newPonds = ponds.filter((_, i) => i !== index);
      setPonds(newPonds); // Cập nhật state sau khi xóa
      message.success("Pond deleted successfully!"); // Thông báo thành công
    } catch (error) {
      console.error("Error deleting pond:", error);
      setErrorMessage("Failed to delete pond. Please try again."); // Set error message
    }
  };

  const onFinish = async (values) => {
    const formattedValues = {
      ...values,
      imageUrl,
    };

    try {
      const response = await api.post('Pond', formattedValues); // Gọi API để thêm hồ mới
      setPonds([...ponds, response.data]); // Cập nhật state với hồ mới
      setIsModalVisible(false); // Đóng modal
      setImageUrl(null); // Đặt lại imageUrl
      message.success("Pond added successfully!"); // Thông báo thành công
    } catch (error) {
      console.error("Error adding pond data:", error);
      setErrorMessage("Failed to add pond data. Please try again."); // Set error message
    }
  };


  return (
    <div className="flex-container">
      <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-white">My Pond</h1>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Display error message */}
        <p className="text-white">Thông tin chi tiết về hồ cá Koi của bạn.</p>
        <div>
          <div className="flex flex-col items-center">
            <Button type="primary" onClick={showModal}>
              Input
            </Button>
          </div>
          <Modal
            title="Input Pond Information"
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
                name="drainCount"
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

          <Row gutter={[200, 200]} style={{ marginTop: "20px" }}>
            {ponds.map((pond, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Card
                  title={`Pond: ${pond.name}`}
                  extra={
                    <Button danger onClick={() => deletePond(index)}>
                      Delete
                    </Button>
                  }
                  style={{ width: 400, marginBottom: "20px" }}
                >
                  {pond.imageUrl && (
                    <img
                      src={pond.imageUrl}
                      alt="Pond"
                      style={{ width: "100%", height: "auto" }}
                    />
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <p>
                        <strong>Name:</strong> {pond.name || "-"}
                      </p>
                      <p>
                        <strong>Volume:</strong> {pond.volume || "-"}
                      </p>
                      <p>
                        <strong>Depth:</strong> {pond.depth || "-"}
                      </p>
                    </div>
                    <p>
                      <strong>Drain Count:</strong> {pond.drainCount || "-"}
                    </p>
                    <p>
                      <strong>Skimmer Count:</strong> {pond.skimmerCount || "-"}
                    </p>
                    <p>
                      <strong>Pumping Capacity:</strong> {pond.pumpingCapacity || "-"}
                    </p>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default MyPond;
