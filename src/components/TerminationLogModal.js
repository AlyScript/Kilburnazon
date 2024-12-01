import React, { useState, useEffect } from "react";

const TerminationLogModal = ({ onClose }) => {
  const [terminationLogs, setTerminationLogs] = useState([]);

  useEffect(() => {
    const fetchTerminationLogs = async () => {
      try {
        const response = await fetch("http://localhost/workshop/employee-directory/getTerminationLogs.php");
        const data = await response.json();
        setTerminationLogs(data);
      } catch (err) {
        console.error("Error fetching termination logs:", err);
      }
    };

    fetchTerminationLogs();
  }, []);

  return (
    <div className="modal-content">
      <h2>Contract Terminations Log</h2>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Position</th>
            <th>Termination Date</th>
            <th>Deleted By</th>
          </tr>
        </thead>
        <tbody>
          {terminationLogs.map((log) => (
            <tr key={log.id}>
              <td>{log.employee_id}</td>
              <td>{log.name}</td>
              <td>{log.department}</td>
              <td>{log.position}</td>
              <td>{log.termination_date}</td>
              <td>{log.deleted_by}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default TerminationLogModal;