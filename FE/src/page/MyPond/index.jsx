import React, { useState } from "react";
import { Button, Modal, Form, Input, Card, Row, Col } from "antd";

const MyPond = () => {
  const [ponds, setPonds] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  // const [parameters, setParameters] = useState({
  //   pond: "",
  //   salt: "",
  //   nitrite: "",
  //   nitrate: "",
  //   phosphate: "",
  //   ammonium: "",
  //   hardness: "",
  //   outdoorTemp: "",
  //   oxygen: "",
  //   temperature: "",
  //   ph: "",
  //   kh: "",
  //   co2: "",
  //   totalChlorines: "",
  //   amountFed: "",
  // });
  //delete pond
  const deletePond = (index) => {
    const newPonds = ponds.filter((_, i) => i !== index);
    setPonds(newPonds);
  };

  const onFinish = (values) => {
    console.log("Form values:", values);
    // setParameters(values);
    setPonds([...ponds, values]);
    setIsModalVisible(false); // Close modal after submit
    setIsInfoVisible(true); //show info after input
  };
  return (
    <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-white p-8">My Pond</h1>
      <p className="text-white p-8">Thông tin chi tiết về hồ cá Koi của bạn.</p>
      <div>
        {/* Nút để mở popup */}
        <div>
          <Button className="" type="primary" onClick={showModal}>
            Input
          </Button>
        </div>
        {/* Form trong Modal */}
        <Modal
          title="Input Pond Infomation"
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
            {ponds.map((pond, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Card
                  key={index}
                  title={`Water Parameters for Pond: ${pond.pond}`}
                  extra={
                    <Button danger onClick={() => deletePond(index)}>
                      Delete
                    </Button>
                  }
                  style={{ width: 400, marginBottom: "20px" }}
                >
                  <p>
                    <strong>Pond:</strong> {pond.pond || "-"}
                  </p>
                  <p>
                    <strong>Salt:</strong> {pond.salt || "-"}
                  </p>
                  <p>
                    <strong>Nitrite (NO₂):</strong> {pond.nitrite || "-"}
                  </p>
                  <p>
                    <strong>Nitrate (NO₃):</strong> {pond.nitrate || "-"}
                  </p>
                  <p>
                    <strong>Phosphate (PO₄):</strong> {pond.phosphate || "-"}
                  </p>
                  <p>
                    <strong>Ammonium (NH₄):</strong> {pond.ammonium || "-"}
                  </p>
                  <p>
                    <strong>Hardness (GH):</strong> {pond.hardness || "-"}
                  </p>
                  <p>
                    <strong>Outdoor Temp:</strong> {pond.outdoorTemp || "-"}
                  </p>
                  <p>
                    <strong>Oxygen (O₂):</strong> {pond.oxygen || "-"}
                  </p>
                  <p>
                    <strong>Temperature:</strong> {pond.temperature || "-"}
                  </p>
                  <p>
                    <strong>pH Value:</strong> {pond.ph || "-"}
                  </p>
                  <p>
                    <strong>Carbon Hardness (KH):</strong> {pond.kh || "-"}
                  </p>
                  <p>
                    <strong>CO₂:</strong> {pond.co2 || "-"}
                  </p>
                  <p>
                    <strong>Total Chlorines:</strong>{" "}
                    {pond.totalChlorines || "-"}
                  </p>
                  <p>
                    <strong>Amount Fed:</strong> {pond.amountFed || "-"}
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

export default MyPond;