import React from "react";
import SideBar from "../../component/sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex-1 h-full p-5 bg-gray-900">
        <Outlet /> {/* This is where routed content will be displayed */}
      </div>
    </div>
  );
};

export default MainLayout;