import React, { useState } from 'react';

const SaltCalculator = () => {
  const [pondVolume, setPondVolume] = useState(0);
  const [currentConcentration, setCurrentConcentration] = useState(0);
  const [desiredConcentration, setDesiredConcentration] = useState(0);
  const [waterChange, setWaterChange] = useState(0);

  return (
    <div className="flex h-full bg-gray-900 text-white min-h-screen p-8">
      <div className="w-full max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Salt Calculator</h1>

        {/* Pond Selector */}
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold">Main pond</h2>
          <select className="bg-gray-700 text-white p-2 rounded mt-2">
            <option>Main pond</option>
            <option>Pond 1</option>
            <option>Pond 2</option>
          </select>
        </div>

        {/* Pond Volume */}
        <div className="mb-8">
          <h3 className="text-lg">Pond volume: {pondVolume} liters</h3>
          <input
            type="range"
            min="0"
            max="5000"
            value={pondVolume}
            onChange={(e) => setPondVolume(e.target.value)}
            className="w-full mt-2"
          />
        </div>

        {/* Current Concentration */}
        <div className="mb-8">
          <h3 className="text-lg">Current concentration: {currentConcentration}%</h3>
          <input
            type="range"
            min="0"
            max="2"
            step="0.01"
            value={currentConcentration}
            onChange={(e) => setCurrentConcentration(e.target.value)}
            className="w-full mt-2"
          />
        </div>

        {/* Desired Concentration */}
        <div className="mb-8">
          <h3 className="text-lg">Desired concentration: {desiredConcentration}%</h3>
          <input
            type="range"
            min="0"
            max="2"
            step="0.01"
            value={desiredConcentration}
            onChange={(e) => setDesiredConcentration(e.target.value)}
            className="w-full mt-2"
          />
        </div>

        {/* Water Change */}
        <div className="mb-8">
          <h3 className="text-lg">Water change: {waterChange}%</h3>
          <input
            type="range"
            min="0"
            max="100"
            value={waterChange}
            onChange={(e) => setWaterChange(e.target.value)}
            className="w-full mt-2"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Calculate
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaltCalculator;
