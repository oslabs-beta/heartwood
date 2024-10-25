import React, { useState, useEffect } from "react";
import LineChart from "./LineChart";
import DonutChart from "./DonutChart";
import { FaSatelliteDish, FaFireAlt, FaBug, FaClock } from "react-icons/fa";
import { CustomError, ApiResponse } from "../rendererTypes";

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
  const [userName, setUserName] = useState<string>();

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

  // TEST - Dynamic period/duration: 
  // Create variables to statically pass period and duration to each function to get AWS metrics. 

  // TODO: 
  // 1. Create states to track user's selection for period, duration. 
  // 2. Change useEffect to run these functions whenever the state is updated. 
  // 3. Update each function's parameter to get period/duration from state (before user's selection, use default value for period/duration). 
  // 4. Update UI to get user's input from pulldown menu for period and duration. 

  // TEST CODE: 
  const period = 3600;
  const duration = 24 * 60 * 60 * 1000 * 30;

  const getInvocationMetrics = async () => {
    try {      
      const result: ApiResponse<number[]> = await window.api.getInvocations(period, duration);
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
      const result: ApiResponse<number[]> = await window.api.getErrors(period, duration);
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
      const result: ApiResponse<number[]> = await window.api.getThrottles(period, duration);
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
      const result: ApiResponse<number[]> = await window.api.getDuration(period, duration);
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
    const getUserName = async() => {
      try {
        const result: ApiResponse<string> = await window.api.getUserName();
        setUserName(result.data);
      } catch (error: any) {
        console.error("Error to get user name in the dashboard");
        setError(error.message);
      }
    }
    getUserName();
  }, []);

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
  
  // TEST: passing x-axis to LineChart arguments (static for now)
  const xaxis = 'day'; // once drop down is created, this will be replaced 

  return (
    <div className="bg-base-100 min-h-screen text-base-content">
      <div className="w-full px-14 pb-8">
        <div className="card shadow-xl w-full bg-gradient-to-r from-primary via-secondary to-accent text-base-300">
          <div className="card-body">
            <p className="text-3xl">Welcome to Your Dashboard, {userName}</p>
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
            <LineChart data={invocationsData} labels={invocationsDataLabels} xaxis={xaxis} />
          </div>
        </div>

        {/* Errors Chart */}
        <div className="card shadow-lg bg-base-200 p-6">
          <p className="text-lg font-semibold mb-4">Errors</p>
          <div className="w-full h-72">
            <LineChart data={errorData} labels={errorDataLabels}  xaxis={xaxis} />
          </div>
        </div>

        {/* Throttles Chart */}
        <div className="card shadow-lg bg-base-200 p-6">
          <p className="text-lg font-semibold mb-4">Throttles</p>
          <div className="w-full h-72">
            <LineChart data={throttleData} labels={throttleDataLabels}  xaxis={xaxis} />
          </div>
        </div>

        {/* Duration Chart */}
        <div className="card shadow-lg bg-base-200 p-6">
          <p className="text-lg font-semibold mb-4">Duration</p>
          <div className="w-full h-72">
            <LineChart data={durationData} labels={durationDataLabels}  xaxis={xaxis} />
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