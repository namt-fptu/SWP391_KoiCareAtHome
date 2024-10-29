// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Card } from "antd";
import { Link } from "react-router-dom";
import api from "../../config/axios";
import { useAuthStore } from "../../page/(auth)/store";

const ShopOverview = () => {
  const [approvedAds, setApprovedAds] = useState(0);
  const [draftedAds, setDraftedAds] = useState(0);
  const [rejectedAds, setRejectedAds] = useState(0);
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
        <h2 className="text-white text-3xl font-bold">Overview Features</h2>
      </div>

      <div className="grid grid-cols-2 gap-5 mt-8">
        <Link to="/ShopPost">
          <button className="bg-blue-600 rounded-md text-white p-4 hover:bg-blue-700 w-full">
            My Post
          </button>
        </Link>
        <Link to="/ShopProduct">
          <button className="bg-blue-600 rounded-md text-white p-4 hover:bg-blue-700 w-full">
            My Product
          </button>
        </Link>
        <Link to="/ShopVipPackage">
          <button className="bg-blue-600 rounded-md text-white p-4 hover:bg-blue-700 w-full">
            My Vip Package
          </button>
        </Link>

        <Link to="/AboutKoi">
          <button className="bg-blue-600 rounded-md text-white p-4 hover:bg-blue-700 w-full">
            About Koi
          </button>
        </Link>
      </div>
      <div className="flex flex-col justify-between mb-5 mt-14">
        <h2 className="text-white text-3xl font-bold">Overview Account</h2>
        <div className="grid grid-cols-2 gap-4 p-6 mt-8">
          
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

          {/* <Card className="shadow-md p-4">
            <p className="text-lg font-semibold mb-2">Products</p>
            <p className="text-4xl font-bold">{data.products}</p>
            <a href="/ShopProduct" className="text-blue-500">
              Add products
            </a>
          </Card> */}
        </div>
      </div>
    </div>
  );
};

export default ShopOverview;
