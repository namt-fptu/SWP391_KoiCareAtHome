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

      <div id="advertisements"
        className="mt-8 px-8 flex flex-col items-center justify-center">
        <div class="flex flex-col items-center mt-8">
          <h1 className="text-5xl font-bold mb-2">Advertisements</h1>
          <div class="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-stretch md:grid-cols-3 md:gap-8">
              <div class="divide-y divide-gray-200 rounded-2xl border border-gray-200 shadow-sm">
                <div class="p-6 sm:px-8">
                  <h2 class="text-lg font-medium text-white-700 ">
                    Vip 1<span class="sr-only ">advertisements</span>
                  </h2>

                  <p class="mt-2 text-white-700">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>

                  <p class="mt-2 sm:mt-4">
                    <strong class="text-3xl font-bold text-white-700 sm:text-4xl">
                      {" "}
                      20${" "}
                    </strong>

                    <span class="text-sm font-medium text-white-700">
                      /month
                    </span>
                  </p>

                  <a
                    class="mt-4 block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-center text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 sm:mt-6"
                    href="/signin"
                  >
                    Get Started
                  </a>
                </div>

                <div class="p-6 sm:px-8">
                  <p class="text-lg font-medium text-white-700 sm:text-xl">
                    What's included:
                  </p>

                  <ul class="mt-2 space-y-2 sm:mt-4">
                    <li class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5 text-indigo-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>

                      <span class="text-white-700"> 10 users </span>
                    </li>

                    <li class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5 text-indigo-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>

                      <span class="text-white-700"> 2GB of storage </span>
                    </li>

                    <li class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5 text-indigo-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>

                      <span class="text-white-700"> Email support </span>
                    </li>

                    <li class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5 text-red-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>

                      <span class="text-white-700"> Help center access </span>
                    </li>

                    <li class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5 text-red-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>

                      <span class="text-white-700"> Phone support </span>
                    </li>

                    <li class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5 text-red-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>

                      <span class="text-white-700"> Community access </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="divide-y divide-gray-200 rounded-2xl border border-gray-200 shadow-sm">
                <div class="p-6 sm:px-8">
                  <h2 class="text-lg font-medium text-white-700">
                    Vip 2<span class="sr-only">Plan</span>
                  </h2>

                  <p class="mt-2 text-white-700">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>

                  <p class="mt-2 sm:mt-4">
                    <strong class="text-3xl font-bold text-white-700 sm:text-4xl">
                      {" "}
                      30${" "}
                    </strong>

                    <span class="text-sm font-medium text-white-700">
                      /month
                    </span>
                  </p>

                  <a
                    class="mt-4 block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-center text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 sm:mt-6"
                    href="/signin"
                  >
                    Get Started
                  </a>
                </div>

                <div class="p-6 sm:px-8">
                  <p class="text-lg font-medium text-white-700 sm:text-xl">
                    What's included:
                  </p>

                  <ul class="mt-2 space-y-2 sm:mt-4">
                    <li class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5 text-indigo-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>

                      <span class="text-white-700"> 20 users </span>
                    </li>

                    <li class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5 text-indigo-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>

                      <span class="text-white-700"> 5GB of storage </span>
                    </li>

                    <li class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5 text-indigo-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>

                      <span class="text-white-700"> Email support </span>
                    </li>

                    <li class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5 text-indigo-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>

                      <span class="text-white-700"> Help center access </span>
                    </li>

                    <li class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5 text-red-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>

                      <span class="text-white-700"> Phone support </span>
                    </li>

                    <li class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5 text-red-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>

                      <span class="text-white-700"> Community access </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="divide-y divide-gray-200 rounded-2xl border border-gray-200 shadow-sm">
                <div class="p-6 sm:px-8">
                  <h2 class="text-lg font-medium text-white-700">
                    Enterprise
                    <span class="sr-only">Plan</span>
                  </h2>

                  <p class="mt-2 text-white-700">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>

                  <p class="mt-2 sm:mt-4">
                    <strong class="text-3xl font-bold text-white-700 sm:text-4xl">
                      {" "}
                      100${" "}
                    </strong>

                    <span class="text-sm font-medium text-white-700">
                      /month
                    </span>
                  </p>

                  <a
                    class="mt-4 block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-center text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 sm:mt-6"
                    href="/signin"
                  >
                    Get Started
                  </a>
                </div>

                <div class="p-6 sm:px-8">
                  <p class="text-lg font-medium text-white-700 sm:text-xl">
                    What's included:
                  </p>

                  <ul class="mt-2 space-y-2 sm:mt-4">
                    <li class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5 text-indigo-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>

                      <span class="text-white-700"> 50 users </span>
                    </li>

                    <li class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5 text-indigo-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>

                      <span class="text-white-700"> 20GB of storage </span>
                    </li>

                    <li class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5 text-indigo-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>

                      <span class="text-white-700"> Email support </span>
                    </li>

                    <li class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5 text-indigo-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>

                      <span class="text-white-700"> Help center access </span>
                    </li>

                    <li class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5 text-indigo-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>

                      <span class="text-white-700"> Phone support </span>
                    </li>

                    <li class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5 text-indigo-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>

                      <span class="text-white-700"> Community access </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="aboutus"
        className="mt-8 px-8 flex flex-col items-center justify-center"
      >
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
