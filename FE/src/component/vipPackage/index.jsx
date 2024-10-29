import React, { useEffect, useState } from "react";
import api from "../../config/axios"; // Axios instance configured with base URL

const VipPackage = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await api.get("/PostPackage/getPackage");
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  return (
    <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 text-white">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 md:gap-8">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="divide-y divide-gray-200 rounded-2xl border border-gray-200 shadow-sm"
          >
            <div className="p-6 sm:px-8">
              <h2 className="text-lg font-medium text-white-700">
                {pkg.name}
                <span className="sr-only"> Plan</span>
              </h2>
              <p className="mt-2 text-white-700">{pkg.name}</p>
              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-white-700 sm:text-4xl">
                  {pkg.price.toLocaleString()} vnđ
                </strong>
              </p>
              <a
                className="mt-4 block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-center text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 sm:mt-6"
                href="/ShopPost"
              >
                Get Started
              </a>
            </div>
            <div className="p-6 sm:px-8">
              <p className="text-lg font-medium text-white-700 sm:text-xl">
                {`What's`} included:
              </p>
              <ul className="mt-2 space-y-2 sm:mt-4">
                <li className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 text-indigo-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  <span className="text-white-700">Duration: {pkg.duration} days</span>
                </li>                
              </ul> 
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VipPackage;
