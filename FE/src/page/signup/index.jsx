import React, { useState } from "react";
import { Form, Input, Radio, message, Button, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import signupimg from "../../assets/signin.png";
import api from "../../config/axios";

const Signup = () => {
  const [role, setRole] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (values) => {
    const payload = {
      email: values.email,
      name: values.name,
      phone: values.phone,
      password: values.password,
      role: role,
      shopUrl: role === "Shop" ? values.url : null,
    };
    try {
      const response = await api.post(`Account/createAccount`, payload);
      if (response.status === 200) {
        message.success("Sign up successful!");
        navigate("/signin");
      } else {
        message.error("Sign up failed!");
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred during sign up.");
    }
  };

  const onRoleChange = (e) => {
    setRole(e.target.value);
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className="signup flex h-screen">
        <div className="hidden md:block w-1/2">
          <img src={signupimg} alt="" className="object-cover w-full h-full" />
        </div>

        <div className="signup__form flex flex-col justify-center w-full md:w-1/2 bg-gray-50 p-8 md:p-8">
          <div className="form-wrapper">
            <Form
              className="form"
              labelCol={{
                span: 24,
              }}
              onFinish={handleSignup}
            >
              <h1 className="text-3xl font-semibold mb-2">Sign Up</h1>
              <p className="mb-2 flex items-center">
                Have an account?{" "}
                <Link to="/signin">
                  <div className="text-blue-500 ml-2">Sign In</div>
                </Link>
              </p>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your Email!" },
                  { type: "email", message: "Please enter a valid Email!" },
                ]}
                className="mb-2"
              >
                <Input type="email" placeholder="John@example.com" />
              </Form.Item>

              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter your Name!" }]}
                className="mb-2"
              >
                <Input type="text" placeholder="John" />
              </Form.Item>

              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  { required: true, message: "Please enter your Phone!" },
                  {
                    pattern: /^0\d{9}$/,
                    message:
                      "Please enter a valid phone number starting with 0 and followed by 9 digits!",
                  },
                ]}
                className="mb-2"
              >
                <Input type="text" placeholder="1234567890" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your Password!" },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters!",
                  },
                ]}
                className="mb-2"
              >
                <Input.Password placeholder="••••••••" />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your Password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Passwords do not match!");
                    },
                  }),
                ]}
                className="mb-2"
              >
                <Input.Password placeholder="••••••••" />
              </Form.Item>

              <Form.Item
                label="Role"
                name="role"
                rules={[
                  { required: true, message: "Please select your Role!" },
                ]}
                className="mb-2"
              >
                <Radio.Group onChange={onRoleChange}>
                  <Radio value="PondOwner">Member</Radio>
                  <Radio value="Shop">Shop</Radio>
                </Radio.Group>
              </Form.Item>

              {role === "Shop" && (
                <Form.Item
                  label="Shop URL"
                  name="url"
                  rules={[
                    { required: true, message: "Please enter your Shop URL!" },
                    { type: "url", message: "Please enter a valid URL!" },
                  ]}
                >
                  <Input type="text" placeholder="https://yourshop.com" />
                </Form.Item>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  CREATE ACCOUNT
                </Button>
              </Form.Item>

              <Form.Item>
                <p className="text-xs text-gray-500">
                  By clicking "Create account", you agree to the KoiF{" "}
                  <span
                    onClick={showModal}
                    className="text-blue-500 cursor-pointer"
                  >
                    Privacy Policy
                  </span>
                  .
                </p>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      <Modal
        title="Privacy Policy for KoiF"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        <p>
          Welcome to Koi Care System at Home! Your privacy is very important to
          us. This Privacy Policy outlines how we collect, use, and safeguard
          your personal information when you visit our website or use our
          services. By accessing or using our website, you agree to the terms
          outlined below.
        </p>
        <h3 style={{ marginTop: "20px", fontSize: "20px", fontWeight: "bold" }}>
          1. Information Collection
        </h3>
        <p>
          We collect personal information such as name, contact details, and
          email when you register. Usage data and interaction details are
          collected to enhance service quality.
        </p>

        <h3 style={{ marginTop: "20px", fontSize: "20px", fontWeight: "bold" }}>
          2. Use of Information
        </h3>
        <p>
          Your information helps us deliver services, respond to inquiries,
          personalize experiences, and improve our services. For marketing, you
          may opt out of communications.
        </p>

        <h3 style={{ marginTop: "20px", fontSize: "20px", fontWeight: "bold" }}>
          3. Information Sharing
        </h3>
        <p>
          We respect your privacy and only share information with trusted
          third-party service providers under strict confidentiality. Your data
          is not sold to third parties.
        </p>

        <h3 style={{ marginTop: "20px", fontSize: "20px", fontWeight: "bold" }}>
          4. Data Security
        </h3>
        <p>
          We prioritize data security by using secure measures to protect your
          information. However, no transmission is entirely secure, and you
          share information at your own risk.
        </p>

        <h3 style={{ marginTop: "20px", fontSize: "20px", fontWeight: "bold" }}>
          5. Third-Party Links
        </h3>
        <p>
          Our website may link to external sites. We are not responsible for
          their content or practices. Review their policies before using their
          services.
        </p>

        <h3 style={{ marginTop: "20px", fontSize: "20px", fontWeight: "bold" }}>
          6. Policy Updates
        </h3>
        <p>
          We may revise this policy. Any changes will be updated on this page.
          Continued use after changes indicates acceptance of the updated terms.
        </p>

        <h3 style={{ marginTop: "20px", fontSize: "20px", fontWeight: "bold" }}>
          7. Contact Us
        </h3>
        <p>
          For privacy questions, please contact us at sofn2004@gmail.com or{" "}
          <br />
          093 370 45 67.
        </p>
        <br />
        <p>
          Thank you for trusting KoiF. We are committed to ensuring that your
          privacy is respected and protected.
        </p>
      </Modal>
    </>
  );
};

export default Signup;
