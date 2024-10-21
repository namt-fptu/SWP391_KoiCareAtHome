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
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import api from "../../config/axios"; // Axios instance configuration
import moment from "moment";

const KoiReport = () => {
  const [kois, setKois] = useState([]); // Array to store Koi fish details
  const [pondId, setPondId] = useState(null); // Selected pond ID
  const [ponds, setPonds] = useState([]); // Array to store user ponds
  const [selectedKoiId, setSelectedKoiId] = useState(null); // State to store selected Koi ID
  const [showForm, setShowForm] = useState(false); // Control form display state
  const [koiGrowthReports, setKoiGrowthReports] = useState([]); // Store Koi growth reports
  // const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false); // State for update modal
  // const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // State for delete modal
  const [form] = Form.useForm(); // Form instance
  const id = sessionStorage.getItem("id");

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
      console.error("Error fetching ponds:", error);
      message.error("Failed to fetch ponds. Please try again.");
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

  useEffect(() => {
    if (pondId) {
      fetchKoiForPond(pondId);
    }
  }, [pondId]);

  const onFinish = async (values) => {
    const { length, weight, date } = values;

    const formattedDate = date
      ? date.format("YYYY-MM-DD")
      : new Date().toISOString();
    console.log("Selected Date:", formattedDate);
    console.log("Form Values:", { length, weight, date: formattedDate });
    const data = {
      koiId: selectedKoiId,
      length,
      weight,
      date: values.date ? values.date.toISOString() : new Date().toISOString(),
    };

    try {
      // Make POST request to create koi growth report
      await api.post("/KoiGrowthReport/createKoiReport", data);
      message.success("Koi report created successfully!");

      // Fetch updated list of growth reports after submission
      fetchGrowthReports(selectedKoiId);
      setShowForm(false); // Hide form after submission
      form.resetFields(); // Reset form fields
    } catch (error) {
      console.error("Error creating koi report:", error);
      message.error("Failed to create koi report.");
    }
  };
  const handleUpdate = (report) => {
    form.setFieldsValue({
      length: report.length,
      weight: report.weight,
      date: moment(report.date),
    });

    setSelectedKoiId(report.id); // Đặt ID báo cáo được chọn để cập nhật
    setShowForm(true); // Hiển thị form cập nhật
  };

  // Hàm xóa báo cáo koi
  const handleDelete = (reportId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this report?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await api.delete(`/KoiGrowthReport/deleteGrowthreport/${reportId}`);
          message.success("Koi report deleted successfully!");

          // Cập nhật lại danh sách báo cáo sau khi xóa
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

  return (
    <div className="flex-container">
      <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-white p-8">Koi Report</h1>

        {/* Pond Selection */}
        <Select
          placeholder="Select a pond to view koi fish"
          onChange={(value) => {
            setPondId(value);
            setSelectedKoiId(null); // Reset selected koi when pond changes
            setShowForm(false); // Hide form when pond changes
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
                style={{ width: "20%", marginTop: "20px" }}
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

        {/* Button to Show Form */}
        {selectedKoiId && !showForm && (
          <Button
            type="primary"
            onClick={() => setShowForm(true)}
            style={{ marginTop: "20px" }}
          >
            Make Report
          </Button>
        )}

        {/* Modal for Report Form */}
        <Modal
          title="Create Koi Growth Report"
          open={showForm}
          onCancel={() => {
            setShowForm(false);
            form.resetFields(); // Reset form when modal is closed
          }}
          footer={null} // No footer needed, we use the form button
        >
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            style={{ marginBottom: "20px" }}
          >
            <Form.Item
              name="length"
              label="Length (cm)"
              rules={[{ required: true, message: "Please enter the length" }]}
            >
              <Input type="number" placeholder="Enter Koi length in cm" />
            </Form.Item>

            <Form.Item
              name="weight"
              label="Weight (g)"
              rules={[{ required: true, message: "Please enter the weight" }]}
            >
              <Input type="number" placeholder="Enter Koi weight in grams" />
            </Form.Item>

            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select the date" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD" // Ensure the format is displayed correctly
                placeholder="Select a date" // Placeholder text
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              style={{ marginTop: "20px" }}
            >
              Submit Koi Report
            </Button>
          </Form>
        </Modal>

        {/* Display Existing and Submitted Reports */}
        {koiGrowthReports.length > 0 && (
          <div style={{ marginTop: "20px", color: "white" }}>
            <h3>Koi Growth Reports:</h3>
            <Row gutter={[16, 16]}>
              {koiGrowthReports.map((report, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={index}>
                  <Card
                    title={`Report ${index + 1}`}
                    bordered={false}
                    style={{ background: "white", color: "black" }}
                  >
                    <p>
                      <strong>Length:</strong> {report.length} cm
                    </p>
                    <p>
                      <strong>Weight:</strong> {report.weight} kg
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {moment(report.date).format("YYYY-MM-DD")}
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
          </div>
        )}
        <Modal
          title={
            selectedKoiId
              ? "Update Koi Growth Report"
              : "Create Koi Growth Report"
          }
          open={showForm}
          onCancel={() => {
            setShowForm(false);
            form.resetFields(); // Reset form khi đóng modal
          }}
          footer={null} // Không cần footer, dùng nút submit trong form
        >
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            initialValues={
              selectedKoiId
                ? koiGrowthReports.find((report) => report.id === selectedKoiId)
                : {}
            }
          >
            <Form.Item
              name="length"
              label="Length (cm)"
              rules={[{ required: true, message: "Please enter the length" }]}
            >
              <Input type="number" placeholder="Enter Koi length in cm" />
            </Form.Item>

            <Form.Item
              name="weight"
              label="Weight (g)"
              rules={[{ required: true, message: "Please enter the weight" }]}
            >
              <Input type="number" placeholder="Enter Koi weight in grams" />
            </Form.Item>

            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select the date" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD" // Định dạng đúng ngày
                placeholder="Select a date"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              style={{ marginTop: "20px" }}
            >
              {selectedKoiId ? "Update Report" : "Submit Report"}
            </Button>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default KoiReport;
