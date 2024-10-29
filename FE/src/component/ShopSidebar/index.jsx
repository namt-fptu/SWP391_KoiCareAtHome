import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import logoimg from "./../../assets/logo koi care.png";
import controlButton from "./../../assets/control.png";
import shopPost from "./../../assets/Logo sidebar/ShopSidebar/post.png";
import overviewIcon from "./../../assets/Logo sidebar/overview.png"; // Thêm icon cho Overview
import myPondIcon from "./../../assets/Logo sidebar/myPond.png"; // Thêm icon cho MyPond
import aboutKoiIcon from "./../../assets/Logo sidebar/aboutKoi.png"; // Thêm icon cho About Koi
import logOutIcon from "./../../assets/Logo sidebar/logout.png"; // Thêm icon cho Log Out
import { useAuthStore } from "../../page/(auth)/store";

const ShopSideBar = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate(); // Create a navigate function
  const { logout } = useAuthStore();

  

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
        <img
          src={controlButton}
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-black border-2 rounded-full ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex gap-x-4 items-center">
          <Link to={"/"}>
            <img
              src={logoimg}
              alt=""
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
        <ul className="pt-6">
          {/* Overview */}
          <Link to="ShopOverview">
            <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-2">
              <img src={overviewIcon} alt="Overview" />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Overview
              </span>
            </li>
          </Link>

          {/* Shop Post */}
          <Link to="ShopPost">
            <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-2">
              <img src={shopPost} alt="My Post" />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                My Post
              </span>
            </li>
          </Link>

          {/* Shop's Product */}
          <Link to="ShopProduct">
            <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-2">
              <img src={myPondIcon} alt="My Product" />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                My Product
              </span>
            </li>
          </Link>

          {/* Shop's Vip Package */}
          <Link to="ShopVipPackage">
            <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-2">
              <img src={myPondIcon} alt="My Vip Package" />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                My Vip Package
              </span>
            </li>
          </Link>

          <Link to="PaymentHistory">
            <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-2">
              <img src={myPondIcon} alt="My Vip Package" />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Payment History
              </span>
            </li>
          </Link>

          
         
          {/* Log Out */}
          <Link to="#">
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
          </Link>
        </ul>
      </div>

      <div className="flex-1 h-full">{/* Add Routes or content here */}</div>
    </div>
  );
};

export default ShopSideBar;
