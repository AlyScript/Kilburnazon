import React from "react";
import "../App.css";

const EmployeeCard = ({ employee, onClick, onDelete }) => {
  return (
    <div className="employee-card" onClick={onClick}>
      <img
        src={employee.photo || "https://via.placeholder.com/150"}
        alt={`${employee.name}`}
        className="employee-photo"
      />
      <h2>{employee.name}</h2>
      <p>{employee.position}</p>
      <p>{employee.department}</p>
      <p>{employee.email}</p>
      {/* <button onClick={onClick}>View Details</button> */}
      {onDelete && (
        <button onClick={onDelete} className="delete-button">
          Delete
        </button>
      )}
    </div>
  );
};

export default EmployeeCard;