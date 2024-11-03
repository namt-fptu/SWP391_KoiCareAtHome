import { Link } from "react-router-dom";
import {
  FaFish,
  FaUniversity,
  FaWater,
  FaClipboard,
  FaCalculator,
  FaChartBar,
  FaBlog,
  FaThumbsUp,
  FaUser,
  FaInfoCircle
} from "react-icons/fa"; // Add icons for each button as needed
import background from "./../../assets/wallpaper.jpg";

const MemberOverview = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Adds a dark overlay
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Centered Overview Title */}
      <h2 className="text-white text-4xl font-bold text-center mb-10">Overview</h2>

      {/* Button Grid Layout */}
      <div className="grid grid-cols-3 gap-5 w-full max-w-3xl">
        <Link to="/MyPond">
          <button className="bg-blue-600 rounded-lg text-white h-32 w-full hover:bg-blue-700 shadow-md flex flex-col items-center justify-center">
            <FaUniversity size={30} />
            <span className="mt-2">My Pond</span>
          </button>
        </Link>
        <Link to="/MyKoiFish">
          <button className="bg-blue-600 rounded-lg text-white h-32 w-full hover:bg-blue-700 shadow-md flex flex-col items-center justify-center">
            <FaFish size={30} />
            <span className="mt-2">My Koi Fish</span>
          </button>
        </Link>
        <Link to="/WaterParameter">
          <button className="bg-blue-600 rounded-lg text-white h-32 w-full hover:bg-blue-700 shadow-md flex flex-col items-center justify-center">
            <FaWater size={30} />
            <span className="mt-2">Water Parameters</span>
          </button>
        </Link>
        <Link to="/KoiReport">
          <button className="bg-blue-600 rounded-lg text-white h-32 w-full hover:bg-blue-700 shadow-md flex flex-col items-center justify-center">
            <FaClipboard size={30} />
            <span className="mt-2">Koi Report</span>
          </button>
        </Link>
        <Link to="/FoodCalculator">
          <button className="bg-blue-600 rounded-lg text-white h-32 w-full hover:bg-blue-700 shadow-md flex flex-col items-center justify-center">
            <FaCalculator size={30} />
            <span className="mt-2">Food Calculator</span>
          </button>
        </Link>
        <Link to="/SaltCalculator">
          <button className="bg-blue-600 rounded-lg text-white h-32 w-full hover:bg-blue-700 shadow-md flex flex-col items-center justify-center">
            <FaCalculator size={30} />
            <span className="mt-2">Salt Calculator</span>
          </button>
        </Link>
        <Link to="/Blog">
          <button className="bg-blue-600 rounded-lg text-white h-32 w-full hover:bg-blue-700 shadow-md flex flex-col items-center justify-center">
            <FaBlog size={30} />
            <span className="mt-2">Blog</span>
          </button>
        </Link>
        <Link to="/Recomendations">
          <button className="bg-blue-600 rounded-lg text-white h-32 w-full hover:bg-blue-700 shadow-md flex flex-col items-center justify-center">
            <FaThumbsUp size={30} />
            <span className="mt-2">Recommendations</span>
          </button>
        </Link>
        <Link to="/Statistics">
          <button className="bg-blue-600 rounded-lg text-white h-32 w-full hover:bg-blue-700 shadow-md flex flex-col items-center justify-center">
            <FaChartBar size={30} />
            <span className="mt-2">Statistics</span>
          </button>
        </Link>
        <Link to="/MemberProfile">
          <button className="bg-blue-600 rounded-lg text-white h-32 w-full hover:bg-blue-700 shadow-md flex flex-col items-center justify-center">
            <FaUser size={30} />
            <span className="mt-2">Member Profile</span>
          </button>
        </Link>
        <Link to="/AboutKoi">
          <button className="bg-blue-600 rounded-lg text-white h-32 w-full hover:bg-blue-700 shadow-md flex flex-col items-center justify-center">
            <FaInfoCircle size={30} />
            <span className="mt-2">About Koi</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MemberOverview;
