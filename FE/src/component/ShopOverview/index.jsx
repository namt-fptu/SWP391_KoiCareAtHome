// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Card } from "antd";
import { Link } from "react-router-dom";

const ShopOverview = () => {
  const [data, setData] = useState({
    newToday: 0,
    posts: 0,
    products: 0,
  });

  useEffect(() => {
    setData({
      newToday: 3,
      posts: 5,
      products: 8,
    });
  }, []);

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
          <Card className="shadow-md p-4">
            <p className="text-lg font-semibold mb-2">Active Posts</p>
            <p className="text-4xl font-bold">{data.posts}</p>
            <a href="/ShopPost" className="text-blue-500">
              Post a new one
            </a>
          </Card>

          <Card className="shadow-md p-4">
            <p className="text-lg font-semibold mb-2">Products</p>
            <p className="text-4xl font-bold">{data.products}</p>
            <a href="/ShopProduct" className="text-blue-500">
              Add products
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShopOverview;
