// eslint-disable-next-line no-unused-vars
import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
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

// import ShopAds from "./component/ShopAds";
import ShopVipPackage from "./component/ShopVipPackage";
import AdminSideBar from "./component/AdminSideBar";
import Dashboard from "./component/DashBoard";
import Admin from "./page/admin";
import Posts from "./component/Posts";
import KoiReport from "./component/KoiReport";
import WaterParameterStandard from "./component/WaterParameterStandard";
const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
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
        { path: "Blog", element: <Blog /> },
      ],
    },
    {
      element: <Shop />, // Use Shop for all routes that require the sidebar
      children: [
        { path: "ShopOverview", element: <ShopOverview /> },
        { path: "ShopPost", element: <ShopPost /> },
        { path: "ShopProduct", element: <ShopProduct /> },
        { path: "ShopVipPackage", element: <ShopVipPackage /> },
        // { path: "SaltCalculator", element: <SaltCalculator /> },
        // { path: "MyPond", element: <MyPond /> },
        // { path: "FoodCalculator", element: <FoodCalculator /> },
        // { path: "MyKoiFish", element: <MyKoiFish /> },
        // { path: "Blog", element: <Blog /> },
      ],
    },
    {
      element: <Admin />,
      children: [
        { path: "DashBoard", element: <Dashboard /> },
        { path: "UserProfile", element: <UserProfile /> },
        { path: "KoiVariety", element: <KoiVariety /> },
        { path: "KoiGrowthStandard", element: <KoiGrowthStandard /> },
        { path: "Posts", element: <Posts /> },
        { path: "WaterParameterStandard", element: <WaterParameterStandard /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
