import React from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { useRoutes } from "react-router-dom";

import LandingPage from "./page/LandingPage";
import Signin from "./page/signin";
import Signup from "./page/signup";
import Member from "./page/member";
import MemberOverview from "./component/MemberOverview";
import MyKoiFish from "./component/MyKoiFish";
import MyPond from "./component/MyPond";
import SaltCalculator from "./component/SaltCalculator";
import WaterParameter from "./component/WaterParameter";
import AboutKoi from "./component/AboutKoi";
import Statistics from "./component/Statistics";
import FoodCalculator from "./component/FoodCalculator";
import Blog from "./component/Blog";
//    import Admin from "./page/admin";

import Shop from "./page/shop";
import ShopOverview from "./component/ShopOverview";
import ShopPost from "./component/ShopPost";
import { Typography } from "antd";
import ShopProduct from "./component/ShopProduct";
import KoiVariety from "./component/KoiVariety";
import KoiGrowthStandard from "./component/KoiGrowthStandard";
import UserProfile from "./component/UserProfile";
import PostPackage from "./component/PostPackage";
import SuccessPage from "./page/SuccessPage";
import PaymentHistory from "./component/PaymentHistory";
// import ShopAds from "./component/ShopAds";
import ShopVipPackage from "./component/ShopVipPackage";
import AdminSideBar from "./component/AdminSideBar";
import Dashboard from "./component/DashBoard";
import MemberProfile from "./component/MemberProfile";
import Admin from "./page/admin";
import Posts from "./component/Posts";
import KoiReport from "./component/KoiReport";
import WaterParameterStandard from "./component/WaterParameterStandard";
import { createRoutes } from "./routes/utils";
import { useAuthStore } from "./page/(auth)/store";
import { elements } from "chart.js";
const App = () => {
  const { authUser } = useAuthStore();

  const router = [
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "*",
      element: <>Page not found</>,
    },
    {
      path: "signin",
      element: <Signin />,
    },
    {
      path: "signup",
      element: <Signup />,
    },
    {
      element: <Member />, // Use Member for all routes that require the sidebar
      accessKey: "PondOwner",
      children: [
        { path: "Overview", element: <MemberOverview /> },
        { path: "Statistics", element: <Statistics /> },
        { path: "AboutKoi", element: <AboutKoi /> },
        { path: "WaterParameter", element: <WaterParameter /> },
        { path: "KoiReport", element: <KoiReport /> },
        { path: "SaltCalculator", element: <SaltCalculator /> },
        { path: "MyPond", element: <MyPond /> },
        { path: "FoodCalculator", element: <FoodCalculator /> },
        { path: "MyKoiFish", element: <MyKoiFish /> },
        { path: "MemberProfile", element: <MemberProfile /> },
        { path: "Blog", element: <Blog /> },

      ],
    },
    {
      element: <Shop />, // Use Shop for all routes that require the sidebar
      accessKey: "Shop",
      children: [
        { path: "ShopOverview", element: <ShopOverview /> },
        { path: "ShopPost", element: <ShopPost /> },
        { path: "ShopProduct", element: <ShopProduct /> },
        { path: "ShopVipPackage", element: <ShopVipPackage /> },
        { path: "PaymentHistory", element: <PaymentHistory /> },
        { path: "SuccessPage", element: <SuccessPage /> },
      ],
    },
    {
      element: <Admin />,
      accessKey: "Admin",
      children: [
        { path: "DashBoard", element: <Dashboard /> },
        { path: "UserProfile", element: <UserProfile /> },
        { path: "KoiVariety", element: <KoiVariety /> },
        { path: "KoiGrowthStandard", element: <KoiGrowthStandard /> },
        { path: "Posts", element: <Posts /> },
        { path: "WaterParameterStandard", element: <WaterParameterStandard /> },
        { path: "PostPackage", element: <PostPackage /> }
      ],
    },
  ];

  const content = useRoutes(
    createRoutes({ routes: router, userRole: authUser?.role })
  );
  
  return content;
  // return <RouterProvider router={router} />;
};

export default App;
