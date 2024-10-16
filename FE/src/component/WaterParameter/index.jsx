// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Card, Row, Col, Select, message } from "antd"; // Import Select
import api from "../../config/axios";

const WaterParameter = () => {
  const [waterParameters, setWaterParameters] = useState([]);
  const [existingParameters, setExistingParameters] = useState([]); // State for existing parameters
  const [ponds, setPonds] = useState([]); // State for ponds
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPond, setSelectedPond] = useState(null); // State for selected pond

  const { Option } = Select;

  useEffect(() => {
    fetchUserPonds();
  }, []);

  const fetchUserPonds = async () => {
    const pondOwnerId = sessionStorage.getItem("pondOwnerId");
    if (!pondOwnerId) {
      message.error("User not logged in. Unable to fetch ponds.");
      return;
    }
    try {
      const response = await api.get(`Pond/ponds/${pondOwnerId}`);
      setPonds(response.data);
    } catch (error) {
      console.error("Error fetching ponds:", error);
    }
  };

  const fetchWaterParameters = async (pondId) => {
    try {
      const response = await api.get(`WaterParameter/parameters/${pondId}`); // Adjust the endpoint accordingly
      setExistingParameters(response.data); // Set existing parameters
    } catch (error) {
      console.error("Error fetching water parameters:", error);
      message.error("Failed to fetch water parameters.");
    }
  };

  const handlePondChange = (value) => {
    setSelectedPond(value);
    fetchWaterParameters(value); // Fetch water parameters for the selected pond
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPond(null); // Reset selected pond when modal is closed
  };

  const onFinish = (values) => {
    const newParameter = {
      pond: selectedPond,
      salt: values.salt,
      nitrite: values.nitrite,
      nitrate: values.nitrate,
      ammonium: values.ammonium,
      hardness: values.hardness,
      oxygen: values.oxygen,
      temperature: values.temperature,
      ph: values.ph,
      co2: values.co2,
    };

    // Update state
    setWaterParameters((prev) => {
      const existingParameters = prev.filter(param => param.pond !== selectedPond);
      return [...existingParameters, newParameter]; // Update existing or add new
    });
    
    message.success("Water parameters added successfully!");
    setIsModalVisible(false);
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
        {/* Button to open modal */}
        <div className="flex flex-col items-center">
          <Button type="primary" onClick={showModal}>
            Input
          </Button>
        </div>
        
        {/* Modal for input */}
        <Modal
          title="Input Water Parameters"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Select Pond"
              name="pond"
              rules={[{ required: true, message: "Please select a pond!" }]}
            >
              <Select
                placeholder="Select a pond"
                onChange={handlePondChange} // Update selected pond state and fetch parameters
                allowClear
              >
                {ponds.map(pond => (
                  <Option key={pond.id} value={pond.id}>
                    {pond.name}
                  </Option>
                ))}
              </Select>
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
              label="Oxygen (O₂)"
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
              label="CO₂"
              name="co2"
              rules={[{ required: true, message: "Please input CO₂!" }]}
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

        {/* Display existing water parameters after selecting a pond */}
        {existingParameters.length > 0 && (
          <Row gutter={[200, 200]} style={{ marginTop: "20px" }}>
            {existingParameters.map((param, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Card
                  title={`Water Parameters for Pond: ${selectedPond}`}
                  extra={<Button danger onClick={() => deleteWaterParameter(index)}>Delete</Button>}
                  style={{ width: 400, marginBottom: "20px" }}
                >
                  <p><strong>Salt:</strong> {param.salt || "-"}</p>
                  <p><strong>Nitrite (NO₂):</strong> {param.nitrite || "-"}</p>
                  <p><strong>Nitrate (NO₃):</strong> {param.nitrate || "-"}</p>
                  <p><strong>Ammonium (NH₄):</strong> {param.ammonium || "-"}</p>
                  <p><strong>Hardness (GH):</strong> {param.hardness || "-"}</p>
                  <p><strong>Oxygen (O₂):</strong> {param.oxygen || "-"}</p>
                  <p><strong>Temperature:</strong> {param.temperature || "-"}</p>
                  <p><strong>pH Value:</strong> {param.ph || "-"}</p>
                  <p><strong>CO₂:</strong> {param.co2 || "-"}</p>
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
