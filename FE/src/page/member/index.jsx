// eslint-disable-next-line no-unused-vars
import React from "react";
import MemberSideBar from "../../component/MemberSidebar";
import { Outlet } from "react-router-dom";

const Member = () => {
  return (
    <div className="flex h-max">
      <MemberSideBar />
      <div className="flex-1 h-full p-5 bg-gray-900">
        <Outlet /> {/* This is where routed content will be displayed */}
      </div>
    </div>
  );
};

export default Member;
