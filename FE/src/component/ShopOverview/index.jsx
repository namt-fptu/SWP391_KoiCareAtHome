import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRegNewspaper, FaBoxOpen, FaStar, FaRegUserCircle, FaHistory } from "react-icons/fa"; // import icons
import api from "../../config/axios";
import { useAuthStore } from "../../page/(auth)/store";

const ShopOverview = () => {
  const [totalProduct, setTotalProduct] = useState(0);
  const { authUser } = useAuthStore();
  const id = authUser.id;

  useEffect(() => {
    if (!id) {
      message.error("User not logged in. Unable to fetch posts.");
      return;
    }
    const fetchProductCounts = async () => {
      try {
        const productResponse = await api.get(
          `/Product/countProductByShopId/${id}`
        );
        setTotalProduct(productResponse.data);
      } catch (error) {
        console.error("Error fetching product counts:", error);
      }
    };
    fetchProductCounts();
  }, [id]);

  return (
    <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
      <div className="flex flex-col justify-between mb-5">
        <h2 className="text-white text-4xl font-bold text-center mb-10">Overview Features</h2>
      </div>

      {/* Center the buttons by wrapping in a flex container and using justify-center */}
      <div className="flex justify-center">
        <div className="grid grid-cols-5 gap-5 w-full max-w-5xl"> {/* Set to 5 columns with max-width */}
          <Link to="/ShopPost">
            <button className="bg-blue-600 rounded-lg text-white h-32 w-full hover:bg-blue-700 shadow-md flex flex-col items-center justify-center">
              <FaRegNewspaper size={24} />
              <span className="mt-2">My Post</span>
            </button>
          </Link>
          <Link to="/ShopProduct">
            <button className="bg-blue-600 rounded-lg text-white h-32 w-full hover:bg-blue-700 shadow-md flex flex-col items-center justify-center">
              <FaBoxOpen size={24} />
              <span className="mt-2">My Product</span>
            </button>
          </Link>
          <Link to="/ShopVipPackage">
            <button className="bg-blue-600 rounded-lg text-white h-32 w-full hover:bg-blue-700 shadow-md flex flex-col items-center justify-center">
              <FaStar size={24} />
              <span className="mt-2">My Vip Package</span>
            </button>
          </Link>
          <Link to="/PaymentHistory">
            <button className="bg-blue-600 rounded-lg text-white h-32 w-full hover:bg-blue-700 shadow-md flex flex-col items-center justify-center">
              <FaHistory size={24} />
              <span className="mt-2">Payment History</span>
            </button>
          </Link>
          <Link to="/ShopProfile">
            <button className="bg-blue-600 rounded-lg text-white h-32 w-full hover:bg-blue-700 shadow-md flex flex-col items-center justify-center">
              <FaRegUserCircle size={24} />
              <span className="mt-2">Shop Profile</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col justify-between mb-5 mt-14">
        <h2 className="text-white text-4xl font-bold text-center mb-10">Overview Account</h2>
        <div className="flex justify-center mt-8"> {/* Center the Total Product section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg transform transition duration-500 hover:scale-105">
            <h4 className="text-lg font-semibold text-gray-300">
              Total Product
            </h4>
            <div className="mt-4 flex items-center space-x-4">
              <span className="text-4xl font-bold text-white">
                {totalProduct}
              </span>
              <div className="flex flex-col items-center justify-center text-green-400">
                <i className="fas fa-user-plus text-2xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopOverview;
