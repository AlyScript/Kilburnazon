import React, { useEffect, useState } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("http://localhost/workshop/employee-directory/getNotifications.php")
      .then((res) => res.json())
      .then((data) => setNotifications(data));
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.map((notif) => (
        <p key={notif.id}>New leave request #{notif.leave_request_id} for approval.</p>
      ))}
    </div>
  );
};

export default Notifications;