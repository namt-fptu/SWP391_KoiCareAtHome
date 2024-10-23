import { Button, Modal } from "antd";
import React, { useState, useEffect } from "react";
import api from "../../config/axios"; // Axios instance configuration

const LandingAdvertisement = () => {
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [products, setProducts] = useState([]);

  // Fetch approved posts when the component loads
  useEffect(() => {
    const fetchApprovedPosts = async () => {
      try {
        const response = await api.get("/Adv/getApprovedAdv");
        setApprovedPosts(response.data);
      } catch (error) {
        console.error("Error fetching approved posts:", error);
      }
    };

    fetchApprovedPosts();
  }, []);

  // Fetch products related to a post
  const fetchProducts = async (postId) => {
    try {
      const response = await api.get(`/Product/getProductByAdvId/${postId}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Show the modal with post details and related products
  const showPostDetails = (post) => {
    setSelectedPost(post);
    fetchProducts(post.id);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPost(null);
    setProducts([]); // Clear products when modal is closed
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl place-items-center">
        {approvedPosts.length > 0 ? (
          approvedPosts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300"
            >
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p>{post.description}</p>
              <Button onClick={() => showPostDetails(post)}>View Detail</Button>
            </div>
          ))
        ) : (
          <p>No approved posts available.</p>
        )}
      </div>
      <Modal
        title="Post Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedPost && (
          <>
            <h2>{selectedPost.title}</h2>
            <p>{selectedPost.description}</p>

            <h3>Related Products</h3>
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id}>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {product.title}
                  </a>
                </div>
              ))
            ) : (
              <p>No related products available.</p>
            )}
          </>
        )}
      </Modal>
    </>
  );
};

export default LandingAdvertisement;
