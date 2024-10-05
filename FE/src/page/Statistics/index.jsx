import React, { useState, useEffect } from 'react';
import LineChart from '../../component/Chart';

const Statistics = () => {
  const [userData, setUserData] = useState({
    labels: [],
    datasets: [],
  });

  // Fetch data from JSON file
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/datachart.json');  // Adjust the path to your JSON file
        const data = await response.json();

        setUserData({
          labels: data.UserData.map((item) => item.month),
          datasets: [
            {
              label: 'Weight',
              data: data.UserData.map((item) => item.weight),
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
            },
            {
              label: 'WeightMin',
              data: data.UserData.map((item) => item.weightMin),
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
            },
            {
              label: 'Weight Max',
              data: data.UserData.map((item) => item.weightMax),
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching the data', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-white p-8">Statistics</h1>
      <p className=" text-white p-8">Thống kê về hồ cá và cá Koi của bạn.</p>
      <div
        style={{
          width: 700,
          backgroundColor: 'white',  // White background for the chart container
          padding: '20px',            // Padding inside the white container
          borderRadius: '10px',        // Optional: Rounded corners for a softer look
          border: '2px solid #ccc',    // Border around the white container
        }}
      >
        <LineChart chartData={userData} />
      </div>
    </div>
  );
};

export default Statistics;
