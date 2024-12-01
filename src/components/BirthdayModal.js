import React from "react";
import "../ModalStyles.css"; // Ensure you have styling for modals

const BirthdayModal = ({ birthdays, onClose }) => {
  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && onClose()}>
      <div className="modal-content">
        <h2>Birthdays This Month</h2>
        {birthdays.length > 0 ? (
          <ul>
            {birthdays.map((birthday) => (
              <li key={birthday.employee_id}>
                {birthday.name} - {birthday.birthday} ({birthday.job_title}, {birthday.department})
              </li>
            ))}
          </ul>
        ) : (
          <p>No birthdays this month.</p>
        )}
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default BirthdayModal;