import React, { useState, useEffect } from 'react';
import LineChart from '../../component/Chart';

const Statistics = () => {
  const [userData, setUserData] = useState({
    labels: [],
    datasets: [],
  });

  const [allFishData, setAllFishData] = useState([]); // State to store all fish data
  const [selectedFish, setSelectedFish] = useState([]); // Default no fish selected

  // Fetch data from JSON file
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/datachart.json'); // Path to the JSON file
        const data = await response.json();

        setAllFishData(data.KoiFishes); // Store raw data
      } catch (error) {
        console.error('Error fetching the data', error);
      }
    };

    fetchData();
  }, []);

  // Update userData based on selected fish
  const updateUserData = (fishes, selection) => {
    const filteredData = selection.includes('All')
      ? fishes // If "All" is selected, take all fish
      : fishes.filter(fish => selection.includes(fish.name)); // Filter fish by selection

    // Update labels
    const labels = filteredData[0]?.data.map(item => item.month) || [];

    // Create datasets for each fish
    const datasets = filteredData.flatMap(fish => [
      {
        label: `${fish.name} - Weight`,
        data: fish.data.map(item => item.weight),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      },
      {
        label: `${fish.name} - WeightMin`,
        data: fish.data.map(item => item.weightMin),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
      {
        label: `${fish.name} - WeightMax`,
        data: fish.data.map(item => item.weightMax),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      },
    ]);

    setUserData({ labels, datasets }); // Update user data
  };

  // Handle fish selection change
  const handleFishSelection = (event) => {
    const { options } = event.target;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    
    // If "Choose Koi" is selected, no fish is selected
    if (selected.includes("Choose Koi")) {
      setSelectedFish([]); // Reset selection
      setUserData({ labels: [], datasets: [] }); // Reset data
    } else {
      setSelectedFish(selected);
      updateUserData(allFishData, selected); // Update user data based on selection
    }
  };

  return (
    <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-4 text-white">Statistics</h1>
      <p className="text-white mb-8">Statistics about your fish tank and Koi fish.</p>

      <form className="max-w-sm mx-auto mb-8">
        <label htmlFor="fishSelect" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Fish:</label>
        <select
          id="fishSelect"       
          onChange={handleFishSelection}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="Choose Koi" selected>Choose Koi</option>
          <option value="All">All</option>
          <option value="Nam">Nam</option>
          <option value="Thu">Thu</option>
        </select>
      </form>

      {/* Display chart for each fish */}
      <div className="flex flex-col items-center">
        {selectedFish.length > 0 ? (
          selectedFish.includes('All')
            ? allFishData.map(fish => (
              <div
                key={fish.name}
                className="w-[700px] bg-white p-5 rounded-lg border-2 border-gray-300 mb-4" // Use Tailwind classes
              >
                <h2 className="text-center text-lg font-bold">{fish.name}</h2>
                <LineChart chartData={{
                  labels: fish.data.map(item => item.month),
                  datasets: [
                    {
                      label: `${fish.name} - Weight`,
                      data: fish.data.map(item => item.weight),
                      backgroundColor: 'rgba(255, 99, 132, 0.2)',
                      borderColor: 'rgba(255, 99, 132, 1)',
                      borderWidth: 2,
                    },
                    {
                      label: `${fish.name} - WeightMin`,
                      data: fish.data.map(item => item.weightMin),
                      backgroundColor: 'rgba(54, 162, 235, 0.2)',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 2,
                    },
                    {
                      label: `${fish.name} - WeightMax`,
                      data: fish.data.map(item => item.weightMax),
                      backgroundColor: 'rgba(54, 162, 235, 0.2)',
                      borderColor: 'rgba(54, 162, 235, 1)',
                      borderWidth: 2,
                    },
                  ],
                }} />
              </div>
            ))
            : (
              <div
                className="w-[700px] bg-white p-5 rounded-lg border-2 border-gray-300"
              >
                <LineChart chartData={userData} />
              </div>
            )
        ) : (
          <div className="text-white">Please select at least one fish to display the chart.</div> // Message when no fish is selected
        )}
      </div>
    </div>
  );
};

export default Statistics;
