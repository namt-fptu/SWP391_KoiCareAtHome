// eslint-disable-next-line no-unused-vars
import React from "react";
import ShopSideBar from "../../component/ShopSidebar";
import { Outlet } from "react-router-dom";

const Member = () => {
  return (
    <div className="flex h-max">
      <ShopSideBar />
      <div className="flex-1 h-full p-5 bg-gray-900">
        <Outlet /> {/* This is where routed content will be displayed */}
      </div>
    </div>
  );
};

export default Member;
