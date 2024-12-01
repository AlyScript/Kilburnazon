import React from "react";
import "../App.css";

const EmployeeDetailsModal = ({ employee, onClose }) => {
  if (!employee) return null;

  // Fallback salary handling
  const formattedSalary = employee.salary
    ? `$${employee.salary.toLocaleString()}`
    : "Not Available";

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>{employee.name}</h2>
        <img
          src={employee.photo || "https://via.placeholder.com/150"}
          alt={`${employee.name}`}
        />
        <p><strong>Position:</strong> {employee.position}</p>
        <p><strong>Department:</strong> {employee.department}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Office:</strong> {employee.office}</p>
        <p><strong>Start Date:</strong> {employee.hired_date}</p>
        <p><strong>Salary:</strong> {formattedSalary}</p>
        <p><strong>Annual Leave Balance:</strong> {employee.leaveBalance} days</p>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};
// 62946

export default EmployeeDetailsModal;