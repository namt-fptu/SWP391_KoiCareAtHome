import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Card, Row, Col, Select, DatePicker, message } from "antd";
import api from "../../config/axios";
import moment from "moment"; // For date formatting

const WaterParameter = () => {
  const [waterReports, setWaterReports] = useState([]);
  const [ponds, setPonds] = useState([]);
  const [selectedPond, setSelectedPond] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { Option } = Select;

  useEffect(() => {
    fetchUserPonds();
  }, []);

  // Fetch user's ponds
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
      message.error("Failed to fetch ponds.");
    }
  };

  // Fetch water parameters for the selected pond
  const fetchWaterReports = async (pondId) => {
    try {
      const response = await api.get(`WaterReport/waterReport/${pondId}`);
      setWaterReports(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setWaterReports([]);
        message.info("No water reports found for this pond.");
      } else {
        console.error("Error fetching water reports:", error);
        message.error("Failed to fetch water reports.");
      }
    }
  };

  // Handle pond selection
  const handlePondChange = (pondId) => {
    setSelectedPond(pondId);
    fetchWaterReports(pondId);
  };

  // Show modal to input water parameters
  const showModal = () => {
    if (!selectedPond) {
      message.error("Please select a pond first!");
      return;
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Submit new water parameters
  const onFinish = async (values) => {
    const newReport = {
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
      date: values.date ? values.date.toISOString() : new Date().toISOString(), // Format the selected date or use the current date
    };

    try {
      await api.post(`WaterReport/createWaterReport`, newReport);
      message.success("Water parameters added successfully!");
      fetchWaterReports(selectedPond); // Refresh the list
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

      {/* Pond Selection */}
      <Form.Item name="pond" rules={[{ required: true, message: "Please select a pond!" }]}>
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

      {/* Button to Input Water Parameters */}
      <div className="flex flex-col items-center">
        <Button type="primary" onClick={showModal}>
          Input Water Parameters
        </Button>
      </div>

      {/* Modal for Adding Water Parameters */}
      <Modal
        title="Input Water Parameters"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={onFinish}>
          {/* Date Picker */}
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          {/* Form Input Fields */}
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

          {/* Submit Buttons */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
            <Button type="default" onClick={handleCancel} style={{ marginLeft: "10px" }}>
              Close
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Display Water Reports */}
      {waterReports.length > 0 ? (
        <Row gutter={[24, 24]} justify="center" style={{ marginTop: "20px" }}>
          {waterReports.map((report, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={`Water Report for Pond: ${selectedPond}`}
                style={{ width: "100%", marginBottom: "20px" }}
              >
                <p><strong>Date:</strong> {moment(report.date).format("YYYY-MM-DD")}</p>
                <p><strong>Salt:</strong> {report.salt}</p>
                <p><strong>Nitrite (NO₂):</strong> {report.nitrite}</p>
                <p><strong>Nitrate (NO₃):</strong> {report.nitrate}</p>
                <p><strong>Ammonium (NH₄):</strong> {report.ammonium}</p>
                <p><strong>Hardness (GH):</strong> {report.hardness}</p>
                <p><strong>Oxygen (O₂):</strong> {report.oxygen}</p>
                <p><strong>Temperature:</strong> {report.temperature}</p>
                <p><strong>pH-Value:</strong> {report.ph}</p>
                <p><strong>CO₂:</strong> {report.co2}</p>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p style={{ color: "white" }}>No water parameters available for this pond.</p>
      )}
    </div>
  );
};

export default WaterParameter;
