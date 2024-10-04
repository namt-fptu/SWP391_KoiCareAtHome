import Header from "../../component/header";
import Footer from "../../component/footer";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import landing1 from "../../assets/landing 1.png";

const Home = () => {
  const navigate = useNavigate();
  const features = [
    {
      title: "Track size of your koi",
      description: "Daily track and monitor the growth of your koi fish.",
    },
    {
      title: "Manage all your fish",
      description: "Keep track and overview of all your koi fish in one app.",
    },
    {
      title: "Food diary",
      description:
        "Track and save the type and number of feeding moments and feeding details.",
    },
    {
      title: "Save photos",
      description:
        "Save photos for all of your koi fish to monitor growth and health of your koi fish.",
    },
    {
      title: "Monitor your pond",
      description:
        "Daily monitor the quality and health (ammonia, nitrite, phosphate etc.) of your koi ponds.",
    },
    {
      title: "Simple charts",
      description:
        "Simple charts allow you to easily see how your koi are growing and developing.",
    },
  ];
  return (
    <div className="home bg-gray-950 text-slate-50">
      <Header />

      <div className="main-content max-w-screen-2xl text-base mx-auto px-8 flex items-center justify-center gap-10">
        <div className="basis-1/2">
          <h1 className="text-5xl font-bold mb-4">Manage & monitor your Koi</h1>
          <p className="mb-6 text-lg">
            Would you like to monitor the growth, feeding and health of your
            Koi? Log from anywhere, always available, including photos and easy
            charts.
          </p>
          <Button
            type="primary"
            onClick={() => {
              navigate("/signin");
            }}
          >
            Sign In Now
          </Button>
        </div>
        <div className="basis-1/2">
          <img id="carouselImage" src={landing1} alt="" />
        </div>
      </div>
      <div className="features mt-8 px-8 flex flex-col items-center justify-center">
        <p className="text-5xl font-bold mb-10">KoiF allows you to:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl place-items-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300"
            >
              <h2 className="text-xl font-bold mb-2">{feature.title}</h2>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="blog px-8 max-w-screen-2xl ">
        <h1 className="text-5xl font-bold mb-4 text-center mt-8">
          Read Our Blog
        </h1>
        <span className="mb-6 text-lg">Most Popular Posts</span>
      </div>
      <div className="term"></div>

      <div className="aboutus mt-8 px-8 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold mb-10">About Us</h1>
        <p className="mb-6 indent-8">
          Welcome to <strong>KoiF</strong>, your trusted partner for Koi fish
          care services at home. We understand the passion and dedication
          required to maintain the beauty and health of Koi fish, and {`we're`}{" "}
          here to make that journey easier for you.
        </p>
        <p className="mb-6 indent-8">
          Our platform acts as a bridge between Koi enthusiasts and professional
          care solutions. With our advanced tools, we help you accurately
          calculate key parameters for your Koi fish and pond, ensuring a
          thriving aquatic environment. From water quality to feeding schedules,
          we provide the insights you need to keep your Koi happy and healthy.
        </p>
        <p className="mb-6 indent-8">
          In addition to expert advice, we also connect you with top-tier
          products that are carefully selected and advertised on our platform,
          making it simple to find the right equipment and supplies for your
          pond.
        </p>
        <p className="mb-6 indent-8">
          Whether {`you're`} a seasoned Koi keeper or just starting out,{" "}
          <strong>KoiF</strong> is here to support you every step of the way.
          Let us take the guesswork out of Koi care, so you can focus on
          enjoying the vibrant beauty of your fish.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
