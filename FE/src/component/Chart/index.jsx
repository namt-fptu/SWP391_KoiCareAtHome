import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
// eslint-disable-next-line react/prop-types
function LineChart({ chartData }) {
  return <Line data={chartData} />;
}

export default LineChart;
