import React, { useState } from "react";

const AddEmployeeModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "",
    salary: "",
    email: "",
    dob: "",
    office: "",
    home_address: "",
    hired_date: "",
    contract: "Permanent",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (formData.name && formData.position && formData.department) {
      onAdd(formData);
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Add Employee</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Position:</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Department:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Salary:</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Office:</label>
          <input
            type="text"
            name="office"
            value={formData.office}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Home Address:</label>
          <textarea
            name="home_address"
            value={formData.home_address}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hired Date:</label>
          <input
            type="date"
            name="hired_date"
            value={formData.hired_date}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contract Type:</label>
          <select
            name="contract"
            value={formData.contract}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          >
            <option value="Permanent">Permanent</option>
            <option value="Temporary">Temporary</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black font-medium px-4 py-2 rounded-lg shadow"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg shadow"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployeeModal;