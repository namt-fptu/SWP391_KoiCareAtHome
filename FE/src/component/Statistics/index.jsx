import React, { useState, useEffect } from "react";
import LineChart from "../Chart";
import api from "../../config/axios";
import { message, Row, Col } from "antd";
import { useAuthStore } from "../../page/(auth)/store";
import backgroud from "./../../assets/wallpaper.jpg";
const Statistics = () => {
  const [lengthData, setLengthData] = useState({ labels: [], datasets: [] });
  const [weightData, setWeightData] = useState({ labels: [], datasets: [] });
  const [pHValue, setPHValue] = useState({ labels: [], datasets: [] });
  const [hardness, setHardness] = useState({ labels: [], datasets: [] });
  const [temperature, setTemperature] = useState({ labels: [], datasets: [] });
  const [carbonDioxide, setCarbonDioxide] = useState({
    labels: [],
    datasets: [],
  });
  const [salt, setSalt] = useState({ labels: [], datasets: [] });
  const [nitrates, setNitrates] = useState({ labels: [], datasets: [] });
  const [nitrites, setNitrites] = useState({ labels: [], datasets: [] });
  const [ammonium, setAmmonium] = useState({ labels: [], datasets: [] });
  const [oxigen, setOxigen] = useState({ labels: [], datasets: [] });

  const [waterParametersData, setWaterParametersData] = useState({
    labels: [],
    datasets: [],
  });
  const [ponds, setPonds] = useState([]);
  const [selectedPond, setSelectedPond] = useState(null);
  const [allFishData, setAllFishData] = useState([]);
  const [selectedFish, setSelectedFish] = useState(null);
  const [selectedDataType, setSelectedDataType] = useState("length");
  // const id = sessionStorage.getItem("id");
  const { authUser } = useAuthStore();
  const id = authUser.id;
  const [chartType, setChartType] = useState("default");

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
      fetchWaterReportData(selectedPond);
    }
  }, [selectedPond]);

  const fetchKoiGrowthDataForFish = async (fishId) => {
    try {
      // Fetch data from the correct API endpoint
      const reportResponse = await api.get(
        `KoiGrowthReport/getKoiStatistic/${fishId}`
      );
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

  const fetchWaterReportData = async (pondId) => {
    try {
      const response = await api.get(`WaterReport/getWaterStatistic/${pondId}`);
      console.log("Water Report Data:", response.data);
      const waterData = response.data;
      updateWaterParametersData(waterData);
    } catch (error) {
      console.error("Full error response:", error.response); // Log full error
      if (error.response && error.response.status === 404) {
        message.warning("No water data found for the selected pond.");
      } else if (error.response) {
        message.error(`Failed to fetch water data: ${error.response.data}`);
      } else {
        console.error("Error water data:", error);
        message.error("Failed to fetch water data.");
      }
    }
  };

  const resetPondData = () => {
    const emptyData = { labels: [], datasets: [] };
    setLengthData(emptyData);
    setWeightData(emptyData);
    setOxigen(emptyData);
    setAmmonium(emptyData);
    setNitrites(emptyData);
    setNitrates(emptyData);
    setSalt(emptyData);
    setCarbonDioxide(emptyData);
    setTemperature(emptyData);
    setHardness(emptyData);
    setPHValue(emptyData);
  };

  const handlePondSelection = (event) => {
    const selectedPondId = event.target.value;
    setSelectedPond(selectedPondId);

    if (selectedPondId) {
      fetchWaterReportData(selectedPondId); // Fetch the water report data here
    } else {
      // If no pond is selected, reset all data
      resetPondData();
    }

    // Reset fish-related data
    setAllFishData([]);
    setSelectedFish(null);
  };

  const handleFishSelection = (event) => {
    const selectedFishId = event.target.value;
    setSelectedFish(selectedFishId);

    if (selectedFishId) {
      fetchKoiGrowthDataForFish(selectedFishId); // Fetch growth data for the selected fish
    } else {
      // If no fish is selected, reset the fish data
      setGrowthStandardData([]);
      resetPondData(); // Reset length and weight data
    }
  };

  const updateUserData = (growthReport) => {
    // Normalize data from API response
    const correctedGrowthReport = growthReport.map((item) => ({
      length: item.length || 0, // Ensure length field exists
      weight: item.weight || 0, // Ensure weight field exists
      maxWeight: item.maxWeight || 0, // Ensure maxWeight exists
      minWeight: item.minWeight || 0, // Ensure minWeight exists
      maxLength: item.maxLength || 0, // Ensure maxLength exists
      minLength: item.minLength || 0, // Ensure minLength exists
      stage: item.stage || "N/A", // Label each point (optional)
    }));

    // Generate labels based on the 'stage' field
    const labels = correctedGrowthReport.map((item) => item.stage);

    // Prepare length datasets
    const lengthDatasets = [
      {
        label: "Length",
        data: correctedGrowthReport.map((item) => item.length),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
      {
        label: "Max Length",
        data: correctedGrowthReport.map((item) => item.maxLength),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
      {
        label: "Min Length",
        data: correctedGrowthReport.map((item) => item.minLength),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 2,
      },
    ];

    // Prepare weight datasets
    const weightDatasets = [
      {
        label: "Weight",
        data: correctedGrowthReport.map((item) => item.weight),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
      {
        label: "Max Weight",
        data: correctedGrowthReport.map((item) => item.maxWeight),
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 2,
      },
      {
        label: "Min Weight",
        data: correctedGrowthReport.map((item) => item.minWeight),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ];

    // Update the chart states
    setLengthData({ labels, datasets: lengthDatasets });
    setWeightData({ labels, datasets: weightDatasets });
  };

  const updateWaterParametersData = (waterReport) => {
    const correctedWaterQualityReport = waterReport.map((item) => ({
      pH: item.pH || 0, // Ensure pH field exists
      hardness: item.hardness || 0, // Ensure hardness field exists
      temperature: item.temperature || 0, // Ensure temperature field exists
      carbonDioxide: item.cabondioxide || 0, // Ensure CO2 field exists
      salt: item.salt || 0, // Ensure salt field exists
      nitrates: item.nitrates || 0, // Ensure nitrates field exists
      nitrite: item.nitrite || 0, // Ensure nitrites field exists
      ammonium: item.amonium || 0, // Ensure ammonium field exists
      oxigen: item.oxigen || 0,
      maxTemp: item.maxTemp || 0, // Ensure maxTemp exists
      minTemp: item.minTemp || 0, // Ensure minTemp exists
      maxPh: item.maxPh || 0, // Ensure maxPh exists
      minPh: item.minPh || 0, // Ensure minPh exists
      maxHardness: item.maxHardness || 0, // Ensure maxHardness exists
      minHardness: item.minHardness || 0, // Ensure minHardness exists
      maxOxigen: item.maxOxigen || 0, // Ensure maxOxigen exists
      minOxigen: item.minOxigen || 0, // Ensure minOxigen exists
      maxCabondioxide: item.maxCabondioxide || 0, // Ensure maxCabondioxide exists
      minCabondioxide: item.minCabondioxide || 0, // Ensure minCabondioxide exists
      maxSalt: item.maxSalt || 0, // Ensure maxSalt exists
      minSalt: item.minSalt || 0, // Ensure minSalt exists
      maxNitrates: item.maxNitrates || 0, // Ensure maxNitrates exists
      minNitrates: item.minNitrates || 0, // Ensure minNitrates exists
      maxNitrite: item.maxNitrite || 0, // Ensure maxNitrite exists
      minNitrite: item.minNitrite || 0, // Ensure minNitrite exists
      maxAmonium: item.maxAmonium || 0, // Ensure maxAmonium exists
      minAmonium: item.minAmonium || 0, // Ensure minAmonium exists
      stage: item.stage || "N/A", // Label each point (optional)
      date: new Date(item.date).toLocaleDateString(),
    }));
    const labels = correctedWaterQualityReport.map((item) => item.date);

    const temperatureDatasets = [
      {
        label: "Max Temperature",
        data: correctedWaterQualityReport.map((item) => item.maxTemp),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
      {
        label: "Min Temperature",
        data: correctedWaterQualityReport.map((item) => item.minTemp),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
      {
        label: "Temperature",
        data: correctedWaterQualityReport.map((item) => item.temperature),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
    ];
    const pHDatasets = [
      {
        label: "Max pH",
        data: correctedWaterQualityReport.map((item) => item.maxPh),
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 2,
      },
      {
        label: "Min pH",
        data: correctedWaterQualityReport.map((item) => item.minPh),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 2,
      },
      {
        label: "pH",
        data: correctedWaterQualityReport.map((item) => item.pH),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
    ];
    const hardnessDatasets = [
      {
        label: "Max Hardness",
        data: correctedWaterQualityReport.map((item) => item.maxHardness),
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 2,
      },
      {
        label: "Min Hardness",
        data: correctedWaterQualityReport.map((item) => item.minHardness),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
      {
        label: "Hardness",
        data: correctedWaterQualityReport.map((item) => item.hardness),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
    ];

    const oxigenDatasets = [
      {
        label: "Max Oxygen",
        data: correctedWaterQualityReport.map((item) => item.maxOxigen),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
      {
        label: "Min Oxygen",
        data: correctedWaterQualityReport.map((item) => item.minOxigen),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
      {
        label: "Oxygen",
        data: correctedWaterQualityReport.map((item) => item.oxigen),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
    ];

    const carbonDioxideDatasets = [
      {
        label: "Max Carbon Dioxide",
        data: correctedWaterQualityReport.map((item) => item.maxCabondioxide),
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 2,
      },
      {
        label: "Min Carbon Dioxide",
        data: correctedWaterQualityReport.map((item) => item.minCabondioxide),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 2,
      },
      {
        label: "Carbon Dioxide",
        data: correctedWaterQualityReport.map((item) => item.carbonDioxide),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
    ];

    const saltDatasets = [
      {
        label: "Max Salt",
        data: correctedWaterQualityReport.map((item) => item.maxSalt),
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 2,
      },
      {
        label: "Min Salt",
        data: correctedWaterQualityReport.map((item) => item.minSalt),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
      {
        label: "Salt",
        data: correctedWaterQualityReport.map((item) => item.salt),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 2,
      },
    ];

    const nitratesDatasets = [
      {
        label: "Max Nitrates",
        data: correctedWaterQualityReport.map((item) => item.maxNitrates),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
      {
        label: "Min Nitrates",
        data: correctedWaterQualityReport.map((item) => item.minNitrates),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
      {
        label: "Nitrates",
        data: correctedWaterQualityReport.map((item) => item.nitrates), // Chỉnh sửa thành nitrates
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 2,
      },
    ];

    const nitritesDatasets = [
      {
        label: "Max Nitrite",
        data: correctedWaterQualityReport.map((item) => item.maxNitrite),
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 2,
      },
      {
        label: "Min Nitrite",
        data: correctedWaterQualityReport.map((item) => item.minNitrite),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 2,
      },
      {
        label: "Nitrite",
        data: correctedWaterQualityReport.map((item) => item.nitrite),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
    ];

    const ammoniumDatasets = [
      {
        label: "Max Ammonium",
        data: correctedWaterQualityReport.map((item) => item.maxAmonium),
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 2,
      },
      {
        label: "Min Ammonium",
        data: correctedWaterQualityReport.map((item) => item.minAmonium),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
      {
        label: "Ammonium",
        data: correctedWaterQualityReport.map((item) => item.ammonium),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 2,
      },
    ];

    setPHValue({ labels, datasets: pHDatasets });
    setHardness({ labels, datasets: hardnessDatasets });
    setTemperature({ labels, datasets: temperatureDatasets });
    setCarbonDioxide({ labels, datasets: carbonDioxideDatasets });
    setSalt({ labels, datasets: saltDatasets });
    setNitrates({ labels, datasets: nitratesDatasets });
    setNitrites({ labels, datasets: nitritesDatasets });
    setAmmonium({ labels, datasets: ammoniumDatasets });
    setOxigen({ labels, datasets: oxigenDatasets });
  };

  const handleDataTypeChange = (type) => {
    setSelectedDataType(type);
  };
  return (
    <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen flex flex-col"
    style={{
      backgroundImage: `url(${backgroud})`, // Set the background image
      backgroundSize: "cover", // Cover the entire container
      backgroundPosition: "center", // Center the image
    }}>
      <h1 className="text-3xl font-bold mb-4 text-black">Statistics</h1>
      <p className="text-black mb-8">
        Statistics about your fish tank and Koi fish.
      </p>
      {/* Pond and Fish selection */}
      <Row gutter={16} className="max-w-sm mx-auto mb-8">
        {/* Pond Selection */}
        <Col span={12}>
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
        </Col>

        {/* Fish Selection */}
        {selectedPond && allFishData.length > 0 && (
          <Col span={12}>
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
          </Col>
        )}
      </Row>
      {/* Chart type selection */}
      {selectedFish ? ( // Show fish chart selection if fish is selected
        <div className="max-w-sm mx-auto mb-8">
          <label className="block mb-2 text-sm font-medium text-white dark:text-white">
            Select Chart Type:
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setChartType("fish");
                setSelectedDataType("length"); // Reset to length when switching to fish chart
              }}
              className={`px-4 py-2 rounded-lg ${
                chartType === "fish"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              Fish Chart
            </button>
          </div>
        </div>
      ) : selectedPond ? ( // Show pond chart selection if pond is selected
        <div className="max-w-sm mx-auto mb-8">
          <label className="block mb-2 text-sm font-medium text-white dark:text-white">
            Select Chart Type:
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setChartType("pond");
                setSelectedDataType(null); // Reset data type when switching to pond chart
              }}
              className={`px-4 py-2 rounded-lg ${
                chartType === "pond"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              Pond Chart
            </button>
          </div>
        </div>
      ) : null}{" "}
      {/* Only show if either pond or fish is selected */}
      {chartType === "pond" && selectedPond && (
        <div className="max-w-sm mx-auto mb-8 ">
          <label className="block mb-2 text-sm font-medium text-white dark:text-white">
            Select Parameter Type:
          </label>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setSelectedDataType("pH")}
              className={`px-4 py-2 rounded-lg ${
                selectedDataType === "pH"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              pH
            </button>
            <button
              onClick={() => setSelectedDataType("hardness")}
              className={`px-4 py-2 rounded-lg ${
                selectedDataType === "hardness"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              Hardness
            </button>
            <button
              onClick={() => setSelectedDataType("temperature")}
              className={`px-4 py-2 rounded-lg ${
                selectedDataType === "temperature"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              Temperature
            </button>
            <button
              onClick={() => setSelectedDataType("carbonDioxide")}
              className={`px-4 py-2 rounded-lg ${
                selectedDataType === "carbonDioxide"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              Carbon Dioxide
            </button>
            <button
              onClick={() => setSelectedDataType("salt")}
              className={`px-4 py-2 rounded-lg ${
                selectedDataType === "salt"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              Salt
            </button>
            <button
              onClick={() => setSelectedDataType("nitrates")}
              className={`px-4 py-2 rounded-lg ${
                selectedDataType === "nitrates"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              Nitrates
            </button>
            <button
              onClick={() => setSelectedDataType("nitrites")}
              className={`px-4 py-2 rounded-lg ${
                selectedDataType === "nitrites"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              Nitrites
            </button>
            <button
              onClick={() => setSelectedDataType("ammonium")}
              className={`px-4 py-2 rounded-lg ${
                selectedDataType === "ammonium"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              Ammonium
            </button>
            <button
              onClick={() => setSelectedDataType("oxygen")}
              className={`px-4 py-2 rounded-lg ${
                selectedDataType === "oxygen"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              Oxygen
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
              onClick={() => setSelectedDataType("length")}
              className={`px-4 py-2 rounded-lg ${
                selectedDataType === "length"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              Length
            </button>
            <button
              onClick={() => setSelectedDataType("weight")}
              className={`px-4 py-2 rounded-lg ${
                selectedDataType === "weight"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              Weight
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center">
        {chartType === "pond" && selectedPond && (
          <div className="w-[700px] bg-white p-5 rounded-lg border-2 border-gray-300">
            {selectedDataType === "temperature" && (
              <LineChart chartData={temperature} />
            )}
            {selectedDataType === "pH" && <LineChart chartData={pHValue} />}
            {selectedDataType === "hardness" && (
              <LineChart chartData={hardness} />
            )}
            {selectedDataType === "carbonDioxide" && (
              <LineChart chartData={carbonDioxide} />
            )}
            {selectedDataType === "salt" && <LineChart chartData={salt} />}
            {selectedDataType === "nitrates" && (
              <LineChart chartData={nitrates} />
            )}
            {selectedDataType === "ammonium" && (
              <LineChart chartData={ammonium} />
            )}
            {selectedDataType === "oxygen" && <LineChart chartData={oxigen} />}
            {selectedDataType === "nitrites" && (
              <LineChart chartData={nitrites} />
            )}
          </div>
        )}

        {chartType === "fish" && selectedFish && (
          <div className="w-[700px] bg-white p-5 rounded-lg border-2 border-gray-300">
            {selectedDataType === "length" && (
              <LineChart chartData={lengthData} />
            )}
            {selectedDataType === "weight" && (
              <LineChart chartData={weightData} />
            )}
          </div>
        )}

        {/* Optional: Add navigation buttons for fish charts if required */}
      </div>
    </div>
  );
};

export default Statistics;
