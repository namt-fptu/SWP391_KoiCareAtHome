import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const SideBar = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate(); // Create a navigate function

  const Menus = [
    { title: "Overview", path: "Overview" },
    { title: "My Pond", path: "MyPond" },
    { title: "My Koi Fish", path: "MyKoiFish", gap: true },
    { title: "Water Parameter", path: "WaterParameter" },
    { title: "Food Calculator", path: "FoodCalculator" },
    { title: "Salt Calculator", path: "SaltCalculator" },
    { title: "Statistics", path: "Statistics", gap: true },
    { title: "About Koi", path: "AboutKoi" },
    { title: "Log Out", path: "/", gap: true }, // Add Log Out item
  ];

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
    <div className="flex h-screen">
      <div
        className={`sidebar ${
          open ? "w-72" : "w-20"
        } bg-black h-full p-5 pt-8 relative duration-300`}
      >
        <img
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-black border-2 rounded-full ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex gap-x-4 items-center">
          <img
            src="../src/assets/logo.png"
            className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`}
          />
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            KoiF
          </h1>
        </div>
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <Link
              to={Menu.title === "Log Out" ? "#" : Menu.path} // Prevent default navigation for Log Out
              key={index}
              onClick={Menu.title === "Log Out" ? handleLogout : undefined} // Handle logout click
            >
              <li
                className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
              ${Menu.gap ? "mt-9" : "mt-2"} ${index === 0 && "bg-light-white"}`}
              >
                <img src={`../assets/${Menu.src}.png`} />
                <span
                  className={`${!open && "hidden"} origin-left duration-200`}
                >
                  {Menu.title}
                </span>
              </li>
            </Link>
          ))}
        </ul>
      </div>

      <div className="flex-1 h-full">
        {/* Add Routes or content here */}
      </div>
    </div>
  );
};

export default SideBar;
