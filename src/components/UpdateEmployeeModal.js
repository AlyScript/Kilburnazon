import React, { useState } from "react";
import "../FormStyles.css";

const UpdateEmployeeModal = ({ employee, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    position: employee.position || "",
    salaryIncrease: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (formData.position && formData.salaryIncrease) {
      onUpdate(employee.id, formData.position, parseFloat(formData.salaryIncrease));
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <div className="modal-content">
      <h2>Promote Employee</h2>
      <form className="form">
        <label>
          Position:
          <input type="text" name="position" value={formData.position} onChange={handleChange} />
        </label>
        <label>
          Salary Increase (%):
          <input
            type="number"
            name="salaryIncrease"
            value={formData.salaryIncrease}
            onChange={handleChange}
          />
        </label>
        <div className="form-buttons">
          <button type="button" className="submit-button" onClick={handleSubmit}>
            Update
          </button>
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEmployeeModal;