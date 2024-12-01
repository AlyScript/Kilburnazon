import React from "react";
import "../FormStyles.css";

const ApproveDenyRequests = ({ requests, onUpdate }) => {
  return (
    <div>
      <h2>Leave Requests</h2>
      {requests.map((request) => (
        <div key={request.id}>
          <p>{request.leave_type} Leave: {request.start_date} to {request.end_date}</p>
          <button onClick={() => onUpdate(request.id, "Approved")}>Approve</button>
          <button onClick={() => onUpdate(request.id, "Denied")}>Deny</button>
        </div>
      ))}
    </div>
  );
};

export default ApproveDenyRequests;