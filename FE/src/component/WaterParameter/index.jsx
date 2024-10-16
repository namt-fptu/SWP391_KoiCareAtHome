import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Card, Row, Col, Select, DatePicker, message } from "antd"; 
import api from "../../config/axios";
import moment from 'moment'; // If needed for date formatting

const WaterParameter = () => {
  const [waterParameters, setWaterParameters] = useState([]);
  const [existingParameters, setExistingParameters] = useState([]);
  const [ponds, setPonds] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPond, setSelectedPond] = useState(null);
  const { Option } = Select;

  useEffect(() => {
    fetchUserPonds();
  }, []);

  const fetchUserPonds = async () => {
    const id = sessionStorage.getItem("id");
    if (!id) {
      message.error("User not logged in. Unable to fetch ponds.");
      return;
    }
    try {
      const response = await api.get(`Pond/ponds/${id}`);
      setPonds(response.data);
    } catch (error) {
      console.error("Error fetching ponds:", error);
    }
  };

  const checkPondsForWaterParameters = async (pondId) => {
    try {
      const response = await api.get(`WaterReport/waterReport/${pondId}`);
      setExistingParameters(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setExistingParameters([]);
        message.info("No water parameters found for this pond.");
      } else {
        console.error("Error fetching water parameters:", error);
        message.error("Failed to fetch water parameters.");
      }
    }
  };

  const handlePondChange = (value) => {
    setSelectedPond(value);
  };

  const showModal = () => {
    if (!selectedPond) {
      message.error("Please select a pond first!");
      return;
    }
    checkPondsForWaterParameters(selectedPond);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPond(null);
  };

  const onFinish = async (values) => {
    const newParameter = {
      pondId: selectedPond,
      salt: values.salt,
      nitrite: values.nitrite,
      nitrate: values.nitrate,
      ammonium: values.ammonium,
      hardness: values.hardness,
      oxygen: values.oxygen,
      temperature: values.temperature,
      ph: values.ph,
      co2: values.co2,
      date: values.date ? values.date.toISOString() : new Date().toISOString(), // Format the selected date or use current date
    };

    try {
      await api.post(`WaterReport/createWaterReport`, newParameter);
      message.success("Water parameters added successfully!");

      checkPondsForWaterParameters(selectedPond);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error adding water parameters:", error);
      message.error("Failed to add water parameters.");
    }
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
        <Form.Item
          
          name="pond"
          rules={[{ required: true, message: "Please select a pond!" }]}
        >
          <Select
            placeholder="Select a pond"
            onChange={handlePondChange}
            allowClear
          >
            {ponds.map((pond) => (
              <Option key={pond.id} value={pond.id}>
                {pond.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div className="flex flex-col items-center">
          <Button type="primary" onClick={showModal}>
            Input Water Parameters
          </Button>
        </div>

        <Modal
          title="Input Water Parameters"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form layout="vertical" onFinish={onFinish}>
            {/* Date Picker Field */}
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: "Please select a date!" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            {/* Other input fields */}
            <Form.Item label="Salt" name="salt" rules={[{ required: true, message: "Please input Salt!" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Nitrite (NO₂)" name="nitrite" rules={[{ required: true, message: "Please input Nitrite!" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Nitrate (NO₃)" name="nitrate" rules={[{ required: true, message: "Please input Nitrate!" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Ammonium (NH₄)" name="ammonium" rules={[{ required: true, message: "Please input Ammonium!" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Hardness (GH)" name="hardness" rules={[{ required: true, message: "Please input Hardness!" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Oxygen (O₂)" name="oxygen" rules={[{ required: true, message: "Please input Oxygen!" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Temperature (℃)" name="temperature" rules={[{ required: true, message: "Please input Temperature!" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="pH-Value" name="ph" rules={[{ required: true, message: "Please input pH-Value!" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="CO₂" name="co2" rules={[{ required: true, message: "Please input CO₂!" }]}>
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

        {existingParameters.length > 0 ? (
          <Row gutter={[200, 200]} style={{ marginTop: "20px" }}>
            {existingParameters.map((param, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Card
                  title={`Water Parameters for Pond: ${selectedPond}`}
                  style={{ width: 400, marginBottom: "20px" }}
                >
                  <p><strong>Date:</strong> {moment(param.date).format('YYYY-MM-DD') || "-"}</p>
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
        ) : (
          <p style={{ color: "white" }}>
            No water parameters available for this pond.
          </p>
        )}
      </div>
    </div>
  );
};

export default WaterParameter;
