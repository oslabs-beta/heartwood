import React, { useState, useEffect } from "react";

type FunctionNames = string[];

const Functions: React.FC = () => {
  const [functions, setFunctions] = useState<FunctionNames[]>([]);

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

  useEffect(() => {
    getFunctionList();
  }, []);

  return (
    <div className="overflow-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 text-base-content">
        Lambda Functions
      </h2>
      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th className="text-left text-base-content">Function Name</th>
            </tr>
          </thead>
          <tbody>
            {functions.length > 0 ? (
              functions.map((funcName, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-base-content">{funcName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="text-center px-4 py-2 text-base-content"
                  colSpan={1}
                >
                  No functions available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Functions;
