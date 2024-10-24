import React, { useState, useEffect } from "react";
import { Card, Row, Col, message, Form, Input, Button, Modal, Select } from "antd";
import api from "../../config/axios";

const WaterParameterStandard = () => {
  const [waterStandards, setWaterStandards] = useState([]);
  const [koiVarieties, setKoiVarieties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchWaterStandards();
    fetchKoiVarieties();
  }, []);

  // Fetch water parameter standards
  const fetchWaterStandards = async () => {
    try {
      const response = await api.get('WaterParameterStandard/waterStandard');
      setWaterStandards(response.data);
    } catch (error) {
      console.error("Error fetching water parameter standards:", error);
      message.error("Failed to fetch water parameter standards.");
    }
  };

  // Fetch koi varieties from API
  const fetchKoiVarieties = async () => {
    try {
      const response = await api.get("KoiVariety/variety"); // Ensure the endpoint is correct
      if (response.data && Array.isArray(response.data)) {
        setKoiVarieties(
          response.data.map((variety, index) => ({
            value: variety.id || index, // Fallback to index if `id` is null
            label: variety.variety,
          }))
        );
      } else {
        message.error("No koi varieties found.");
      }
    } catch (error) {
      console.error("Error fetching koi varieties:", error);
      message.error("Failed to fetch koi varieties.");
    }
  };

  const onFinish = async (values) => {
    // Find the selected variety by its value (id or index) and map it to its label
    const selectedVariety = koiVarieties.find(variety => variety.value === values.koiVariety);
  
    if (selectedVariety) {
      values.koiVariety = selectedVariety.label; // Replace the value with the label
    } else {
      // Log a warning if the selected variety is not found
      console.warn('Selected koi variety not found for value:', values.koiVariety);
      message.error("Selected koi variety is invalid.");
      return; // Exit early if the variety is invalid
    }
  
    console.log('Form values being submitted:', values); // Log the form data before submission
  
    try {
      setLoading(true);
      
      // Send the request to create a new koi growth standard
      const response = await api.post("WaterParameterStandard/createWaterPameterStandard", values);
  
      // Check for a successful response (optional based on your API structure)
      if (response.status === 200 || response.status === 201) {
        message.success("Water parameter standard created successfully!");
        fetchWaterStandards(); // Refresh the standards after successful creation
        setIsModalVisible(false); // Close the modal
        form.resetFields(); // Reset the form fields
      } else {
        // Handle unexpected response statuses
        message.error("Failed to create koi growth standard. Please try again.");
      }
    } catch (error) {
      console.error("Error creating koi growth standard:", error);
  
      // Detailed error handling
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        message.error(`Failed to create koi growth standard: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        console.error("Request data:", error.request);
        message.error("No response received from the server. Please check your network connection.");
      } else {
        console.error("Error message:", error.message);
        message.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  

  // Handle modal visibility
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-white p-8">Water Parameter Standards</h1>

      <Button type="primary" onClick={showModal} style={{ marginBottom: "20px" }}>
        Create New Water Parameter Standard
      </Button>

      <Modal
  title="Create New Water Parameter Standard"
  open={isModalVisible}
  onCancel={handleCancel}
  footer={null}  // Ẩn footer mặc định
>
  <Form layout="vertical" onFinish={onFinish}>
    <Form.Item
      label="Koi Variety"
      name="koiVariety"
      rules={[{ required: true, message: 'Please select a koi variety!' }]}
    >
      <Select placeholder="Select a koi variety" loading={koiVarieties.length === 0}>
              {koiVarieties.length > 0 ? (
                koiVarieties.map(variety => (
                  <Select.Option key={variety.value} value={variety.value}>
                    {variety.label}
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled>No koi varieties available</Select.Option>
              )}
            </Select>
    </Form.Item>

    {/* Temperature */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Min Temperature (℃)"
          name="minTemp"
          rules={[{ required: true, message: 'Please input min temperature!' }]}
        >
          <Input type="number" placeholder="Min Temperature" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Max Temperature (℃)"
          name="maxTemp"
          rules={[{ required: true, message: 'Please input max temperature!' }]}
        >
          <Input type="number" placeholder="Max Temperature" />
        </Form.Item>
      </Col>
    </Row>

    {/* pH */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Min pH"
          name="minPh"
          rules={[{ required: true, message: 'Please input min pH!' }]}
        >
          <Input type="number" step="0.1" placeholder="Min pH" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Max pH"
          name="maxPh"
          rules={[{ required: true, message: 'Please input max pH!' }]}
        >
          <Input type="number" step="0.1" placeholder="Max pH" />
        </Form.Item>
      </Col>
    </Row>

    {/* Hardness */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Min Hardness (GH)"
          name="minHardness"
          rules={[{ required: true, message: 'Please input min hardness!' }]}
        >
          <Input type="number" placeholder="Min Hardness" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Max Hardness (GH)"
          name="maxHardness"
          rules={[{ required: true, message: 'Please input max hardness!' }]}
        >
          <Input type="number" placeholder="Max Hardness" />
        </Form.Item>
      </Col>
    </Row>

    {/* Oxygen */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Min Oxygen (O₂)"
          name="minOxigen"
          rules={[{ required: true, message: 'Please input min oxygen!' }]}
        >
          <Input type="number" step="0.1" placeholder="Min Oxygen" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Max Oxygen (O₂)"
          name="maxOxigen"
          rules={[{ required: true, message: 'Please input max oxygen!' }]}
        >
          <Input type="number" step="0.1" placeholder="Max Oxygen" />
        </Form.Item>
      </Col>
    </Row>

    {/* Carbon Dioxide */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Min Carbon Dioxide (CO₂)"
          name="minCabondioxide"
          rules={[{ required: true, message: 'Please input min carbon dioxide!' }]}
        >
          <Input type="number" placeholder="Min CO₂" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Max Carbon Dioxide (CO₂)"
          name="maxCabondioxide"
          rules={[{ required: true, message: 'Please input max carbon dioxide!' }]}
        >
          <Input type="number" placeholder="Max CO₂" />
        </Form.Item>
      </Col>
    </Row>

    {/* Salt */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Min Salt"
          name="minSalt"
          rules={[{ required: true, message: 'Please input min salt!' }]}
        >
          <Input type="number" placeholder="Min Salt" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Max Salt"
          name="maxSalt"
          rules={[{ required: true, message: 'Please input max salt!' }]}
        >
          <Input type="number" placeholder="Max Salt" />
        </Form.Item>
      </Col>
    </Row>

    {/* Nitrates */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Min Nitrates"
          name="minNitrates"
          rules={[{ required: true, message: 'Please input min nitrates!' }]}
        >
          <Input type="number" placeholder="Min Nitrates" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Max Nitrates"
          name="maxNitrates"
          rules={[{ required: true, message: 'Please input max nitrates!' }]}
        >
          <Input type="number" placeholder="Max Nitrates" />
        </Form.Item>
      </Col>
    </Row>

    {/* Nitrite */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Min Nitrite"
          name="minNitrite"
          rules={[{ required: true, message: 'Please input min nitrite!' }]}
        >
          <Input type="number" placeholder="Min Nitrite" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Max Nitrite"
          name="maxNitrite"
          rules={[{ required: true, message: 'Please input max nitrite!' }]}
        >
          <Input type="number" placeholder="Max Nitrite" />
        </Form.Item>
      </Col>
    </Row>

    {/* Ammonium */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Min Ammonium"
          name="minAmonium"
          rules={[{ required: true, message: 'Please input min ammonium!' }]}
        >
          <Input type="number" placeholder="Min Ammonium" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Max Ammonium"
          name="maxAmonium"
          rules={[{ required: true, message: 'Please input max ammonium!' }]}
        >
          <Input type="number" placeholder="Max Ammonium" />
        </Form.Item>
      </Col>
    </Row>

    <Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Create
      </Button>
    </Form.Item>
  </Form>
</Modal>


      {/* Display water parameter standards */}
{waterStandards.length > 0 ? (
  <Row gutter={[24, 24]} justify="center" style={{ marginTop: "20px" }}>
    {waterStandards.map((standard, index) => (
      <Col key={standard.id || index} xs={24} sm={12} md={8} lg={6}>
        <Card title={`Koi Variety: ${standard.koiVariety}`} style={{ width: "100%", marginBottom: "20px" }}>
          <Row gutter={16}>
            <Col span={12}>
              <p><strong>Temperature (℃):</strong></p>
              <p>Min: <span style={{ color: "#00FF00" }}>{standard.minTemp}</span></p>
              <p>Max: <span style={{ color: "#FF4500" }}>{standard.maxTemp}</span></p>

              <p><strong>pH:</strong></p>
              <p>Min: <span style={{ color: "#00FF00" }}>{standard.minPh}</span></p>
              <p>Max: <span style={{ color: "#FF4500" }}>{standard.maxPh}</span></p>

              <p><strong>Oxygen (O₂):</strong></p>
              <p>Min: <span style={{ color: "#00FF00" }}>{standard.minOxigen}</span></p>
              <p>Max: <span style={{ color: "#FF4500" }}>{standard.maxOxigen}</span></p>

              <p><strong>Nitrates:</strong></p>
              <p>Min: <span style={{ color: "#00FF00" }}>{standard.minNitrates}</span></p>
              <p>Max: <span style={{ color: "#FF4500" }}>{standard.maxNitrates}</span></p>
            </Col>
            <Col span={12}>
              <p><strong>Hardness (GH):</strong></p>
              <p>Min: <span style={{ color: "#00FF00" }}>{standard.minHardness}</span></p>
              <p>Max: <span style={{ color: "#FF4500" }}>{standard.maxHardness}</span></p>

              <p><strong>Carbon Dioxide (CO₂):</strong></p>
              <p>Min: <span style={{ color: "#00FF00" }}>{standard.minCabondioxide}</span></p>
              <p>Max: <span style={{ color: "#FF4500" }}>{standard.maxCabondioxide}</span></p>

              <p><strong>Salt:</strong></p>
              <p>Min: <span style={{ color: "#00FF00" }}>{standard.minSalt}</span></p>
              <p>Max: <span style={{ color: "#FF4500" }}>{standard.maxSalt}</span></p>

              <p><strong>Nitrite:</strong></p>
              <p>Min: <span style={{ color: "#00FF00" }}>{standard.minNitrite}</span></p>
              <p>Max: <span style={{ color: "#FF4500" }}>{standard.maxNitrite}</span></p>

              <p><strong>Ammonium:</strong></p>
              <p>Min: <span style={{ color: "#00FF00" }}>{standard.minAmonium}</span></p>
              <p>Max: <span style={{ color: "#FF4500" }}>{standard.maxAmonium}</span></p>
            </Col>
          </Row>
        </Card>
      </Col>
    ))}
  </Row>
) : (
  <p style={{ color: "white" }}>No water parameter standards available.</p>
)}

    </div>
  );
};

export default WaterParameterStandard;
