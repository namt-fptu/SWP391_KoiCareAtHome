import React, { useEffect, useState } from "react";
import { message, Select, Button, Typography, Card, notification } from "antd";
import api from "../../config/axios";
import { useAuthStore } from "../../page/(auth)/store";
import backgroud from "./../../assets/wallpaper.jpg";
const { Title, Text } = Typography;

const SaltCalculator = () => {
  const [ponds, setPonds] = useState([]);
  const [pondVolume, setPondVolume] = useState(0);
  const [selectedPond, setSelectedPond] = useState("");
  const [saltAmount, setSaltAmount] = useState(0);
  const [selectedSaltLevel, setSelectedSaltLevel] = useState("medium");

  const { authUser } = useAuthStore();
  const id = authUser.id;

  const fetchPondDetails = async (pondId) => {
    try {
      const response = await api.get(`Pond/pond/${pondId}`);
      setPondVolume(response.data.volume);
    } catch (error) {
      notification.error({
        message: "Pond Not Found",
        description: "Maybe there are no ponds yet. Please add one.",
        duration: 2, // Duration in seconds
      });
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
      notification.error({
        message: "Pond Not Found",
        description: "Maybe there are no ponds yet. Please add one.",
        duration: 2, // Duration in seconds
      });
    }
  };

  useEffect(() => {
    if (selectedPond) {
      fetchPondDetails(selectedPond);
    }
  }, [selectedPond]);

  const calculateSaltAmount = () => {
    let percentage = 0;

    switch (selectedSaltLevel) {
      case "low":
        percentage = 0.003;
        break;
      case "medium":
        percentage = 0.005;
        break;
      case "high":
        percentage = 0.007;
        break;
      default:
        break;
    }

    const calculatedSalt = pondVolume * percentage;
    setSaltAmount(calculatedSalt);
  };

  return (
    <div
      className="flex h-screen bg-gray-900 text-white p-8"
      style={{
        backgroundImage: `url(${backgroud})`, // Set the background image
        backgroundSize: "cover", // Cover the entire container
        backgroundPosition: "center", // Center the image
      }}
    >
      {/* Salt Calculator Section */}
      <div className="w-1/2 pr-4">
        <Card>
          <h1 className="text-3xl font-bold mb-8">Salt Calculator</h1>

          {/* Pond Selector */}
          <div className="mb-8">
            <Text strong>Main Pond</Text>
            <Select
              className="mt-2 w-full"
              onChange={(value) => setSelectedPond(value)}
              value={selectedPond}
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
            <Text strong>Pond Volume:</Text>
            <div
              className="bg-white text-black p-2 rounded mt-2 inline-block"
              style={{ minWidth: "100px", textAlign: "center" }}
            >
              {typeof pondVolume === "number"
                ? `${pondVolume} liters`
                : "Select a pond"}
            </div>
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

          {/* Display Calculated Salt Amount */}
          <div className="mb-8">
            <Text strong>Calculated Salt Amount:</Text>
            <div
              className="bg-white text-black p-2 rounded mt-2 inline-block"
              style={{ minWidth: "100px", textAlign: "center" }}
            >
              {saltAmount > 0
                ? `${saltAmount.toFixed(2)} kg`
                : "Select salt level"}
            </div>
          </div>
          <Button type="primary" onClick={calculateSaltAmount}>
            Calculate
          </Button>
        </Card>
      </div>

      {/* Salt Information Section */}
      <div className="w-1/2 pl-4">
        <Card>
          <h2 className="text-lg font-bold">Salt Information</h2>
          <p>
            The recommended amount of salt should be between 3-7% per liter.
            This ensures the best environment for koi.
          </p>
          <h2 className="text-lg font-bold mt-6">Instructions</h2>
          <p>1. Select a pond to get the volume of water.</p>
          <p>2. Choose the desired salt level.</p>
          <p>3. Click Calculate to view the recommended salt amount.</p>
        </Card>
      </div>
    </div>
  );
};

export default SaltCalculator;
