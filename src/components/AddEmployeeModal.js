import React, { useState } from "react";
import "../FormStyles.css";

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
    <div className="modal-content">
      <h2>Add Employee</h2>
      <form className="form">
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          Position:
          <input type="text" name="position" value={formData.position} onChange={handleChange} />
        </label>
        <label>
          Department:
          <input type="text" name="department" value={formData.department} onChange={handleChange} />
        </label>
        <label>
          Salary:
          <input type="number" name="salary" value={formData.salary} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <label>
          Date of Birth:
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
        </label>
        <label>
          Office:
          <input type="text" name="office" value={formData.office} onChange={handleChange} />
        </label>
        <label>
          Home Address:
          <textarea name="home_address" value={formData.home_address} onChange={handleChange} />
        </label>
        <label>
          Hired Date:
          <input type="date" name="hired_date" value={formData.hired_date} onChange={handleChange} />
        </label>
        <label>
          Contract Type:
          <select name="contract" value={formData.contract} onChange={handleChange}>
            <option value="Permanent">Permanent</option>
            <option value="Temporary">Temporary</option>
            <option value="Freelance">Freelance</option>
          </select>
        </label>
        <div className="form-buttons">
          <button type="button" className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployeeModal;