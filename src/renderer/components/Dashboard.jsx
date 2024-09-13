import React, { useState, useEffect } from "react";
import LineChart from "./LineChart";
import DonutChart from "./DonutChart";

const Dashboard = () => {
  const [invocationsData, setInvocations] = useState(() => JSON.parse(localStorage.getItem('invocationsData')) || []);
  const [invocationsDataLabels, setInvocationsLabels] = useState(() => JSON.parse(localStorage.getItem('invocationsLabels')) || []);
  const [errorData, setErrors] = useState(() => JSON.parse(localStorage.getItem('errorData')) || []);
  const [errorDataLabels, setErrorLabels] = useState(() => JSON.parse(localStorage.getItem('errorLabels')) || []);

  
  // Function to fetch invocation metrics from the backend
  const getInvocationMetrics = async () => {
    try {
      const result = await window.api.getInvocations();
      setInvocations(result.data);  
      setInvocationsLabels(result.label);
      
      // Store data in localStorage
      localStorage.setItem('invocationsData', JSON.stringify(result.data));
      localStorage.setItem('invocationsLabels', JSON.stringify(result.label));
    } catch (error) {
      console.log("Error in dashboardjsx invocation data:", error);
    }
  };

  // Function to fetch error count metrics from the backend
  const getErrorMetrics = async () => {
    try {
      const result = await window.api.getErrors();
      setErrors(result.data);  
      setErrorLabels(result.label);

      // Store data in localStorage
      localStorage.setItem('errorData', JSON.stringify(result.data));
      localStorage.setItem('errorLabels', JSON.stringify(result.label));
    } catch (error) {
      console.log("Error in dashboardjsx errors data:", error);
    }
  };

  // Fetch the invocation and error metrics when the component mounts only if data is empty
  useEffect(() => {
    if (invocationsData.length === 0) getInvocationMetrics();
    if (errorData.length === 0) getErrorMetrics();
  }, [invocationsData, errorData]);

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
              Invocation Count
            </p>
            <div className="w-full h-96">
              <LineChart data={invocationsData} labels={invocationsDataLabels} />
            </div>
          </div>
        </div>
        <div className="lg:w-1/2">
          <div className="card shadow-lg bg-base-200 p-6">
            <p className="text-lg font-semibold text-base-content mb-4">
              Error count
            </p>
            <div className="w-full h-96">
              <LineChart data={errorData} labels={errorDataLabels}/>
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
