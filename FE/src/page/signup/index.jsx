import { Form, Input, Radio, message, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"; // Thêm useState
import signupimg from "../../assets/signin.png";
import api from "../../config/axios"; // Axios instance configuration

const Signup = () => {
  const [values, setValues] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
    role: "",
    url: "",
  });
  const [role, setRole] = useState(""); // Khai báo biến role
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleSignup = async (values) => {
    const payload = {
      email: values.email,
      name: values.name,
      phone: values.phone,
      password: values.password,
      role: role, // Ensure role is taken from state
      shopUrl: role === "Shop" ? values.url : null, // Only add shopUrl if role is "Shop"
    };
    try {
      const response = await api.post(`Account/createAccount`, payload);
      if (response.status === 200) {
        message.success("Sign up successful!"); // Hiển thị thông báo thành công
        navigate("/signin"); // Chuyển hướng về trang đăng nhập
      } else {
        message.error("Sign up failed!");
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API thất bại
      console.error(error);
      message.error("An error occurred during sign up.");
    }
  };

  // Hàm xử lý thay đổi vai trò
  const onRoleChange = (e) => {
    setRole(e.target.value); // Cập nhật role khi người dùng chọn
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
                  <div className="text-blue-500 ml-2  ">Sign In</div>
                </Link>
              </p>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter your Email !!",
                  },
                ]}
                className="mb-2"
              >
                <Input type="text" placeholder="John@example.com" />
              </Form.Item>

              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter your Name !!",
                  },
                ]}
                className="mb-2"
              >
                <Input type="text" placeholder="John" />
              </Form.Item>

              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please enter your Phone !!",
                  },
                ]}
                className="mb-2"
              >
                <Input type="text" placeholder="" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your Password !!",
                  },
                ]}
                className="mb-2"
              >
                <Input type="password" placeholder="••••••••••••" />
                {/* <Space direction="vertical">
                  <Input.Password
                    placeholder="•••••••••••"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Space> */}
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: "Please enter your Password !!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (getFieldValue("password") != value) {
                        return Promise.reject(
                          "Confirm Password must match with Password!!"
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                className="mb-2"
              >
                <Input type="password" placeholder="••••••••••••" />
              </Form.Item>

              <Form.Item
                label="Role"
                name="role"
                rules={[
                  {
                    required: true,
                    message: "Please select your Role !!",
                  },
                ]}
                className="mb-2"
              >
                <Radio.Group onChange={onRoleChange}>
                  <Radio value="PondOwner">Member</Radio>
                  <Radio value="Shop">Shop</Radio>
                </Radio.Group>
              </Form.Item>

              {/* Chỉ hiển thị khi vai trò là "Shop" */}
              {role === "Shop" && (
                <Form.Item
                  label="ShopURL"
                  name="url"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your Shop URL !!",
                    },
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
                  CREATE ACOUNT
                </Button>
              </Form.Item>
              {/* Divider */}
              {/* <Form.Item>
                <div className="flex items-center my-6">
                  <hr className="w-full border-gray-300" />
                  <span className="px-2 text-gray-400">OR</span>
                  <hr className="w-full border-gray-300" />
                </div>
              </Form.Item> */}
              <Form.Item>
                <p className="text-xs text-gray-500">
                  By clicking {`"Create account"`} or {`"Sign Up with Google"`},
                  you agree to the KoiF Privacy Policy.
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
