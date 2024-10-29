import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useNavigate
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
  const navigate = useNavigate();
  const location = useLocation(); // Track current path
  const { logout } = useAuthStore();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const menuItems = [
    { to: "ShopOverview", icon: overviewIcon, label: "Overview" },
    { to: "ShopPost", icon: shopPost, label: "My Post" },
    { to: "ShopProduct", icon: myPondIcon, label: "My Product" },
    { to: "ShopVipPackage", icon: myPondIcon, label: "My Vip Package" },
    { to: "PaymentHistory", icon: myPondIcon, label: "Payment History" },
    { to: "ShopProfile", icon: myPondIcon, label: "Shop Profile" },
  ];

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
          {menuItems.map((item) => (
            <Link to={item.to} key={item.label}>
              <li
                className={`flex rounded-md p-2 cursor-pointer text-gray-300 text-sm items-center gap-x-4 mt-2 
                  ${
                    location.pathname.includes(item.to)
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-500"
                  }`}
              >
                <img src={item.icon} alt={item.label} />
                <span
                  className={`${!open && "hidden"} origin-left duration-200`}
                >
                  {item.label}
                </span>
              </li>
            </Link>
          ))}

          {/* Log Out */}
          <li
            className="flex rounded-md p-2 cursor-pointer hover:bg-red-400 text-gray-300 text-sm items-center gap-x-4 mt-9"
            onClick={() => {
              logout();
              handleLogout();
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

export default ShopSideBar;
