import { Form, Input, Checkbox } from "antd";
import { Link, useNavigate } from "react-router-dom";
import signinimg from "../../assets/signin.png";
import { useState } from "react";
import api from "../../config/axios";

const Signin = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [staySignedIn, setStaySignedIn] = useState(false);
  const navigate = useNavigate();

  // Function to decode JWT without jwt-decode
  const decodeJWT = (token) => {
    try {
      if (!token) {
        throw new Error("Token is undefined");
      }

      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        throw new Error("Invalid token format");
      }

      const base64Url = tokenParts[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = atob(base64);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const handleSignin = async (values) => {
    const { email, password } = values;

    try {
      const response = await api.post(
        "Account/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = response.data;
      console.log("Login successful", token);

      if (!token) {
        setErrorMessage("Login failed: No token returned from server.");
        return;
      }

      sessionStorage.setItem("authToken", token);

      const decodedToken = decodeJWT(token);
      if (!decodedToken) {
        setErrorMessage("Invalid token. Please try again.");
        return;
      }

      const userRole =
        decodedToken.role ||
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      const id =
        decodedToken.nameidentifier ||
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      if (id) {
        try {
          sessionStorage.setItem("id", id);
        } catch (storageError) {
          console.error("Error storing pond owner ID:", storageError);
          setErrorMessage("Error storing pond owner ID. Please try again.");
          return;
        }
      } else {
        setErrorMessage("Failed to retrieve pond owner ID from token.");
        return;
      }

      if (userRole === "Admin") {
        navigate("/DashBoard");
      } else if (userRole === "PondOwner") {
        navigate("/overview");
      } else if (userRole === "Shop") {
        navigate("/ShopOverview");
      } else {
        setErrorMessage("Unknown user role.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response && error.response.status === 401) {
        setErrorMessage("Invalid email or password");
      } else if (error.response) {
        setErrorMessage(`Login failed: ${error.response.statusText}`);
      } else {
        setErrorMessage("Network error. Please try again later.");
      }
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
