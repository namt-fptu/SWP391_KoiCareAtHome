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

import Shop from "./page/shop";
import ShopOverview from "./component/ShopOverview";
import ShopPost from "./component/ShopPost";
// import ShopAds from "./component/ShopAds";
// import ShopVipPackage from "./component/ShopVipPackage";

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
        // { path: "MyAdvertisements", element: <ShopAds /> },
        // { path: "MyVipPackage", element: <ShopVipPackage /> },
        // { path: "SaltCalculator", element: <SaltCalculator /> },
        // { path: "MyPond", element: <MyPond /> },
        // { path: "FoodCalculator", element: <FoodCalculator /> },
        // { path: "MyKoiFish", element: <MyKoiFish /> },
        // { path: "Blog", element: <Blog /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
