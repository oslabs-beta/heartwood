import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

const LineChart = ({ data, labels }) => {
 // ^ change this to pass in props later

    // Register chart components to be used on all charts
    Chart.register(
        // TimeScale,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );
    
  // Define the chart data and configuration
  const chartData = {
    labels, // X-axis labels (timestamps, dates, etc.)
    datasets: [
      {
        label: 'Metrics', // Label for the dataset
        data, // Data for the line chart (y-axis values) 
        borderColor: 'rgba(75, 192, 192, 1)', // Line color
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill under the line
        borderWidth: 2, // Line thickness
        tension: 0.4, // Smoothing the line
        pointRadius: 4, // Radius of points on the line
      },
    ],
  };

  // Chart configuration options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true, // Show/hide the legend
        position: 'top',
      },
      title: {
        display: true,
        text: 'Metrics Over Time', // Title of the chart, pass in props later 
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Start y-axis at 0
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default LineChart;