import React, { useState, useEffect } from "react";
import { Card, Row, Col, message, Form, Input, Button, Modal, Select } from "antd";
import api from "../../config/axios";

const KoiGrowthStandard = () => {
  const [growthStandards, setGrowthStandards] = useState([]);
  const [koiVarieties, setKoiVarieties] = useState([]); // State for koi varieties
  const [filteredStandards, setFilteredStandards] = useState([]); // State for filtered growth standards
  const [selectedVariety, setSelectedVariety] = useState(null); // State for selected variety in filter
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchKoiGrowthStandards();
    fetchKoiVarieties(); // Fetch koi varieties when the component mounts
  }, []);

  // Fetch koi growth standards
  const fetchKoiGrowthStandards = async () => {
    try {
      const response = await api.get("koiGrowthStandard/koiStandard");
      setGrowthStandards(response.data);
      setFilteredStandards(response.data); // Set initially to show all standards
    } catch (error) {
      console.error("Error fetching koi growth standards:", error);
      message.error("Failed to fetch koi growth standards.");
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

  // Handle form submission for creating a new growth standard
  const onFinish = async (values) => {
    // Find the selected variety by its value (id or index) and map it to its label
    const selectedVariety = koiVarieties.find(variety => variety.value === values.koiVariety);

    if (selectedVariety) {
      values.koiVariety = selectedVariety.label; // Replace the value with the label
    }

    console.log('Form values being submitted:', values); // Check the form data after transformation

    try {
      setLoading(true);
      await api.post("koiGrowthStandard/createKoiGrowthStandard", values);
      message.success("Koi growth standard created successfully!");
      fetchKoiGrowthStandards(); // Refresh the standards after successful creation
      setIsModalVisible(false); // Close the modal
      form.resetFields(); // Reset the form fields
    } catch (error) {
      console.error("Error creating koi growth standard:", error);
      message.error("Failed to create koi growth standard.");
    } finally {
      setLoading(false);
    }
  };

  // Handle filtering by koi variety
  const handleVarietyFilterChange = (value) => {
    setSelectedVariety(value);
    if (value) {
      const filtered = growthStandards.filter(standard => standard.koiVariety === value);
      setFilteredStandards(filtered);
    } else {
      setFilteredStandards(growthStandards); // Reset to show all if no variety is selected
    }
  };

  // Handle modal visibility
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset the form fields
  };

  return (
    <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-white">Koi Growth Standards</h1>

      {/* Button to trigger form modal */}
      <Button type="primary" onClick={showModal} style={{ marginBottom: "20px" }}>
        Create New Koi Growth Standard
      </Button>

      {/* Filter by Koi Variety */}
      <Select
        placeholder="Filter by Koi Variety"
        onChange={handleVarietyFilterChange}
        style={{ width: 200, marginBottom: "20px" }}
        allowClear // To allow clearing the filter
      >
        {koiVarieties.map(variety => (
          <Select.Option key={variety.label} value={variety.label}>
            {variety.label}
          </Select.Option>
        ))}
      </Select>

      {/* Modal containing the form */}
      <Modal
        title="Create New Koi Growth Standard"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Hide default footer
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
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

          {/* Stage */}
          <Form.Item
            label="Stage"
            name="stage"
            rules={[{ required: true, message: 'Please input the stage!' }]}
          >
            <Input type="number" placeholder="Enter stage" />
          </Form.Item>

          {/* Min and Max Length */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Min Length (cm)"
                name="minLength"
                rules={[{ required: true, message: 'Please input min length!' }]}
              >
                <Input type="number" placeholder="Min Length" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Length (cm)"
                name="maxLength"
                rules={[{ required: true, message: 'Please input max length!' }]}
              >
                <Input type="number" placeholder="Max Length" />
              </Form.Item>
            </Col>
          </Row>

          {/* Min and Max Weight */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Min Weight (g)"
                name="minWeight"
                rules={[{ required: true, message: 'Please input min weight!' }]}
              >
                <Input type="number" placeholder="Min Weight" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Weight (g)"
                name="maxWeight"
                rules={[{ required: true, message: 'Please input max weight!' }]}
              >
                <Input type="number" placeholder="Max Weight" />
              </Form.Item>
            </Col>
          </Row>

          {/* Min and Max Feed */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Min Feed (g)"
                name="minFeed"
                rules={[{ required: true, message: 'Please input min feed!' }]}
              >
                <Input type="number" placeholder="Min Feed" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Feed (g)"
                name="maxFeed"
                rules={[{ required: true, message: 'Please input max feed!' }]}
              >
                <Input type="number" placeholder="Max Feed" />
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

      {/* Display koi growth standards */}
      {filteredStandards.length > 0 ? (
        <Row gutter={[24, 24]} justify="center" style={{ marginTop: "20px" }}>
          {filteredStandards.map((standard, index) => (
            <Col key={standard.id || index} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={`Koi Variety: ${standard.koiVariety}`}
                style={{ width: "100%", marginBottom: "20px" }}
              >
                <p><strong>Stage:</strong> {standard.stage}</p>
                <p><strong>Min Length (cm):</strong> {standard.minLength}</p>
                <p><strong>Max Length (cm):</strong> {standard.maxLength}</p>
                <p><strong>Min Weight (g):</strong> {standard.minWeight}</p>
                <p><strong>Max Weight (g):</strong> {standard.maxWeight}</p>
                <p><strong>Min Feed (g):</strong> {standard.minFeed}</p>
                <p><strong>Max Feed (g):</strong> {standard.maxFeed}</p>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p style={{ color: "white" }}>No koi growth standards available.</p>
      )}
    </div>
  );
};

export default KoiGrowthStandard;
