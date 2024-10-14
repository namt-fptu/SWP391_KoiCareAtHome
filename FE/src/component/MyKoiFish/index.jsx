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
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import api from "../../config/axios"; // Axios instance configuration

// Firebase configuration (use your own Firebase config)
const firebaseConfig = {
  apiKey: "AIzaSyBIcvSZRnSTBxw8yrLcq7AqLjqNhvaUQyk",
  authDomain: "swp391-76ab5.firebaseapp.com",
  projectId: "swp391-76ab5",
  storageBucket: "swp391-76ab5.appspot.com",
  messagingSenderId: "86962001326",
  appId: "1:86962001326:web:936799b1e20348cbb8643f",
};

// Initialize Firebase app and storage
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const MyKoiFish = () => {
  const [kois, setKois] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [pondId, setPondId] = useState(null); // Pond ID to be associated with koi fish
  const [varieties, setVarieties] = useState([]); // State to store varieties
  const [ponds, setPonds] = useState([]); // State to store ponds

  const { Option } = Select;

  // Fetch koi fish data on component mount
  useEffect(() => {
    fetchKoiFishData();
    fetchVarieties(); // Fetch varieties when component mounts
    fetchUserPonds(); // Fetch user's ponds when component mounts
  }, []);

  // Fetch koi fish belonging to a specific pond
  const fetchKoiFishData = async () => {
    if (pondId) { // Fetch only if pondId is set
      try {
        const response = await api.get(`/api/KoiFish/koiFish/${pondId}`);
        setKois(response.data); // Assuming the response data is an array of koi fish
      } catch (error) {
        console.error("Error fetching koi fish data:", error);
      }
    }
  };

  // Fetch varieties from API
  const fetchVarieties = async () => {
    try {
      const response = await api.get('KoiVariety/variety'); // Update with your endpoint for varieties
      setVarieties(response.data); // Assuming the response data is an array of varieties
    } catch (error) {
      console.error("Error fetching varieties:", error);
    }
  };

  // Fetch user's ponds from API
  const fetchUserPonds = async () => {
    const ownerid = 1; // Assuming the default user ID is 1
    try {
      const response = await api.get(`Pond/ponds/${ownerid}`); // Update with your endpoint for ponds
      setPonds(response.data); // Assuming the response data is an array of ponds
    } catch (error) {
      console.error("Error fetching ponds:", error);
    }
  };

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
        (snapshot) => {
          // Optional: Handle progress if needed
        },
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
      // Ensure the image is uploaded before creating the Koi fish
      if (!imageUrl) {
        message.error("Please upload an image before adding the Koi fish.");
        return;
      }

      const formattedValues = {
        pondId: pondId, // Selected pond ID
        koiVariety: values.variety, // Selected variety
        koiName: values.name, // Koi fish name
        dob: selectedDate ? selectedDate.format("YYYY-MM-DDTHH:mm:ss") : null, // Date of birth
        sex: values.sex, // Selected sex
        price: values.price, // Price of the Koi fish
        imageUrl: imageUrl, // URL from Firebase
      };

      // Make API request to create Koi fish
      await api.post("/api/KoiFish/createKoiFish", formattedValues);
      message.success("Koi fish added successfully!");
      setIsModalVisible(false);
      fetchKoiFishData(); // Refresh the koi list after adding
    } catch (error) {
      console.error("Error adding koi fish:", error);
      message.error("Failed to add koi fish.");
    }
  };

  return (
    <div className="flex-container">
      <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-white p-8">My Koi Fish</h1>

        <Button type="primary" onClick={showModal}>
          Add Koi Fish
        </Button>

        <Modal
          title="Input Koi Fish Information"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form layout="vertical" onFinish={onFinish}>
            {/* Pond selection from API */}
            <Form.Item label="Select Pond" name="pond" rules={[{ required: true, message: "Please select a pond!" }]}>
              <Select
                placeholder="Select your pond"
                onChange={(value) => setPondId(value)}
              >
                {ponds.map((pond) => (
                  <Option key={pond.id} value={pond.id}>
                    {pond.name} {/* Display pond name */}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Upload component for image */}
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
              {imageUrl && <img src={imageUrl} alt="Koi" style={{ width: "100%", marginTop: "10px" }} />}
            </Form.Item>

            <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please input Name!" }]}>
              <Input />
            </Form.Item>

            {/* Variety selection from API */}
            <Form.Item label="Variety" name="variety" rules={[{ required: true, message: "Please select Variety!" }]}>
              <Select placeholder="">
                {varieties.map((variety, index) => (
                  <Option key={index} value={variety.variety}>
                    {variety.variety} - {variety.rarity} - {variety.color} {/* Display variety information */}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="In pond since" name="dob" rules={[{ required: true, message: "Please input date!" }]}>
              <DatePicker onChange={handleDateChange} />
              {selectedDate && <p>{selectedDate.format("YYYY-MM-DD")}</p>}
            </Form.Item>

            <Form.Item label="Sex" name="sex" rules={[{ required: true, message: "Please choose Sex!" }]}>
              <Select placeholder="">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Price (VND)" name="price" rules={[{ required: true, message: "Please input Price!" }]}>
              <Input type="number" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
              <Button type="default" onClick={handleCancel} style={{ marginLeft: "10px" }}>
                Close
              </Button>
            </Form.Item>
          </Form>
        </Modal>


        {/* Display koi fish info */}
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          {kois.map((koi, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={`Koi Fish: ${koi.koiName}`}
                style={{ width: 300 }}
                cover={<img alt="Koi" src={koi.imageUrl} />}
              >
                <p><strong>Variety:</strong> {koi.koiVariety}</p>
                <p><strong>Sex:</strong> {koi.sex}</p>
                <p><strong>In pond since:</strong> {koi.dob}</p>
                <p><strong>Price:</strong> {koi.price}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default MyKoiFish;
