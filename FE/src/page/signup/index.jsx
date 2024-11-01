import React, { useState } from "react";
import { Form, Input, Radio, message, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import signupimg from "../../assets/signin.png";
import api from "../../config/axios";

const Signup = () => {
  const [role, setRole] = useState("");
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
                    message: "Please enter a valid phone number starting with 0 and followed by 9 digits!",
                }
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
                  By clicking "Create account", you agree to the KoiF Privacy
                  Policy.
                </p>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
