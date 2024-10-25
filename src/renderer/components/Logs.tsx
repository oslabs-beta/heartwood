import React, { useState, useEffect } from "react";

interface Log {
  message: string;
  timestamp: string;
}

type Functions = string[];

const Logs: React.FC = () => {
  const [logFilter, setLogFilter] = useState<"all" | "reports">("all");
  const [logs, setLogs] = useState<Log[]>([]);
  const [functions, setFunctions] = useState<Functions[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFunction, setSelectedFunction] = useState("");
  const [timePeriod, setTimePeriod] = useState<"1D" | "7D" | "14D" | "30D">(
    "1D"
  );

  const getFunctionList = async () => {
    try {
      const result = await window.api.getFunctionNameList();
      if (result && Array.isArray(result)) {
        setFunctions(result);
      } else {
        throw new Error("Invalid data structure returned from getFunctionList");
      }
    } catch (error: any) {
      console.log("Error in get function list data", error);
    }
  };

  // Fetch logs when the selected function changes
  useEffect(() => {
      getLogs();
  }, []);

  useEffect(() => {
    getFunctionList();
  }, []);

  // function to fetch logs from the backend (static right now, pass in selected function?)
  const getLogs = async () => {
    try {

      const result = await window.api.getLambdaLogEvents();
      // console.log("getLogs result is", result);
      // check if result exists and if its correct data type (arr)
      if (result && Array.isArray(result)) {
        setLogs(result);
      } else {
        throw new Error("Invalid data structure returned from getLogs");
      }
    } catch (error: any) {
      console.error("Error in logs data:", error);
    }
  };

    // Helper function to get the time range in milliseconds for the selected period
    const getTimeRangeInMillis = () => {
      const now = Date.now();
      switch (timePeriod) {
        case "1D":
          return now - 24 * 60 * 60 * 1000; // Last 1 day
        case "7D":
          return now - 7 * 24 * 60 * 60 * 1000; // Last 7 days
        case "14D":
          return now - 14 * 24 * 60 * 60 * 1000; // Last 14 days
        case "30D":
          return now - 30 * 24 * 60 * 60 * 1000; // Last 30 days
        default:
          return now;
      }
    };
  
  // Sort logs by timestamp (newest first)
  const sortedLogs = [...logs].sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp)
  );

  // Combined filter logic for log type, search term, and time period
  const filteredLogs = sortedLogs.filter((log) => {
    const matchesLogFilter =
      logFilter === "all" || log.message.includes("REPORT");
    const matchesSearchTerm =
      searchTerm === "" ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by timestamp (time period)
    const logTimestamp = Number(log.timestamp); 
    const withinTimePeriod = logTimestamp >= getTimeRangeInMillis();

    return matchesLogFilter && matchesSearchTerm && withinTimePeriod;
  });

  return (
    <div className="container flex flex-col w-full overflow-auto p-4">
      <div className="bg-base-100 shadow-lg rounded-lg p-6">
        {/* Flex container */}
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Function names dropdown */}
          <div className="relative w-full max-w-xs">
            <select
              value={selectedFunction}
              onChange={(e) => {
                setSelectedFunction(e.target.value);
                console.log("Selected function:", e.target.value); // Check selected value
              }}
              className="select select-bordered w-full flex-grow mb-3 xl:mb-0"
            >
              <option value="">Select function</option>
              {functions.map((funcName, index) => (
                <option key={index} value={funcName}>
                  {funcName}
                </option>
              ))}
            </select>
          </div>
          {/* Search bar with dropdown */}
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full flex-grow"
            />
          </div>
          {/* Filter buttons */}
          <div className="btn-group mb-3 xl:mb-0">
            <button
              onClick={() => setLogFilter("all")}
              className={`btn ${logFilter === "all" ? "btn-active" : ""}`}
            >
              All logs
            </button>
            <button
              onClick={() => setLogFilter("reports")}
              className={`btn ${logFilter === "reports" ? "btn-active" : ""}`}
            >
              Reports
            </button>
          </div>

          {/* Time period dropdown */}
          <div className="relative w-full max-w-xs">
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value as "1D" | "7D" | "14D" | "30D")}
              className="select select-bordered w-full"
            >
              <option value="1D">1 Day</option>
              <option value="7D">7 Days</option>
              <option value="14D">14 Days</option>
              <option value="30D">30 Days</option>
            </select>
          </div>
        </div>

        {/* Logs display */}
        <div className="bg-base-200 p-4 rounded-lg shadow">
          <ul className="space-y-2">
            {filteredLogs.map((log, index) => (
              <li key={index} className="text-base-content">
                {/* Display the log timestamp and message */}
                <strong>
                  {new Date(Number(log.timestamp)).toLocaleString()}
                </strong>
                : {log.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Logs;
