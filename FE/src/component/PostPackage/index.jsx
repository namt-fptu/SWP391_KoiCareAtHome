import React, { useState, useEffect } from "react";
import { Card, Row, Col, message, Button, Modal, Form, Input } from "antd";
import api from "../../config/axios"; // Axios instance configured with base URL

const PostPackage = () => {
    const [packages, setPackages] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
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

    // Handle the submission of the form to create a new package
    const onFinish = async (values) => {
        try {
            setLoading(true);
            // Prepare the request body matching the API structure
            const requestBody = {
                name: values.name,
                duration: parseInt(values.duration, 10),
                price: parseInt(values.price, 10),
            };

            const response = await api.post("/PostPackage/createPackage", requestBody);

            if (response.status === 200) {
                message.success("Package created successfully!");
                fetchPackages(); // Refresh package list
                setIsModalVisible(false); // Close the modal
                form.resetFields(); // Reset form fields
            } else {
                message.error("Failed to create package.");
            }
        } catch (error) {
            console.error("Error creating package:", error);
            message.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    return (
        <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
            <h2 className="text-2xl font-bold mb-8 text-white p-8">
                Available Packages
            </h2>

            <Button type="primary" onClick={showModal} style={{ marginBottom: "20px" }}>
                Create New Package
            </Button>

            {/* Modal for creating a new package */}
            <Modal
                title="Create New Package"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form layout="vertical" form={form} onFinish={onFinish}>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: "Please input the package name!" }]}
                    >
                        <Input placeholder="Enter package name" />
                    </Form.Item>
                    <Form.Item
                        label="Duration (days)"
                        name="duration"
                        rules={[{ required: true, message: "Please input the package duration!" }]}
                    >
                        <Input type="number" placeholder="Enter duration in days" />
                    </Form.Item>
                    <Form.Item
                        label="Price ($)"
                        name="price"
                        rules={[{ required: true, message: "Please input the package price!" }]}
                    >
                        <Input type="number" placeholder="Enter price" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Display packages */}
            <Row gutter={[24, 24]} justify="center" style={{ marginTop: "20px" }}>
                {packages.length > 0 ? (
                    packages.map((pkg) => (
                        <Col key={pkg.id} xs={24} sm={12} md={8} lg={6}>
                            <Card title={pkg.name} style={{ width: "100%", marginBottom: "20px" }}>
                                <p>
                                    <strong>Duration:</strong> {pkg.duration} days
                                </p>
                                <p>
                                    <strong>Price:</strong> ${pkg.price}
                                </p>
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
