import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, notification } from "antd";
import api from "../../config/axios";

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [form] = Form.useForm();

  // Function to fetch accounts from the API
  const fetchAccounts = async () => {
    try {
      const response = await api.get("Account/getAccounts");
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch accounts.",
      });
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Function to handle delete action
  const handleDelete = async (id) => {
    try {
      await api.delete(`Account/deleteAccount/${id}`); // Adjust endpoint as necessary
      notification.success({
        message: "Success",
        description: "Account deleted successfully!",
      });
      fetchAccounts(); // Refresh the account list
    } catch (error) {
      console.error("Error deleting account:", error);
      notification.error({
        message: "Error",
        description: "Failed to delete account.",
      });
    }
  };

  // Function to handle update action
  const handleUpdate = (account) => {
    setSelectedAccount(account);
    form.setFieldsValue(account); // Populate the form with the account data
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset the form fields
    setSelectedAccount(null); // Clear selected account
  };

  // Function to handle form submission for updates
  const onFinish = async (values) => {
    try {
      await api.put(`Account/updateAccount/${selectedAccount.id}`, values); // Adjust endpoint as necessary
      notification.success({
        message: "Success",
        description: "Account updated successfully!",
      });
      handleCancel(); // Close the modal after successful update
      fetchAccounts(); // Refresh the account list
    } catch (error) {
      console.error("Error updating account:", error);
      notification.error({
        message: "Error",
        description: "Failed to update account.",
      });
    }
  };

  return (
    <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-white">Account List</h1>
      <Table
        dataSource={accounts}
        columns={[
          {
            title: "ID",
            dataIndex: "id",
            key: "id",
          },
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
          },
          {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
          },
          {
            title: "Role",
            dataIndex: "role",
            key: "role",
          },
          {
            title: "Action",
            key: "action",
            render: (text, record) => (
              <span>
                <Button
                  type="link"
                  onClick={() => handleUpdate(record)}
                  style={{ marginRight: 16 }}
                >
                  Update
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() => handleDelete(record.id)}
                >
                  Delete
                </Button>
              </span>
            ),
          },
        ]}
        rowKey="id"
        pagination={false} // Disable pagination if you want full-screen effect
        scroll={{ y: 'calc(100vh - 200px)' }} // Adjust this value as needed
        style={{ background: "#1f2937", borderRadius: "8px" }} // Optional styling
      />
      <Modal
        title="Update Account"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Hide default footer
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input the email!' }]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please input the phone!' }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select the role!' }]}
          >
            <Input placeholder="Enter role (e.g., PondOwner, Shop, Admin)" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>a
        </Form>
      </Modal>
    </div>
  );
};

export default AccountList;
