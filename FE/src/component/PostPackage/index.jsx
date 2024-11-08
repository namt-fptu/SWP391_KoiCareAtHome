import React, { useState, useEffect } from "react";
import { Card, Row, Col, message, Button, Modal, Form, Input } from "antd";
import api from "../../config/axios"; // Axios instance configured with base URL
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import backgroud from "./../../assets/wallpaper.jpg";

const PostPackage = () => {
  const [packages, setPackages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // New state to track if updating
  const [currentPackage, setCurrentPackage] = useState(null); // Store the package being updated
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPackages();
  }, []);

  // Fetch packages from the API
  const fetchPackages = async () => {
    try {
      const response = await api.get("PostPackage/getPackage");
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
      message.error("Failed to fetch packages.");
    }
  };

  // Handle the submission of the form to create/update a package
  const onFinish = async (values) => {
    try {
      setLoading(true);
      // Prepare the request body matching the API structure
      const requestBody = {
        name: values.name,
        duration: parseInt(values.duration, 10),
        price: parseInt(values.price, 10),
      };

      let response;
      if (isUpdating && currentPackage) {
        // Update package if we're in update mode (name is not changeable)
        response = await api.put(
          `/PostPackage/updatePackage/${currentPackage.id}`,
          requestBody
        );
      } else {
        // Otherwise, create a new package (name is editable)
        response = await api.post("/PostPackage/createPackage", requestBody);
      }

      if (response.status === 200) {
        message.success(
          isUpdating
            ? "Package updated successfully!"
            : "Package created successfully!"
        );
        fetchPackages(); // Refresh package list
        setIsModalVisible(false); // Close the modal
        form.resetFields(); // Reset form fields
        setIsUpdating(false); // Reset update mode
        setCurrentPackage(null); // Clear current package
      } else {
        message.error(
          isUpdating ? "Failed to update package." : "Failed to create package."
        );
      }
    } catch (error) {
      console.error("Error saving package:", error);
      message.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Show the modal for creating a new package
  const showModal = () => {
    setIsUpdating(false); // Set to create mode
    setIsModalVisible(true);
  };

  // Show the modal for updating an existing package
  const showUpdateModal = (pkg) => {
    setIsUpdating(true); // Set to update mode
    setCurrentPackage(pkg); // Store the package being updated
    form.setFieldsValue({
      name: pkg.name,
      duration: pkg.duration,
      price: pkg.price,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setIsUpdating(false);
    setCurrentPackage(null);
  };

  // Function to delete a package
  const deletePackage = async (packageId) => {
    try {
      setLoading(true);
      const response = await api.delete(
        `PostPackage/deletePakage/${packageId}`
      );
      if (response.status === 204) {
        message.success("Package deleted successfully!");
        fetchPackages(); // Refresh package list after deletion
      } else {
        message.error("Failed to delete package.");
      }
    } catch (error) {
      console.error("Error deleting package:", error);
      message.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen"
      style={{
        backgroundImage: `url(${backgroud})`, // Set the background image
        backgroundSize: "cover", // Cover the entire container
        backgroundPosition: "center", // Center the image
      }}>
      <h2 className="text-2xl font-bold mb-8 text-white p-8">
        Available Packages
      </h2>
      <Button
        type="primary"
        onClick={showModal}
        style={{ marginBottom: "20px" }}
      >
        Create New Package
      </Button>
      {/* Modal for creating/updating a package */}
      <Modal
        title={isUpdating ? "Update Package" : "Create New Package"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input the package name!" },
            ]}
          >
            <Input placeholder="Enter package name" />
          </Form.Item>
          <Form.Item
            label="Duration (days)"
            name="duration"
            rules={[
              { required: true, message: "Please input the package duration!" },
            ]}
          >
            <Input type="number" placeholder="Enter duration in days" />
          </Form.Item>
          <Form.Item
  label="Price (vnđ)"
  name="price"
  rules={[
    { required: true, message: "Please input the package price!" },
    {
      validator: (_, value) =>
        value && value >= 20000
          ? Promise.resolve()
          : Promise.reject(new Error("Price must be greater than 20,000 vnđ")),
    },
  ]}
>
  <Input type="number" placeholder="Enter price" />
</Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isUpdating ? "Update" : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Display packages */}
      <Row gutter={[24, 24]} justify="center" style={{ marginTop: "20px" }}>
        {packages.length > 0 ? (
          packages.map((pkg) => (
            <Col key={pkg.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={pkg.name}
                style={{
                  width: "100%",
                  marginBottom: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p>
                    <strong>Duration:</strong> {pkg.duration} days
                  </p>
                  <p>
                    <strong>Price:</strong> {pkg.price}vnđ
                  </p>
                </div>
                {/* Place buttons inside the card */}
                <div style={{ marginTop: "auto" }}>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    style={{ marginRight: "10px" }}
                    onClick={() => showUpdateModal(pkg)}
                  >
                    Update
                  </Button>

                  <Button
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => deletePackage(pkg.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            </Col>
          ))
        ) : (
          <p style={{ color: "white" }}>No packages available.</p>
        )}
      </Row>
    </div>
  );
};

export default PostPackage;
