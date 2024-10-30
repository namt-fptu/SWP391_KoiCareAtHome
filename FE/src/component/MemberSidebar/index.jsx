import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useNavigate
import logoimg from "./../../assets/logo koi care.png";
import controlButton from "./../../assets/control.png";
import overviewIcon from "./../../assets/Logo sidebar/overview.png"; // Thêm icon cho Overview
import myPondIcon from "./../../assets/Logo sidebar/myPond.png"; // Thêm icon cho MyPond
import myKoiFishIcon from "./../../assets/Logo sidebar/myKoiFish.png"; // Thêm icon cho My Koi Fish
import waterParamIcon from "./../../assets/Logo sidebar/waterParameter.png"; // Thêm icon cho Water Parameter
import foodCalcIcon from "./../../assets/Logo sidebar/foodCalculator.png"; // Thêm icon cho Food Calculator
import saltCalcIcon from "./../../assets/Logo sidebar/saltCalculator.png"; // Thêm icon cho Salt Calculator
import statsIcon from "./../../assets/Logo sidebar/statistics.png"; // Thêm icon cho Statistics
import aboutKoiIcon from "./../../assets/Logo sidebar/aboutKoi.png"; // Thêm icon cho About Koi
import logOutIcon from "./../../assets/Logo sidebar/logout.png"; // Thêm icon cho Log Out
import { useAuthStore } from "../../page/(auth)/store";

const MemberSideBar = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // Track current path
  const { logout } = useAuthStore();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const menuItems = [
    { to: "Overview", icon: overviewIcon, label: "Overview" },
    { to: "MyPond", icon: myPondIcon, label: "My Pond" },
    { to: "MyKoiFish", icon: myKoiFishIcon, label: "My Koi Fish" },
    { to: "WaterParameter", icon: waterParamIcon, label: "Water Parameter" },
    { to: "KoiReport", icon: waterParamIcon, label: "Koi Report" },
    { to: "FoodCalculator", icon: foodCalcIcon, label: "Food Calculator" },
    { to: "SaltCalculator", icon: saltCalcIcon, label: "Salt Calculator" },
    { to: "Statistics", icon: statsIcon, label: "Statistics" },
    { to: "Blog", icon: aboutKoiIcon, label: "Blog" },
    { to: "Recomendations", icon: aboutKoiIcon, label: "Recomendations" },
    { to: "AboutKoi", icon: aboutKoiIcon, label: "About Koi" },
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

export default MemberSideBar;
