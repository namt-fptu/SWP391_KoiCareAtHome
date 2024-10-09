// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Button, Modal, Form, Input, Card, Row, Col } from "antd";

const WaterParameter = () => {
  const [waterParameters, setWaterParameters] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //delete WaterParameter
  const deleteWaterParameter = (index) => {
    const newWaterParameters = waterParameters.filter((_, i) => i !== index);
    setWaterParameters(newWaterParameters);
  };

  const onFinish = (values) => {
    console.log("Form values:", values);
    setWaterParameters([...waterParameters, values]);
    setIsModalVisible(false); // Close modal after submit
    setIsInfoVisible(true); // Show info after input
  };

  return (
    <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-white p-8">
        Water Parameters
      </h1>
      <p className="text-white p-8">
        Kiểm tra và theo dõi các thông số nước của hồ cá.
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
          title="Input Water Parameters"
          visible={isModalVisible}
          onCancel={handleCancel} // Nút close
          footer={null} // Tùy chỉnh để không có nút mặc định ở dưới modal
        >
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Pond"
              name="pond"
              rules={[{ required: true, message: "Please input Pond!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Salt"
              name="salt"
              rules={[{ required: true, message: "Please input Salt!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Nitrite (NO₂)"
              name="nitrite"
              rules={[{ required: true, message: "Please input Nitrite!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Nitrate (NO₃)"
              name="nitrate"
              rules={[{ required: true, message: "Please input Nitrate!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Phosphate (PO₄)"
              name="phosphate"
              rules={[{ required: true, message: "Please input Phosphate!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Ammonium (NH₄)"
              name="ammonium"
              rules={[{ required: true, message: "Please input Ammonium!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Hardness (GH)"
              name="hardness"
              rules={[{ required: true, message: "Please input Hardness!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Outdoor temp (℃)"
              name="outdoorTemp"
              rules={[
                { required: true, message: "Please input Outdoor temp!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Oxygen (O₂):"
              name="oxygen"
              rules={[{ required: true, message: "Please input Oxygen!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Temperature (℃)"
              name="temperature"
              rules={[{ required: true, message: "Please input Temperature!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="pH-Value"
              name="ph"
              rules={[{ required: true, message: "Please input pH-Value!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Carbon. hard. (KH):"
              name="kh"
              rules={[
                { required: true, message: "Please input Carbon. hard.!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="CO₂"
              name="co2"
              rules={[{ required: true, message: "Please input CO₂!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Total chlorines"
              name="totalchlorines"
              rules={[
                { required: true, message: "Please input Total chlorines!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Amount fed"
              name="amountFed"
              rules={[{ required: true, message: "Please input Amount fed:!" }]}
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
            {waterParameters.map((waterParameter, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Card
                  key={index}
                  title={`Water Parameters for Pond: ${waterParameter.pond}`}
                  extra={
                    <Button danger onClick={() => deleteWaterParameter(index)}>
                      Delete
                    </Button>
                  }
                  style={{ width: 400, marginBottom: "20px" }}
                >
                  <p>
                    <strong>Pond:</strong> {waterParameter.pond || "-"}
                  </p>
                  <p>
                    <strong>Salt:</strong> {waterParameter.salt || "-"}
                  </p>
                  <p>
                    <strong>Nitrite (NO₂):</strong>{" "}
                    {waterParameter.nitrite || "-"}
                  </p>
                  <p>
                    <strong>Nitrate (NO₃):</strong>{" "}
                    {waterParameter.nitrate || "-"}
                  </p>
                  <p>
                    <strong>Phosphate (PO₄):</strong>{" "}
                    {waterParameter.phosphate || "-"}
                  </p>
                  <p>
                    <strong>Ammonium (NH₄):</strong>{" "}
                    {waterParameter.ammonium || "-"}
                  </p>
                  <p>
                    <strong>Hardness (GH):</strong>{" "}
                    {waterParameter.hardness || "-"}
                  </p>
                  <p>
                    <strong>Outdoor Temp:</strong>{" "}
                    {waterParameter.outdoorTemp || "-"}
                  </p>
                  <p>
                    <strong>Oxygen (O₂):</strong> {waterParameter.oxygen || "-"}
                  </p>
                  <p>
                    <strong>Temperature:</strong>{" "}
                    {waterParameter.temperature || "-"}
                  </p>
                  <p>
                    <strong>pH Value:</strong> {waterParameter.ph || "-"}
                  </p>
                  <p>
                    <strong>Carbon Hardness (KH):</strong>{" "}
                    {waterParameter.kh || "-"}
                  </p>
                  <p>
                    <strong>CO₂:</strong> {waterParameter.co2 || "-"}
                  </p>
                  <p>
                    <strong>Total Chlorines:</strong>{" "}
                    {waterParameter.totalchlorines || "-"}
                  </p>
                  <p>
                    <strong>Amount Fed:</strong>{" "}
                    {waterParameter.amountFed || "-"}
                  </p>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default WaterParameter;
