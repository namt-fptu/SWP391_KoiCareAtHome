import React, { useState, useEffect } from "react";
import { message, Select, Button, Card, Typography ,notification} from "antd";
import api from "../../config/axios";
import { useAuthStore } from "../../page/(auth)/store";
import backgroud from "./../../assets/wallpaper.jpg";
const { Title, Text } = Typography;
const FoodCalculator = () => {
  const { authUser } = useAuthStore();
  const id = authUser.id;

  const [selectedGrowth, setSelectedGrowth] = useState("medium");
  const [totalWeight, setTotalWeight] = useState("");
  const [pondName, setPondName] = useState("");
  const [ponds, setPonds] = useState([]);
  const [foodAmount, setFoodAmount] = useState(0);

  useEffect(() => {
    if (!id) {
      message.error("User not logged in. Unable to fetch ponds.");
      return;
    }

    const fetchPonds = async () => {
      try {
        const response = await api.get(`Pond/ponds/${id}`);
        setPonds(response.data);
      } catch (error) {
        notification.error({
          message: "Pond Not Found",
          description: "The pond you are looking for does not exist.",
          duration: 2,  // Duration in seconds
        });
      }
    };

    fetchPonds();
  }, [id]);

  useEffect(() => {
    const fetchTotalWeight = async () => {
      if (!pondName) return;

      try {
        const selectedPond = ponds.find((pond) => pond.name === pondName);
        const response = await api.get(
          `http://localhost:5088/api/KoiFish/getSumOfKoiWeight/${selectedPond.id}`
        );
        setTotalWeight(response.data);
      } catch (error) {
        message.error("Failed to fetch total weight data.");
      }
    };

    fetchTotalWeight();
  }, [pondName, ponds]);

  const handleGrowthSelection = (growth) => {
    setSelectedGrowth(growth);
  };

  const calculateFoodAmount = () => {
    let percentage = 0;

    switch (selectedGrowth) {
      case "low":
        percentage = 0.02;
        break;
      case "medium":
        percentage = 0.03;
        break;
      case "high":
        percentage = 0.04;
        break;
      default:
        break;
    }

    if (totalWeight) {
      const calculatedFood = totalWeight * percentage;
      setFoodAmount(calculatedFood);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white p-8"
    style={{
      backgroundImage: `url(${backgroud})`, // Set the background image
      backgroundSize: "cover", // Cover the entire container
      backgroundPosition: "center", // Center the image
    }}>
      <div className="w-1/2 pr-4">
        <Card>
          <h1 className="text-3xl font-bold mb-8">Food Calculator</h1>

          <div className="mb-8">
            <Text strong>Main Pond</Text>
            <div className="flex items-center space-x-4">
              <Select
                value={pondName}
                onChange={(value) => setPondName(value)}
                className="w-full"
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
              {totalWeight
                ? `${totalWeight} gram`
                : "Select a pond to see the total weight"}
            </div>
          </div>

          <div className="mb-8">
            <Text strong>Desired Level</Text>
            <div className="flex space-x-4 mt-2">
              {["low", "medium", "high"].map((growth) => (
                <Button
                  key={growth}
                  type={selectedGrowth === growth ? "primary" : "default"}
                  onClick={() => handleGrowthSelection(growth)}
                >
                  {growth.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-bold">Calculated food amount:</h2>
            <div
              className="bg-white text-black p-2 rounded mt-2 inline-block"
              style={{ minWidth: "100px", textAlign: "center" }}
            >
              {foodAmount
                ? `${foodAmount.toFixed(2)} gram`
                : "Press Calculate to see food amount"}
            </div>
          </div>

          <Button type="primary" onClick={calculateFoodAmount}>
            Calculate
          </Button>
        </Card>
      </div>

      <div className="w-1/2 pl-4">
        <Card>
          <h2 className="text-lg font-bold">Feeding Information</h2>
          <p>
            The recommended amount of food should be split evenly into 3-5
            feedings per day. This way the koi will ingest the food better.
          </p>
          <h2 className="text-lg font-bold mt-6">Instructions</h2>
          <p>1. Select a pond to get the total weight of Koi.</p>
          <p>2. Choose the desired growth rate.</p>
          <p>3. Click Calculate to see the calculated food amount.</p>
        </Card>
      </div>
    </div>
  );
};

export default FoodCalculator;
