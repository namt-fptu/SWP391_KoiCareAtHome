import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Important for enabling chart.js in React
import api from '../../config/axios'; // Make sure this is your Axios instance

const DashBoard = () => {
    const [totalUser, setTotalUser] = useState(0); // State to hold the total user count

    // Fetch total user count from API
    useEffect(() => {
        const fetchTotalUser = async () => {
            try {
                const response = await api.get('/Account/countAccount');
                setTotalUser(response.data); // Assuming the API returns the count directly in response.data
            } catch (error) {
                console.error('Error fetching total user count:', error);
            }
        };

        fetchTotalUser();
    }, []); // Run once when component mounts

    // Data for Pie Charts
    const dataOrder = {
        datasets: [
            {
                data: [81, 19], // 81% total order
                backgroundColor: ['#FF6384', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#FFCE56'],
            },
        ],
    };

    const dataCustomerGrowth = {
        datasets: [
            {
                data: [22, 78], // 22% customer growth
                backgroundColor: ['#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#36A2EB', '#FFCE56'],
            },
        ],
    };

    const dataRevenue = {
        datasets: [
            {
                data: [62, 38], // 62% total revenue
                backgroundColor: ['#4BC0C0', '#FFCE56'],
                hoverBackgroundColor: ['#4BC0C0', '#FFCE56'],
            },
        ],
    };

    return (
        <div className="dashboard-container flex-1 h-full p-5 bg-gray-900 min-h-screen"> {/* Dark background similar to koiGrowthStandard */}
            {/* Overview Section */}
            <div className="flex justify-between mb-6">
                {/* Total User Card */}
                <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                    <h4 className="text-lg font-semibold">Total User</h4>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-3xl font-bold">{totalUser}</span> {/* Use totalUser from state */}
                        
                    </div>
                </div>

                {/* Total Post Card */}
                <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                    <h4 className="text-lg font-semibold">Total Post</h4>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-3xl font-bold">20</span>
                        
                    </div>
                </div>
            </div>

           
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h4 className="text-lg font-semibold mb-6">Overview</h4>
                <div className="flex justify-around">
                    
                    <div className="w-1/4 text-center">
                        <Pie data={dataOrder} />
                        <h5 className="mt-4 font-medium">Total Order</h5>
                    </div>

                    <div className="w-1/4 text-center">
                        <Pie data={dataCustomerGrowth} />
                        <h5 className="mt-4 font-medium">Customer Growth</h5>
                    </div>


                    <div className="w-1/4 text-center">
                        <Pie data={dataRevenue} />
                        <h5 className="mt-4 font-medium">Total Revenue</h5>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
