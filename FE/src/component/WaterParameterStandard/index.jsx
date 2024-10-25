import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  message,
  Form,
  Input,
  Button,
  Modal,
  Select,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import api from "../../config/axios";

const WaterParameterStandard = () => {
  const [waterStandards, setWaterStandards] = useState([]);
  const [koiVarieties, setKoiVarieties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState(null);
  const [editingStandard, setEditingStandard] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchWaterStandards();
    fetchKoiVarieties();
  }, []);

  const fetchWaterStandards = async () => {
    try {
      const response = await api.get("WaterParameterStandard/waterStandard");
      setWaterStandards(response.data);
    } catch (error) {
      console.error("Error fetching water parameter standards:", error);
      message.error("Failed to fetch water parameter standards.");
    }
  };

  const fetchKoiVarieties = async () => {
    try {
      const response = await api.get("KoiVariety/variety");
      if (response.data && Array.isArray(response.data)) {
        setKoiVarieties(
          response.data.map((variety, index) => ({
            value: variety.id || index,
            label: variety.variety,
          }))
        );
      } else {
        message.error("No koi varieties found.");
      }
    } catch (error) {
      console.error("Error fetching koi varieties:", error);
      message.error("Failed to fetch koi varieties.");
    }
  };
  const onFinish = async (values) => {
    const selectedVariety = koiVarieties.find(
      (variety) => variety.value === values.koiVariety
    );
    console.log(values);
    if (selectedVariety) {
      values.koiVariety = selectedVariety.label;
    } else {
      console.warn(
        "Selected koi variety not found for value:",
        values.koiVariety
      );
      message.error("Selected koi variety is invalid.");
      return;
    }

    try {
      setLoading(true);
      if (editingStandard) {
        const response = await api.put(
          `WaterParameterStandard/updateWaterStandard/${editingStandard.id}`,
          values
        );

        if (response.status === 200) {
          message.success("Water parameter standard updated successfully!");
          setEditingStandard(null);
        } else {
          message.error("Failed to update water parameter standard.");
        }
      } else {
        const response = await api.post(
          "WaterParameterStandard/createWaterPameterStandard",
          values
        );
        if (response.status === 200 || response.status === 201) {
          message.success("Water parameter standard created successfully!");
        } else {
          message.error("Failed to create koi growth standard.");
        }
      }

      fetchWaterStandards();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting the form:", error);
      message.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdate = (standard) => {
    setEditingStandard(standard);
    form.setFieldsValue({
      koiVariety: koiVarieties.find(
        (variety) => variety.label === standard.koiVariety
      )?.value,
      minTemp: standard.minTemp,
      maxTemp: standard.maxTemp,
      minPh: standard.minPh,
      maxPh: standard.maxPh,
      minHardness: standard.minHardness,
      maxHardness: standard.maxHardness,
      minOxigen: standard.minOxigen,
      maxOxigen: standard.maxOxigen,
      minCabondioxide: standard.minCabondioxide,
      maxCabondioxide: standard.maxCabondioxide,
      minSalt: standard.minSalt,
      maxSalt: standard.maxSalt,
      minNitrates: standard.minNitrates,
      maxNitrates: standard.maxNitrates,
      minNitrite: standard.minNitrite,
      maxNitrite: standard.maxNitrite,
      minAmonium: standard.minAmonium,
      maxAmonium: standard.maxAmonium,
    });
    setIsModalVisible(true);
  };

  // Function to delete a koi growth standard based on its ID
  const deleteWaterParameterStandard = async (id) => {
    try {
      await api.delete(
        `WaterParameterStandard/deleteWaterParameterStandard/${id}`
      );
      message.success("Water Parameter Standard deleted successfully!");
      fetchWaterStandards(); // Reload the list of koi growth standards after deletion
    } catch (error) {
      console.error("Error deleting water parameter standard:", error);
      message.error("Failed to delete water parameter standard.");
    }
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingStandard(null);
    form.resetFields();
  };

  const showDetailModal = (standard) => {
    setSelectedStandard(standard);
    setIsDetailModalVisible(true);
  };

  const handleDetailModalCancel = () => {
    setIsDetailModalVisible(false);
    setSelectedStandard(null);
  };

  return (
    <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-white p-8">
        Water Parameter Standards
      </h1>

      <Button
        type="primary"
        onClick={showModal}
        style={{ marginBottom: "20px" }}
      >
        Create New Water Parameter Standard
      </Button>
      <Modal
        title={
          editingStandard
            ? "Update Water Parameter Standard"
            : "Create New Water Parameter Standard"
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Koi Variety"
            name="koiVariety"
            rules={[
              { required: true, message: "Please select a koi variety!" },
            ]}
          >
            <Select
              placeholder="Select a koi variety"
              loading={koiVarieties.length === 0}
            >
              {koiVarieties.map((variety) => (
                <Select.Option key={variety.value} value={variety.value}>
                  {variety.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Temperature */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Min Temperature (℃)"
                name="minTemp"
                rules={[
                  { required: true, message: "Please input min temperature!" },
                ]}
              >
                <Input type="number" placeholder="Min Temperature" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Temperature (℃)"
                name="maxTemp"
                rules={[
                  { required: true, message: "Please input max temperature!" },
                ]}
              >
                <Input type="number" placeholder="Max Temperature" />
              </Form.Item>
            </Col>
          </Row>

          {/* pH */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Min pH"
                name="minPh"
                rules={[{ required: true, message: "Please input min pH!" }]}
              >
                <Input type="number" step="0.1" placeholder="Min pH" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max pH"
                name="maxPh"
                rules={[{ required: true, message: "Please input max pH!" }]}
              >
                <Input type="number" step="0.1" placeholder="Max pH" />
              </Form.Item>
            </Col>
          </Row>

          {/* Hardness */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Min Hardness (GH)"
                name="minHardness"
                rules={[
                  { required: true, message: "Please input min hardness!" },
                ]}
              >
                <Input type="number" placeholder="Min Hardness" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Hardness (GH)"
                name="maxHardness"
                rules={[
                  { required: true, message: "Please input max hardness!" },
                ]}
              >
                <Input type="number" placeholder="Max Hardness" />
              </Form.Item>
            </Col>
          </Row>

          {/* Oxygen */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Min Oxygen (O₂)"
                name="minOxigen"
                rules={[
                  { required: true, message: "Please input min oxygen!" },
                ]}
              >
                <Input type="number" step="0.1" placeholder="Min Oxygen" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Oxygen (O₂)"
                name="maxOxigen"
                rules={[
                  { required: true, message: "Please input max oxygen!" },
                ]}
              >
                <Input type="number" step="0.1" placeholder="Max Oxygen" />
              </Form.Item>
            </Col>
          </Row>

          {/* Carbon Dioxide */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Min Carbon Dioxide (CO₂)"
                name="minCabondioxide"
                rules={[
                  {
                    required: true,
                    message: "Please input min carbon dioxide!",
                  },
                ]}
              >
                <Input type="number" placeholder="Min CO₂" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Carbon Dioxide (CO₂)"
                name="maxCabondioxide"
                rules={[
                  {
                    required: true,
                    message: "Please input max carbon dioxide!",
                  },
                ]}
              >
                <Input type="number" placeholder="Max CO₂" />
              </Form.Item>
            </Col>
          </Row>

          {/* Salt */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Min Salt"
                name="minSalt"
                rules={[{ required: true, message: "Please input min salt!" }]}
              >
                <Input type="number" placeholder="Min Salt" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Salt"
                name="maxSalt"
                rules={[{ required: true, message: "Please input max salt!" }]}
              >
                <Input type="number" placeholder="Max Salt" />
              </Form.Item>
            </Col>
          </Row>

          {/* Nitrates */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Min Nitrates"
                name="minNitrates"
                rules={[
                  { required: true, message: "Please input min nitrates!" },
                ]}
              >
                <Input type="number" placeholder="Min Nitrates" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Nitrates"
                name="maxNitrates"
                rules={[
                  { required: true, message: "Please input max nitrates!" },
                ]}
              >
                <Input type="number" placeholder="Max Nitrates" />
              </Form.Item>
            </Col>
          </Row>

          {/* Nitrite */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Min Nitrite"
                name="minNitrite"
                rules={[
                  { required: true, message: "Please input min nitrite!" },
                ]}
              >
                <Input type="number" placeholder="Min Nitrite" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Nitrite"
                name="maxNitrite"
                rules={[
                  { required: true, message: "Please input max nitrite!" },
                ]}
              >
                <Input type="number" placeholder="Max Nitrite" />
              </Form.Item>
            </Col>
          </Row>

          {/* Ammonium */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Min Ammonium"
                name="minAmonium"
                rules={[
                  { required: true, message: "Please input min ammonium!" },
                ]}
              >
                <Input type="number" placeholder="Min Ammonium" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Ammonium"
                name="maxAmonium"
                rules={[
                  { required: true, message: "Please input max ammonium!" },
                ]}
              >
                <Input type="number" placeholder="Max Ammonium" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Finish
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal to show detailed information */}
      <Modal
        title="Water Parameter Standard Details"
        open={isDetailModalVisible}
        onCancel={handleDetailModalCancel}
        footer={null}
      >
        {selectedStandard && (
          <div>
            <p><strong>Koi Variety:</strong> {selectedStandard.koiVariety}</p>
            <p><strong>Temperature (℃):</strong>Min: {selectedStandard.minTemp}, Max: {selectedStandard.maxTemp} </p>
            <p><strong>pH:</strong>Min: {selectedStandard.minPh}, Max: {selectedStandard.maxPh}</p>
            <p><strong>Oxygen (O₂):</strong> Min: {selectedStandard.minOxigen}, Max: {selectedStandard.maxOxigen}</p>
            <p><strong>Nitrates:</strong> Min: {selectedStandard.minNitrates}, Max: {selectedStandard.maxNitrates}</p>
            <p><strong>Hardness (GH):</strong> Min: {selectedStandard.minHardness}, Max: {selectedStandard.maxHardness}</p>
            <p><strong>Carbon Dioxide (CO₂):</strong> Min: {selectedStandard.minCabondioxide}, Max: {selectedStandard.maxCabondioxide}</p>
            <p><strong>Nitrite:</strong> Min: {selectedStandard.minNitrite}, Max: {selectedStandard.maxNitrite}</p>
            <p><strong>Ammonium:</strong> Min: {selectedStandard.minAmonium}, Max: {selectedStandard.maxAmonium}</p>
          </div>
        )}
      </Modal>

      {/* Display water parameter standards */}
      {waterStandards.length > 0 ? (
        <Row gutter={[24, 24]} justify="center" style={{ marginTop: "20px" }}>
          {waterStandards.map((standard, index) => (
            <Col key={standard.id || index} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={`Koi Variety: ${standard.koiVariety}`}
                style={{ width: "100%", marginBottom: "20px" }}
              >
                <p>
                  <strong>Temperature (℃):</strong> {standard.minTemp} - {standard.maxTemp}
                </p>
                <p>
                  <strong>pH:</strong> {standard.minPh} - {standard.maxPh}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => showDetailModal(standard)}
                  >
                    View More
                  </Button>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => handleUpdate(standard)}
                  >
                    Update
                  </Button>
                  <Button
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => deleteWaterParameterStandard(standard.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p style={{ color: "white" }}>
          No water parameter standards available.
        </p>
      )}
    </div>
  );
};

export default WaterParameterStandard;
