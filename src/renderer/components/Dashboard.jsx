import React, { useState, useEffect } from "react";
import LineChart from "./LineChart";
import DonutChart from "./DonutChart";

const Dashboard = () => {
  const [invocationsData, setInvocations] = useState([]);
  const [invocationsDataLabels, setInvocationsLabels] = useState([]);
  const [errorData, setErrors] = useState([]);
  const [errorDataLabels, setErrorLabels] = useState([]);
  const [throttleData, setThrottles] = useState([]);
  const [throttleDataLabels, setThrottleDataLabels] = useState([]);
  const [durationData, setDuration] = useState([]);
  const [durationDataLabels, setDurationDataLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // helper function to calculate totals of each metric, using reduce to accumulate the values
  const calculateTotals = (data) => {
    if (!data || !Array.isArray(data)) return 0;
    return data.reduce((total, current) => total + current, 0);
  }

// helper function to calculate average of specific metric (duration)
  const calculateAverage = (data) => {

  }
// helper function to calculate cost
  const calculateCost = () => {

  }
  
  const getInvocationMetrics = async () => {
    try {
      const result = await window.api.getInvocations();
      console.log('Raw getInvocations result:', result);
      if (result && result.data && result.label) {
        setInvocations(result.data);
        setInvocationsLabels(result.label);
      } else {
        throw new Error('Invalid data structure returned from getInvocations');
      }
    } catch (error) {
      console.error("Error in dashboard invocation data:", error);
      setError(error.message);
    }
  };

  const getErrorMetrics = async () => {
    try {
      const result = await window.api.getErrors();
      console.log('Raw getErrors result:', result);
      if (result && result.data && result.label) {
        setErrors(result.data);
        setErrorLabels(result.label);
      } else {
        throw new Error('Invalid data structure returned from getErrors');
      }
    } catch (error) {
      console.error("Error in dashboard errors data:", error);
      setError(error.message);
    }
  };

  const getThrottleMetrics = async () => {
    try {
      const result = await window.api.getThrottles();
      console.log('Raw getThrottles result:', result);
      if (result && result.data && result.label) {
        setThrottles(result.data);
        setThrottleDataLabels(result.label);
      } else {
        throw new Error('Invalid data structure returned from getErrors');
      }
    } catch (error) {
      console.error("Error in dashboard throttles data:", error);
      setError(error.message);
    }
  };

  const getDurationMetrics = async () => {
    try {
      const result = await window.api.getDuration();
      console.log('Raw getDuration result:', result);
      if (result && result.data && result.label) {
        setDuration(result.data);
        setDurationDataLabels(result.label);
      } else {
        throw new Error('Invalid data structure returned from getDuration');
      }
    } catch (error) {
      console.error("Error in dashboard duration data:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([getInvocationMetrics(), getErrorMetrics(), getThrottleMetrics(), getDurationMetrics()]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // calculate the totals of each metric by passing in respective data into helper function
  const totalInvocations = calculateTotals(invocationsData);
  const totalErrors = calculateTotals(errorData);
  const totalThrottles = calculateTotals(throttleData);
  const totalDuration = calculateTotals(durationData);

  return (
    <div className="bg-base-100 min-h-screen text-base-content">
      <div className="w-full px-14 pb-8">
        <div className="card shadow-xl w-full bg-gradient-to-r from-primary via-secondary to-accent text-base-300">
          <div className="card-body">
            <p className="text-3xl">Welcome to Your Dashboard, User</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 mt-10">
        {/* Total Invocations */}
        <div className="card bg-base-200 shadow-lg p-4">
          <p className="text-md font-semibold mb-2">Total Invocations</p>
          <p className="text-2xl font-bold">{totalInvocations}</p>
        </div>

        {/* Total Throttles */}
        <div className="card bg-base-200 shadow-lg p-4">
          <p className="text-md font-semibold mb-2">Total Throttles</p>
          <p className="text-2xl font-bold">{totalThrottles}</p>
        </div>

        {/* Total Errors */}
        <div className="card bg-base-200 shadow-lg p-4">
          <p className="text-md font-semibold mb-2">Total Errors</p>
          <p className="text-2xl font-bold">{totalErrors}</p>
        </div>

        {/* Total Duration */}
        <div className="card bg-base-200 shadow-lg p-4">
          <p className="text-md font-semibold mb-2">Average Duration</p>
          <p className="text-2xl font-bold"> {totalDuration} ms</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 px-4">
        {/* Invocations Chart */}
        <div className="card shadow-lg bg-base-200 p-6">
          <p className="text-lg font-semibold mb-4">Invocations</p>
          <div className="w-full h-72">
            <LineChart data={invocationsData} labels={invocationsDataLabels} />
          </div>
        </div>

        {/* Errors Chart */}
        <div className="card shadow-lg bg-base-200 p-6">
          <p className="text-lg font-semibold mb-4">Errors</p>
          <div className="w-full h-72">
            <LineChart data={errorData} labels={errorDataLabels} />
          </div>
        </div>

        {/* Throttles Chart */}
        <div className="card shadow-lg bg-base-200 p-6">
          <p className="text-lg font-semibold mb-4">Throttles</p>
          <div className="w-full h-72">
            <LineChart data={throttleData} labels={throttleDataLabels} />
          </div>
        </div>

        {/* Duration Chart */}
        <div className="card shadow-lg bg-base-200 p-6">
          <p className="text-lg font-semibold mb-4">Duration</p>
          <div className="w-full h-72">
            <LineChart data={durationData} labels={durationDataLabels} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;


        {/* Donut Chart Section */}
        {/* <div className="lg:w-1/2">
          <div className="card shadow-lg bg-base-200 p-6">
            <p className="text-lg font-semibold text-base-content mb-4">
              Invocations per Function
            </p>
            <div className="h-72 flex justify-center items-center">
              <DonutChart data={donutChartData} labels={donutChartLabels} />
            </div>
          </div>
        </div> */}