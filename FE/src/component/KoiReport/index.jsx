import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  message,
  Modal,
  notification,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import api from "../../config/axios"; // Axios instance configuration
import moment from "moment";
import { useAuthStore } from "../../page/(auth)/store";
import backgroud from "./../../assets/wallpaper.jpg";
const KoiReport = () => {
  const [kois, setKois] = useState([]); // Array to store Koi fish details
  const [pondId, setPondId] = useState(null); // Selected pond ID
  const [ponds, setPonds] = useState([]); // Array to store user ponds
  const [selectedKoiId, setSelectedKoiId] = useState(null); // State to store selected Koi ID
  const [showCreateForm, setShowCreateForm] = useState(false); // Control form display state for create
  const [showUpdateForm, setShowUpdateForm] = useState(false); // Control form display state for update

  const [koiGrowthReports, setKoiGrowthReports] = useState([]); // Store Koi growth reports
  const [selectedReport, setSelectedReport] = useState(null); // Store selected report for update
  const [form] = Form.useForm(); // Form instance for create
  const [updateForm] = Form.useForm(); // Form instance for update
  // const id = sessionStorage.getItem("id");
  const { authUser } = useAuthStore();
  const id = authUser.id;

  useEffect(() => {
    if (!id) {
      message.error("User not logged in. Unable to fetch ponds.");
      return;
    }
    fetchUserPonds();
  }, [id]);

  // Fetch ponds owned by the user
  const fetchUserPonds = async () => {
    try {
      const response = await api.get(`Pond/ponds/${id}`);
      setPonds(response.data);
    } catch (error) {
      notification.error({
        message: "Pond Not Found",
        description: "Maybe there are no ponds yet. Please add one.",
        duration: 2, // Duration in seconds
      });
    }
  };

  // Fetch koi fish for the selected pond
  const fetchKoiForPond = async (pondId) => {
    try {
      const response = await api.get(`KoiFish/koiFish/${pondId}`);
      setKois(response.data);
    } catch (error) {
      setKois([]);
      message.warning("No koi fish found for this pond."); // Changed to warning
      console.error("Error fetching koi fish:", error);
    }
  };

  // Fetch all growth reports for the selected koi
  const fetchGrowthReports = async (koiId) => {
    try {
      const response = await api.get(
        `/KoiGrowthReport/koiGrowthReport/${koiId}`
      );
      setKoiGrowthReports(response.data); // Store fetched growth reports in state
    } catch (error) {
      console.error("Error fetching koi growth reports:", error);
      message.error("Failed to fetch koi growth reports.");
    }
  };

  // Handle deletion of a growth report
  const handleDelete = (reportId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this report?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await api.delete(
            `/KoiGrowthReport/deleteGrowthreportById/${reportId}`
          );
          message.success("Koi report deleted successfully!");

          // Update the list of reports after deletion
          setKoiGrowthReports(
            koiGrowthReports.filter((report) => report.id !== reportId)
          );
        } catch (error) {
          console.error("Error deleting koi report:", error);
          message.error("Failed to delete koi report.");
        }
      },
    });
  };

  // Handle updating a report
  const handleUpdate = (report) => {
    // Set the selected report for update
    setSelectedReport(report);
    updateForm.setFieldsValue({
      length: report.length,
      wetight: report.weight,
      date: moment(report.date),
    });

    setShowUpdateForm(true); // Show the update form
  };

  useEffect(() => {
    if (pondId) {
      fetchKoiForPond(pondId);
    }
  }, [pondId]);

  // Handle form submission for new report creation
  const onFinishCreate = async (values) => {
    const { length, wetight, date } = values;
    const formattedDate = date
      ? date.format("YYYY-MM-DD")
      : new Date().toISOString();

    const data = {
      koiId: selectedKoiId,
      length,
      wetight,
      date: formattedDate,
    };

    try {
      // Make POST request to create koi growth report
      await api.post("/KoiGrowthReport/createKoiReport", data);
      message.success("Koi report created successfully!");

      // Fetch updated list of growth reports after submission
      fetchGrowthReports(selectedKoiId);
      setShowCreateForm(false); // Hide create form after submission
      form.resetFields(); // Reset form fields
    } catch (error) {
      console.error("Error creating koi report:", error);
      message.error("Failed to create koi report.");
    }
  };

  // Handle form submission for updating a report
  const onFinishUpdate = async (values) => {
    const { length, wetight, date } = values;
    const updatedData = {
      koiId: selectedKoiId,
      length,
      wetight,
      date: date ? date.format("YYYY-MM-DD") : new Date().toISOString(),
    };

    try {
      // Send the update request to the server
      await api.put(
        `/KoiGrowthReport/updateKoiGrowthreport/${selectedReport.id}`,
        updatedData
      );

      message.success("Koi report updated successfully!");
      setShowUpdateForm(false); // Hide update form after update
      fetchGrowthReports(selectedKoiId); // Refresh the reports
    } catch (error) {
      console.error("Error updating koi report:", error);
      message.error("Failed to update koi report.");
    }
  };

  return (
    <div className="flex-container">
      <div
        className="flex-1 h-full p-5 bg-gray-900 min-h-screen"
        style={{
          backgroundImage: `url(${backgroud})`, // Set the background image
          backgroundSize: "cover", // Cover the entire container
          backgroundPosition: "center", // Center the image
        }}
      >
        <h1 className="text-3xl font-bold mb-8 text-white">Koi Report</h1>
        <p className="text-white"> Report about your Koi.</p>
        {/* Pond Selection */}
        <Select
          placeholder="Select a pond to view koi fish"
          onChange={(value) => {
            setPondId(value);
            setSelectedKoiId(null); // Reset selected koi when pond changes
            setShowCreateForm(false); // Hide form when pond changes
            form.resetFields(); // Reset form when pond changes
          }}
          style={{ width: "10%", marginBottom: "20px" }}
        >
          {ponds.map((pond) => (
            <Select.Option key={pond.id} value={pond.id}>
              {pond.name}
            </Select.Option>
          ))}
        </Select>

        {pondId && (
          <>
            {/* Koi Selection */}
            {kois.length > 0 ? (
              <Select
                placeholder="Select a koi fish"
                onChange={(value) => {
                  setSelectedKoiId(value);
                  fetchGrowthReports(value); // Fetch growth reports when koi is selected
                }}
                style={{ width: "10%", marginTop: "20px" }}
              >
                {kois.map((koi) => (
                  <Select.Option key={koi.id} value={koi.id}>
                    {koi.koiName}
                  </Select.Option>
                ))}
              </Select>
            ) : (
              <p style={{ color: "white", marginTop: "10px" }}>
                No Koi fish available.
              </p>
            )}
          </>
        )}
        {ponds.length === 0 && (
          <div className="mt-4">
            <Button
              type="primary"
              onClick={() => (window.location.href = "/MyPond")}
            >
              Go to My Pond to create one
            </Button>
          </div>
        )}

        {ponds.length > 0 && kois.length === 0 && (
          <div className="mt-4">
            <Button
              type="primary"
              onClick={() => (window.location.href = "/MyKoiFish")}
            >
              Go to My Koi Fish to add one
            </Button>
          </div>
        )}

        {/* Button to Show Create Form */}
        {selectedKoiId && !showCreateForm && (
          <Button
            type="primary"
            onClick={() => setShowCreateForm(true)}
            style={{ marginTop: "20px" }}
          >
            Make Report
          </Button>
        )}

        {/* Modal for Create Form */}
        <Modal
          title="Create Koi Growth Report"
          open={showCreateForm}
          onCancel={() => {
            setShowCreateForm(false);
            form.resetFields(); // Reset form when modal is closed
          }}
          footer={null} // No footer needed, we use the form button
        >
          <Form
            form={form}
            onFinish={onFinishCreate}
            layout="vertical"
            style={{ marginBottom: "20px" }}
          >
            <Form.Item
              name="length"
              label="Length (cm)"
              rules={[
                { required: true, message: "Please enter the length" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Length must be greater than 0")
                    );
                  },
                }),
              ]}
            >
              <Input placeholder="Length" />
            </Form.Item>

            <Form.Item
              name="wetight"
              label="Weight (g)"
              rules={[
                { required: true, message: "Please enter the weight" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Weight must be greater than 0")
                    );
                  },
                }),
              ]}
            >
              <Input placeholder="Weight" />
            </Form.Item>

            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select the date" }]}
            >
              <DatePicker
                disabledDate={(current) =>
                  current && current > moment().endOf("day")
                }
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal for Update Form */}
        <Modal
          title="Update Koi Growth Report"
          open={showUpdateForm}
          onCancel={() => {
            setShowUpdateForm(false);
            updateForm.resetFields(); // Reset form when modal is closed
          }}
          footer={null} // No footer needed, we use the form button
        >
          <Form
            form={updateForm}
            onFinish={onFinishUpdate}
            layout="vertical"
            style={{ marginBottom: "20px" }}
          >
            <Form.Item
              name="length"
              label="Length (cm)"
              rules={[
                { required: true, message: "Please enter the length" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Length must be greater than 0")
                    );
                  },
                }),
              ]}
            >
              <Input placeholder="Length" />
            </Form.Item>

            <Form.Item
              name="wetight"
              label="weight (g)"
              rules={[
                { required: true, message: "Please enter the weight" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Weight must be greater than 0")
                    );
                  },
                }),
              ]}
            >
              <Input placeholder="Weight" />
            </Form.Item>

            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select the date" }]}
            >
              <DatePicker
                disabledDate={(current) =>
                  current && current > moment().endOf("day")
                }
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Display Koi Growth Reports */}
        {koiGrowthReports.length > 0 ? (
          <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
            {koiGrowthReports.map((report) => (
              <Col
                span={8}
                key={report.id}
                xs={24}
                sm={12}
                md={8}
                lg={6}
                style={{
                  width: "100%",
                  height: "100%",
                  marginBottom: "20px",
                }}
              >
                <Card
                  title={`Report - ${moment(report.date).format(
                    "MMMM Do, YYYY"
                  )}`}
                >
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <p>
                        <strong>Length:</strong> {report.length}
                      </p>
                    </Col>
                    <Col span={12}>
                      <p>
                        <strong>Weight (NO₂):</strong> {report.weight}
                      </p>
                    </Col>
                  </Row>
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
                      onClick={() => handleUpdate(report)}
                    >
                      Update
                    </Button>

                    <Button
                      type="danger"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(report.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          selectedKoiId && <p style={{ color: "white" }}>No reports found.</p>
        )}
      </div>
    </div>
  );
};

export default KoiReport;
