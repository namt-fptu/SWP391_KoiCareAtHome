import React, { useEffect, useState } from "react";
import { Table, Button, notification } from "antd";
import api from "../../config/axios";

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);

  // Function to fetch accounts from the API
  const fetchAccounts = async () => {
    try {
      const response = await api.get("Account/getShopAndPondOwner");
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
      await api.delete(`Account/deleteAccount/${id}`);
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
              <Button
                type="link"
                danger
                onClick={() => handleDelete(record.id)}
              >
                Delete
              </Button>
            ),
          },
        ]}
        rowKey="id"
        pagination={false} // Disable pagination if you want full-screen effect
        scroll={{ y: 'calc(100vh - 200px)' }} // Adjust this value as needed
        style={{ background: "#1f2937", borderRadius: "8px" }} // Optional styling
      />
    </div>
  );
};

export default AccountList;
