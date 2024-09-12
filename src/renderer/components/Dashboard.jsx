import React from "react";
import LineChart from "./LineChart";
import DonutChart from "./DonutChart";

const Dashboard = () => {
  // Sample data for the line chart
  // const data = [65, 59, 80, 81, 56, 55, 40]; // Metrics data (y-axis values)
  const data = [
    67, 23, 88, 42, 15, 79, 95, 31, 52, 9, 
    73, 48, 20, 61, 36, 84, 5, 97, 28, 54, 
    70, 13, 39, 82
  ];
  // const labels = [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  // ]; // Corresponding x-axis labels
  const labels = [
    "2024-09-11T00:00:00Z",
    "2024-09-11T01:00:00Z",
    "2024-09-11T02:00:00Z",
    "2024-09-11T03:00:00Z",
    "2024-09-11T04:00:00Z",
    "2024-09-11T05:00:00Z",
    "2024-09-11T06:00:00Z",
    "2024-09-11T07:00:00Z",
    "2024-09-11T08:00:00Z",
    "2024-09-11T09:00:00Z",
    "2024-09-11T10:00:00Z",
    "2024-09-11T11:00:00Z",
    "2024-09-11T12:00:00Z",
    "2024-09-11T13:00:00Z",
    "2024-09-11T14:00:00Z",
    "2024-09-11T15:00:00Z",
    "2024-09-11T16:00:00Z",
    "2024-09-11T17:00:00Z",
    "2024-09-11T18:00:00Z",
    "2024-09-11T19:00:00Z",
    "2024-09-11T20:00:00Z",
    "2024-09-11T21:00:00Z",
    "2024-09-11T22:00:00Z",
    "2024-09-11T23:00:00Z"
  ]

  // Sample data for the donut chart
  const donutChartData = [300, 50, 100, 150, 250]; // Sample metric data for donut chart
  const donutChartLabels = ["Lambda1", "Lambda2", "Lambda3", "Lambda4", "Lambda5"]; // Labels for the donut chart sections

  return (
    <div className="bg-base-100 min-h-screen text-base-content">
      <div className="w-full px-14 pb-8">
        <div className="card shadow-xl w-full bg-gradient-to-r from-primary via-secondary to-accent text-base-300">
          <div className="card-body">
            <p className="text-3xl">Welcome to Your Dashboard, User</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-center gap-8 mt-10">
        {/* Line Chart Section */}
        <div className="lg:w-1/2">
          <div className="card shadow-lg bg-base-200 p-6">
            <p className="text-lg font-semibold text-base-content mb-4">
              Metrics Overview
            </p>
            <div className="w-full h-96">
              <LineChart data={data} labels={labels} />
            </div>
          </div>
        </div>

        {/* Donut Chart Section */}
        <div className="lg:w-1/2">
          <div className="card shadow-lg bg-base-200 p-6">
            <p className="text-lg font-semibold text-base-content mb-4">
              Invocations per Function
            </p>
            <div className="h-72 flex justify-center items-center">
              <DonutChart data={donutChartData} labels={donutChartLabels} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;