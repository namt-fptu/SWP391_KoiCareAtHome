import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo koi care.png";

function Header() {
  const navigate = useNavigate();
  return (
    <div className="contents-wrapper max-w-screen-2xl text-base mx-auto px-8 bg-slate-950">
      <header className="py-6 mx-10">
        <nav className="flex flex-row justify-between items-center">
          <div className="logo basis-1/6 flex items-center text-center">
            <Link to={"/"}>
              <img src={Logo} alt="" width={60} />
            </Link>
            <span className="ml-2 text-lg text-white">KoiF</span>
          </div>

          <ul className="basis-4/6 flex items-center justify-center gap-8 text-sm text-gray-400">
            <li className="top-menu-item">
              <a href="home">Home</a>
            </li>
            <li className="top-menu-item">
              <a href="features">Features</a>
            </li>
            <li className="top-menu-item">
              <a href="advertisements">Advertisements</a>
            </li>
            <li className="top-menu-item">
              <a href="blogs">Blogs</a>
            </li>
            <li className="top-menu-item">
              <a href="aboutus">About us</a>
            </li>
            <li className="top-menu-item">
              <a href="#">Contact</a>
            </li>
          </ul>

          <div className="basis-1/6 flex justify-end">
            <Button
              type="primary"
              onClick={() => {
                navigate("/signin");
              }}
            >
              Sign In
            </Button>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Header;
