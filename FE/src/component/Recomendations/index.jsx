import React, { useState, useEffect } from "react";
import { Button, Card, Row, Col, message, notification, Modal } from "antd";
import api from "../../config/axios";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const Recomendations = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("Product/getRecommendationsProduct");
      setProducts(response.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          "Failed to load products. Maybe there are no products yet.",
      });
      console.log("Error", error);
    }
  };
  const showProductDetails = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  return (
    <div className="bg-gray-900 p-10 min-h-screen text-white"
    style={{
      backgroundImage: `url(${backgroud})`, // Set the background image
      backgroundSize: "cover", // Cover the entire container
      backgroundPosition: "center", // Center the image
    }}>
      <h2 className="text-3xl font-bold mb-6">Product Recommendations</h2>
      <p className="text-lg mb-10">
        We offer effective solutions for targeted treatment of water problems.
        Optimize the water quality for your koi.
      </p>

      <Row gutter={16}>
        {products.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              className="bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden"
              bordered={false}
            >
              <div className="flex flex-col items-center">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-24 h-24 mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold">{product.title}</h3>
                <p className="text-sm text-gray-300 mt-2">
                  {product.description}
                </p>
                <div className="flex flex-col items-center mt-4 space-y-2">
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button type="primary" className="w-full">
                      Show in store
                    </Button>
                  </a>
                  <Button
                    type="default"
                    className="w-full text-gray-900"
                    onClick={() => showProductDetails(product)}
                  >
                    More details
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        title={selectedProduct?.title}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedProduct && (
          <>
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.title}
              style={{ width: "100%", marginBottom: "20px" }}
            />
            <p>
              <strong>Description:</strong> {selectedProduct.description}
            </p>
            <p>
              <strong>Product Link:</strong>{" "}
              <a
                href={selectedProduct.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedProduct.url}
              </a>
            </p>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Recomendations;
