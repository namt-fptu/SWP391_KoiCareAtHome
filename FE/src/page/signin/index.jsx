import { Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import signinimg from "../../assets/signin.png";
import { useEffect, useState } from "react";

const Signin = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch user data from the public directory
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/data.json'); // Adjust the path as needed
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSignin = (values) => {
    const { email, password } = values;

    // Check if the email and password match any user in the fetched data
    const user = users.find((user) => user.email === email && user.password === password);

    if (user) {
      console.log("Login successful", user);
      navigate("/overview"); // Redirect to the Overview page
    } else {
      console.log("Invalid email or password");
      // Handle invalid login case (e.g., show error message)
    }
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
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please enter your Email !!" }]}
              >
                <Input type="text" placeholder="John@example.com" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter your Password !!" }]}
              >
                <Input type="password" placeholder="••••••••••••" />
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
