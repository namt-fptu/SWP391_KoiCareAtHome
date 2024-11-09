import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Avatar from "antd/es/avatar/avatar";
import {
  FaRegNewspaper,
  FaBoxOpen,
  FaStar,
  FaHistory,
  FaRegUserCircle,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa"; // import icons
import logoimg from "./../../assets/logo koi care.png";
import controlButton from "./../../assets/control.png";
import { useAuthStore } from "../../page/(auth)/store";
import api from "../../config/axios";

const ShopSideBar = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const { authUser, logout } = useAuthStore();
  const id = authUser.id;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  
  useEffect(() => {
    if (!id) {
      message.error("User not logged in. Unable to fetch posts.");
      return;
    }
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`/Account/getAccountById/${id}`);
        setUsername(response.data.name); // Set username
      } catch (error) {
        console.error("Error fetching user profile:", error);
        message.error("Failed to load profile information.");
      }
    };

    fetchUserProfile();
  }, [id]);

  const menuItems = [
    { to: "ShopOverview", icon: <FaHome size={20} />, label: "Overview" },
    { to: "ShopPost", icon: <FaRegNewspaper size={20} />, label: "My Post" },
    { to: "ShopProduct", icon: <FaBoxOpen size={20} />, label: "My Product" },
    {
      to: "ShopVipPackage",
      icon: <FaStar size={20} />,
      label: "My Vip Package",
    },
    {
      to: "PaymentHistory",
      icon: <FaHistory size={20} />,
      label: "Payment History",
    },
    {
      to: "ShopProfile",
      icon: <FaRegUserCircle size={20} />,
      label: "Shop Profile",
    },
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
              alt="Logo"
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
        <div className={`flex items-center gap-x-4 mt-8 ${!open && "hidden"}`}>
          <Avatar
            style={{ backgroundColor: "#808080" }}
            icon={<FaRegUserCircle />}
          />
          <span className="text-white font-semibold">{username}</span>
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
                {item.icon}
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
            <FaSignOutAlt size={20} />
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
