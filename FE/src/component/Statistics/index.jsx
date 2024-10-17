import React, { useState, useEffect } from "react";
import LineChart from "../Chart";
import api from "../../config/axios";
import { message } from "antd";

const Statistics = () => {
  const [lengthData, setLengthData] = useState({ labels: [], datasets: [] });
  const [weightData, setWeightData] = useState({ labels: [], datasets: [] });
  
  const [ponds, setPonds] = useState([]);
  const [selectedPond, setSelectedPond] = useState(null);
  const [allFishData, setAllFishData] = useState([]);
  const [growthReportData, setGrowthReportData] = useState([]);
  const [growthStandardData, setGrowthStandardData] = useState([]);
  const [selectedFish, setSelectedFish] = useState(null);
  const [selectedDataType, setSelectedDataType] = useState("length");

  const id = sessionStorage.getItem("id");

  const fetchUserPonds = async () => {
    try {
      const response = await api.get(`Pond/ponds/${id}`);
      setPonds(response.data);
    } catch (error) {
      console.error("Error fetching ponds:", error);
      message.error("Failed to fetch ponds.");
    }
  };

  useEffect(() => {
    if (!id) {
      message.error("User not logged in. Unable to fetch ponds.");
      return;
    }
    fetchUserPonds();
  }, [id]);

  const fetchKoiForPond = async (pondId) => {
    try {
      const response = await api.get(`KoiFish/koiFish/${pondId}`);
      if (response.data.length > 0) {
        setAllFishData(response.data);
      } else {
        setAllFishData([]);
        message.warning("No koi fish found in the selected pond.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setAllFishData([]);
        message.warning("No koi fish found for this pond.");
      } else {
        console.error("Error fetching koi fish:", error);
        message.error("Failed to fetch koi fish for the selected pond.");
      }
    }
  };

  useEffect(() => {
    if (selectedPond) {
      fetchKoiForPond(selectedPond);
    }
  }, [selectedPond]);

  const fetchKoiGrowthDataForFish = async (fishId) => {
    try {
      const reportResponse = await api.get(`/KoiGrowthReport/koiGrowthReport/${fishId}`);
      const standardResponse = await api.get("/KoiGrowthStandard/koiStandard");

      console.log("Growth Report Data:", reportResponse.data); // Check the structure
    console.log("Growth Standard Data:", standardResponse.data); // Check the structure

      setGrowthReportData(reportResponse.data);
      setGrowthStandardData(standardResponse.data);
      updateUserData(reportResponse.data, standardResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        message.warning("No growth data found for the selected fish.");
      } else {
        console.error("Error fetching growth data:", error);
        message.error("Failed to fetch growth data.");
      }
    }
  };

  const handlePondSelection = (event) => {
    const selectedPondId = event.target.value;
    setSelectedPond(selectedPondId);
    setAllFishData([]);
    setSelectedFish(null);
    setLengthData({ labels: [], datasets: [] });
    setWeightData({ labels: [], datasets: [] });
  };

  const handleFishSelection = (event) => {
    const selectedFishId = event.target.value;
    setSelectedFish(selectedFishId);

    if (selectedFishId) {
      fetchKoiGrowthDataForFish(selectedFishId);
    } else {
      setGrowthReportData([]);
      setGrowthStandardData([]);
      setLengthData({ labels: [], datasets: [] });
      setWeightData({ labels: [], datasets: [] });
    }
  };

  const updateUserData = (growthReport, growthStandard) => {
    const labels = growthReport.map(item => item.stage); // Ensure stages are mapped correctly
  
    // Prepare length datasets
    const lengthDatasets = [
      {
        label: "Length",
        data: growthReport.map(item => item.length), // Check if this data exists
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
      {
        label: "Standard Length",
        data: growthStandard.map(item => item.standardLength), // Check if this data exists
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ];
  
    // Prepare weight datasets with checks for existence
    const weightDatasets = [
      {
        label: "Weight",
        data: growthReport.map(item => item.weight || 0), // Ensure it falls back to 0 if missing
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
      {
        label: "Standard Weight",
        data: growthStandard.map(item => item.standardWeight || 0), // Ensure it falls back to 0 if missing
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 2,
      },
    ];
  
    // Set state for length and weight data
    setLengthData({ labels, datasets: lengthDatasets });
    setWeightData({ labels, datasets: weightDatasets });
  };
  

  const handleDataTypeChange = (type) => {
    setSelectedDataType(type);
  };

  return (
    <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-4 text-white">Statistics</h1>
      <p className="text-white mb-8">
        Statistics about your fish tank and Koi fish.
      </p>

      {/* Pond selection */}
      <form className="max-w-sm mx-auto mb-8">
        <label
          htmlFor="pondSelect"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select Pond:
        </label>
        <select
          id="pondSelect"
          onChange={handlePondSelection}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Choose Pond</option>
          {ponds.map((pond) => (
            <option key={pond.id} value={pond.id}>
              {pond.name}
            </option>
          ))}
        </select>
      </form>

      {/* Fish selection */}
      {selectedPond && allFishData.length > 0 && (
        <form className="max-w-sm mx-auto mb-8">
          <label
            htmlFor="fishSelect"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Select Fish:
          </label>
          <select
            id="fishSelect"
            onChange={handleFishSelection}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Choose Koi</option>
            {allFishData.map((fish) => (
              <option key={fish.id} value={fish.id}>
                {fish.koiName}
              </option>
            ))}
          </select>
        </form>
      )}

      {/* Data type selection with toggle buttons */}
      {selectedFish && (
        <div className="max-w-sm mx-auto mb-8">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Select Data Type:
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => handleDataTypeChange("length")}
              className={`px-4 py-2 rounded-lg ${selectedDataType === "length" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-900"}`}
            >
              Length
            </button>
            <button
              onClick={() => handleDataTypeChange("weight")}
              className={`px-4 py-2 rounded-lg ${selectedDataType === "weight" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-900"}`}
            >
              Weight
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center">
        {selectedFish ? (
          <>
            {selectedDataType === "length" && (
              <div className="w-[700px] bg-white p-5 rounded-lg border-2 border-gray-300">
                <LineChart chartData={lengthData} />
              </div>
            )}
            {selectedDataType === "weight" && (
              <div className="w-[700px] bg-white p-5 rounded-lg border-2 border-gray-300">
                <LineChart chartData={weightData} />
              </div>
            )}
          </>
        ) : (
          <div className="text-white">Please select a pond and fish to display the chart.</div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
