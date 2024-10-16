import React from "react";
import AdminSideBar from "../../component/AdminSideBar";
import { Outlet } from "react-router-dom";

const Admin = () => {
  return (
    <div className="flex h-max">
      <AdminSideBar />
      <div className="flex-1 h-full p-5 bg-gray-900">
        <Outlet /> {/* This is where routed content will be displayed */}
      </div>
    </div>
  );
};

export default Admin;