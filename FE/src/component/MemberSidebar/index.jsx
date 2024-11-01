import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaFish,
  FaUniversity,
  FaWater,
  FaClipboard,
  FaCalculator,
  FaChartBar,
  FaBlog,
  FaThumbsUp,
  FaUser,
  FaInfoCircle,
  FaSignOutAlt,
} from "react-icons/fa"; // Add icons
import logoimg from "./../../assets/logo koi care.png";
import controlButton from "./../../assets/control.png";
import { useAuthStore } from "../../page/(auth)/store";

const MemberSideBar = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const menuItems = [
    { to: "Overview", icon: <FaHome />, label: "Overview" },
    { to: "MyPond", icon: <FaUniversity />, label: "My Pond" },
    { to: "MyKoiFish", icon: <FaFish />, label: "My Koi Fish" },
    { to: "WaterParameter", icon: <FaWater />, label: "Water Parameter" },
    { to: "KoiReport", icon: <FaClipboard />, label: "Koi Report" },
    { to: "FoodCalculator", icon: <FaCalculator />, label: "Food Calculator" },
    { to: "SaltCalculator", icon: <FaCalculator />, label: "Salt Calculator" },
    { to: "Statistics", icon: <FaChartBar />, label: "Statistics" },
    { to: "Blog", icon: <FaBlog />, label: "Blog" },
    { to: "Recomendations", icon: <FaThumbsUp />, label: "Recommendations" },
    { to: "MemberProfile", icon: <FaUser />, label: "Member Profile" },
    { to: "AboutKoi", icon: <FaInfoCircle />, label: "About Koi" },
  ];

  return (
    <div className="flex h-auto">
      <div
        className={`sidebar ${open ? "w-72" : "w-20"
          } bg-black h-full p-5 pt-8 relative duration-300`}
      >
        <img
          src={controlButton}
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-black border-2 rounded-full ${!open && "rotate-180"
            }`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex gap-x-4 items-center">
          <Link to={"/"}>
            <img
              src={logoimg}
              alt=""
              width={60}
              className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"
                }`}
            />
          </Link>
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${!open && "scale-0"
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
                  ${location.pathname.includes(item.to)
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
            <FaSignOutAlt />
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

export default MemberSideBar;
