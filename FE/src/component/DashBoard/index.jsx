import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Important for enabling chart.js in React

const DashBoard = () => {
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
        <div className="dashboard-container p-5">
            <div className="flex justify-between mb-4">
                {/* Total User */}
                <div className="bg-white p-4 rounded shadow w-1/4">
                    <h4 className="font-bold">Total User</h4>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-2xl font-bold">20</span>
                        <div className="text-green-500 text-sm">8.5% Up from yesterday</div>
                    </div>
                </div>

                {/* Total Post */}
                <div className="bg-white p-4 rounded shadow w-1/4">
                    <h4 className="font-bold">Total Post</h4>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-2xl font-bold">20</span>
                        <div className="text-red-500 text-sm">4.3% Down from yesterday</div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h4 className="font-bold mb-4">Pie Chart</h4>
                <div className="flex justify-around">
                    {/* Total Order Pie Chart */}
                    <div className="w-1/4 text-center">
                        <Pie data={dataOrder} />
                        <h5 className="mt-2">Total Order</h5>
                    </div>

                    {/* Customer Growth Pie Chart */}
                    <div className="w-1/4 text-center">
                        <Pie data={dataCustomerGrowth} />
                        <h5 className="mt-2">Customer Growth</h5>
                    </div>

                    {/* Total Revenue Pie Chart */}
                    <div className="w-1/4 text-center">
                        <Pie data={dataRevenue} />
                        <h5 className="mt-2">Total Revenue</h5>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
