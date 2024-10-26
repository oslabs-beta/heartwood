import React, { useState, useEffect } from "react";

interface Log {
  message: string;
  timestamp: string;
}

type Functions = string[];
type LogStreams = string[];

const Logs: React.FC = () => {
  const [logFilter, setLogFilter] = useState<"all" | "reports">("all");
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [functions, setFunctions] = useState<Functions[]>([]);
  const [logStreams, setLogStreams] = useState<LogStreams[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFunction, setSelectedFunction] = useState("");
  const [selectedLogStream, setSelectedLogStream] = useState(""); 
  const [timePeriod, setTimePeriod] = useState<"1D" | "7D" | "14D" | "30D">(
    "30D"
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

  const getLogStreams = async () => {
    try {
      console.log('selected function is', selectedFunction);
      const result = await window.api.getLambdaLogStreams(selectedFunction);
      if (result && Array.isArray(result)) {
        setLogStreams(result);
      } else {
        throw new Error ("Invalid data structure returned from getLogStreams");
      }
    } catch (error: any) {
      console.log("Error in getLogStreams", error);
    }
  }

  useEffect(() => {
    getFunctionList();
  }, []);
  // Fetch log streams when the selected function changes
  useEffect(() => {
    getLogStreams();
  }, [selectedFunction]);

  useEffect(() => {
    getLogs();
  }, [selectedLogStream])

  // function to fetch logs from the backend (static right now, pass in selected function?)
  const getLogs = async () => {
    try {
      const result = await window.api.getLambdaLogEvents(selectedFunction, selectedLogStream);
      console.log("getLogs result is", result);
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

  // Update filteredLogs whenever logs or filters change
  useEffect(() => {
    const getTimeRangeInMillis = () => {
      const now = Date.now();
      switch (timePeriod) {
        case "1D": return now - 24 * 60 * 60 * 1000; // Last 1 day
        case "7D": return now - 7 * 24 * 60 * 60 * 1000; // Last 7 days
        case "14D": return now - 14 * 24 * 60 * 60 * 1000; // Last 14 days
        case "30D": return now - 30 * 24 * 60 * 60 * 1000; // Last 30 days
        default: return now;
      }
    };

    // Filter logic for logs
    const filtered = logs
      .filter((log) => {
        const matchesLogFilter = logFilter === "all" || log.message.includes("REPORT");
        const matchesSearchTerm = !searchTerm || log.message.toLowerCase().includes(searchTerm.toLowerCase());
        const withinTimePeriod = Number(log.timestamp) >= getTimeRangeInMillis();
        return matchesLogFilter && matchesSearchTerm && withinTimePeriod;
      })
      .sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

    setFilteredLogs(filtered);
  }, [logs, logFilter, searchTerm, timePeriod]);

  return (
    <div className="container flex flex-col w-full overflow-auto p-4">
      <div className="bg-base-100 shadow-lg rounded-lg p-6">
        {/* Flex container */}
        <div className="flex flex-wrap gap-4 items-center mb-4">
          {/* Function names dropdown */}
          <div className="relative w-full max-w-[175px]">
            <select
              value={selectedFunction}
              onChange={(e) => setSelectedFunction(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">Select function</option>
              {functions.map((funcName, index) => (
                <option key={index} value={funcName}>
                  {funcName}
                </option>
              ))}
            </select>
          </div>
  
          {/* Log streams dropdown */}
          <div className="relative w-full max-w-[175px]">
            <select
              value={selectedLogStream}
              onChange={(e) => setSelectedLogStream(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">Select Log Stream</option>
              {logStreams.map((logStream, index) => (
                <option key={index} value={logStream}>
                  {logStream}
                </option>
              ))}
            </select>
          </div>
  
          {/* Filter buttons */}
          <div className="btn-group">
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
          <div className="relative w-full max-w-[100px]">
            <select
              value={timePeriod}
              onChange={(e) =>
                setTimePeriod(e.target.value as "1D" | "7D" | "14D" | "30D")
              }
              className="select select-bordered w-full"
            >
              <option value="1D">1D</option>
              <option value="7D">7D</option>
              <option value="14D">14D</option>
              <option value="30D">30D</option>
            </select>
          </div>
          {/* Search bar */}
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
        </div>
  
        {/* Logs display */}
        <div className="bg-base-200 p-4 rounded-lg shadow">
          <ul className="space-y-2">
            {filteredLogs.map((log, index) => (
              <li key={index} className="text-base-content">
                <strong>{new Date(Number(log.timestamp)).toLocaleString()}</strong>: {log.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
  
};

export default Logs;
