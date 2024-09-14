// import React, { useState, useEffect } from "react";
// import LineChart from "./LineChart";
// import DonutChart from "./DonutChart";

// const Dashboard = () => {
//   const [invocationsData, setInvocations] = useState(() => JSON.parse(localStorage.getItem('invocationsData')) || []);
//   const [invocationsDataLabels, setInvocationsLabels] = useState(() => JSON.parse(localStorage.getItem('invocationsLabels')) || []);
//   const [errorData, setErrors] = useState(() => JSON.parse(localStorage.getItem('errorData')) || []);
//   const [errorDataLabels, setErrorLabels] = useState(() => JSON.parse(localStorage.getItem('errorLabels')) || []);

//   // Function to fetch invocation metrics from the backend
//   const getInvocationMetrics = async () => {
//     try {
//       const result = await window.api.getInvocations();
//       setInvocations(result.data);  
//       setInvocationsLabels(result.label);
      
//       // Store data in localStorage
//       localStorage.setItem('invocationsData', JSON.stringify(result.data));
//       localStorage.setItem('invocationsLabels', JSON.stringify(result.label));
//     } catch (error) {
//       console.log("Error in dashboardjsx invocation data:", error);
//     }
//   };

//   // Function to fetch error count metrics from the backend
//   const getErrorMetrics = async () => {
//     try {
//       const result = await window.api.getErrors();
//       setErrors(result.data);  
//       setErrorLabels(result.label);

//       // Store data in localStorage
//       localStorage.setItem('errorData', JSON.stringify(result.data));
//       localStorage.setItem('errorLabels', JSON.stringify(result.label));
//     } catch (error) {
//       console.log("Error in dashboardjsx errors data:", error);
//     }
//   };

//   // Fetch the invocation and error metrics when the component mounts only if data is empty
//   useEffect(() => {
//     if (invocationsData.length === 0) getInvocationMetrics();
//     if (errorData.length === 0) getErrorMetrics();
//   }, [invocationsData, errorData]);

//     // Sample data for the donut chart
//   const donutChartData = [300, 50, 100, 150, 250]; // Sample metric data for donut chart
//   const donutChartLabels = ["Lambda1", "Lambda2", "Lambda3", "Lambda4", "Lambda5"]; // Labels for the donut chart sections

//   return (
//     <div className="bg-base-100 min-h-screen text-base-content">
//       <div className="w-full px-14 pb-8">
//         <div className="card shadow-xl w-full bg-gradient-to-r from-primary via-secondary to-accent text-base-300">
//           <div className="card-body">
//             <p className="text-3xl">Welcome to Your Dashboard, User</p>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col lg:flex-row justify-center gap-8 mt-10">
//         {/* Line Chart Section */}
//         <div className="lg:w-1/2">
//           <div className="card shadow-lg bg-base-200 p-6">
//             <p className="text-lg font-semibold text-base-content mb-4">
//               Invocation Count
//             </p>
//             <div className="w-full h-96">
//               <LineChart data={invocationsData} labels={invocationsDataLabels} />
//             </div>
//           </div>
//         </div>
//         <div className="lg:w-1/2">
//           <div className="card shadow-lg bg-base-200 p-6">
//             <p className="text-lg font-semibold text-base-content mb-4">
//               Error count
//             </p>
//             <div className="w-full h-96">
//               <LineChart data={errorData} labels={errorDataLabels}/>
//             </div>
//           </div>
//         </div>
//         {/* Donut Chart Section */}
//         <div className="lg:w-1/2">
//           <div className="card shadow-lg bg-base-200 p-6">
//             <p className="text-lg font-semibold text-base-content mb-4">
//               Invocations per Function
//             </p>
//             <div className="h-72 flex justify-center items-center">
//               <DonutChart data={donutChartData} labels={donutChartLabels} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Dashboard;

// import React, { useState, useEffect } from "react";
// import LineChart from "./LineChart";
// import DonutChart from "./DonutChart";

// const Dashboard = () => {
//   const [invocationsData, setInvocations] = useState([]);
//   const [invocationsDataLabels, setInvocationsLabels] = useState([]);
//   const [errorData, setErrors] = useState([]);
//   const [errorDataLabels, setErrorLabels] = useState([]);

//   // Function to fetch invocation metrics from the backend
//   const getInvocationMetrics = async () => {
//     try {
//       const result = await window.api.getInvocations();
//       console.log('result of calling getInovcationMetrics is', result);
//       setInvocations(result.data);  
//       setInvocationsLabels(result.label);
//     } catch (error) {
//       console.log("Error in dashboard invocation data:", error);
//     }
//   };

//   // Function to fetch error count metrics from the backend
//   const getErrorMetrics = async () => {
//     try {
//       const result = await window.api.getErrors();
//       setErrors(result.data);  
//       setErrorLabels(result.label);
//     } catch (error) {
//       console.log("Error in dashboard errors data:", error);
//     }
//   };

//   // Fetch the invocation and error metrics when the component mounts
//   useEffect(() => {
//     getInvocationMetrics();
//     getErrorMetrics();
//   }, []);

//   console.log('invoc data is', invocationsData);
//   // Sample data for the donut chart
//   const donutChartData = [300, 50, 100, 150, 250]; // Sample metric data for donut chart
//   const donutChartLabels = ["Lambda1", "Lambda2", "Lambda3", "Lambda4", "Lambda5"]; // Labels for the donut chart sections

//   return (
//     <div className="bg-base-100 min-h-screen text-base-content">
//       <div className="w-full px-14 pb-8">
//         <div className="card shadow-xl w-full bg-gradient-to-r from-primary via-secondary to-accent text-base-300">
//           <div className="card-body">
//             <p className="text-3xl">Welcome to Your Dashboard, User</p>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col lg:flex-row justify-center gap-8 mt-10">
//         {/* Line Chart Section */}
//         <div className="lg:w-1/2">
//           <div className="card shadow-lg bg-base-200 p-6">
//             <p className="text-lg font-semibold text-base-content mb-4">
//               Invocation Count
//             </p>
//             <div className="w-full h-96">
//               <LineChart data={invocationsData} labels={invocationsDataLabels} />
//             </div>
//           </div>
//         </div>
//         <div className="lg:w-1/2">
//           <div className="card shadow-lg bg-base-200 p-6">
//             <p className="text-lg font-semibold text-base-content mb-4">
//               Error count
//             </p>
//             <div className="w-full h-96">
//               <LineChart data={errorData} labels={errorDataLabels}/>
//             </div>
//           </div>
//         </div>
//         {/* Donut Chart Section */}
//         <div className="lg:w-1/2">
//           <div className="card shadow-lg bg-base-200 p-6">
//             <p className="text-lg font-semibold text-base-content mb-4">
//               Invocations per Function
//             </p>
//             <div className="h-72 flex justify-center items-center">
//               <DonutChart data={donutChartData} labels={donutChartLabels} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([getInvocationMetrics(), getErrorMetrics(), getThrottleMetrics()]);
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
              Errors
            </p>
            <div className="w-full h-96">
              <LineChart data={errorData} labels={errorDataLabels}/>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2">
          <div className="card shadow-lg bg-base-200 p-6">
            <p className="text-lg font-semibold text-base-content mb-4">
              Throttles
            </p>
            <div className="w-full h-96">
              <LineChart data={throttleData} labels={throttleDataLabels}/>
            </div>
          </div>
        </div>
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
      </div>
    </div>
  );
};
export default Dashboard;