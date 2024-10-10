import { Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import signinimg from "../../assets/signin.png";
import { useState } from "react";
import api from "../../config/axios"

const Signin = () => {
  const [errorMessage, setErrorMessage] = useState(null); // For error messages
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignin = async (values) => {
    const { email, password, staySignedIn } = values; // Get form values

    try {
      const response = await api.post("Account/login", 
        {
          email: email,
          password: password
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      // Axios automatically throws errors for non-2xx status codes, so no need for .ok or .json()
      const data = response.data; // Extract response data
      console.log("Login successful", data);

      // Store token based on "Stay signed in" checkbox
      if (staySignedIn) {
        localStorage.setItem("authToken", data.token); // Token stored in localStorage
      } else {
        sessionStorage.setItem("authToken", data.token); // Token stored in sessionStorage
      }

      navigate("/overview"); // Navigate to the overview page
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Invalid email or password");
    }
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
              onFinish={handleSignin}
            >
              <h1 className="text-3xl font-semibold mb-6">Sign In</h1>
              <p className="mb-4">
                New User?{" "}
                <Link to="/signup">
                  <div className="text-blue-500 ml-auto">Create an account</div>
                </Link>
              </p>

              {errorMessage && (
                <div className="mb-4 text-red-500">{errorMessage}</div>
              )}

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your Email !!" },
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
                  <input
                    type="checkbox"
                    id="stay-signed-in"
                    className="mr-2 h-4 w-4 text-blue-500"
                  />
                  <label htmlFor="stay-signed-in" className="text-gray-700">
                    Stay signed in
                  </label>
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
