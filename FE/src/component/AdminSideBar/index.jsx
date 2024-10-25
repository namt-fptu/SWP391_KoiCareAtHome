import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import logoimg from "./../../assets/logo koi care.png";
import controlButton from "./../../assets/control.png";
import dashboardIcon from "./../../assets/Logo sidebar/AdminSideBar/dashboard.png"; // Icon for Dashboard
import userProfileIcon from "./../../assets/Logo sidebar/AdminSideBar/userprofile.png"; // Icon for User Profile
import tableListIcon from "./../../assets/Logo sidebar/AdminSideBar/tablelist.png"; // Icon for Table List
import typographyIcon from "./../../assets/Logo sidebar/AdminSideBar/typography.png"; // Icon for Typography
import postsIcon from "./../../assets/Logo sidebar/AdminSideBar/posts.png"; // Icon for Posts
import logOutIcon from "./../../assets/Logo sidebar/AdminSideBar/logout.png"; // Icon for Log Out
import { useAuthStore } from "../../page/(auth)/store";

const AdminSideBar = () => {
  const { logout } = useAuthStore();

  const [open, setOpen] = useState(true);
  const navigate = useNavigate(); // Create a navigate function

  const handleLogout = () => {
    // Clear user data or tokens from local storage/session storage/context
    localStorage.removeItem("token"); // Example: remove token from local storage
    // If you're using a global state or context, reset that state accordingly
    // For example, if using context:
    // dispatch({ type: "LOGOUT" });

    // Redirect to the landing page
    navigate("/");
  };

  return (
    <div className="flex h-auto">
      <div
        className={`sidebar ${
          open ? "w-72" : "w-20"
        } bg-black h-full p-5 pt-8 relative duration-300`}
      >
        {/* Control Button */}
        <img
          src={controlButton}
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-black border-2 rounded-full ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
          alt="control"
        />

        {/* Logo and Title */}
        <div className="flex gap-x-4 items-center">
          <Link to={"/"}>
            <img
              src={logoimg}
              alt="logo"
              width={60}
              className={`cursor-pointer duration-500 ${
                open && "rotate-[360deg]"
              }`}
            />
          </Link>
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            KoiF
          </h1>
        </div>

        {/* Menu Items */}
        <ul className="pt-6">
          {/* Dashboard */}
          <Link to="Dashboard">
            <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-2">
              <img src={dashboardIcon} alt="Dashboard" />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Dashboard
              </span>
            </li>
          </Link>

          {/* User Profile */}
          <Link to="UserProfile">
            <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-2">
              <img src={userProfileIcon} alt="User Profile" />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                User Profile
              </span>
            </li>
          </Link>

          {/* KoiVariety */}
          <Link to="KoiVariety">
            <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-9">
              <img src={tableListIcon} alt="Table List" />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                KoiVariety
              </span>
            </li>
          </Link>

          {/* KoiGrowthStandard */}
          <Link to="KoiGrowthStandard">
            <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-2">
              <img src={typographyIcon} alt="Typography" />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                KoiGrowthStandard
              </span>
            </li>
          </Link>

          {/* waterParameterStandard */}
          <Link to="WaterParameterStandard">
            <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-2">
              <img src={typographyIcon} alt="Typography" />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                WaterParameterStandard
              </span>
            </li>
          </Link>

          {/* Posts */}
          <Link to="Posts">
            <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-2">
              <img src={postsIcon} alt="Posts" />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Posts
              </span>
            </li>
          </Link>

          {/* Log Out */}
          <li
            className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-9"
            onClick={() => {
              logout();
            }}
          >
            <img src={logOutIcon} alt="Log Out" />
            <span className={`${!open && "hidden"} origin-left duration-200`}>
              Log Out
            </span>
          </li>
        </ul>
      </div>

      <div className="flex-1 h-full">{/* Add Routes or content here */}</div>
    </div>
  );
};

export default AdminSideBar;
