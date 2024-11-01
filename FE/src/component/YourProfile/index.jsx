import React, { useState, useEffect } from "react";
import {
  Card,
  Input,
  Button,
  Form,
  message,
  Avatar,
  Typography,
  Divider,
  Row,
  Col,
  Modal,
} from "antd";
import {
  EditOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import api from "../../config/axios";
import { useAuthStore } from "../../page/(auth)/store";
import backgroud from "./../../assets/wallpaper.jpg";
const { Title, Text } = Typography;

const YourProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
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
  const handleChangePassword = async (values) => {
    try {
      const { oldPassword, newPassword } = values;
      // Call your API to change the password here
      await api.post(`Account/changePassword/${userId}`, {
        oldPassword,
        newPassword,
        confirmPassword: values.confirmPassword,
      });

      message.success("Password changed successfully");
      setIsChangingPassword(false); // Close the modal
    } catch (error) {
      console.error("Error changing password:", error);
      message.error("Failed to change password.");
    }
  };

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900"
    style={{
      backgroundImage: `url(${backgroud})`, // Set the background image
      backgroundSize: "cover", // Cover the entire container
      backgroundPosition: "center", // Center the image
    }}>
      <Card
        title="Your Profile"
        className="w-full max-w-4xl"
        headStyle={{
          backgroundColor: "#f0f0f0",
          color: "#000",
          textAlign: "center",
        }}
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
              rules={[
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input prefix={<MailOutlined />} size="large" />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Phone number is required!" },
                {
                  pattern: /^0\d{9}$/,
                  message: "Please enter a valid phone number starting with 0 and followed by 9 digits!",
              }
              ]}
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
                style={{ marginLeft: "10px" }}
                size="large"
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div style={{ textAlign: "center" }}>
            <Text
              strong
              style={{
                display: "block",
                color: "#333",
                fontSize: "16px",
                marginTop: "10px",
              }}
            >
              <MailOutlined style={{ marginRight: "8px" }} />
              Email: {profile.email}
            </Text>
            <Text
              strong
              style={{
                display: "block",
                color: "#333",
                fontSize: "16px",
                marginTop: "10px",
              }}
            >
              <PhoneOutlined style={{ marginRight: "8px" }} />
              Phone: {profile.phone}
            </Text>
            <Row justify="space-between" style={{ marginTop: "20px" }}>
              <Col>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
                  size="large"
                >
                  Edit Profile
                </Button>
              </Col>
              <Col>
                <Button
                  type="default"
                  onClick={() => setIsChangingPassword(true)}
                  size="large"
                >
                  Change Password
                </Button>
              </Col>
            </Row>
          </div>
        )}
      </Card>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        visible={isChangingPassword}
        onCancel={() => setIsChangingPassword(false)}
        footer={null}
      >
        <Form onFinish={handleChangePassword} layout="vertical">
          <Form.Item
            label="Old Password"
            name="oldPassword"
            rules={[
              { required: true, message: "Please input your old password!" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please input your new password!" },
              {
                min: 8,
                message: "Password must be at least 8 characters!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your new password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit">
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default YourProfile;
