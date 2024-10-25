import React, { useState, useEffect } from "react";
import { Card, Row, Col, message, notification } from "antd";
import api from "../../config/axios";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

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
const storage = getStorage(app);

const Blog = () => {
  const [approvedPosts, setApprovedPosts] = useState([]);

  useEffect(() => {
    const fetchApprovedPosts = async () => {
      try {
        const response = await api.get("Adv/getApprovedAdv"); // API để lấy bài post đã được Approved
        const postsData = response.data;
        console.log(postsData);

        // Tải nội dung từ Firebase cho từng bài viết
        const postsWithContent = await Promise.all(
          postsData.map(async (post) => {
            if (post.url) {
              try {
                const contentURL = await getDownloadURL(ref(storage, post.url));
                const contentResponse = await fetch(contentURL);
                const contentText = await contentResponse.text();
                return { ...post, content: contentText }; // Cập nhật nội dung vào bài post
              } catch (error) {
                console.error("Failed to fetch content from Firebase", error);
                return { ...post, content: "Content could not be loaded" }; // Trường hợp lỗi
              }
            }
            return post;
          })
        );

        setApprovedPosts(postsWithContent);
      } catch (error) {
        notification.error({
          message: "Error",
          description:
            "Failed to load Approved Posts. Maybe you haven't approved any posts yet.",
        });
        console.log("Error", error);
      }
    };

    fetchApprovedPosts();
  }, []);

  return (
    <div className="flex-container">
      <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-white p-8">Blogs</h1>
        {approvedPosts.length > 0 ? (
          <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
            {approvedPosts.map((post, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8}>
                <Card
                  style={{
                    width: "100%",
                    height: "500px",
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
                        height: "200px",
                        objectFit: "cover",
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
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-white">No approved posts available.</p>
        )}
      </div>
    </div>
  );
};

export default Blog;
