import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, notification, Row, Col } from "antd";
import api from "../../config/axios";

const { Option } = Select; // Destructure Option from Select

const KoiVariety = () => {
  const [varieties, setVarieties] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm(); // Create form instance

  // Function to fetch koi varieties from the API
  const fetchKoiVarieties = async () => {
    try {
      const response = await api.get("KoiVariety/variety");
      setVarieties(response.data);
    } catch (error) {
      console.error("Error fetching koi varieties:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch koi varieties.",
      });
    }
  };

  useEffect(() => {
    fetchKoiVarieties();
  }, []);

  // Function to handle create new variety modal
  const handleCreate = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset the form fields
  };

  // Function to handle form submission
  const onFinish = async (values) => {
    try {
      await api.post("KoiVariety/createKoiVariety", values);
      notification.success({
        message: "Success",
        description: "Koi variety created successfully!",
      });
      handleCancel(); // Close the modal after successful creation
      fetchKoiVarieties(); // Refresh the list of varieties
    } catch (error) {
      console.error("Error creating koi variety:", error);
      notification.error({
        message: "Error",
        description: "Failed to create koi variety.",
      });
    }
  };

  return (
    <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-white">Koi Varieties</h1>
      <Button type="primary" onClick={handleCreate} style={{ marginBottom: '20px' }}>
        Create New Koi Variety
      </Button>
      <Table
        dataSource={varieties}
        columns={[
          {
            title: "Variety",
            dataIndex: "variety",
            key: "variety",
          },
          {
            title: "Rarity",
            dataIndex: "rarity",
            key: "rarity",
          },
          {
            title: "Color",
            dataIndex: "color",
            key: "color",
          },
        ]}
        rowKey="variety"
        pagination={false} // Disable pagination if you want full-screen effect
        scroll={{ y: 'calc(100vh - 300px)' }} // Adjust this value as needed
        style={{ background: "#1f2937", borderRadius: "8px" }} // Optional styling
      />
      <Modal
        title="Create New Koi Variety"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Hide default footer
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Variety"
            name="variety"
            rules={[{ required: true, message: 'Please input the koi variety!' }]}
          >
            <Input placeholder="Enter koi variety (e.g. Kohaku, General)" />
          </Form.Item>
          <Form.Item
            label="Rarity"
            name="rarity"
            rules={[{ required: true, message: 'Please select the rarity!' }]}
          >
            <Select placeholder="Select rarity">
              <Option value="Common">Common</Option>
              <Option value="Rare">Rare</Option>
              <Option value="Super Rare">Super Rare</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Color"
            name="color"
            rules={[{ required: true, message: 'Please input the color!' }]}
          >
            <Input placeholder="Enter color (e.g. Red and White)" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KoiVariety;
