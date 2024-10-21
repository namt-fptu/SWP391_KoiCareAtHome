import React, { useState, useEffect } from "react";
import LineChart from "../Chart";
import api from "../../config/axios";
import { message,Row, Col  } from "antd";

const Statistics = () => {
  const [lengthData, setLengthData] = useState({ labels: [], datasets: [] });
  const [weightData, setWeightData] = useState({ labels: [], datasets: [] });
  const [waterReport, setWaterReport] = useState(null);
  const [waterStandard, setWaterStandard] = useState(null);
  const [ponds, setPonds] = useState([]);
  const [selectedPond, setSelectedPond] = useState(null);
  const [allFishData, setAllFishData] = useState([]);
  const [selectedFish, setSelectedFish] = useState(null);
  const [selectedDataType, setSelectedDataType] = useState("length");
  const id = sessionStorage.getItem("id");
  const [chartType, setChartType] = useState('default');

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
      // Fetch data from the correct API endpoint
      const reportResponse = await api.get(`/KoiGrowthReport/getKoiStatistic/${fishId}`);
      console.log("Growth Report Data:", reportResponse.data); // Check the structure
  
      // Assuming there's no need for a separate "standard" API call
      const growthData = reportResponse.data;
  
      // Process the data and update the charts
      updateUserData(growthData);
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

  const updateUserData = (growthReport) => {
    // Normalize data from API response
    const correctedGrowthReport = growthReport.map(item => ({
      length: item.length || 0, // Ensure length field exists
      weight: item.weight || 0, // Ensure weight field exists
      maxWeight: item.maxWeight || 0, // Ensure maxWeight exists
      minWeight: item.minWeight || 0, // Ensure minWeight exists
      maxLength: item.maxLength || 0, // Ensure maxLength exists
      minLength: item.minLength || 0, // Ensure minLength exists
      stage: item.stage || 'N/A', // Label each point (optional)
    }));
  
    // Generate labels based on the 'stage' field
    const labels = correctedGrowthReport.map(item => item.stage);
  
    // Prepare length datasets
    const lengthDatasets = [
      {
        label: "Length",
        data: correctedGrowthReport.map(item => item.length),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
      {
        label: "Max Length",
        data: correctedGrowthReport.map(item => item.maxLength),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
      {
        label: "Min Length",
        data: correctedGrowthReport.map(item => item.minLength),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 2,
      },
    ];
  
    // Prepare weight datasets
    const weightDatasets = [
      {
        label: "Weight",
        data: correctedGrowthReport.map(item => item.weight),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
      {
        label: "Max Weight",
        data: correctedGrowthReport.map(item => item.maxWeight),
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 2,
      },
      {
        label: "Min Weight",
        data: correctedGrowthReport.map(item => item.minWeight),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ];
  
    // Update the chart states
    setLengthData({ labels, datasets: lengthDatasets });
    setWeightData({ labels, datasets: weightDatasets });
  };
  

  const handleDataTypeChange = (type) => {
    setSelectedDataType(type);
  };
  

  return (
    <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen flex flex-col">
    <h1 className="text-3xl font-bold mb-4 text-white">Statistics</h1>
    <p className="text-white mb-8">Statistics about your fish tank and Koi fish.</p>

    {/* Pond and Fish selection */}
    <Row gutter={16} className="max-w-sm mx-auto mb-8">
      {/* Pond Selection */}
      <Col span={12}>
        <label htmlFor="pondSelect" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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
      </Col>

      {/* Fish Selection */}
      {selectedPond && allFishData.length > 0 && (
        <Col span={12}>
          <label htmlFor="fishSelect" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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
        </Col>
      )}
    </Row>

    {/* Chart type selection, only visible if a fish is selected */}
    {selectedFish && (
      <div className="max-w-sm mx-auto mb-8">
        <label className="block mb-2 text-sm font-medium text-white dark:text-white">
          Select Chart Type:
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => setChartType("pond")}
            className={`px-4 py-2 rounded-lg ${chartType === "pond" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-900"}`}
          >
            Pond Chart
          </button>
          <button
            onClick={() => {
              setChartType("fish");
              setSelectedDataType('length'); // Reset to length when switching to fish chart
            }}
            className={`px-4 py-2 rounded-lg ${chartType === "fish" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-900"}`}
          >
            Fish Chart
          </button>
        </div>
      </div>
    )}

    {/* Conditional rendering for fish chart type selection */}
    {chartType === "fish" && selectedFish && (
      <div className="max-w-sm mx-auto mb-8">
        <label className="block mb-2 text-sm font-medium text-white dark:text-white">
          Select Data Type:
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedDataType('length')}
            className={`px-4 py-2 rounded-lg ${selectedDataType === "length" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-900"}`}
          >
            Length
          </button>
          <button
            onClick={() => setSelectedDataType('weight')}
            className={`px-4 py-2 rounded-lg ${selectedDataType === "weight" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-900"}`}
          >
            Weight
          </button>
        </div>
      </div>
    )}

    <div className="flex flex-col items-center">
      {chartType === "pond" && selectedPond && (
        <div className="w-[700px] bg-white p-5 rounded-lg border-2 border-gray-300">
          <LineChart chartData={pondData} />
        </div>
      )}

      {chartType === "fish" && selectedFish && (
        <div className="w-[700px] bg-white p-5 rounded-lg border-2 border-gray-300">
          {selectedDataType === "length" && <LineChart chartData={lengthData} />}
          {selectedDataType === "weight" && <LineChart chartData={weightData} />}
        </div>
      )}

      {!chartType && (
        <div className="text-white">Please select a chart type to display.</div>
      )}
    </div>
  </div>
);
};

export default Statistics;
