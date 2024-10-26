import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import api from '../../config/axios';

const DashBoard = () => {
    const [totalUser, setTotalUser] = useState(0);
    const [revenueData, setRevenueData] = useState(Array(12).fill(0));
    const [approvedAds, setApprovedAds] = useState(0);
    const [draftedAds, setDraftedAds] = useState(0);

    // Fetch total user count from API
    useEffect(() => {
        const fetchTotalUser = async () => {
            try {
                const response = await api.get('/Account/countAccount');
                setTotalUser(response.data);
            } catch (error) {
                console.error('Error fetching total user count:', error);
            }
        };
        fetchTotalUser();
    }, []);

    // Fetch revenue data for Bar Chart
    useEffect(() => {
        const fetchRevenueData = async () => {
            try {
                const response = await api.get('/Admin/getRevenueStatistic');
                
                const monthlyRevenue = Array(12).fill(0);
                response.data.forEach(item => {
                    const monthIndex = item.month - 1;
                    monthlyRevenue[monthIndex] = item.revenue;
                });
                setRevenueData(monthlyRevenue);
            } catch (error) {
                console.error('Error fetching revenue data:', error);
            }
        };
        fetchRevenueData();
    }, []);

    // Fetch count of approved and drafted ads
    useEffect(() => {
        const fetchAdCounts = async () => {
            try {
                const approvedResponse = await api.get('/Adv/countAdsByStatus/Approved');
                const draftedResponse = await api.get('/Adv/countAdsByStatus/Drafted');

                setApprovedAds(approvedResponse.data);
                setDraftedAds(draftedResponse.data);
            } catch (error) {
                console.error('Error fetching ad counts:', error);
            }
        };
        fetchAdCounts();
    }, []);

    // Prepare data for Bar Chart
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const barChartData = {
        labels: monthNames, // Use month names instead of month numbers
        datasets: [
            {
                label: 'Revenue',
                data: revenueData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: '#4BC0C0',
                borderWidth: 1,
            },
        ],
    };

    const groupedRevenueData = [
        revenueData.slice(0, 3).reduce((a, b) => a + b, 0), // Q1
        revenueData.slice(3, 6).reduce((a, b) => a + b, 0), // Q2
        revenueData.slice(6, 9).reduce((a, b) => a + b, 0), // Q3
        revenueData.slice(9, 12).reduce((a, b) => a + b, 0), // Q4
    ];
    

    return (
        <div className="dashboard-container flex-1 h-full p-8 bg-gradient-to-r from-gray-800 via-gray-900 to-black min-h-screen text-white">
            {/* Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">
                {/* Total User Card */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg transform transition duration-500 hover:scale-105">
                    <h4 className="text-lg font-semibold text-gray-300">Total User</h4>
                    <div className="mt-4 flex items-center space-x-4">
                        <span className="text-4xl font-bold text-white">{totalUser}</span>
                        <div className="flex flex-col items-center justify-center text-green-400">
                            <i className="fas fa-user-plus text-2xl"></i>
                        </div>
                    </div>
                </div>

                {/* Total Post Card */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg transform transition duration-500 hover:scale-105">
                    <h4 className="text-lg font-semibold text-gray-300">Total Post</h4>
                    <div className="mt-4 space-y-2 text-white">
                        <div>
                            <span className="font-bold">Approved:</span> {approvedAds}
                        </div>
                        <div>
                            <span className="font-bold">Drafted:</span> {draftedAds}
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Bar Chart */}
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
                <h4 className="text-xl font-semibold text-gray-300 mb-6">Revenue Overview</h4>
                <Bar 
                    data={barChartData} 
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true,
                                labels: {
                                    color: 'white'
                                }
                            }
                        },
                        scales: {
                            x: {
                                ticks: {
                                    color: 'white'
                                },
                                grid: {
                                    color: '#333'
                                }
                            },
                            y: {
                                ticks: {
                                    color: 'white'
                                },
                                grid: {
                                    color: '#333'
                                }
                            }
                        }
                    }} 
                />
            </div>
        </div>
    );
};

export default DashBoard;
