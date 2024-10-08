// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Button, Modal, Form, Input, Card, Row, Col, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
// eslint-disable-next-line no-unused-vars
import dayjs from "dayjs";

const MyPond = () => {
  const [ponds, setPonds] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const [imageUrl, setImageUrl] = useState(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result); // Save base64 image
      // eslint-disable-next-line no-undef
      message.success(`${file.name} file uploaded successfully`);
    };
    reader.readAsDataURL(file); // Convert the image file to base64
    return false; // Prevent antd's automatic upload
  };

  // Handle change in the upload component to trigger preview
  const handleChange = (info) => {
    if (info.file.status === "error") {
      // eslint-disable-next-line no-undef
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  //delete Pond
  const deletePond = (index) => {
    const newPonds = ponds.filter((_, i) => i !== index);
    setPonds(newPonds);
  };

  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      imageUrl,
    };
    console.log("Form values:", formattedValues);
    setPonds([...ponds, formattedValues]);
    setIsModalVisible(false); // Close modal after submit
    setIsInfoVisible(true); // Show info after input
  };

  return (
    <div className="flex-container">
      <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-white p-8">My Pond</h1>
        <p className="text-white p-8">
          Thông tin chi tiết về hồ cá Koi của bạn.
        </p>
        <div>
          {/* Nút để mở popup */}
          <div className="flex flex-col items-center">
            <Button className="" type="primary" onClick={showModal}>
              Input
            </Button>
          </div>
          {/* Form trong Modal */}
          <Modal
            title="Input Pond Information"
            visible={isModalVisible}
            onCancel={handleCancel} // Nút close
            footer={null} // Tùy chỉnh để không có nút mặc định ở dưới modal
          >
            <Form layout="vertical" onFinish={onFinish}>
              {/* Upload component for image */}
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
                  onChange={handleChange} // Handle the change event for feedback
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
                label="Pumping capacity"
                name="pumpingCapacity:"
                rules={[
                  { required: true, message: "Please input Pumping capacity!" },
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

          {/*show info form after input*/}

          {isInfoVisible && (
            <Row gutter={[200, 200]} style={{ marginTop: "20px" }}>
              {ponds.map((pond, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    key={index}
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
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
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
                        <strong>Skimmer Count:</strong>{" "}
                        {pond.skimmerCount || "-"}
                      </p>
                      <p>
                        <strong>Pumping Capacity:</strong>{" "}
                        {pond.pumpingCapacity || "-"}
                      </p>
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
