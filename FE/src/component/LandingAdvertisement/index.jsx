// import { Button, Modal } from "antd";
// import React, { useState, useEffect } from "react";
// import api from "../../config/axios"; // Axios instance configuration
// import { initializeApp } from "firebase/app";
// import { Select, InputNumber } from "antd";
// import {
//   getStorage,
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   deleteObject,
// } from "firebase/storage";

// // Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyBIcvSZRnSTBxw8yrLcq7AqLjqNhvaUQyk",
//     authDomain: "swp391-76ab5.firebaseapp.com",
//     projectId: "swp391-76ab5",
//     storageBucket: "swp391-76ab5.appspot.com",
//     messagingSenderId: "86962001326",
//     appId: "1:86962001326:web:936799b1e20348cbb8643f",
//   };

//   const app = initializeApp(firebaseConfig);
//   const storageImg = getStorage(app);
//   const storageTxt = getStorage(app);

// const LandingAdvertisement = () => {
//   const [approvedPosts, setApprovedPosts] = useState([]);
//   const [selectedPost, setSelectedPost] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [products, setProducts] = useState([]);

//   // Fetch approved posts when the component loads
//   useEffect(() => {
//     const fetchApprovedPosts = async () => {
//         try {
//           // Fetch posts with the 'Processing' status
//           const response = await api.get(`Adv/getApprovedAdv`);
//           const postsData = response.data;

//           // Tải nội dung từ Firebase cho từng bài viết
//           const postsWithContent = await Promise.all(
//             postsData.map(async (post) => {
//               if (post.url) {
//                 try {
//                   const contentURL = await getDownloadURL(
//                     ref(storageTxt, post.url)
//                   );
//                   const contentResponse = await fetch(contentURL);
//                   const contentText = await contentResponse.text();
//                   return { ...post, content: contentText }; // Cập nhật content vào post
//                 } catch (error) {
//                   console.error("Failed to fetch content from Firebase", error);
//                   console.log(post.url);
//                   return { ...post, content: "Content could not be loaded" }; // Trường hợp lỗi
//                 }
//               }
//               return post;
//             })
//           );

//           setPosts(postsWithContent);
//         } catch (error) {
//           message.error("Failed to fetch post data.");
//         }
//       };
//       fetchProcessingPosts();
//     }, []);
//     useEffect(() => {
//         const fetchShortContents = async () => {
//           const contents = {};
//           posts.forEach((post) => {
//             setTimeout(() => {
//               const shortContent = getShortContent(post.content);
//               contents[post.id] = shortContent;
//               setShortContents({ ...contents }); // Cập nhật lại shortContent sau khi có timeout
//             }, 3000); // Chờ 3 giây
//           });
//         };

//         fetchShortContents();
//       }, [posts]);
//       const getShortContent = (content) => {
//         const maxLength = 50; // số ký tự tóm tắt
//         // Kiểm tra nếu content là một chuỗi hợp lệ
//         if (typeof content === "string") {
//           return content.length > maxLength
//             ? content.slice(0, maxLength) + "..."
//             : content;
//         }
//         return ""; // Nếu content không hợp lệ, trả về chuỗi rỗng
//       };
//       const handleShowDetail = (post) => {
//         setSelectedPost(post);
//       };

//       const handleDetailClose = () => {
//         setSelectedPost(null);
//       };

//   // Fetch products related to a post
//   const fetchProducts = async (postId) => {
//     try {
//       const response = await api.get(`/Product/getProductByAdvId/${postId}`);
//       setProducts(response.data);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   // Show the modal with post details and related products
//   const showPostDetails = (post) => {
//     setSelectedPost(post);
//     fetchProducts(post.id);
//     setIsModalVisible(true);
//   };

//   const handleModalClose = () => {
//     setIsModalVisible(false);
//     setSelectedPost(null);
//     setProducts([]); // Clear products when modal is closed
//   };

//   return (
//     <>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl place-items-center">
//       {posts.length > 0 && (
//           <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
//             {posts.map((post, index) => (
//               <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8}>
//                 <Card
//                   style={{
//                     width: "100%",
//                     height: 500, // Cố định chiều cao của khung
//                     marginBottom: "20px",
//                     border: "1px solid #f0f0f0",
//                     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   {/* Title ở trên cùng */}
//                   <div style={{ flex: "none" }}>
//                     <p style={{ fontSize: "16px", fontWeight: "bold" }}>
//                       <strong>Title:</strong> {post.title || "-"}
//                     </p>
//                   </div>

//                   {/* Hình ảnh ở giữa */}
//                   {post.imageUrl && (
//                     <img
//                       src={post.imageUrl}
//                       alt="Post"
//                       style={{
//                         width: "100%",
//                         height: "200px", // Cố định chiều cao của hình ảnh
//                         objectFit: "cover", // Đảm bảo hình ảnh không bị méo
//                         borderRadius: "8px",
//                         marginBottom: "10px",
//                       }}
//                     />
//                   )}

//                   {/* Content ở dưới hình ảnh */}
//                   <div
//                     style={{
//                       flex: "1 1 auto",
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     <p
//                       style={{
//                         fontSize: "14px",
//                         fontWeight: "bold",
//                         color: "#555",
//                       }}
//                     >
//                       <strong>Content:</strong>{" "}
//                       {shortContents[post.id] || "Loading content..."}
//                     </p>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       marginTop: "10px",
//                     }}
//                   >
//                     <Button onClick={() => handleShowDetail(post)}>
//                       View Detail
//                     </Button>
//                   </div>
//       <Modal
//         title="Post Details"
//         visible={isModalVisible}
//         onCancel={handleModalClose}
//         footer={null}
//       >
//         {selectedPost && (
//           <>
//             <h2>{selectedPost.title}</h2>
//             <p>{selectedPost.description}</p>

//             <h3>Related Products</h3>
//             {products.length > 0 ? (
//               products.map((product) => (
//                 <div key={product.id}>
//                   <a
//                     href={product.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     {product.title}
//                   </a>
//                 </div>
//               ))
//             ) : (
//               <p>No related products available.</p>
//             )}
//           </>
//         )}
//       </Modal>
//     </>
//   );
// };

// export default LandingAdvertisement;
