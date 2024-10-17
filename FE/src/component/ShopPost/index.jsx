import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Card,
  Row,
  Col,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { initializeApp } from "firebase/app";
import { Select, InputNumber } from "antd";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getFirestore, addDoc, collection, getDocs } from "firebase/firestore";
import api from "../../config/axios";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIcvSZRnSTBxw8yrLcq7AqLjqNhvaUQyk",
  authDomain: "swp391-76ab5.firebaseapp.com",
  projectId: "swp391-76ab5",
  storageBucket: "swp391-76ab5.appspot.com",
  messagingSenderId: "86962001326",
  appId: "1:86962001326:web:936799b1e20348cbb8643f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storageImg = getStorage(app);
const storageTxt = getStorage(app);
const { Option } = Select;

const ShopPost = () => {
  const [posts, setPosts] = useState([]);
  const [value, setValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [packages, setPackages] = useState([]); // Dữ liệu packages từ API
  const [selectedPackage, setSelectedPackage] = useState(null); // Lưu packageId
  const [amount, setAmount] = useState(0); // Lưu số tiền thanh toán
  const [isExtendModalVisible, setIsExtendModalVisible] = useState(false); // State để điều khiển modal Extend
  const [currentPostId, setCurrentPostId] = useState(null);

  // Retrieve pondOwnerId from sessionStorage
  const id = sessionStorage.getItem("id");

  useEffect(() => {
    if (!id) {
      message.error("User not logged in. Unable to fetch posts.");
      return;
    }

    // Fetch posts from the API based on the logged-in user's id
    const fetchPosts = async () => {
      try {
        const response = await api.get(`Adv/getAdvByShopId/${id}`);
        const postsData = response.data;

        // Tải nội dung từ Firebase cho từng bài viết
        const postsWithContent = await Promise.all(
          postsData.map(async (post) => {
            if (post.url) {
              try {
                const contentURL = await getDownloadURL(
                  ref(storageTxt, post.url)
                );
                const contentResponse = await fetch(contentURL);
                const contentText = await contentResponse.text();
                return { ...post, content: contentText }; // Cập nhật content vào post
              } catch (error) {
                console.error("Failed to fetch content from Firebase", error);
                console.log(post.url);
                return { ...post, content: "Content could not be loaded" }; // Trường hợp lỗi
              }
            }
            return post;
          })
        );

        setPosts(postsWithContent);
      } catch (error) {
        message.error("Failed to fetch post data.");
      }
    };

    fetchPosts();
  }, [id]);

  const fetchPackage = async () => {
    try {
      const response = await api.get("/PostPackage/getPackage");
      return response.data;
    } catch (error) {
      message.error("Failed to fetch package options.");
      return [];
    }
  };
  const handleExtend = async (postId) => {
    const packageData = await fetchPackage();
    setPackages(packageData); // Lấy dữ liệu package từ API
    setCurrentPostId(postId); // Lưu postId của bài cần gia hạn
    setIsExtendModalVisible(true); // Hiển thị modal Extend
  };

  const handleExtendOk = async () => {
    if (!selectedPackage || amount <= 0) {
      message.error("Please select a package and enter a valid amount.");
      return;
    }
    try {
      console.log("Data sent to API:", {
        postId: currentPostId,
        packageId: selectedPackage,
        amount,
      });
      const response = await api.post("/Payment/createPaymentURL", {
        postId: currentPostId,
        packageId: selectedPackage,
        amount,
      });

      // Kiểm tra phản hồi trả về từ API
      console.log("Payment URL response:", response);

      // Nếu API trả về link thanh toán thành công
      window.location.href = response.data.paymentUrl;
    } catch (error) {
      // In ra chi tiết lỗi từ server để kiểm tra
      console.error("Error creating payment URL:", error);
      message.error("Failed to create payment URL.");
    }
  };
  const handleExtendCancel = () => {
    setIsExtendModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFileList([]);
    setImageUrl(null);
  };

  const uploadImgToFirebase = async (file) => {
    if (!file) return null;
    const storageRef = ref(storageImg, `post-images/${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadImgURL = await getDownloadURL(snapshot.ref);
      return downloadImgURL;
    } catch (error) {
      console.error("Error uploading image to Firebase: ", error);
      message.error("Image upload failed!");
      return null;
    }
  };

  const uploadContentToFirebase = async (content) => {
    if (!content) return null;

    // Convert content to a Blob
    const blob = new Blob([content], { type: "text/plain" });
    const postIndex = posts.length + 1; // Xác định số thứ tự dựa vào số bài đăng hiện tại
    const storageRef = ref(storageTxt, `post-content/${id}_${postIndex}.txt`);

    try {
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadTxtURL = await getDownloadURL(snapshot.ref);
      return downloadTxtURL;
    } catch (error) {
      console.error("Error uploading content to Firebase: ", error);
      message.error("Content upload failed!");
      return null;
    }
  };

  const handleUpload = (file) => {
    setFileList([file]);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const deletePost = (index) => {
    const newPosts = posts.filter((_, i) => i !== index);
    setPosts(newPosts);
  };

  const onFinish = async (values) => {
    // Kiểm tra nếu fileList không có file
    if (fileList.length === 0) {
      message.error("No file selected for upload.");
      return; // Kết thúc hàm nếu không có file
    }
    const file = fileList[0]; // Lấy file đầu tiên trong danh sách
    const uploadedImageUrl = await uploadImgToFirebase(file);
    const uploadedTxtUrl = await uploadContentToFirebase(values.content);

    if (uploadedImageUrl && uploadedTxtUrl) {
      const postData = {
        shopId: Number(id), // Use ShopId from sessionStorage
        title: values.title,
        url: uploadedTxtUrl,
        imageUrl: uploadedImageUrl,
      };

      try {
        const response = await api.post("Adv/createAdv", postData);
        setPosts([...posts, response.data]); // Update posts with the newly created one
        setIsModalVisible(false);
        message.success("Post information added successfully!");
      } catch (error) {
        message.error("Failed to add post information.");
      }
    } else {
      message.error("Failed to upload Post.");
    }
  };

  const handleShowDetail = (post) => {
    setSelectedPost(post);
  };

  const handleDetailClose = () => {
    setSelectedPost(null);
  };

  // const getShortContent = (content) => {
  //   const maxLength = 100; // số ký tự tóm tắt
  //   return content.length > maxLength
  //     ? content.slice(0, maxLength) + "..."
  //     : content;
  // };

  return (
    <div className="flex-container">
      <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-8 text-white p-8">My Posts</h1>
          <div className="flex flex-col items-center">
            <Button type="primary" onClick={showModal}>
              Create Post
            </Button>
          </div>
        </div>
        <Modal
          title="Input Post"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Upload Image"
              name="image"
              rules={[{ required: true, message: "Please upload an image!" }]}
            >
              <Upload
                name="image"
                listType="picture"
                maxCount={1}
                showUploadList={false}
                fileList={fileList}
                beforeUpload={handleUpload}
                onRemove={() => setFileList([])}
              >
                <Button icon={<UploadOutlined />}>Select Image</Button>
              </Upload>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Post "
                  style={{ width: "100%", marginTop: "10px" }}
                />
              )}
            </Form.Item>

            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please input Title!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Content"
              name="content"
              rules={[{ required: true, message: "Please input Content!" }]}
            >
              <Input.TextArea
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </Form.Item>

            {/* <Form.Item
                label="Link"
                name="link"
                rules={[{ required: true, message: "Please input Link!" }]}
              >
                <Input />
              </Form.Item> */}

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
              <Button onClick={handleCancel} style={{ marginLeft: "10px" }}>
                Close
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {posts.length > 0 && (
          <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
            {posts.map((post, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8}>
                <Card
                  style={{
                    width: "100%",
                    height: 500, // Cố định chiều cao của khung
                    marginBottom: "20px",
                    border: "1px solid #f0f0f0",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Title ở trên cùng */}
                  <div style={{ flex: "none" }}>
                    <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                      <strong>Title:</strong> {post.title || "-"}
                    </p>
                  </div>

                  {/* Hình ảnh ở giữa */}
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      style={{
                        width: "100%",
                        height: "200px", // Cố định chiều cao của hình ảnh
                        objectFit: "cover", // Đảm bảo hình ảnh không bị méo
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    />
                  )}

                  {/* Content ở dưới hình ảnh */}
                  <div
                    style={{
                      flex: "1 1 auto",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#555",
                      }}
                    >
                      <strong>Content:</strong> {post.content || "-"}
                    </p>
                  </div>

                  {/* Các thông tin khác ở dưới cùng */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "10px",
                    }}
                  >
                    <div style={{ width: "60%" }}>
                      <p>
                        <strong>Created Date:</strong> {post.advDate || "-"}
                      </p>
                      <p>
                        <strong>Duration:</strong> {post.duration || "-"}
                      </p>
                    </div>
                    <div style={{ width: "40%" }}>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          style={{
                            color:
                              post.status === "Expired"
                                ? "gray"
                                : post.status === "Approved"
                                ? "green"
                                : post.status === "Rejected"
                                ? "red"
                                : "black",
                            fontWeight: "bold",
                          }}
                        >
                          {post.status || "-"}
                        </span>
                      </p>
                      <p>
                        <strong>Edited Date:</strong> <br />
                        {post.editedDate || "-"}
                      </p>
                      <p>
                        <strong>Expired Date:</strong> <br />
                        {post.expiredDate || "-"}
                      </p>
                    </div>
                  </div>

                  <Button onClick={() => handleShowDetail(post)}>
                    View Detail
                  </Button>

                  {/* Nút Extend nếu status là Expired */}
                  {post.status === "Expired" && (
                    <Button
                      type="primary"
                      onClick={() => handleExtend(post.id)}
                      style={{ alignSelf: "flex-end" }}
                    >
                      Extend
                    </Button>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Chi tiết bài viết */}
        <Modal
          title="Post Detail"
          visible={!!selectedPost}
          onCancel={handleDetailClose}
          footer={null}
        >
          {selectedPost && (
            <>
              <h2>{selectedPost.title}</h2>
              <p>{selectedPost.content}</p>
            </>
          )}
        </Modal>

        {/* Modal Extend */}
        <Modal
          title="Extend Post"
          visible={isExtendModalVisible}
          onOk={handleExtendOk}
          onCancel={handleExtendCancel}
          okText="Pay"
        >
          <Form layout="vertical">
            <Form.Item label="Select Package">
              <Select
                placeholder="Select a package"
                onChange={(value) => setSelectedPackage(value)}
              >
                {packages.map((pkg) => (
                  <Option key={pkg.id} value={pkg.id}>
                    {pkg.name} - {pkg.price}$
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Amount">
              <InputNumber
                min={1}
                value={amount}
                onChange={(value) => setAmount(value)}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ShopPost;
