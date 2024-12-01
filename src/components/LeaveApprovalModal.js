import React, { useState } from "react";
import "../FormStyles.css";

const LeaveApprovalModal = ({ request, onClose, onUpdate }) => {
  const [decision, setDecision] = useState("");

  const handleSubmit = () => {
    if (decision) {
      onUpdate(request.id, decision, request.leave_type, request.total_days);
    } else {
      alert("Please select a decision.");
    }
  };

  return (
    <div className="modal-content">
      <h2>Review Leave Request</h2>
      <p><strong>Employee:</strong> {request.employee_name}</p>
      <p><strong>Leave Type:</strong> {request.leave_type}</p>
      <p><strong>Dates:</strong> {request.start_date} to {request.end_date}</p>
      <p><strong>Total Days:</strong> {request.total_days}</p>
      <p><strong>Comments:</strong> {request.comments || "None"}</p>

      <form className="form">
        <label>
          Decision:
          <select value={decision} onChange={(e) => setDecision(e.target.value)}>
            <option value="">Select</option>
            <option value="Approved">Approve</option>
            <option value="Denied">Deny</option>
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

export default LeaveApprovalModal;