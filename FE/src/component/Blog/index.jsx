import React, { useState, useEffect } from "react";
import { Card, Row, Col, Modal, Button, Spin } from "antd"; // Import Spin for loading indicator
import api from "../../config/axios";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import backgroud from "./../../assets/wallpaper.jpg";
// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const Blog = () => {
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [shortContents, setShortContents] = useState({});
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchApprovedPosts = async () => {
      setLoading(true); // Start loading
      try {
        const response = await api.get("Adv/getApprovedAdv");
        const postsData = response.data;

        const postsWithContent = await Promise.all(
          postsData.map(async (post) => {
            if (post.url) {
              try {
                const contentURL = await getDownloadURL(ref(storage, post.url));
                const contentResponse = await fetch(contentURL);
                const contentText = await contentResponse.text();
                return { ...post, content: contentText };
              } catch (error) {
                console.error("Failed to fetch content from Firebase", error);
                return { ...post, content: "Content could not be loaded..." };
              }
            }
            return post;
          })
        );

        setApprovedPosts(postsWithContent);

        // Generate short contents immediately
        const contents = {};
        postsWithContent.forEach((post) => {
          const shortContent = getShortContent(post.content);
          contents[post.id] = shortContent; // Assuming each post has a unique 'id'
        });
        setShortContents(contents);

      } catch (error) {
        console.log("Error fetching posts", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchApprovedPosts();
  }, []);

  const getShortContent = (content) => {
    const maxLength = 50; // Number of characters for summary
    if (typeof content === "string") {
      return content.length > maxLength
        ? content.slice(0, maxLength) + "..."
        : content;
    }
    return ""; // Return empty string if content is invalid
  };

  const showModal = (post) => {
    setSelectedPost(post);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPost(null);
  };

  return (
    <div className="flex-container">
      <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen"
       style={{
        backgroundImage: `url(${backgroud})`, // Set the background image
        backgroundSize: "cover", // Cover the entire container
        backgroundPosition: "center", // Center the image
      }}>
        <h1 className="text-3xl font-bold mb-8 text-white p-8">Blogs</h1>
        {loading ? ( // Show loading indicator
          <Spin size="large" />
        ) : (
          <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
            {approvedPosts.map((post, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8}>
                <Card
                  hoverable
                  onClick={() => showModal(post)}
                  style={{
                    width: "100%",
                    height: 500,
                    marginBottom: "20px",
                    border: "1px solid #f0f0f0",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Title */}
                  <div style={{ flex: "none", paddingBottom: "10px" }}>
                    <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                      {post.title || "Untitled Post"}
                    </p>
                  </div>

                  {/* Image */}
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "150px",
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    >
                      <span>No Image Available</span>
                    </div>
                  )}

                  {/* Truncated Content */}
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
                      {shortContents[post.id] || "Loading content..."} {/* Use post.id */}
                    </p>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Modal for Full Content */}
        <Modal
          title={selectedPost?.title || "Post"}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Close
            </Button>,
          ]}
        >
          {selectedPost?.imageUrl && (
            <img
              src={selectedPost.imageUrl}
              alt="Post"
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                marginBottom: "10px",
              }}
            />
          )}
          <p>{selectedPost?.content || "No content available"}</p>
        </Modal>
      </div>
    </div>
  );
};

export default Blog;
