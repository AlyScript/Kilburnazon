import React from "react";

const EmployeeCard = ({ employee, onClick, onDelete }) => {
  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden transform transition duration-200 hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={employee.photo || "https://i.pinimg.com/564x/04/b0/17/04b0170e4d380b58f5f96ad52b1e006b.jpg"}
          alt={`${employee.name}`}
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center text-white font-bold text-lg opacity-0 hover:opacity-100 transition-opacity duration-300">
          View Details
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">{employee.name}</h2>
        <p className="text-gray-600">{employee.position}</p>
        <p className="text-gray-500">{employee.department}</p>
        <p className="text-gray-400 text-sm">{employee.email}</p>
      </div>
      {onDelete && (
        <div className="p-4">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the card click
              onDelete();
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeCard;