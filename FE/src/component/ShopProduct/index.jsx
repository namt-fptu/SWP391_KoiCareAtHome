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
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import api from "../../config/axios"; // Axios instance configuration
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
        message.error(
          "Failed to load products. Maybe there are no products yet."
        );
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
      message.warning("Please add a post first.");
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
      fetchProduct(postId); // Refresh product list after deletion

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
    if (!imageUrl) {
      message.error("Please upload an image.");
      return;
    }

    try {
      const formattedValues = {
        postId,
        title: values.title,
        koiName: values.name,
        url: values.url,
        description: values.description,
        imageUrl,
      };

      await api.post("Product/createProduct", formattedValues);
      message.success("Product added successfully!");
      handleCancel(); // Close modal after submission
      fetchProduct(postId); // Refresh product list
    } catch (error) {
      console.error("Error adding product :", error);
      message.error("Failed to add product .");
    }
  };
  const onUpdateFinish = async (values) => {
    try {
      let newImageUrl = selectedProduct.imageUrl; // Sử dụng URL hình ảnh hiện tại làm mặc định

      // Kiểm tra nếu người dùng đã chọn hình ảnh mới để tải lên
      if (values.image && values.image.file) {
        console.log("Image file selected:", values.image.file);

        // Xóa ảnh cũ từ Firebase
        const oldImageRef = ref(storage, selectedProduct.imageUrl);
        await deleteObject(oldImageRef);

        // Sử dụng handleUpload để upload ảnh mới
        await handleUpload(values.image.file).then((downloadURL) => {
          newImageUrl = downloadURL; // Cập nhật URL ảnh mới
          setImageUrl(downloadURL); // Cập nhật URL ảnh cho state
        });
      }

      const updatedData = {
        id: selectedProduct.id,
        postId,
        title: values.title,
        url: values.url,
        description: values.description,
        imageUrl,
      };
      console.log("Updated data to send:", updatedData);
      // Send the update request to the server
      await api.put(
        `Product/updateProductById/${selectedProduct.id}`,
        updatedData
      );

      message.success("Product updated successfully!");
      handleUpdateCancel(); // Close modal after submission
      fetchProduct(postId); // Refresh product list
    } catch (error) {
      console.error("Error updating product :", error);
      message.error("Failed to update product .");
    }
  };
  // const uploadImgToFirebase = async (file) => {
  //   if (!file) return imageUrl;
  //   const storageRef = ref(storageImg, `product-images/${file.name}`);

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
        <h2 className="text-white text-3xl font-bold mb-5">My Product</h2>
        <p className="text-white">Add your product here.</p>
        <div className="flex flex-col items-center">
          <Button
            type="primary"
            onClick={showModal}
            style={{ marginTop: "20px" }}
          >
            Add Product
          </Button>
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
                          bodystyle={{
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
              <Form.Item label="Upload Image" name="imageUrl">
                <Upload
                  listType="picture"
                  maxCount={1}
                  showUploadList={false}
                  customRequest={({ file, onSuccess }) => {
                    handleUpload(file); // Cập nhật xem trước hình ảnh
                    onSuccess("ok"); // Kích hoạt onSuccess để không bị lỗi
                    console.log("File uploaded successfully:", file); // Log thông tin file
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
          open={isDeleteModalVisible}
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
