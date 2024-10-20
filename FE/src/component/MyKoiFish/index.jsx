import React, { useState, useEffect } from "react";
import moment from "moment";
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
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
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
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // State for delete modal
  const [selectedKoi, setSelectedKoi] = useState(null); // Selected koi to delete
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false); // State for update modal
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
      message.error("Failed to fetch koi varieties.");
    }
  };

  const fetchUserPonds = async () => {
    try {
      const response = await api.get(`Pond/ponds/${id}`);
      setPonds(response.data);
    } catch (error) {
      console.error("Error fetching ponds:", error);
      message.error("Failed to fetch ponds.");
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
        message.error("Failed to fetch koi fish.");
      }
    }
  };

  useEffect(() => {
    if (pondId) {
      fetchKoiForPond(pondId);
    }
  }, [pondId]);
  const showDeleteModal = (koi) => {
    setSelectedKoi(koi); // Set the selected koi fish to delete
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false); // Close delete modal
    setSelectedKoi(null); // Reset selected koi
  };

  const handleDeleteKoi = async () => {
    if (!selectedKoi) return;

    try {
      // Delete koi image from Firebase
      const imageRef = ref(storage, selectedKoi.imageUrl);
      await deleteObject(imageRef);

      // Delete koi fish from database
      await api.delete(`KoiFish/deleteKoiFish/${selectedKoi.id}`);

      message.success("Koi fish deleted successfully.");
      fetchKoiForPond(pondId); // Refresh koi list after deletion

      setIsDeleteModalVisible(false); // Close modal
      setSelectedKoi(null); // Reset selected koi
    } catch (error) {
      console.error("Error deleting koi fish:", error);
      message.error("Failed to delete koi fish.");
    }
  };
  const showUpdateModal = (koi) => {
    setSelectedKoi(koi); // Set the selected koi fish for update
    setImageUrl(koi.imageUrl); // Set the image URL of the selected koi fish
    setIsUpdateModalVisible(true); // Show update modal
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setImageUrl(null); // Reset imageUrl when closing modal
    setSelectedDate(null); // Reset selected date when closing modal
  };
  const handleUpdateCancel = () => {
    setIsModalVisible(false);
    setIsUpdateModalVisible(false); // Close update modal
    setImageUrl(null); // Reset imageUrl when closing modal
    setSelectedKoi(null); // Reset selected koi
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
        pondId,
        koiVariety: values.variety,
        koiName: values.name,
        dob: selectedDate ? selectedDate.format("YYYY-MM-DDTHH:mm:ss") : null,
        sex: values.sex,
        price: values.price,
        imageUrl,
      };

      await api.post("KoiFish/createKoiFish", formattedValues);
      message.success("Koi fish added successfully!");
      handleCancel(); // Close modal after submission
      fetchKoiForPond(pondId); // Refresh koi list
    } catch (error) {
      console.error("Error adding koi fish:", error);
      message.error("Failed to add koi fish.");
    }
  };
  const onUpdateFinish = async (values) => {
    try {
      let newImageUrl = selectedKoi.imageUrl; // Sử dụng URL hình ảnh hiện tại làm mặc định

      // Kiểm tra nếu người dùng đã chọn hình ảnh mới để tải lên
      if (values.image && values.image.file) {
        console.log("Image file selected:", values.image.file);

        // Xóa ảnh cũ từ Firebase
        const oldImageRef = ref(storage, selectedKoi.imageUrl);
        await deleteObject(oldImageRef);

        // Sử dụng handleUpload để upload ảnh mới
        await handleUpload(values.image.file).then((downloadURL) => {
          newImageUrl = downloadURL; // Cập nhật URL ảnh mới
          setImageUrl(downloadURL); // Cập nhật URL ảnh cho state
        });
      }

      // Prepare updated data
      const updatedData = {
        id: selectedKoi.id, // koi fish id
        pondId,
        koiVariety: values.variety,
        koiName: values.name,
        dob: values.dob.format("YYYY-MM-DDTHH:mm:ss"),
        sex: values.sex,
        price: values.price,
        imageUrl, // Use the updated image URL
      };

      // Send the update request to the server
      await api.put(`KoiFish/updateFish/${selectedKoi.id}`, updatedData);

      message.success("Koi fish updated successfully!");
      handleUpdateCancel(); // Close modal after submission
      fetchKoiForPond(pondId); // Refresh koi list
    } catch (error) {
      console.error("Error updating koi fish:", error);
      message.error("Failed to update koi fish.");
    }
  };

  return (
    <div className="flex-container">
      <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-white p-8">My Koi Fish</h1>

        <Select
          placeholder="Select a pond to view koi fish"
          onChange={setPondId}
          style={{ width: "10%", marginBottom: "20px" }}
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
                  const dob = koi.dob ? new Date(koi.dob) : null;
                  const age = dob
                    ? `${new Date().getFullYear() - dob.getFullYear()} years`
                    : "Unknown";

                  return (
                    <Col key={index} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        title={`Pond: ${
                          ponds.find((pond) => pond.id === pondId)?.name
                        }`}
                        bordered={true}
                        style={{
                          marginBottom: "20px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                          borderRadius: "8px",
                        }}
                        // extra={
                        //   <Button
                        //     type="danger"
                        //     icon={<DeleteOutlined />}
                        //     onClick={() => showDeleteModal(koi)}
                        //   >
                        //     Delete
                        //   </Button>
                        // }
                      >
                        <img
                          src={koi.imageUrl || "default-koi-image-url"} // Default koi image
                          alt={koi.koiName}
                          style={{
                            width: "100%", // Ensure image takes full width of the card
                            height: "200px", // Fixed height for uniformity
                            objectFit: "cover", // Cover the area while maintaining aspect ratio
                            borderRadius: "8px 8px 0 0",
                          }}
                        />
                        <p>
                          <strong>Name:</strong> {koi.koiName}
                        </p>
                        <p>
                          <strong>Age:</strong> {age}
                        </p>
                        <p>
                          <strong>Variety:</strong> {koi.koiVariety}
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
                            onClick={() => showUpdateModal(koi)}
                          >
                            Update
                          </Button>

                          <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                            onClick={() => showDeleteModal(koi)}
                          >
                            Delete
                          </Button>
                        </div>
                        {/* <div className="absolute bottom-10 right-10">
                          <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => showUpdateModal(koi)}
                            style={{ marginRight: 10 }}
                          >
                            Update
                          </Button>
                        </div> */}
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
        {/* Modal for update koi fish */}
        <Modal
          title="Update Koi Fish Information"
          open={isUpdateModalVisible}
          onCancel={handleUpdateCancel}
          footer={null}
        >
          <Form
            layout="vertical"
            onFinish={onUpdateFinish}
            initialValues={{
              name: selectedKoi?.koiName,
              variety: selectedKoi?.koiVariety,
              dob: selectedKoi?.dob ? moment(selectedKoi.dob) : null,
              sex: selectedKoi?.sex,
              price: selectedKoi?.price,
            }}
          >
            <Form.Item label="Selected Pond">
              <Input value={pondId} disabled />
            </Form.Item>

            <Form.Item label="Upload Image" name="image">
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
              <Select>
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
              rules={[{ required: true, message: "Please input Date!" }]}
            >
              <DatePicker />
            </Form.Item>

            <Form.Item
              label="Sex"
              name="sex"
              rules={[{ required: true, message: "Please select Sex!" }]}
            >
              <Select>
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Unknown">Unknown</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please input Price!" }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal for delete confirmation */}
        <Modal
          title="Confirm Deletion"
          visible={isDeleteModalVisible}
          onOk={handleDeleteKoi}
          onCancel={handleDeleteCancel}
          okText="Delete"
          okButtonProps={{ danger: true }}
        >
          <p>
            Are you sure you want to <strong>delete</strong> this koi fish?
          </p>
        </Modal>

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
              rules={[{ required: true, message: "Please select Sex!" }]}
            >
              <Select>
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Unknown">Unknown</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please input Price!" }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default MyKoiFish;
