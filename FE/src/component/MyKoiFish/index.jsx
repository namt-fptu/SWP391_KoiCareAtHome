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
  Select,
  DatePicker,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
// eslint-disable-next-line no-unused-vars
import dayjs from "dayjs";

const MyKoiFish = () => {
  const [kois, setKois] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleDateChange = (value) => {
    setSelectedDate(value);
  };

  const { Option } = Select;

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

  //delete Koi
  const deleteKoi = (index) => {
    const newKois = kois.filter((_, i) => i !== index);
    setKois(newKois);
  };

  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      inPondSince: selectedDate ? selectedDate.format("YYYY-MM-DD") : null,
      imageUrl,
    };
    console.log("Form values:", formattedValues);
    setKois([...kois, formattedValues]);
    setIsModalVisible(false); // Close modal after submit
    setIsInfoVisible(true); // Show info after input
  };
  return (
    <div className="flex-container">
      <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-white p-8">My Koi Fish</h1>
        <p className="text-white p-8">Thông tin chi tiết về cá Koi của bạn.</p>
        <div>
          {/* Nút để mở popup */}
          <div>
            <Button className="" type="primary" onClick={showModal}>
              Input
            </Button>
          </div>
          {/* Form trong Modal */}
          <Modal
            title="Input Koi Fish Information"
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
                    alt="Koi"
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
                label="Age(Month)"
                name="age"
                rules={[{ required: true, message: "Please input Age!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Weight(kg)"
                name="weight"
                rules={[{ required: true, message: "Please input Weight!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Length(cm)"
                name="length"
                rules={[{ required: true, message: "Please input Length!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Variety"
                name="variety"
                rules={[{ required: true, message: "Please input Variety!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="In pond since"
                name="inPondSince"
                rules={[{ required: true, message: "Please input time!" }]}
              >
                <DatePicker onChange={handleDateChange} placeholder="" />
                {/* Hiển thị ngày đã chọn dưới dạng chuỗi */}
                {selectedDate ? (
                  <p>{selectedDate.format("YYYY-MM-DD")}</p>
                ) : null}
              </Form.Item>

              <Form.Item
                label="Physique"
                name="physique"
                rules={[{ required: true, message: "Please input Physique!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Sex"
                name="sex"
                rules={[{ required: true, message: "Please choose Sex!" }]}
              >
                <Select placeholder="">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Pond"
                name="pond"
                rules={[{ required: true, message: "Please input Pond!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Origin"
                name="origin"
                rules={[{ required: true, message: "Please input Origin!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Price(vnđ)"
                name="price"
                rules={[{ required: true, message: "Please input Price!" }]}
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
              {kois.map((koi, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    key={index}
                    title={`Koi Fish: ${koi.name}`}
                    extra={
                      <Button danger onClick={() => deleteKoi(index)}>
                        Delete
                      </Button>
                    }
                    style={{ width: 400, marginBottom: "20px" }}
                  >
                    {koi.imageUrl && (
                      <img
                        src={koi.imageUrl}
                        alt="Koi"
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
                          <strong>Name:</strong> {koi.name || "-"}
                        </p>
                        <p>
                          <strong>Age:</strong> {koi.age || "-"}
                        </p>
                        <p>
                          <strong>Variety:</strong> {koi.variety || "-"}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Length:</strong> {koi.length || "-"}
                        </p>
                        <p>
                          <strong>Weight:</strong> {koi.weight || "-"}
                        </p>
                      </div>
                    </div>
                    <p>
                      <strong>In pond since:</strong> {koi.inPondSince || "-"}
                    </p>
                    <p>
                      <strong>Physique:</strong> {koi.physique || "-"}
                    </p>
                    <p>
                      <strong>Sex:</strong> {koi.sex || "-"}
                    </p>
                    <p>
                      <strong>Pond:</strong> {koi.pond || "-"}
                    </p>
                    <p>
                      <strong>Origin:</strong> {koi.origin || "-"}
                    </p>
                    <p>
                      <strong>Price:</strong> {koi.price || "-"}
                    </p>
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

export default MyKoiFish;
