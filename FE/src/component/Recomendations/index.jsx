import React, { useState, useEffect } from "react";
import { Button, Card, Row, Col, message } from "antd";
import api from "../../config/axios";

const Recomendations = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("Product/getRecommendationsProduct");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching recommended products:", error);
      message.error("Failed to fetch recommended products.");
    }
  };

  return (
    <div className="bg-gray-900 p-10 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6">Product Recommendations</h2>
      <p className="text-lg mb-10">
        We offer effective solutions for targeted treatment of water problems. Optimize the water quality for your koi.
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
                <p className="text-sm text-gray-300 mt-2">{product.description}</p>
                <div className="flex flex-col items-center mt-4 space-y-2">
                  <a href={product.url} target="_blank" rel="noopener noreferrer">
                    <Button type="primary" className="w-full">
                      Show in store
                    </Button>
                  </a>
                  <Button type="default" className="w-full text-gray-900">
                    More details
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Recomendations;
