import React, { useState, useEffect } from "react";
import LineChart from "./LineChart";
import DonutChart from "./DonutChart";
import { FaSatelliteDish, FaFireAlt, FaBug, FaClock } from "react-icons/fa";
import { CustomError, ApiResponse } from "../renderTypes";

const Dashboard: React.FC = () => {
  const [invocationsData, setInvocations] = useState<number[]>([]);
  const [invocationsDataLabels, setInvocationsLabels] = useState<string[]>([]);
  const [errorData, setErrors] = useState<number[]>([]);
  const [errorDataLabels, setErrorLabels] = useState<string[]>([]);
  const [throttleData, setThrottles] = useState<number[]>([]);
  const [throttleDataLabels, setThrottleDataLabels] = useState<string[]>([]);
  const [durationData, setDuration] = useState<number[]>([]);
  const [durationDataLabels, setDurationDataLabels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // helper function to calculate totals of each metric, using reduce to accumulate the values
  const calculateTotals = (data: number[]): number => {
    if (!data || !Array.isArray(data)) return 0;
    return data.reduce((total, current) => total + current, 0);
  }

// helper function to calculate average of specific metric (duration)
  const calculateAverage = (data: number[]): number => {
    if (!data || !Array.isArray(data) || data.length === 0) return 0;
    const total = data.reduce((total, current) => total + current, 0);
    return total / data.length;
  }
// helper function to calculate cost
  // const calculateCost = () => {

  // }

  const getInvocationMetrics = async () => {
    try {
      const result: ApiResponse<number[]> = await window.api.getInvocations();
      console.log('Raw getInvocations result:', result);
      if (result && result.data && result.label) {
        setInvocations(result.data);
        setInvocationsLabels(result.label);
      } else {
        throw new Error('Invalid data structure returned from getInvocations');
      }
    } catch (error: any) {
      console.error("Error in dashboard invocation data:", error);
      setError(error.message);
    }
  };

  const getErrorMetrics = async () => {
    try {
      const result: ApiResponse<number[]> = await window.api.getErrors();
      console.log('Raw getErrors result:', result);
      if (result && result.data && result.label) {
        setErrors(result.data);
        setErrorLabels(result.label);
      } else {
        throw new Error('Invalid data structure returned from getErrors');
      }
    } catch (error: any) {
      console.error("Error in dashboard errors data:", error);
      setError(error.message);
    }
  };

  const getThrottleMetrics = async () => {
    try {
      const result: ApiResponse<number[]> = await window.api.getThrottles();
      console.log('Raw getThrottles result:', result);
      if (result && result.data && result.label) {
        setThrottles(result.data);
        setThrottleDataLabels(result.label);
      } else {
        throw new Error('Invalid data structure returned from getErrors');
      }
    } catch (error: any) {
      console.error("Error in dashboard throttles data:", error);
      setError(error.message);
    }
  };

  const getDurationMetrics = async () => {
    try {
      const result: ApiResponse<number[]> = await window.api.getDuration();
      console.log('Raw getDuration result:', result);
      if (result && result.data && result.label) {
        setDuration(result.data);
        setDurationDataLabels(result.label);
      } else {
        throw new Error('Invalid data structure returned from getDuration');
      }
    } catch (error: any) {
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
  const averageDuration = calculateAverage(durationData);

  return (
    <div className="bg-base-100 min-h-screen text-base-content">
      <div className="w-full px-14 pb-8">
        <div className="card shadow-xl w-full bg-gradient-to-r from-primary via-secondary to-accent text-base-300">
          <div className="card-body">
            <p className="text-3xl">Welcome to Your Dashboard, User</p>
          </div>
        </div>
      </div>
  
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
        {/* Total Invocations */}
        <div className="card bg-base-200 shadow-lg p-2 flex items-center space-x-2">
          <div className="flex items-center">
            <FaSatelliteDish className="text-blue-500 text-2xl mr-2" /> 
            <div>
              <p className="text-sm font-semibold mb-1">Total Invocations</p>
              <p className="text-xl font-bold">{totalInvocations}</p>
            </div>
          </div>
        </div>

        {/* Total Throttles */}
        <div className="card bg-base-200 shadow-lg p-2 flex items-center space-x-2">
          <div className="flex items-center">
            <FaFireAlt className="text-red-500 text-2xl mr-2" /> 
            <div>
              <p className="text-sm font-semibold mb-1">Total Throttles</p>
              <p className="text-xl font-bold">{totalThrottles}</p>
            </div>
          </div>
        </div>

        {/* Total Errors */}
        <div className="card bg-base-200 shadow-lg p-2 flex items-center space-x-2">
          <div className="flex items-center">
            <FaBug className="text-green-500 text-2xl mr-2" /> 
            <div>
              <p className="text-sm font-semibold mb-1">Total Errors</p>
              <p className="text-xl font-bold">{totalErrors}</p>
            </div>
          </div>
        </div>

        {/* Average Duration */}
        <div className="card bg-base-200 shadow-lg p-2 flex items-center space-x-2">
          <div className="flex items-center">
            <FaClock className="text-yellow-500 text-2xl mr-2" /> 
            <div>
              <p className="text-sm font-semibold mb-1">Average Duration</p>
              <p className="text-xl font-bold">{averageDuration.toFixed(2)} ms</p>
            </div>
          </div>
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