import { Form, Input } from "antd";
import { Link } from "react-router-dom";
import signupimg from "../../assets/signin.png";

const Signup = () => {
  const handleSignup = (values) => {
    console.log(values);
  };

  return (
    <>
      <div className="signup flex h-screen">
        <div className="hidden md:block w-1/2">
          <img src={signupimg} alt="" className="object-cover w-full h-full" />
        </div>

        <div className="signup__form flex flex-col justify-center w-full md:w-1/2 bg-gray-50 p-8 md:p-16">
          <div className="form-wrapper">
            <Form
              className="form"
              labelCol={{
                span: 24,
              }}
              onFinish={handleSignup}
            >
              <h1 className="text-3xl font-semibold mb-6">Sign Up</h1>
              <p className="mb-4">
                Have an account?{" "}
                <Link to="/signin">
                  <div className="text-blue-500 ml-auto">Sign In</div>
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
              >
                <Input type="text" placeholder="John@example.com" />
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
                      if (getFieldValue("password") != value)
                        return Promise.reject(
                          "Confirm Password must match with Password!!"
                        );
                    },
                  }),
                ]}
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
              <Form.Item>
                <button className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition">
                  CREATE ACOUNT
                </button>
              </Form.Item>
              <Form.Item>
                {/* Divider */}
                <div className="flex items-center my-6">
                  <hr className="w-full border-gray-300" />
                  <span className="px-2 text-gray-400">OR</span>
                  <hr className="w-full border-gray-300" />
                </div>
              </Form.Item>
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
