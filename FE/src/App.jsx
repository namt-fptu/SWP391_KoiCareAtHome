import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { decodeJWT } from "./page/signin";
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

const ProtectedRoute = ({ element, requiredRoles }) => {
  const token = sessionStorage.getItem("authToken");
  const decodedToken = token ? decodeJWT(token) : null;
  const userRole = decodedToken?.role || null;

  if (!token || !requiredRoles.includes(userRole)) {
    sessionStorage.removeItem("authToken"); // Xóa token để logout
    sessionStorage.removeItem("id");
    return <Navigate to="/signin" replace />; // Chuyển về trang signin
  }
  return element; // Hiển thị thành phần nếu đủ quyền
};

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
      element: <Member />,
      children: [
        {
          path: "Overview",
          element: (
            <ProtectedRoute
              element={<MemberOverview />}
              requiredRoles={["PondOwner"]}
            />
          ),
        },
        {
          path: "Statistics",
          element: (
            <ProtectedRoute
              element={<Statistics />}
              requiredRoles={["PondOwner"]}
            />
          ),
        },
        {
          path: "AboutKoi",
          element: (
            <ProtectedRoute
              element={<AboutKoi />}
              requiredRoles={["PondOwner"]}
            />
          ),
        },
        {
          path: "WaterParameter",
          element: (
            <ProtectedRoute
              element={<WaterParameter />}
              requiredRoles={["PondOwner"]}
            />
          ),
        },
        {
          path: "KoiReport",
          element: (
            <ProtectedRoute
              element={<KoiReport />}
              requiredRoles={["PondOwner"]}
            />
          ),
        },
        {
          path: "SaltCalculator",
          element: (
            <ProtectedRoute
              element={<SaltCalculator />}
              requiredRoles={["PondOwner"]}
            />
          ),
        },
        {
          path: "MyPond",
          element: (
            <ProtectedRoute
              element={<MyPond />}
              requiredRoles={["PondOwner"]}
            />
          ),
        },
        {
          path: "FoodCalculator",
          element: (
            <ProtectedRoute
              element={<FoodCalculator />}
              requiredRoles={["PondOwner"]}
            />
          ),
        },
        {
          path: "MyKoiFish",
          element: (
            <ProtectedRoute
              element={<MyKoiFish />}
              requiredRoles={["PondOwner"]}
            />
          ),
        },
        {
          path: "Blog",
          element: (
            <ProtectedRoute element={<Blog />} requiredRoles={["PondOwner"]} />
          ),
        },
      ],
    },
    {
      element: <Shop />,
      children: [
        {
          path: "ShopOverview",
          element: (
            <ProtectedRoute
              element={<ShopOverview />}
              requiredRoles={["Shop"]}
            />
          ),
        },
        {
          path: "ShopPost",
          element: (
            <ProtectedRoute element={<ShopPost />} requiredRoles={["Shop"]} />
          ),
        },
        {
          path: "ShopProduct",
          element: (
            <ProtectedRoute
              element={<ShopProduct />}
              requiredRoles={["Shop"]}
            />
          ),
        },
        {
          path: "ShopVipPackage",
          element: (
            <ProtectedRoute
              element={<ShopVipPackage />}
              requiredRoles={["Shop"]}
            />
          ),
        },
      ],
    },
    {
      element: <Admin />,
      children: [
        {
          path: "DashBoard",
          element: (
            <ProtectedRoute element={<Dashboard />} requiredRoles={["Admin"]} />
          ),
        },
        {
          path: "UserProfile",
          element: (
            <ProtectedRoute
              element={<UserProfile />}
              requiredRoles={["Admin"]}
            />
          ),
        },
        {
          path: "KoiVariety",
          element: (
            <ProtectedRoute
              element={<KoiVariety />}
              requiredRoles={["Admin"]}
            />
          ),
        },
        {
          path: "KoiGrowthStandard",
          element: (
            <ProtectedRoute
              element={<KoiGrowthStandard />}
              requiredRoles={["Admin"]}
            />
          ),
        },
        {
          path: "Posts",
          element: (
            <ProtectedRoute element={<Posts />} requiredRoles={["Admin"]} />
          ),
        },
        {
          path: "WaterParameterStandard",
          element: (
            <ProtectedRoute
              element={<WaterParameterStandard />}
              requiredRoles={["Admin"]}
            />
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
