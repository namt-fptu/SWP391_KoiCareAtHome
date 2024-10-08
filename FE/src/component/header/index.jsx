import { Button } from "antd";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import Logo from "../../assets/logo koi care.png";

function Header() {
  const navigate = useNavigate();
  return (
    <div className="contents-wrapper max-w-screen-2xl text-base mx-auto px-8 bg-slate-950">
      <header className="sticky top-0 py-6 mx-10 bg-slate-950 z-50">
        <nav className="flex flex-row justify-between items-center">
          <div className="logo basis-1/6 flex items-center text-center">
            <RouterLink to={"/"}>
              <img src={Logo} alt="Logo" width={60} />
            </RouterLink>
            <span className="ml-2 text-lg text-white">KoiF</span>
          </div>

          <ul className="basis-4/6 flex items-center justify-center gap-8 text-sm text-gray-400">
            <li className="top-menu-item">
              <ScrollLink to="home" smooth={true} duration={500}>
                Home
              </ScrollLink>
            </li>
            <li className="top-menu-item">
              <ScrollLink to="features" smooth={true} duration={500}>
                Features
              </ScrollLink>
            </li>
            <li className="top-menu-item">
              <ScrollLink to="advertisements" smooth={true} duration={500}>
                Advertisements
              </ScrollLink>
            </li>
            <li className="top-menu-item">
              <ScrollLink to="blogs" smooth={true} duration={500}>
                Blogs
              </ScrollLink>
            </li>
            <li className="top-menu-item">
              <ScrollLink to="aboutus" smooth={true} duration={500}>
                About us
              </ScrollLink>
            </li>
            <li className="top-menu-item">
              <ScrollLink to="footer" smooth={true} duration={500}>
                Contact
              </ScrollLink>
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
