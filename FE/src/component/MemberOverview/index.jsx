import { Link } from "react-router-dom";
import backgroud from "./../../assets/wallpaper.jpg";
const MemberOverview = () => {
  return (
    <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen"
    style={{
      backgroundImage: `url(${backgroud})`, // Set the background image
      backgroundSize: "cover", // Cover the entire container
      backgroundPosition: "center", // Center the image
    }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-black text-3xl font-bold \">Overview</h2>
      </div>

      <div className="grid grid-cols-2 gap-5 mt-8">
        <Link to="/MyPond">
          <button className="bg-blue-600 rounded-md text-white p-4 hover:bg-blue-700 w-full">
            My Pond
          </button>
        </Link>
        <Link to="/MyKoiFish">
          <button className="bg-blue-600 rounded-md text-white p-4 hover:bg-blue-700 w-full">
            My Koi Fish
          </button>
        </Link>
        <Link to="/WaterParameter">
          <button className="bg-blue-600 rounded-md text-white p-4 hover:bg-blue-700 w-full">
            Water Parameters
          </button>
        </Link>
        
        <Link to="/KoiReport">
          <button className="bg-blue-600 rounded-md text-white p-4 hover:bg-blue-700 w-full">
          Koi Report
          </button>
        </Link>
        <Link to="/FoodCalculator">
          <button className="bg-blue-600 rounded-md text-white p-4 hover:bg-blue-700 w-full">
            Food Calculator
          </button>
        </Link>
        <Link to="/SaltCalculator">
          <button className="bg-blue-600 rounded-md text-white p-4 hover:bg-blue-700 w-full">
            Salt Calculator
          </button>
        </Link>
        <Link to="/Blog">
          <button className="bg-blue-600 rounded-md text-white p-4 hover:bg-blue-700 w-full">
            Blog
          </button>
        </Link>
        <Link to="/Recomendations">
          <button className="bg-blue-600 rounded-md text-white p-4 hover:bg-blue-700 w-full">
          Recomendations
          </button>
        </Link>
        <Link to="/Statistics">
          <button className="bg-blue-600 rounded-md text-white p-4 hover:bg-blue-700 w-full">
            Statistics
          </button>
        </Link>
        <Link to="/MemberProfile">
          <button className="bg-blue-600 rounded-md text-white p-4 hover:bg-blue-700 w-full">
          Member Profile
          </button>
        </Link>
        <Link to="/AboutKoi">
          <button className="bg-blue-600 rounded-md text-white p-4 hover:bg-blue-700 w-full">
            About Koi
          </button>
        </Link>

      </div>
    </div>
  );
};

export default MemberOverview;
