import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LandingPage from "./page/LandingPage";
import Signin from "./page/signin";
import Signup from "./page/signup";
import Overview from "./page/overview";
import MyKoiFish from "./page/MyKoiFish";
import MyPond from "./page/MyPond";
import SaltCalculator from "./page/SaltCalculator";
import WaterParameter from "./page/WaterParameter";
import AboutKoi from "./page/AboutKoi";
import Statistics from "./page/Statistics";
import FoodCalculator from "./page/FoodCalculator";
import MainLayout from "./page/MainLayout/MainLayout";
import Blog from "./page/Blog";

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
      element: <MainLayout />, // Use MainLayout for all routes that require the sidebar
      children: [
        { path: "Overview", element: <Overview /> },
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
  ]);

  return <RouterProvider router={router} />;
};

export default App;
