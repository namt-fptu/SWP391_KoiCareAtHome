import VipPackage from "../vipPackage";
import backgroud from "./../../assets/wallpaper.jpg";

const ShopVipPackage = () => {
  return (
    <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen"
      style={{
        backgroundImage: `url(${backgroud})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <div className="flex flex-col justify-between mb-5">
        <h2 className="text-white text-3xl font-bold">Packages</h2>
        <VipPackage />
      </div>
    </div>
  );
};

export default ShopVipPackage;
