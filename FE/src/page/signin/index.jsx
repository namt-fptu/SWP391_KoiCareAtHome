import { Form, Input } from "antd";
import { Link } from "react-router-dom";
import signinimg from "../../assets/signin.png";
//import { GoogleOAuthProvider } from "@react-oauth/google";

const Signin = () => {
  const handleSignin = (values) => {
    console.log(values);
  };

  return (
    <>
      <div className="signin flex h-screen">
        <div className="signin__image hidden md:block w-1/2">
          <img src={signinimg} alt="" className="object-cover w-full h-full" />
        </div>

        <div className="signin__form flex flex-col justify-center w-full md:w-1/2 bg-gray-50 p-8 md:p-16">
          <div className="form-wrapper">
            <Form
              className="form"
              labelCol={{
                span: 24,
              }}
              onFinish={handleSignin}
            >
              <h1 className="text-3xl font-semibold mb-6">Sign In</h1>
              <p className="mb-4">
                New User?{" "}
                <Link to="/signup">
                  <div className="text-blue-500 ml-auto">Create an account</div>
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
                    className="w-full"
                  />
                </Space> */}
              </Form.Item>
              <Form.Item>
                {/* Stay signed in */}
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="stay-signed-in"
                    className="mr-2 h-4 w-4 text-blue-500"
                  />
                  <label htmlFor="stay-signed-in" className="text-gray-700">
                    Stay signed in
                  </label>
                  <a href="#" className="ml-auto text-blue-500">
                    Forgot password?
                  </a>
                </div>
              </Form.Item>
              <Form.Item>
                <button className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition">
                  SIGN IN
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
              {/* <Form.Item>
                <GoogleOAuthProvider clientId="<your_client_id>"></GoogleOAuthProvider>
                ;
              </Form.Item> */}
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
