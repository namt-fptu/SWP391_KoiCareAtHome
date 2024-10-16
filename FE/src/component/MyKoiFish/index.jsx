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
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { initializeApp } from "firebase/app";
import api from "../../config/axios"; // Axios instance configuration

const firebaseConfig = {
  apiKey: "AIzaSyBIcvSZRnSTBxw8yrLcq7AqLjqNhvaUQyk",
  authDomain: "swp391-76ab5.firebaseapp.com",
  projectId: "swp391-76ab5",
  storageBucket: "swp391-76ab5.appspot.com",
  messagingSenderId: "86962001326",
  appId: "1:86962001326:web:936799b1e20348cbb8643f",
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const MyKoiFish = () => {
  const [kois, setKois] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [pondId, setPondId] = useState(null);
  const [varieties, setVarieties] = useState([]);
  const [ponds, setPonds] = useState([]);

  const { Option } = Select;

  const id = sessionStorage.getItem("id");

  useEffect(() => {
    if (!id) {
      message.error("User not logged in. Unable to fetch ponds.");
      return;
    }
    fetchVarieties();
    fetchUserPonds();
  }, [id]);

  const fetchVarieties = async () => {
    try {
      const response = await api.get("KoiVariety/variety");
      setVarieties(response.data);
    } catch (error) {
      console.error("Error fetching varieties:", error);
    }
  };

  const fetchUserPonds = async () => {
    try {
      const response = await api.get(`Pond/ponds/${id}`);
      setPonds(response.data);
    } catch (error) {
      console.error("Error fetching ponds:", error);
    }
  };

  const fetchKoiForPond = async (pondId) => {
    try {
      const response = await api.get(`KoiFish/koiFish/${pondId}`);
      setKois(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Pond has no koi fish, set empty koi array
        setKois([]);
        console.warn("No koi fish found for this pond.");
      } else {
        console.error("Error fetching koi fish:", error);
      }
    }
  };

  useEffect(() => {
    if (pondId) {
      fetchKoiForPond(pondId);
    }
  }, [pondId]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDateChange = (value) => {
    setSelectedDate(value);
  };

  const handleUpload = (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          message.error(`Upload failed: ${error.message}`);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUrl(downloadURL);
            message.success(`${file.name} uploaded successfully`);
            resolve();
          });
        }
      );
    });
  };

  const onFinish = async (values) => {
    try {
      if (!imageUrl) {
        message.error("Please upload an image before adding the Koi fish.");
        return;
      }

      const formattedValues = {
        pondId: pondId,
        koiVariety: values.variety,
        koiName: values.name,
        dob: selectedDate ? selectedDate.format("YYYY-MM-DDTHH:mm:ss") : null,
        sex: values.sex,
        price: values.price,
        imageUrl: imageUrl,
      };

      await api.post("KoiFish/createKoiFish", formattedValues);
      message.success("Koi fish added successfully!");
      setIsModalVisible(false);
      fetchKoiForPond(pondId);
    } catch (error) {
      console.error("Error adding koi fish:", error);
      message.error("Failed to add koi fish.");
    }
  };

  return (
    <div className="flex-container">
      <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-white p-8">My Koi Fish</h1>

        <Select
          placeholder="Select a pond to view koi fish"
          onChange={(value) => {
            setPondId(value);
          }}
          style={{ width: "100%", marginBottom: "20px" }}
        >
          {ponds.map((pond) => (
            <Option key={pond.id} value={pond.id}>
              {pond.name}
            </Option>
          ))}
        </Select>

        {pondId && (
          <>
            <Row gutter={16}>
              {kois.length > 0 ? (
                kois.map((koi, index) => {
                  // Calculate koi age based on DOB
                  const dob = koi.dob ? new Date(koi.dob) : null;
                  const age = dob
                    ? `${new Date().getFullYear() - dob.getFullYear()} years`
                    : "Unknown";

                  return (
                    <Col span={8} key={index}>
                      <Card
                        title={`Pond: ${
                          ponds.find((pond) => pond.id === pondId)?.name
                        }`}
                        bordered={true}
                        style={{ textAlign: "center" }}
                      >
                        {/* Koi Image */}
                        <img
                          src={koi.imageUrl || "default-koi-image-url"} // Replace with your default koi image URL if needed
                          alt={koi.koiName}
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                            marginBottom: "10px",
                          }}
                        />

                        {/* Koi Information */}
                        <p>
                          <strong>Name:</strong> {koi.koiName}
                        </p>
                        <p>
                          <strong>Age:</strong> {age}
                        </p>
                        <p>
                          <strong>Variety:</strong> {koi.koiVariety}
                        </p>
                      </Card>
                    </Col>
                  );
                })
              ) : (
                <p style={{ color: "white" }}>No koi fish in this pond</p>
              )}
            </Row>

            <Button
              type="primary"
              onClick={showModal}
              style={{ marginTop: "20px" }}
            >
              Add Koi Fish
            </Button>
          </>
        )}

        <Modal
          title="Input Koi Fish Information"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Selected Pond">
              <Input value={pondId} disabled />
            </Form.Item>

            <Form.Item
              label="Upload Image"
              name="image"
              rules={[{ required: true, message: "Please upload an image!" }]}
            >
              <Upload
                listType="picture"
                maxCount={1}
                showUploadList={false}
                customRequest={({ file, onSuccess }) => {
                  handleUpload(file).then(onSuccess);
                }}
              >
                <Button icon={<UploadOutlined />}>Select Image</Button>
              </Upload>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Koi"
                  style={{ width: "100%", marginTop: "10px" }}
                />
              )}
            </Form.Item>

            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input Name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Variety"
              name="variety"
              rules={[{ required: true, message: "Please select Variety!" }]}
            >
              <Select placeholder="">
                {varieties.map((variety, index) => (
                  <Option key={index} value={variety.variety}>
                    {variety.variety} - {variety.rarity} - {variety.color}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="In pond since"
              name="dob"
              rules={[{ required: true }]}
            >
              <DatePicker onChange={handleDateChange} />
            </Form.Item>

            <Form.Item
              label="Sex"
              name="sex"
              rules={[{ required: true, message: "Please input sex!" }]}
            >
              <Select>
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please input price!" }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default MyKoiFish;
