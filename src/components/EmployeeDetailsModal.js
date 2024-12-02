import React from "react";
import "../App.css";

const EmployeeDetailsModal = ({ 
  employee, 
  onClose, 
  onPromote, 
  onRequestLeave 
}) => {
  if (!employee) return null;

  // Fallback salary handling
  const formattedSalary = employee.salary
    ? `$${employee.salary.toLocaleString()}`
    : "Not Available";

  return (
    <div
      className="fixed top-0 right-0 h-full sm:w-96 bg-white shadow-lg z-50 border-l border-gray-200 transform transition-transform duration-300 ease-in-out pointer-events-auto"
    >
      <div className="p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
        >
          &times;
        </button>

        {/* Employee Details */}
        <h2 className="text-2xl font-bold text-gray-800">{employee.name}</h2>
        <img
          src={
            employee.photo ||
            "https://i.pinimg.com/564x/04/b0/17/04b0170e4d380b58f5f96ad52b1e006b.jpg"
          }
          alt={`${employee.name}`}
          className="w-24 h-24 rounded-full mx-auto my-4"
        />
        <p className="text-gray-600"><strong>Position:</strong> {employee.position}</p>
        <p className="text-gray-600"><strong>Department:</strong> {employee.department}</p>
        <p className="text-gray-600"><strong>Email:</strong> {employee.email}</p>
        <p className="text-gray-600"><strong>Office:</strong> {employee.office}</p>
        <p className="text-gray-600"><strong>Start Date:</strong> {employee.hired_date}</p>
        <p className="text-gray-600"><strong>Salary:</strong> {formattedSalary}</p>
        <p className="text-gray-600">
          <strong>Annual Leave Balance:</strong> {employee.leaveBalance} days
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => onPromote(employee.id)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            Promote
          </button>
          <button
            onClick={() => onRequestLeave(employee.id)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md"
          >
            Request Leave
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;