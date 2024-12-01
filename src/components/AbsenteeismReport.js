import React, { useState, useEffect } from "react";

const AbsenteeismReport = ({ startDate, endDate }) => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(
          `http://localhost/workshop/employee-directory/generateAbsenteeismReport.php?start_date=${startDate}&end_date=${endDate}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReportData(data);
      } catch (err) {
        console.error("Failed to fetch absenteeism report:", err);
        setError("Failed to load absenteeism report. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [startDate, endDate]);

  if (loading) {
    return (
      <div className="text-center text-blue-500 text-lg font-semibold">
        Loading absenteeism report...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-lg font-semibold">{error}</div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Absenteeism Report</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border border-gray-300 px-4 py-2 text-left">Department</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Total Absences</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Total Days Absent</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Average Days Absent</th>
            </tr>
          </thead>
          <tbody>
            {reportData.length > 0 ? (
              reportData.map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200`}
                >
                  <td className="border border-gray-300 px-4 py-2">{row.department}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.total_absences}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.total_days_absent}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {parseFloat(row.average_days_absent).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-gray-500 border border-gray-300 px-4 py-2"
                >
                  No absenteeism data available for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AbsenteeismReport;