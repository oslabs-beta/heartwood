import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { LineChartProps } from "../renderTypes";
const LineChart: React.FC<LineChartProps> = ({ data, labels }) => {
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
        Legend,
        TimeScale
    );
    
  // Define the chart data and configuration
  const chartData = {
    labels, // X-axis labels (timestamps, dates, etc.)
    datasets: [
      {
        label: 'count', // Label for the dataset, TO DO: Pass in label from props later
        data: data, // Data for the line chart (y-axis values) 
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
        position: 'top' as const,
      },
    //   title: {
    //     display: true,
    //     text: 'Metrics Over Time', // Title of the chart, pass in props later 
    //   },
    },
    scales: {
      y: {
        beginAtZero: true, // Start y-axis at 0
      },
      x: {
        type: 'time' as const, // enables time/date handling
        time: {
          unit: 'hour' as const, 
          tooltipFormat: 'PPpp', // pretty print date 
        },
      }
    },
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default LineChart;

// const obj = {
//   position: 'top' // TS is inferring this to be position: string
// }

// const obj2 = {
//   position: 'top' as const // TS inferring this be position: 'top'
// }