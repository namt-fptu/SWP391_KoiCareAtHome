import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Card,
  Row,
  Col,
  Select,
  message,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import api from "../../config/axios"; // Axios instance configuration

const ShopProduct = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // State for delete modal
  const [selectedProduct, setSelectedProduct] = useState(null); // Selected product to delete
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false); // State for update modal
  const [postId, setPostId] = useState(null);
  const [posts, setPosts] = useState([]);

  const { Option } = Select;
  const id = sessionStorage.getItem("id");

  useEffect(() => {
    if (!id) {
      message.error("User not signed in. Unable to fetch ponds.");
      return;
    }
    fetchPosts();
  }, [id]);

  const fetchProduct = async (advId) => {
    try {
      const response = await api.get(`Product/getProductByAdvId/${advId}`);
      setProducts(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Post has no product, set empty product array
        setProducts([]);
        console.warn("No product found for this post.");
        console.error("Error fetching products:", error);
        message.error("Failed to fetch products.");
      }
    }
  };
  //   const fetchProductDetails = async (productId) => {
  //     try {
  //       const response = await api.get(`Product/getProductById/${productId}`);
  //       const productDetails = response.data;

  //       // Set selected product details to state
  //       setSelectedProduct({
  //         id: productDetails.id,
  //         title: productDetails.title,
  //         url: productDetails.url,
  //         description: productDetails.description,
  //       });

  //       setIsUpdateModalVisible(true); // Hiện modal sau khi lấy được dữ liệu
  //     } catch (error) {
  //       console.error("Error fetching product details:", error);
  //       message.error("Failed to fetch product details.");
  //     }
  //   };

  const fetchPosts = async () => {
    try {
      const response = await api.get(`Adv/getAdvByShopId/${id}`);

      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else {
        setPosts([]); // Đặt giá trị mặc định là mảng rỗng nếu không phải là mảng
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      message.error("Failed to fetch posts.");
      setPosts([]); // Đảm bảo posts luôn là mảng ngay cả khi có lỗi
    }
  };
  useEffect(() => {
    if (postId) {
      fetchProduct(postId);
    }
  }, [postId]);

  const showDeleteModal = (product) => {
    setSelectedProduct(product); // Set the selected product  to delete
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false); // Close delete modal
    setSelectedProduct(null); // Reset selected product
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      // Delete product  from database
      await api.delete(`Product/deleteProductById/${selectedProduct.id}`);

      message.success("Product deleted successfully.");
      fetchProduct(id); // Refresh product list after deletion

      setIsDeleteModalVisible(false); // Close modal
      setSelectedProduct(null); // Reset selected product
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("Failed to delete product.");
    }
  };
  const showUpdateModal = (product) => {
    // fetchProductDetails(product);
    setSelectedProduct(product); // Set the selected product  for update
    setIsUpdateModalVisible(true); // Show update modal
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpdateCancel = () => {
    setIsModalVisible(false);
    setIsUpdateModalVisible(false); // Close update modal
    setSelectedProduct(null); // Reset selected product
  };

  const onFinish = async (values) => {
    try {
      const formattedValues = {
        postId,
        title: values.title,
        koiName: values.name,
        url: values.url,
        description: values.description,
      };

      await api.post("Product/createProduct", formattedValues);
      message.success("Product added successfully!");
      handleCancel(); // Close modal after submission
      fetchProduct(id); // Refresh product list
    } catch (error) {
      console.error("Error adding product :", error);
      message.error("Failed to add product .");
    }
  };
  const onUpdateFinish = async (values) => {
    try {
      // Prepare updated data
      const updatedData = {
        id: selectedProduct.id, // product  id
        postId,
        title: values.title,
        koiName: values.name,
        url: values.url,
        description: values.description,
      };

      // Send the update request to the server
      await api.put(
        `Product/updateProductById/${selectedProduct.id}`,
        updatedData
      );

      message.success("Product updated successfully!");
      handleUpdateCancel(); // Close modal after submission
      fetchProduct(id); // Refresh product list
    } catch (error) {
      console.error("Error updating product :", error);
      message.error("Failed to update product .");
    }
  };
  return (
    <div className="flex-container">
      <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-8 text-white p-8">
            My Products
          </h1>
        </div>
        <Select
          placeholder="Select a post"
          onChange={setPostId}
          style={{ width: "10%", marginBottom: "20px" }}
        >
          {posts.map((post) => (
            <Option key={post.id} value={post.id}>
              {post.title}
            </Option>
          ))}
        </Select>

        {postId && (
          <>
            <Button
              type="primary"
              onClick={showModal}
              style={{ marginTop: "20px" }}
            >
              Add Product
            </Button>
            <Row gutter={16}>
              {products.length > 0 ? (
                products.map((product, index) => {
                  return (
                    <Col key={index} xs={24} sm={12} md={8} lg={6}>
                      <Card title={`Product: ${product.title}`} bordered={true}>
                        <div
                          style={{
                            marginBottom: "20px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            borderRadius: "8px",
                            width: "100%", // Đảm bảo card chiếm 100% chiều rộng của cột
                            height: "300px", // Chiều cao cố định
                            overflow: "hidden", // Ẩn các nội dung vượt quá chiều cao
                          }}
                          bodyStyle={{
                            height: "200px", // Cố định chiều cao phần thân để đồng đều
                            overflowY: "auto", // Bật cuộn cho nội dung nếu cần
                          }}
                        >
                          <p>
                            <strong>From Post:</strong>{" "}
                            {posts.find((post) => post.id === postId)?.title}
                          </p>
                          <br />
                          <p>
                            <strong>Url:</strong>{" "}
                            <a
                              href={product.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {product.url}
                            </a>
                          </p>
                          <br />
                          <p>
                            <strong>Description:</strong> {product.description}
                          </p>
                        </div>
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
                            onClick={() => showUpdateModal(product)}
                          >
                            Update
                          </Button>

                          <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                            onClick={() => showDeleteModal(product)}
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
                <p style={{ color: "white" }}>No product in this post</p>
              )}
            </Row>
          </>
        )}
        {/* Modal for update koi fish */}
        <Modal
          title="Update Product Information"
          open={isUpdateModalVisible}
          onCancel={handleUpdateCancel}
          footer={null}
        >
          {selectedProduct && (
            <Form
              layout="vertical"
              onFinish={onUpdateFinish}
              initialValues={{
                title: selectedProduct.title,
                url: selectedProduct.url,
                description: selectedProduct.description,
              }}
            >
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: "Please input Title!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Product Url"
                name="url"
                rules={[
                  { required: true, message: "Please input Product Url!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please input Description!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </Form.Item>
            </Form>
          )}
        </Modal>

        {/* Modal for delete confirmation */}
        <Modal
          title="Confirm Deletion"
          visible={isDeleteModalVisible}
          onOk={handleDeleteProduct}
          onCancel={handleDeleteCancel}
          okText="Delete"
          okButtonProps={{ danger: true }}
        >
          <p>
            Are you sure you want to <strong>delete</strong> this Product?
          </p>
        </Modal>

        {/* Modal for Add product */}
        <Modal
          title="Input Product Information"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Selected Post">
              <Input value={postId} disabled />
            </Form.Item>

            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please input Title!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Product Url"
              name="url"
              rules={[{ required: true, message: "Please input Product Url!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please input Description!" }]}
            >
              <Input />
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

export default ShopProduct;
