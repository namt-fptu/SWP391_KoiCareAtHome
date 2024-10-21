import React, { useState, useEffect } from "react";
import { message, Select, Button, Card, Typography } from "antd"; // Ensure you import the message component if you haven't already
import api from "../../config/axios"; // Axios instance configuration


const { Title, Text } = Typography; 
const FoodCalculator = () => {
  const id = sessionStorage.getItem("id");
  const [selectedGrowth, setSelectedGrowth] = useState("medium");
  const [totalWeight, setTotalWeight] = useState(""); // State to store total weight of Koi
  const [pondName, setPondName] = useState(""); // State to store selected pond name
  const [ponds, setPonds] = useState([]); // State to store fetched ponds
  const [foodAmount, setFoodAmount] = useState(0); // State to store calculated food amount

  useEffect(() => {
    if (!id) {
      message.error("User not logged in. Unable to fetch ponds.");
      return;
    }

    // Fetch ponds from the API based on the logged-in user's id
    const fetchPonds = async () => {
      try {
        const response = await api.get(`Pond/ponds/${id}`);
        setPonds(response.data);
      } catch (error) {
        message.error("Failed to fetch pond data.");
      }
    };

    fetchPonds();
  }, [id]);

  // Fetch total weight of Koi fish based on selected pond ID
  useEffect(() => {
    const fetchTotalWeight = async () => {
      if (!pondName) return; // Do not fetch if no pond is selected
      
      try {
        const selectedPond = ponds.find(pond => pond.name === pondName);
        const response = await api.get(`http://localhost:5088/api/KoiFish/getSumOfKoiWeight/${selectedPond.id}`);
        setTotalWeight(response.data); // Assuming the response contains the total weight directly
      } catch (error) {
        message.error("Failed to fetch total weight data.");
      }
    };

    fetchTotalWeight();
  }, [pondName, ponds]); // Depend on pondName and ponds array

  // Function to handle growth selection and calculate food amount
  const handleGrowthSelection = (growth) => {
    setSelectedGrowth(growth);
    let percentage = 0;

    switch (growth) {
      case "low":
        percentage = 0.02; // 2%
        break;
      case "medium":
        percentage = 0.03; // 3%
        break;
      case "high":
        percentage = 0.04; // 4%
        break;
      default:
        break;
    }

    // Calculate food amount based on total weight
    if (totalWeight) {
      const calculatedFood = totalWeight * percentage;
      setFoodAmount(calculatedFood);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white p-8">
      {/* Food Calculator Section */}
      <div className="w-1/2 pr-4">
      <Card>
        <h1 className="text-3xl font-bold mb-8">Food Calculator</h1>

        {/* Pond selection */}
        <div className="mb-8">
  <Text strong>Main Pond</Text>
  <div className="flex items-center space-x-4">
    <Select
      value={pondName}
      onChange={(value) => setPondName(value)}
      className="w-full" // Make it full width
      placeholder="Select a pond"
    >
      {ponds.map((pond) => (
        <Select.Option key={pond.id} value={pond.name}>
          {pond.name}
        </Select.Option>
      ))}
    </Select>
  </div>
</div>

<div className="mb-8">
  <Text strong>Total weight of Kois in pond:</Text>
  <div
    className="bg-white text-black p-2 rounded mt-2 inline-block"
    style={{ minWidth: "100px", textAlign: "center" }}
  >
    {totalWeight ? `${totalWeight} gram` : "Select a pond to see the total weight"}
  </div>
</div>

        {/* Growth selection */}
        <div className="mb-8">
  <Text strong>Desired Level</Text>
  <div className="flex space-x-4 mt-2">
    {["low", "medium", "high"].map((growth) => (
      <Button
        key={growth}
        type={selectedGrowth === growth ? "primary" : "default"}
        onClick={() => handleGrowthSelection(growth)} // Use the new function to handle growth selection
      >
        {growth.toUpperCase()}
      </Button>
    ))}
  </div>
</div>

        {/* Display calculated food amount */}
        <div className="mb-8">
          <h2 className="text-lg font-bold">Calculated food amount:</h2>
          <div
            className="bg-white text-black p-2 rounded mt-2 inline-block" // Use inline-block for tight fitting
            style={{ minWidth: "100px", textAlign: "center" }} // Set a minimum width and center the text
          >
            {foodAmount ? `${foodAmount.toFixed(2)} gram` : "Select growth level"}
          </div>
        </div>
        </Card>
      </div>

      {/* Feeding Information Section */}
      <div className="w-1/2 pl-4">
      <Card>
        <h2 className="text-lg font-bold">Feeding Information</h2>
        <p>
          The recommended amount of food should be split evenly into 3-5 feedings per day.
          This way the koi will ingest the food better.
        </p>
        <h2 className="text-lg font-bold mt-6">Instructions</h2>
        <p>1. Select a pond to get the total weight of Koi.</p>
        <p>2. Choose the desired growth rate.</p>
        <p>3. Check the calculated food amount.</p>
        </Card>
      </div>
    </div>
  );
};

export default FoodCalculator;
