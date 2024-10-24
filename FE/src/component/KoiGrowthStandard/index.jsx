import React, { useState, useEffect } from "react";
import { Card, Row, Col, message, Form, Input, Button, Modal, Select } from "antd";
import api from "../../config/axios";
import { UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";


const KoiGrowthStandard = () => {
  const [growthStandards, setGrowthStandards] = useState([]);
  const [koiVarieties, setKoiVarieties] = useState([]);
  const [filteredStandards, setFilteredStandards] = useState([]);
  const [selectedVariety, setSelectedVariety] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingStandard, setEditingStandard] = useState(null); // For holding the standard being edited

  useEffect(() => {
    fetchKoiGrowthStandards();
    fetchKoiVarieties();
  }, []);

  // Fetch koi growth standards
  const fetchKoiGrowthStandards = async () => {
    try {
      const response = await api.get("koiGrowthStandard/koiStandard");
      setGrowthStandards(response.data);
      setFilteredStandards(response.data);
    } catch (error) {
      console.error("Error fetching koi growth standards:", error);
      message.error("Failed to fetch koi growth standards.");
    }
  };

  const fetchKoiVarieties = async () => {
    try {
      const response = await api.get("KoiVariety/variety");
      if (response.data && Array.isArray(response.data)) {
        setKoiVarieties(
          response.data.map((variety, index) => ({
            value: variety.id || index,
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

    console.log('Form values being submitted:', values);

    try {
      setLoading(true);
      if (editingStandard) {
        // If editing, make a PUT request to update the existing standard
        await api.put(`koiGrowthStandard/updateKoiStandard/${editingStandard.id}`, values);
        message.success("Koi growth standard updated successfully!");
      } else {
        // If not editing, make a POST request to create a new standard
        await api.post("koiGrowthStandard/createKoiGrowthStandard", values);
        message.success("Koi growth standard created successfully!");
      }

      fetchKoiGrowthStandards(); // Refresh the standards after successful creation or update
      setIsModalVisible(false); // Close the modal
      form.resetFields(); // Reset the form fields
    } catch (error) {
      console.error("Error submitting koi growth standard:", error);
      message.error(`Failed to ${editingStandard ? 'update' : 'create'} koi growth standard.`);
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
      setFilteredStandards(growthStandards);
    }
  };

  // Handle modal visibility
  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingStandard(null);
  };

  // Open the modal for updating a koi growth standard
  const handleUpdate = (standard) => {
    setEditingStandard(standard);
    form.setFieldsValue({
      koiVariety: koiVarieties.find(v => v.label === standard.koiVariety)?.value,
      stage: standard.stage,
      minLength: standard.minLength,
      maxLength: standard.maxLength,
      minWeight: standard.minWeight,
      maxWeight: standard.maxWeight,
      minFeed: standard.minFeed,
      maxFeed: standard.maxFeed,
    });
    setIsModalVisible(true);
  };

  // Function to delete a koi growth standard based on its ID
  const deleteKoiGrowthStandard = async (id) => {
    try {
      await api.delete(`koiGrowthStandard/deleteKoiGrowthStandard/${id}`);
      message.success('Koi growth standard deleted successfully!');
      fetchKoiGrowthStandards(); // Reload the list of koi growth standards after deletion
    } catch (error) {
      console.error('Error deleting koi growth standard:', error);
      message.error('Failed to delete koi growth standard.');
    }
  }

  return (
    <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-white">Koi Growth Standards</h1>

      {/* Button to trigger form modal */}
      <Button type="primary" onClick={showModal} style={{ marginBottom: "20px" }}>
        {editingStandard ? "Update Koi Growth Standard" : "Create New Koi Growth Standard"}
      </Button>

      {/* Filter by Koi Variety */}
      <Select
        placeholder="Filter by Koi Variety"
        onChange={handleVarietyFilterChange}
        style={{ width: 200, marginBottom: "20px" }}
        allowClear
      >
        {koiVarieties.map(variety => (
          <Select.Option key={variety.label} value={variety.label}>
            {variety.label}
          </Select.Option>
        ))}
      </Select>

      <Modal
        title={editingStandard ? "Update Koi Growth Standard" : "Create New Koi Growth Standard"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Koi Variety"
            name="koiVariety"
            rules={[{ required: true, message: 'Please select a koi variety!' }]}
          >
            <Select placeholder="Select a koi variety" loading={koiVarieties.length === 0}>
              {koiVarieties.map(variety => (
                <Select.Option key={variety.value} value={variety.value}>
                  {variety.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Stage"
            name="stage"
            rules={[{ required: true, message: 'Please input the stage!' }]}
          >
            <Input type="number" placeholder="Enter stage" />
          </Form.Item>

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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Min Weight (g)"
                name="minWeigth"
                rules={[{ required: true, message: 'Please input min weight!' }]}
              >
                <Input type="number" placeholder="Min Weight" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Weight (g)"
                name="maxWeigth"
                rules={[{ required: true, message: 'Please input max weight!' }]}
              >
                <Input type="number" placeholder="Max Weight" />
              </Form.Item>
            </Col>
          </Row>

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
              {editingStandard ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {filteredStandards.length > 0 ? (
        <Row gutter={[24, 24]} justify="center" style={{ marginTop: "20px" }}>
          {filteredStandards.map((standard, index) => (
            <Col key={standard.id || index} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={`Koi Variety: ${standard.koiVariety}`}
                style={{ width: "100%", marginBottom: "20px" }}
                extra={
                  <>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => handleUpdate(standard)}
                      style={{ marginRight: "10px" }}
                    >
                      Update
                    </Button>
                    <Button
                      type="danger"
                      icon={<DeleteOutlined />}
                      onClick={() => deleteKoiGrowthStandard(standard.id)}
                    >
                      Delete
                    </Button>
                  </>
                }
              >
                <p><strong>Stage:</strong> {standard.stage}</p>
                <p><strong>Min Length (cm):</strong> {standard.minLength}</p>
                <p><strong>Max Length (cm):</strong> {standard.maxLength}</p>
                <p><strong>Min Weight (g):</strong> {standard.minWeigth}</p>
                <p><strong>Max Weight (g):</strong> {standard.maxWeigth}</p>
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
