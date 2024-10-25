import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  message,
} from "antd";
import api from "../../config/axios";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import moment from "moment"; // For date formatting
import { useAuthStore } from "../../page/(auth)/store";

const WaterParameter = () => {
  const [waterReports, setWaterReports] = useState([]);
  const [ponds, setPonds] = useState([]);
  const [selectedPond, setSelectedPond] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editReport, setEditReport] = useState(null); // New state for editing a report

  const { Option } = Select;

  useEffect(() => {
    fetchUserPonds();
  }, []);
  const { authUser } = useAuthStore();
  const id = authUser.id;

  // Fetch user's ponds
  const fetchUserPonds = async () => {
    // const id = sessionStorage.getItem("id");

    if (!id) {
      message.error("User not logged in. Unable to fetch ponds.");
      return;
    }
    try {
      const response = await api.get(`Pond/ponds/${id}`);
      setPonds(response.data);
    } catch (error) {
      console.error("Error fetching ponds:", error);
      message.error("Failed to fetch ponds.");
    }
  };

  // Fetch water parameters for the selected pond
  const fetchWaterReports = async (pondId) => {
    try {
      const response = await api.get(`WaterReport/waterReport/${pondId}`);
      setWaterReports(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setWaterReports([]);
        message.info("No water reports found for this pond.");
      } else {
        console.error("Error fetching water reports:", error);
        message.error("Failed to fetch water reports.");
      }
    }
  };
  const handleDeleteReport = async (reportId) => {
    try {
      // Call API DELETE with the report ID
      await api.delete(`/WaterReport/deleteWaterReportById/${reportId}`);

      message.success("Water report deleted successfully!");

      // Update the list of reports after deletion
      fetchWaterReports(selectedPond);
    } catch (error) {
      console.error("Error deleting water report:", error);
      message.error("Failed to delete water report.");
    }
  };
  // Handle pond selection
  const handlePondChange = (pondId) => {
    setSelectedPond(pondId);
    fetchWaterReports(pondId);
  };

  // Show modal to input water parameters
  const showModal = (report = null) => {
    if (!selectedPond && !report) {
      message.error("Please select a pond first!");
      return;
    }

    if (report) {
      setEditReport(report); // Set the report for editing
      form.setFieldsValue({
        ...report,
        date: moment(report.date),
      });
    } else {
      setEditReport(null);
      form.resetFields();
    }

    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Submit new water parameters or update existing ones
  const onFinish = async (values) => {
    const newReport = {
      pondId: selectedPond,
      salt: values.salt,
      nitrite: values.nitrite,
      nitrates: values.nitrates,
      amonium: values.amonium,
      hardness: values.hardness,
      oxigen: values.oxigen,
      temperature: values.temperature,
      phVaule: values.phVaule,
      cabondioxide: values.cabondioxide,
      date: values.date ? values.date.toISOString() : new Date().toISOString(), // Format the selected date or use the current date
    };

    const handleDeleteReport = async (reportId) => {
      try {
        // Gọi API DELETE với ID của báo cáo
        await api.delete(`/WaterReport/deleteWaterReportById/${reportId}`);

        message.success("Water report deleted successfully!");

        // Cập nhật lại danh sách báo cáo sau khi xóa
        fetchWaterReports();
      } catch (error) {
        console.error("Error deleting water report:", error);
        message.error("Failed to delete water report.");
      }
    };

    try {
      if (editReport) {
        // Update existing report
        await api.put(
          `WaterReport/updateWaterReport/${editReport.id}`,
          newReport
        );
        message.success("Water parameters updated successfully!");
      } else {
        // Create new report
        await api.post(`WaterReport/createWaterReport`, newReport);
        message.success("Water parameters added successfully!");
      }

      fetchWaterReports(selectedPond); // Refresh the list
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error saving water parameters:", error);
      message.error("Failed to save water parameters.");
    }
  };

  return (
    <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-white p-8">
        Water Parameters
      </h1>

      {/* Pond Selection */}
      <Form.Item
        name="pond"
        rules={[{ required: true, message: "Please select a pond!" }]}
      >
        <Select
          placeholder="Select a pond"
          onChange={handlePondChange}
          allowClear
          style={{ width: "10%" }} // Apply inline styling for width
        >
          {ponds.map((pond) => (
            <Option key={pond.id} value={pond.id}>
              {pond.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Button to Input Water Parameters */}
      <div className="flex flex-col items-center">
        <Button type="primary" onClick={() => showModal()}>
          Input Water Parameters
        </Button>
      </div>

      {/* Modal for Adding or Updating Water Parameters */}
      <Modal
        title={
          editReport ? "Update Water Parameters" : "Input Water Parameters"
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            {/* Date Picker */}
            <Col span={12}>
              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: "Please select a date!" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            {/* Salt Input */}
            <Col span={12}>
              <Form.Item
                label="Salt"
                name="salt"
                rules={[{ required: true, message: "Please input Salt!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            {/* Nitrite Input */}
            <Col span={12}>
              <Form.Item
                label="Nitrite (NO₂)"
                name="nitrite"
                rules={[{ required: true, message: "Please input Nitrite!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            {/* Nitrate Input */}
            <Col span={12}>
              <Form.Item
                label="Nitrate (NO₃)"
                name="nitrates"
                rules={[{ required: true, message: "Please input Nitrate!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            {/* Ammonium Input */}
            <Col span={12}>
              <Form.Item
                label="Ammonium (NH₄)"
                name="amonium"
                rules={[{ required: true, message: "Please input Ammonium!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            {/* Hardness Input */}
            <Col span={12}>
              <Form.Item
                label="Hardness (GH)"
                name="hardness"
                rules={[{ required: true, message: "Please input Hardness!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            {/* Oxygen Input */}
            <Col span={12}>
              <Form.Item
                label="Oxygen (O₂)"
                name="oxigen"
                rules={[{ required: true, message: "Please input Oxygen!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            {/* Temperature Input */}
            <Col span={12}>
              <Form.Item
                label="Temperature (℃)"
                name="temperature"
                rules={[
                  { required: true, message: "Please input Temperature!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            {/* pH-Value Input */}
            <Col span={12}>
              <Form.Item
                label="pH-Value"
                name="phVaule"
                rules={[{ required: true, message: "Please input pH-Value!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            {/* CO₂ Input */}
            <Col span={12}>
              <Form.Item
                label="CO₂"
                name="cabondioxide"
                rules={[{ required: true, message: "Please input CO₂!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* Submit Buttons */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editReport ? "Update" : "Add"}
            </Button>
            <Button
              type="default"
              onClick={handleCancel}
              style={{ marginLeft: "10px" }}
            >
              Close
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Display Water Reports */}
      {waterReports.length > 0 ? (
        <Row gutter={[24, 24]} justify="center" style={{ marginTop: "20px" }}>
          {waterReports.map((report, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={`Water Report for Pond: ${selectedPond}`}
                style={{ width: "100%", marginBottom: "20px" }}
                // extra={
                //   <>
                //     <Button
                //       type="primary"
                //       icon={<EditOutlined />}
                //       onClick={() => showModal(report)}
                //       style={{ marginRight: "10px" }}
                //     >
                //       Update
                //     </Button>
                //     <Button
                //       type="danger"
                //       icon={<DeleteOutlined />}
                //       onClick={() => handleDeleteReport(report.id)} // Pass report.id here
                //     >
                //       Delete
                //     </Button>
                //   </>
                // }
              >
                <p>
                  <strong>Date:</strong>{" "}
                  {moment(report.date).format("YYYY-MM-DD")}
                </p>
                <p>
                  <strong>Salt:</strong> {report.salt}
                </p>
                <p>
                  <strong>Nitrite (NO₂):</strong> {report.nitrite}
                </p>
                <p>
                  <strong>Nitrate (NO₃):</strong> {report.nitrates}
                </p>
                <p>
                  <strong>Ammonium (NH₄):</strong> {report.amonium}
                </p>
                <p>
                  <strong>Hardness (GH):</strong> {report.hardness}
                </p>
                <p>
                  <strong>Oxygen (O₂):</strong> {report.oxigen}
                </p>
                <p>
                  <strong>Temperature:</strong> {report.temperature}
                </p>
                <p>
                  <strong>pH-Value:</strong> {report.phVaule}
                </p>
                <p>
                  <strong>CO₂:</strong> {report.cabondioxide}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => showModal(report)}
                  >
                    Update
                  </Button>

                  <Button
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteReport(report.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p style={{ color: "white" }}>No reports available.</p>
      )}
    </div>
  );
};

export default WaterParameter;
