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
  Upload,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import api from "../../config/axios"; // Axios instance configuration
import { useAuthStore } from "../../page/(auth)/store";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIcvSZRnSTBxw8yrLcq7AqLjqNhvaUQyk",
  authDomain: "swp391-76ab5.firebaseapp.com",
  projectId: "swp391-76ab5",
  storageBucket: "swp391-76ab5.appspot.com",
  messagingSenderId: "86962001326",
  appId: "1:86962001326:web:936799b1e20348cbb8643f",
};

const app = initializeApp(firebaseConfig);
const storageImg = getStorage(app);

const ShopProduct = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // State for delete modal
  const [selectedProduct, setSelectedProduct] = useState(null); // Selected product to delete
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false); // State for update modal
  const [postId, setPostId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm(); // Khởi tạo form Ant Design

  const { Option } = Select;

  const { authUser } = useAuthStore();
  const id = authUser.id;

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
      const imageRef = ref(storageImg, selectedProduct.imageUrl);

      await Promise.all([deleteObject(imageRef)]);

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
    setImageUrl(product.imageUrl);
    setIsUpdateModalVisible(true); // Show update modal
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    resetForm();
    setIsModalVisible(false);
  };
  const resetForm = () => {
    form.resetFields(); // Xóa dữ liệu của form
    setFileList([]);
    setImageUrl("");
  };

  const handleUpdateCancel = () => {
    setIsModalVisible(false);
    setIsUpdateModalVisible(false); // Close update modal
    setImageUrl(null);
    setSelectedProduct(null); // Reset selected product
  };

  const onFinish = async (values) => {
    if (fileList.length === 0) {
      message.error("Please upload an image.");
      return;
    }
    const file = fileList[0];
    const uploadedImageUrl = await uploadImgToFirebase(file);

    try {
      const formattedValues = {
        postId,
        title: values.title,
        koiName: values.name,
        url: values.url,
        description: values.description,
        imageUrl: uploadedImageUrl,
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
      let newImageUrl = selectedProduct.imageUrl;

      if (values.image && values.image.file) {
        const oldImageRef = ref(storageImg, selectedProduct.imageUrl);
        await deleteObject(oldImageRef);
        newImageUrl = await uploadImgToFirebase(values.image.file);
        setImageUrl(newImageUrl);
      }
      // Prepare updated data
      const updatedData = {
        id: selectedProduct.id, // product  id
        postId,
        title: values.title,
        koiName: values.name,
        url: values.url,
        description: values.description,
        imageUrl: newImageUrl,
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
  const uploadImgToFirebase = async (file) => {
    if (!file) return null;
    const storageRef = ref(storageImg, `product-images/${file.name}`);

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
  const handleUpload = (file) => {
    setFileList([file]);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
    return false;
  };
  return (
    <div className="flex-container">
      <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-white text-3xl font-bold mb-5">My Product</h2>
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

            <Row gutter={[16, 16]}>
              {products.length > 0 ? (
                products.map((product, index) => {
                  return (
                    <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8}>
                      <Card title={`Product: ${product.title}`} bordered={true}>
                        <div
                          style={{
                            marginBottom: "20px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            borderRadius: "8px",
                            width: "100%", // Đảm bảo card chiếm 100% chiều rộng của cột
                            height: "350px", // Chiều cao cố định
                            overflow: "hidden", // Ẩn các nội dung vượt quá chiều cao
                          }}
                          bodyStyle={{
                            height: "200px", // Cố định chiều cao phần thân để đồng đều
                            overflow: "auto", // Bật cuộn cho nội dung nếu cần
                          }}
                        >
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt="Product"
                              style={{
                                width: "100%",
                                height: "160px", // Cố định chiều cao của hình ảnh
                                objectFit: "cover", // Đảm bảo hình ảnh không bị méo
                                borderRadius: "8px",
                                marginBottom: "10px",
                              }}
                            />
                          )}
                          <p className="-mb-2">
                            <strong>From Post:</strong>{" "}
                            {posts.find((post) => post.id === postId)?.title}
                          </p>
                          <br />
                          <p className="-mb-2">
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
                          <p className="-mb-2">
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
              <Form.Item label="Upload Image" name="image">
                <Upload
                  listType="picture"
                  maxCount={1}
                  showUploadList={false}
                  customRequest={({ file, onSuccess }) => {
                    handleUpload(file).then(onSuccess);
                  }}
                >
                  <Button icon={<UploadOutlined />}>Select Image</Button>
                </Upload>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Product"
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                )}
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
          afterClose={resetForm} // Đảm bảo reset khi modal đóng
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {
              onFinish(values);
              resetForm();
            }}
          >
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
              <Input.TextArea rows={4} />
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
