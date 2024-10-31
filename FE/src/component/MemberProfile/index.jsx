import React, { useState, useEffect } from "react";
import { Card, Input, Button, Form, message, Avatar, Typography ,Divider} from "antd";
import { EditOutlined, UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import api from "../../config/axios";
import { useAuthStore } from "../../page/(auth)/store";

const { Title, Text } = Typography;

const MemberProfile = () => {
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
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <Card
        title="User Profile"
        className="w-full max-w-4xl"
        headStyle={{ backgroundColor: "#f0f0f0", color: "#000", textAlign: "center" }}
        style={{
          borderRadius: "16px",
          padding: "30px",
          backgroundColor: "#ffffff",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div className="flex justify-center mb-6">
        <Avatar size={120} icon={<UserOutlined />} />
        </div>
        <Title level={3} style={{ textAlign: "center", color: "#333" }}>
          {profile.name}
        </Title>
        <Divider />
        {isEditing ? (
          <Form
            layout="vertical"
            initialValues={profile}
            onFinish={handleUpdateProfile}
            style={{ marginTop: "20px" }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ type: "email", message: "Please enter a valid email!" }]}
            >
              <Input prefix={<MailOutlined />} size="large" />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Phone number is required!" }]}
            >
              <Input prefix={<PhoneOutlined />} size="large" />
            </Form.Item>
            <Form.Item label="Name" name="name">
              <Input size="large" />
            </Form.Item>
            <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
              <Button type="primary" htmlType="submit" size="large">
                Save
              </Button>
              <Button
                
                onClick={() => setIsEditing(false)}
                style={{ marginLeft: "10px" }} size="large">
            
                Cancel
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div style={{ textAlign: "center" }}>
            <Text strong style={{ display: "block", color: "#333", fontSize: "16px", marginTop: "10px" }}>
              <MailOutlined style={{ marginRight: "8px" }} />
              Email: {profile.email}
            </Text>
            <Text strong style={{ display: "block", color: "#333", fontSize: "16px", marginTop: "10px" }}>
              <PhoneOutlined style={{ marginRight: "8px" }} />
              Phone: {profile.phone}
            </Text>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setIsEditing(true)}
              style={{ marginTop: "20px", width: "50%" }}
              size="large"
            >
              Edit Profile
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MemberProfile;
