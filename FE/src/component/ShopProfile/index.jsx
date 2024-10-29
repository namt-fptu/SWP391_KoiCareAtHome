import React, { useState, useEffect } from "react";
import { Card, Input, Button, Form, message, Avatar, Typography } from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import api from "../../config/axios";
import { useAuthStore } from "../../page/(auth)/store";

const { Title, Text } = Typography;

const ShopProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { authUser } = useAuthStore();
  const userId = authUser.id;

  // Fetch user profile on component mount
  useEffect(() => {
    if (!userId) {
      message.error("User not logged in. Unable to fetch profile.");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`/Account/getAccountById/${userId}`);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        message.error("Failed to load profile information.");
      }
    };

    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get(`/Account/getAccountById/${userId}`);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      message.error("Failed to load profile information.");
    }
  };

  const handleUpdateProfile = async (values) => {
    try {
      const { email, phone, name } = values;
      await api.put(`Account/updateAccount/${userId}`, {
        email,
        phone,
        name,
        password: "placeholderPassword", // Placeholder password
      });

      message.success("Profile updated successfully");
      setIsEditing(false); // Exit editing mode
      await fetchUserProfile(); // Fetch updated profile data
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response ? error.response.data : error.message
      );

      if (error.response && error.response.data.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(", ");
        message.error(`Failed to update profile: ${errorMessages}`);
      } else {
        message.error("Failed to update profile.");
      }
    }
  };

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="p-5 bg-gray-900 min-h-screen flex justify-center items-center">
      <Card
        title="Shop Profile"
        className="bg-gray-800 text-white w-full max-w-md"
        headStyle={{ backgroundColor: "#1f2937", color: "#ffffff" }}
        style={{ borderRadius: "10px", overflow: "hidden" }}
      >
        <div className="flex justify-center mb-4">
          <Avatar size={80} icon={<UserOutlined />} />
        </div>
        <Title level={4} style={{ textAlign: "center", color: "#ffffff" }}>
          {profile.name}
        </Title>
        {isEditing ? (
          <Form
            layout="vertical"
            initialValues={profile}
            onFinish={handleUpdateProfile}
            style={{ marginTop: "20px" }}
          >
            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input />
            </Form.Item>
            <Form.Item label="Name" name="name">
              <Input />
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
              <Button
                style={{ marginLeft: "10px" }}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div style={{ textAlign: "center" }}>
            <Text strong style={{ display: "block", color: "#ffffff" }}>
              Email: {profile.email}
            </Text>
            <Text strong style={{ display: "block", color: "#ffffff" }}>
              Phone: {profile.phone}
            </Text>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setIsEditing(true)}
              style={{ marginTop: "20px" }}
            >
              Edit Profile
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ShopProfile;
