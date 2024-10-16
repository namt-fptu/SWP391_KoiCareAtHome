// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";

const FoodCalculator = () => {
  const [selectedGrowth, setSelectedGrowth] = useState("medium");
  const [selectedTemp, setSelectedTemp] = useState("13-16");
  const [totalWeight, setTotalWeight] = useState(""); // State để lưu tổng khối lượng cá Koi
  const [pondName, setPondName] = useState(""); // State để lưu tên hồ

  return (
    <div className="flex h-screen bg-gray-900 text-white p-8">
      {/* Main Content */}
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-8">Food Calculator</h1>

        {/* Pond selection */}
        <div className="mb-8">
          <h2 className="text-lg font-bold">Select pond</h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Enter pond name"
              value={pondName}
              onChange={(e) => setPondName(e.target.value)}
              className="px-4 py-2 rounded bg-gray-700 text-white"
            />
            <button className="py-2 px-4 bg-blue-500 rounded">Select</button>
          </div>
        </div>

        {/* Total weight input */}
        <div className="mb-8">
          <h2 className="text-lg font-bold">Total weight of Kois in pond:</h2>
          <input
            type="number"
            placeholder="Enter total weight in grams"
            value={totalWeight}
            onChange={(e) => setTotalWeight(e.target.value)}
            className="px-4 py-2 rounded bg-gray-700 text-white mt-2 w-full"
          />
        </div>

        {/* Growth selection */}
        <div className="mb-8">
          <h2 className="text-lg font-bold">Desired growth</h2>
          <div className="flex space-x-4">
            {["low", "medium", "high"].map((growth) => (
              <button
                key={growth}
                className={`py-2 px-4 rounded ${
                  selectedGrowth === growth ? "bg-blue-500" : "bg-gray-700"
                }`}
                onClick={() => setSelectedGrowth(growth)}
              >
                {growth.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Temperature selection */}
        <div className="mb-8">
          <h2 className="text-lg font-bold">Water temperature</h2>
          <div className="grid grid-cols-5 gap-4">
            {["6-8", "9-12", "13-16", "17-20", "21-28"].map((temp) => (
              <button
                key={temp}
                className={`py-2 px-4 rounded ${
                  selectedTemp === temp ? "bg-blue-500" : "bg-gray-700"
                }`}
                onClick={() => setSelectedTemp(temp)}
              >
                {temp}°
              </button>
            ))}
          </div>
        </div>

        {/* Feeding information */}
        <div className="mt-8">
          <h2 className="text-lg font-bold">Feeding information</h2>
          <p>
            The recommended amount of food should be split evenly into 3-5
            feedings per day. This way the koi will ingest the food better.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FoodCalculator;
