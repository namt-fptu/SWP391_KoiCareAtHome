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
  Dropdown,
  Menu,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  DownOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { initializeApp } from "firebase/app";
import { Select, InputNumber } from "antd";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
// import { getFirestore, addDoc, collection, getDocs } from "firebase/firestore";
import api from "../../config/axios";
import moment from "moment";
import dayjs from "dayjs";
import { useAuthStore } from "../../page/(auth)/store";
import backgroud from "./../../assets/wallpaper.jpg";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

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
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // State for delete modal
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false); // State for update modal
  const [currentPostId, setCurrentPostId] = useState(null);
  const [shortContents, setShortContents] = useState({});
  const { authUser } = useAuthStore();
  const id = authUser.id;

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
        message.error("Failed to load posts. Please add a new post!!");
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
  useEffect(() => {
    const fetchShortContents = async () => {
      const contents = {};
      posts.forEach((post) => {
        setTimeout(() => {
          const shortContent = getShortContent(post.content);
          contents[post.id] = shortContent;
          setShortContents({ ...contents }); // Cập nhật lại shortContent sau khi có timeout
        }, 3000); // Chờ 3 giây
      });
    };

    fetchShortContents();
  }, [posts]);
  const handleExtend = async (postId) => {
    const packageData = await fetchPackage();
    setPackages(packageData); // Lấy dữ liệu package từ API
    setCurrentPostId(postId); // Lưu postId của bài cần gia hạn
    setIsExtendModalVisible(true); // Hiển thị modal Extend
  };

  const handleExtendOk = async () => {
    if (!selectedPackage) {
      message.error("Please select a package.");
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
        // amount,
        orderType: "ShopPostExtension", // OrderType bạn cần xác định chính xác từ yêu cầu của hệ thống
        orderDescription: `Extension for post ID: ${currentPostId}`, // Mô tả đơn hàng
      });

      const paymentWindow = window.open(response.data, "_blank");

      // Theo dõi trạng thái của tab thanh toán
      const interval = setInterval(() => {
        if (paymentWindow.closed) {
          clearInterval(interval);
          message.success("Payment completed successfully!");

          // Reload lại trang chính sau khi tab thanh toán đóng
          window.location.reload();
        }
      }, 1000); // Kiểm tra trạng thái của tab mỗi giây
    } catch (error) {
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
  const showDeleteModal = (post) => {
    setSelectedPost(post); // Set the selected post to delete
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false); // Close delete modal
    setSelectedPost(null); // Reset selected post
  };
  const handleDeletePost = async () => {
    if (!selectedPost) return;

    try {
      // Xóa hình ảnh từ Firebase
      const imageRef = ref(storageImg, selectedPost.imageUrl);
      const contentRef = ref(storageTxt, selectedPost.url); // Cần chắc chắn dùng đúng đường dẫn tới file content

      // Sử dụng Promise.all để chờ cả hai hành động xóa hoàn tất
      await Promise.all([deleteObject(imageRef), deleteObject(contentRef)]);

      // Sau khi xóa cả ảnh và content thành công, xóa bài viết trong cơ sở dữ liệu
      await api.delete(`Adv/deleteAdvById/${selectedPost.id}`);

      message.success("Post and related files deleted successfully.");

      // Sau khi xóa thành công, làm mới lại danh sách bài viết
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== selectedPost.id)
      );

      setIsDeleteModalVisible(false); // Đóng modal xóa
      setSelectedPost(null); // Reset selected post
    } catch (error) {
      console.error("Error deleting post:", error);
      message.error("Failed to delete post or related files.");
    }
  };
  const showUpdateModal = async (post) => {
    setSelectedPost(post); // Set the selected post for update
    setImageUrl(post.imageUrl); // Set the image URL of the selected post

    try {
      // Tải nội dung từ Firebase
      const contentURL = await getDownloadURL(ref(storageTxt, post.url));
      const contentResponse = await fetch(contentURL);
      const contentText = await contentResponse.text();
      setValue(contentText); // Set the content to state for the TextArea
    } catch (error) {
      console.error("Failed to load content from Firebase:", error);
      setValue(""); // Reset content in case of error
    }

    setIsUpdateModalVisible(true); // Show update modal
  };
  const handleUpdateCancel = () => {
    setIsModalVisible(false);
    setIsUpdateModalVisible(false); // Close update modal
    setImageUrl(null); // Reset imageUrl when closing modal
    setSelectedPost(null); // Reset selected koi
  };
  const onUpdateFinish = async (values) => {
    try {
      let newImageUrl = selectedPost.imageUrl;

      if (values.image && values.image.file) {
        console.log("Image file selected:", values.image.file);

        // Xóa ảnh cũ từ Firebase
        const oldImageRef = ref(storageImg, selectedPost.imageUrl);
        await deleteObject(oldImageRef);

        // Sử dụng handleUpload để upload ảnh mới
        await handleUpload(values.image.file).then((downloadURL) => {
          newImageUrl = downloadURL; // Cập nhật URL ảnh mới
          setImageUrl(downloadURL); // Cập nhật URL ảnh cho state
        });
      }
      // Cập nhật nội dung mới lên Firebase
      const uploadedTxtUrl = await uploadContentToFirebase(values.content); // Gửi nội dung đã chỉnh sửa

      // Prepare updated data
      const updatedData = {
        title: values.title,
        url: uploadedTxtUrl, // Ensure this is set to the right URL after upload
        imageUrl,
      };

      await api.put(`Adv/updateAdv/${selectedPost.id}`, updatedData);

      message.success("Post updated successfully!");
      handleUpdateCancel(); // Close modal after submission

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === selectedPost.id ? { ...post, ...updatedData } : post
        )
      );
    } catch (error) {
      console.error("Error updating post:", error);
      message.error("Failed to update post.");
    }
  };
  const handleMenuClick = (e, post) => {
    if (e.key === "update") {
      showUpdateModal(post);
    } else if (e.key === "delete") {
      showDeleteModal(post);
    } else if (e.key === "extend") {
      handleExtend(post.id);
    }
  };
  const currentDate = moment();
  const menu = (post) => (
    <Menu onClick={(e) => handleMenuClick(e, post)}>
      {post.status !== "Reject" && (
        <Menu.Item key="update" icon={<EditOutlined />}>
          Update
        </Menu.Item>
      )}
      {(post.status === "Drafted" || currentDate.isAfter(post.expiredDate)) && (
        <Menu.Item key="extend" icon={<PlusOutlined />}>
          Extend
        </Menu.Item>
      )}
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
        Delete
      </Menu.Item>
    </Menu>
  );

  // const uploadImgToFirebase = async (file) => {
  //   if (!file) return null;
  //   const storageRef = ref(storageImg, `post-images/${file.name}`);

  //   try {
  //     const snapshot = await uploadBytes(storageRef, file);
  //     const downloadImgURL = await getDownloadURL(snapshot.ref);
  //     return downloadImgURL;
  //   } catch (error) {
  //     console.error("Error uploading image to Firebase: ", error);
  //     message.error("Image upload failed!");
  //     return null;
  //   }
  // };

  const uploadContentToFirebase = async (content) => {
    if (!content) return null;

    // Convert content to a Blob
    const blob = new Blob([content], { type: "text/plain" });
    const postIndex = posts.length + 1; // Xác định số thứ tự dựa vào số bài đăng hiện tại
    const storageRef = ref(storageTxt, `post-content/${id}_${postIndex}.txt`);

    try {
      const snapshot = await uploadBytesResumable(storageRef, blob);
      const downloadTxtURL = await getDownloadURL(snapshot.ref);
      return downloadTxtURL;
    } catch (error) {
      console.error("Error uploading content to Firebase: ", error);
      message.error("Content upload failed!");
      return null;
    }
  };

  const handleUpload = (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storageImg, `product-images/${file.name}`);
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
    if (!imageUrl) {
      message.error("Please upload an image.");
      return;
    }

    const uploadedImageUrl = await handleUpload(values.image.file);
    const uploadedTxtUrl = await uploadContentToFirebase(values.content);

    if (uploadedImageUrl && uploadedTxtUrl) {
      const postData = {
        shopId: Number(id),
        title: values.title,
        url: uploadedTxtUrl,
        imageUrl,
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

  const getShortContent = (content) => {
    const maxLength = 50; // số ký tự tóm tắt
    // Kiểm tra nếu content là một chuỗi hợp lệ
    if (typeof content === "string") {
      return content.length > maxLength
        ? content.slice(0, maxLength) + "..."
        : content;
    }
    return ""; // Nếu content không hợp lệ, trả về chuỗi rỗng
  };

  return (
    <div className="flex-container">
      <div
        className="flex-1 h-full p-5 bg-gray-900 min-h-screen"
        style={{
          backgroundImage: `url(${backgroud})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-white text-3xl font-bold mb-5">My Post</h2>
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
                      <strong>Content:</strong>{" "}
                      {shortContents[post.id] || "Loading content..."}
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
                        <strong>Created Date:</strong>{" "}
                        {post.advDate
                          ? dayjs(post.advDate).format("DD-MM-YYYY, HH:mm")
                          : "-"}
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
                              post.status === "Drafted"
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
                        {post.editedDate
                          ? dayjs(post.editedDate).format("DD-MM-YYYY, HH:mm")
                          : "-"}
                      </p>
                      <p>
                        <strong>Expired Date:</strong> <br />
                        {post.expiredDate
                          ? dayjs(post.expiredDate).format("DD-MM-YYYY, HH:mm")
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute", // Set position absolute
                      bottom: "10px", // Distance from the bottom
                      left: "10px", // Distance from the left
                      right: "10px", // Distance from the right
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button onClick={() => handleShowDetail(post)}>
                      View Detail
                    </Button>

                    <Dropdown overlay={menu(post)} trigger={["click"]}>
                      <Button>
                        Actions <DownOutlined />
                      </Button>
                    </Dropdown>
                  </div>
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
              {selectedPost.imageUrl && (
                <img
                  src={selectedPost.imageUrl}
                  alt="Post"
                  style={{ width: "100%", marginBottom: "20px" }}
                />
              )}
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
                    {pkg.name} - {pkg.price}vnđ
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* <Form.Item label="Amount">
              <InputNumber
                min={1}
                value={amount}
                onChange={(value) => setAmount(value)}
                style={{ width: "100%" }}
              />
            </Form.Item> */}
          </Form>
        </Modal>

        {/* Modal for delete confirmation */}
        <Modal
          title="Confirm Deletion"
          visible={isDeleteModalVisible}
          onOk={handleDeletePost}
          onCancel={handleDeleteCancel}
          okText="Delete"
          okButtonProps={{ danger: true }}
        >
          <p>
            Are you sure you want to <strong>delete</strong> this Post?
          </p>
        </Modal>
        {/* Modal for updating post */}
        <Modal
          title="Update Post Information"
          open={isUpdateModalVisible}
          onCancel={handleUpdateCancel}
          footer={null}
        >
          <Form
            layout="vertical"
            onFinish={onUpdateFinish}
            initialValues={{
              title: selectedPost?.title,
              content: value, // Thêm trường nội dung (content)
              // Các trường khác nếu cần
            }}
          >
            <Form.Item label="Upload Image" name="image">
              <Upload
                listType="picture"
                maxCount={1}
                showUploadList={false}
                customRequest={({ file, onSuccess }) => {
                  handleUpload(file);
                  onSuccess("ok");
                }}
              >
                <Button icon={<UploadOutlined />}>Select Image</Button>
              </Upload>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Post"
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

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ShopPost;
