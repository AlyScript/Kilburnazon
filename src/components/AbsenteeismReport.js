import React, { useState, useEffect } from "react";
import "../ReportStyles.css";

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
    return <h2>Loading absenteeism report...</h2>;
  }

  if (error) {
    return <h2 className="error">{error}</h2>;
  }

  return (
    <div>
      <h2>Absenteeism Report</h2>
      <table>
        <thead>
          <tr>
            <th>Department</th>
            <th>Total Absences</th>
            <th>Total Days Absent</th>
            <th>Average Days Absent</th>
          </tr>
        </thead>
        <tbody>
          {reportData.length > 0 ? (
            reportData.map((row, index) => (
              <tr key={index}>
                <td>{row.department}</td>
                <td>{row.total_absences}</td>
                <td>{row.total_days_absent}</td>
                <td>{parseFloat(row.average_days_absent).toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No absenteeism data available for this period.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AbsenteeismReport;