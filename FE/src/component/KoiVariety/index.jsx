import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, notification } from "antd";
import api from "../../config/axios";

const { Option } = Select;

const KoiVariety = () => {
  const [varieties, setVarieties] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedVariety, setSelectedVariety] = useState(null); // Track the variety being updated
  const [form] = Form.useForm();

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

  // Open modal for creating a new variety
  const handleCreate = () => {
    setSelectedVariety(null);
    setIsUpdating(false); // Create mode
    setIsModalVisible(true);
    form.resetFields();
  };

  // Open modal for updating an existing variety
  const handleUpdate = (record) => {
    setSelectedVariety(record);
    setIsUpdating(true); // Update mode
    setIsModalVisible(true);
    form.setFieldsValue(record); // Pre-fill the form with selected variety's data
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    if (isUpdating && selectedVariety) {
      // Handle update
      try {
        await api.put(`KoiVariety/updateKoiVariety/${selectedVariety.variety}`, values); // Using selectedVariety.variety as identifier
        notification.success({
          message: "Success",
          description: "Koi variety updated successfully!",
        });
        handleCancel();
        fetchKoiVarieties(); // Refresh the list
      } catch (error) {
        console.error("Error updating koi variety:", error);
        notification.error({
          message: "Error",
          description: "Failed to update koi variety.",
        });
      }
    } else {
      // Handle create
      try {
        await api.post("KoiVariety/createKoiVariety", values);
        notification.success({
          message: "Success",
          description: "Koi variety created successfully!",
        });
        handleCancel();
        fetchKoiVarieties();
      } catch (error) {
        console.error("Error creating koi variety:", error);
        notification.error({
          message: "Error",
          description: "Failed to create koi variety.",
        });
      }
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
          {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
              <Button type="link" onClick={() => handleUpdate(record)}>
                Update
              </Button>
            ),
          },
        ]}
        rowKey="variety"
        pagination={false}
        scroll={{ y: 'calc(100vh - 300px)' }}
        style={{ background: "#1f2937", borderRadius: "8px" }}
      />
      <Modal
        title={isUpdating ? "Update Koi Variety" : "Create New Koi Variety"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Variety"
            name="variety"
            rules={[{ required: true, message: 'Please input the koi variety!' }]}
          >
            <Input
              placeholder="Enter koi variety (e.g. Kohaku, General)"
              disabled={isUpdating} // Disable the field during update
            />
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
              {isUpdating ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KoiVariety;
