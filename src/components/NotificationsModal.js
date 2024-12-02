import React from "react";

const NotificationsModal = ({ notifications, onClose, markAsRead }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Notifications</h2>
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notification, index) => (
              <li
                key={index}
                className="border-b py-2 flex justify-between items-center"
              >
                <p>{notification.message}</p>
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-blue-500 text-sm"
                >
                  Mark as Read
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No new notifications.</p>
        )}
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;