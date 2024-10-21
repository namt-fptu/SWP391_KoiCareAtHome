import React, { useEffect, useState } from "react";
import { message, Select, Button, Typography, Card } from 'antd';
import api from "../../config/axios"; // Update with your actual API import

const { Title, Text } = Typography;

const SaltCalculator = () => {
  const [ponds, setPonds] = useState([]);
  const [pondVolume, setPondVolume] = useState(0);
  const [selectedPond, setSelectedPond] = useState("");
  const [saltAmount, setSaltAmount] = useState(0); // State to store calculated salt amount
  const [selectedSaltLevel, setSelectedSaltLevel] = useState("medium"); // State for salt level selection

  const id = sessionStorage.getItem("id"); // Get user ID from sessionStorage

  const fetchPondDetails = async (pondId) => {
    try {
      const response = await api.get(`Pond/pond/${pondId}`);
      setPondVolume(response.data.volume);
    } catch (error) {
      console.error("Error fetching pond details:", error);
      message.error("Failed to fetch pond details.");
    }
  };

  useEffect(() => {
    if (!id) {
      message.error("User not logged in. Unable to fetch ponds.");
      return;
    }
    fetchUserPonds();
  }, [id]);

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
    if (selectedPond) {
      fetchPondDetails(selectedPond); // Fetch pond details when a pond is selected
    }
  }, [selectedPond]);

  // Function to calculate the amount of salt based on the selected level
  const calculateSaltAmount = () => {
    let percentage = 0;

    switch (selectedSaltLevel) {
      case "low":
        percentage = 0.003; // 30%
        break;
      case "medium":
        percentage = 0.005; // 50%
        break;
      case "high":
        percentage = 0.007; // 70%
        break;
      default:
        break;
    }

    const calculatedSalt = pondVolume * percentage;
    setSaltAmount(calculatedSalt);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white p-8">
      {/* Salt Calculator Section */}
      <div className="w-1/2 pr-4">
        <Card>
          <Title level={3}>Salt Calculator</Title>

          {/* Pond Selector */}
          <div className="mb-8">
            <Text strong>Main Pond</Text>
            <Select
              className="mt-2 w-full"
              onChange={(value) => setSelectedPond(value)}
              value={selectedPond} // Set value to reflect selection
              placeholder="Select a pond"
            >
              {ponds.map((pond) => (
                <Select.Option key={pond.id} value={pond.id}>
                  {pond.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Pond Volume Display */}
          <div className="mb-8">
            <Text className="text-lg">
              Pond Volume: {typeof pondVolume === "number" ? `${pondVolume} liters` : "Not available"}
            </Text>
          </div>

          {/* Salt Level Selection */}
          <div className="mb-8">
            <Text strong>Desired Salt Level</Text>
            <div className="flex space-x-4 mt-2">
              {["low", "medium", "high"].map((level) => (
                <Button
                  key={level}
                  type={selectedSaltLevel === level ? "primary" : "default"}
                  onClick={() => setSelectedSaltLevel(level)}
                >
                  {level.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          {/* Calculate Salt Amount Button */}
          <div className="text-center mb-8">
            <Button
              type="primary"
              onClick={calculateSaltAmount} // Calculate salt when button is clicked
            >
              Calculate
            </Button>
          </div>

          {/* Display Calculated Salt Amount */}
          <div className="mb-8">
            <Text strong>Calculated Salt Amount:</Text>
            <div
              className="bg-white text-black p-2 rounded mt-2 inline-block"
              style={{ minWidth: "100px", textAlign: "center" }} 
            >
              {saltAmount > 0 ? `${saltAmount.toFixed(2)} kg` : "Select salt level"}
            </div>
          </div>
        </Card>
      </div>

      {/* Feeding Information Section */}
      <div className="w-1/2 pl-4">
        <Card>
          <Title level={4}>Salt Information</Title>
          <Text>
            The recommended amount of salt should be split evenly into 3-7 % per liter.
            This way, the koi will ingest the food better.
          </Text>
          <Title level={4} className="mt-6">Instructions</Title>
          <Text>1. Select a pond to get the volume of Koi.</Text><br />
          <Text>2. Choose the desired salt level.</Text><br />
          <Text>3. Check the calculated salt amount.</Text>
        </Card>
      </div>
    </div>
  );
};

export default SaltCalculator;
