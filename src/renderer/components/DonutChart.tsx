import React from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2'
import { DonutChartProps } from '../rendererTypes';

const DonutChart: React.FC<DonutChartProps> = ({data, labels}) => {

    Chart.register(ArcElement, Tooltip, Legend);

    const chartData = {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)', // Red
                    'rgba(54, 162, 235, 0.2)', // Blue
                    'rgba(255, 206, 86, 0.2)', // Yellow
                    'rgba(75, 192, 192, 0.2)', // Green
                    'rgba(153, 102, 255, 0.2)', // Purple
                  ],
                borderWidth: [0],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const, // Display the legend at the top
          },
          tooltip: {
            enabled: true, // Enable tooltips on hover
          },
        },
    }
    return (
        <Doughnut data={chartData} options={options} />
    )
}

export default DonutChart;