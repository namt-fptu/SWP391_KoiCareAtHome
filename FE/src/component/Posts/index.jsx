import api from "../../config/axios";
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
  Select,
  InputNumber,
  notification,
} from "antd";
import backgroud from "./../../assets/wallpaper.jpg";

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

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("Processing");
  const [shortContents, setShortContents] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchProcessingPosts = async () => {
      try {
        // Fetch posts with the 'Processing' status
        const response = await api.get(`Admin/getAdvByStatus/${status}`);
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
        notification.error({
          message: "Error",
          description: "Failed to load Post. Maybe there're no Processing Post",
        });
        // message.error("Failed to fetch post data.");
      }
    };
    fetchProcessingPosts();
  }, [status]);

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
  const handleShowDetail = (post) => {
    setSelectedPost(post);
  };

  const handleDetailClose = () => {
    setSelectedPost(null);
  };

  // Function to approve a post and call the PUT API to update the status to "Approved"
  const approvePost = async (id) => {
    try {
      console.log(`Approving post with ID: ${id}`);

      // Ensure the correct data format and endpoint URL
      const response = await api.put(`Admin/approveAdv/${id}?status=Approved`);
      console.log("Response from server:", response.data);

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, status: "Approved" } : post
        )
      );
    } catch (error) {
      console.error("Error approving the post:", error);
      console.error("Response error:", error.response); // Log the server response
    }
  };

  // Function to reject a post and call the PUT API to update the status to "Rejected"
  const rejectPost = async (id) => {
    try {
      console.log(`Rejecting post with ID: ${id}`);

      // Ensure the correct data format and endpoint URL
      const response = await api.put(`Admin/approveAdv/${id}?status=Rejected`);
      console.log("Response from server:", response.data);

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, status: "Rejected" } : post
        )
      );
    } catch (error) {
      console.error("Error rejecting the post:", error);
      console.error("Response error:", error.response); // Log the server response
    }
  };

  return (
    <div className="flex-container">
      <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen"
        style={{
          backgroundImage: `url(${backgroud})`, // Set the background image
          backgroundSize: "cover", // Cover the entire container
          backgroundPosition: "center", // Center the image
        }}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-8 text-white p-8">
            Posts Management
          </h1>
        </div>
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

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "10px",
                    }}
                  >
                    <Button onClick={() => handleShowDetail(post)}>
                      View Detail
                    </Button>

                    {post.status === "Processing" && (
                      <div>
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                          onClick={() => approvePost(post.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded"
                          onClick={() => rejectPost(post.id)}
                        >
                          Reject
                        </button>
                      </div>
                    )}
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

        {posts.length === 0 && (
          <p className="text-gray-500">No posts to display.</p>
        )}
      </div>
    </div>
  );
};

export default Posts;
