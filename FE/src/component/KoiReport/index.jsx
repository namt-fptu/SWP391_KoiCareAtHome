import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  message,
} from "antd";
import api from "../../config/axios"; // Axios instance configuration

const KoiReport = () => {
  const [kois, setKois] = useState([]); // Array to store Koi fish details
  const [pondId, setPondId] = useState(null); // Selected pond ID
  const [varieties, setVarieties] = useState([]); // Array to store Koi varieties
  const [ponds, setPonds] = useState([]); // Array to store user ponds
  const [koiIds, setKoiIds] = useState([]); // Array to store Koi IDs
  const [selectedKoiId, setSelectedKoiId] = useState(null); // State to store selected Koi ID

  const { Option } = Select;

  const id = sessionStorage.getItem("id");

  useEffect(() => {
    if (!id) {
      message.error("User not logged in. Unable to fetch ponds.");
      return;
    }
    fetchVarieties();
    fetchUserPonds();
  }, [id]);

  const fetchVarieties = async () => {
    try {
      const response = await api.get("KoiVariety/variety");
      setVarieties(response.data);
    } catch (error) {
      console.error("Error fetching varieties:", error);
    }
  };

  const fetchUserPonds = async () => {
    try {
      const response = await api.get(`Pond/ponds/${id}`);
      setPonds(response.data);
    } catch (error) {
      console.error("Error fetching ponds:", error);
    }
  };

  const fetchKoiForPond = async (pondId) => {
    try {
      const response = await api.get(`KoiFish/koiFish/${pondId}`);
      setKois(response.data);
      // Update koiIds with the IDs of fetched Koi fish
      const ids = response.data.map(koi => koi.id);
      setKoiIds(ids);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Pond has no koi fish, set empty koi array
        setKois([]);
        setKoiIds([]);
        console.warn("No koi fish found for this pond.");
      } else {
        console.error("Error fetching koi fish:", error);
      }
    }
  };

  useEffect(() => {
    if (pondId) {
      fetchKoiForPond(pondId);
    }
  }, [pondId]);

  return (
    <div className="flex-container">
      <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-white p-8">Koi Report</h1>

        <Select
          placeholder="Select a pond to view koi fish"
          onChange={(value) => {
            setPondId(value);
            setSelectedKoiId(null); // Reset selected koi when pond changes
          }}
          style={{ width: "100%", marginBottom: "20px" }}
        >
          {ponds.map((pond) => (
            <Option key={pond.id} value={pond.id}>
              {pond.name}
            </Option>
          ))}
        </Select>

        {pondId && (
          <>
            <Row gutter={16}>
              {kois.length > 0 ? (
                kois.map((koi, index) => {
                  // Calculate koi age based on DOB
                  const dob = koi.dob ? new Date(koi.dob) : null;
                  const age = dob
                    ? `${new Date().getFullYear() - dob.getFullYear()} years`
                    : "Unknown";

                  return (
                    <Col span={8} key={index}>
                      <Card
                        bordered={true}
                        style={{ textAlign: "center" }}
                      >
                        {/* Koi Information */}
                        <p>
                          <strong>Name:</strong> {koi.koiName}
                        </p>
                        <p>
                          <strong>Age:</strong> {age}
                        </p>
                        <p>
                          <strong>Variety:</strong> {koi.koiVariety}
                        </p>
                        <p>
                          <strong>Koi ID:</strong> {koi.id} {/* Display Koi ID */}
                        </p>
                      </Card>
                    </Col>
                  );
                })
              ) : (
                <p style={{ color: "white" }}>No koi fish in this pond</p>
              )}
            </Row>

            {kois.length > 0 && (
              <Select
                placeholder="Select a koi fish"
                onChange={(value) => setSelectedKoiId(value)}
                style={{ width: "100%", marginTop: "20px" }}
              >
                {kois.map((koi) => (
                  <Option key={koi.id} value={koi.id}>
                    {koi.koiName}
                  </Option>
                ))}
              </Select>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default KoiReport;
