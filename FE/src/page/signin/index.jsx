import { Form, Input, Checkbox, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import signinimg from "../../assets/signin.png";
import { useState } from "react";
import api from "../../config/axios";
import { useAuthStore } from "../(auth)/store";
import { useMutation } from "@tanstack/react-query";

const Signin = () => {
  const { isKeepLogin, login } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState(null);
  const [staySignedIn, setStaySignedIn] = useState(false);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      console.log("Login successful");
      message.success("Login successful"); // Direct message for simplicity
    },
    onError: (error) => {
      console.log("Login failed", error);

      // Show default error message if translation is missing
      const errorMessage =
        error.message === "username_or_password_incorrect"
          ? "Incorrect username or password"
          : "Account not found. Please try again.";

      message.error(errorMessage); // Display the error message
    },
  });

  // Handle form submission
  const handleFinish = (values) => {
    loginMutation.mutate(values); // Pass values to the mutate function
  };

  return (
    <>
      <div className="signin flex h-screen">
        <div className="signin__image hidden md:block w-1/2">
          <img
            src={signinimg}
            alt="Sign In illustration"
            className="object-cover w-full h-full"
          />
        </div>

        <div className="signin__form flex flex-col justify-center w-full md:w-1/2 bg-gray-50 p-8 md:p-16">
          <div className="form-wrapper">
            <Form
              className="form"
              labelCol={{ span: 24 }}
              onFinish={loginMutation.mutate}
            >
              <h1 className="text-3xl font-semibold mb-6">Sign In</h1>
              <div className="mb-4">
                New User?{" "}
                <Link to="/signup">
                  <div className="text-blue-500 ml-auto">Create an account</div>
                </Link>
              </div>

              {errorMessage && (
                <div className="mb-4 text-red-500">{errorMessage}</div>
              )}

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your Email !!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  type="email"
                  placeholder="John@example.com"
                  aria-label="Email"
                />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your Password !!" },
                ]}
              >
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  aria-label="Password"
                />
              </Form.Item>
              <Form.Item>
                <div className="flex items-center mb-6">
                  <Form.Item
                    name="staySignedIn"
                    valuePropName="checked"
                    noStyle
                  >
                    <Checkbox
                      checked={staySignedIn}
                      onChange={(e) => setStaySignedIn(e.target.checked)}
                    >
                      Stay signed in
                    </Checkbox>
                  </Form.Item>
                  <Link to="/forgot-password" className="ml-auto text-blue-500">
                    Forgot password?
                  </Link>
                </div>
              </Form.Item>
              <Form.Item>
                <button className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition">
                  SIGN IN
                </button>
              </Form.Item>
              <Form.Item>
                <div className="flex items-center my-6">
                  <hr className="w-full border-gray-300" />
                  <span className="px-2 text-gray-400">OR</span>
                  <hr className="w-full border-gray-300" />
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
