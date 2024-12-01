import React, { useState } from "react";
import "../FormStyles.css";

const LeaveRequestForm = ({ onSubmit, onClose, selectedEmployee }) => {
  const [formData, setFormData] = useState({
    leave_type: "Sick",
    start_date: "",
    end_date: "",
    comments: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Submit button clicked."); // Debugging log
    console.log("Form data:", formData); // Debugging log
  
    // Ensure selectedEmployee exists
    if (!selectedEmployee || !selectedEmployee.id) {
      alert("No employee selected. Please select an employee before requesting leave.");
      return;
    }

    console.log("Selected employee in LeaveRequestForm:", selectedEmployee);
  
    // Validate required fields
    if (!formData.start_date || !formData.end_date) {
      alert("Please fill in all required fields.");
      return;
    }
  
    // Combine employee ID with form data
    const payload = {
      ...formData,
      employee_id: selectedEmployee.id,
    };
  
    console.log("Payload to submit:", payload); // Debugging log
    onSubmit(payload); // Pass the payload to the parent handler
  };

  return (
    <div className="modal-content">
      <h2>Request Leave</h2>
      <form className="leave-form">
        <label>
          Leave Type:
          <select name="leave_type" value={formData.leave_type} onChange={handleChange}>
            <option value="Sick">Sick</option>
            <option value="Vacation">Vacation</option>
            <option value="Personal">Personal</option>
          </select>
        </label>
        <label>
          Start Date:
          <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} />
        </label>
        <label>
          End Date:
          <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} />
        </label>
        <label>
          Comments:
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            placeholder="Optional comments..."
          ></textarea>
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

export default LeaveRequestForm;