import React, { useState, useEffect } from "react";
import EmployeeCard from "./components/EmployeeCard";
import EmployeeDetailsModal from "./components/EmployeeDetailsModal";
import SearchFilter from "./components/SearchFilter";
import AddEmployeeModal from "./components/AddEmployeeModal";
import UpdateEmployeeModal from "./components/UpdateEmployeeModal";
import LeaveRequestForm from "./components/LeaveRequestForm";
import LeaveApprovalModal from "./components/LeaveApprovalModal";
import PayrollReportModal from "./components/PayrollReportModal";
import BirthdayModal from "./components/BirthdayModal";
import Login from "./components/LoginPage";
import Navbar from "./components/Navbar"

import "./App.css";
import "./ReportStyles.css";

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isLeaveRequestOpen, setIsLeaveRequestOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);
  const [birthdays, setBirthdays] = useState([]);
  const [loadingBirthdays, setLoadingBirthdays] = useState(false);
  const [filters, setFilters] = useState({ search: "", department: "", jobTitle: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [absenteeismReport, setAbsenteeismReport] = useState([]);
  const [reportFilters, setReportFilters] = useState({ start_date: "", end_date: "" });
  const [currentUser, setCurrentUser] = useState(null);
  const [isLeaveRequestsModalOpen, setIsLeaveRequestsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5;
  const totalPages = Math.ceil(leaveRequests.length / requestsPerPage);
  const paginatedRequests = leaveRequests.slice(
    (currentPage - 1) * requestsPerPage,
    currentPage * requestsPerPage
  );


  const fetchCurrentUser = async () => {
    try {
      console.log("Fetching current user..."); // Debugging log
      const response = await fetch("http://localhost/workshop/employee-directory/getCurrentUser.php");
      const data = await response.json();
      console.log("Current user data:", data); // Debugging log
  
      if (data.user_id) {
        setCurrentUser(data); // Set user if logged in
      } else {
        console.warn(data.error || "No user logged in"); // Log the error message
        setCurrentUser(null); // Ensure `currentUser` is null
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
      setCurrentUser(null); // Set `currentUser` to null on fetch error
    }
  };

  const handleLogout = async () => {
    try {
      console.log("Attempting to log out..."); // Debugging log
  
      const response = await fetch("http://localhost/workshop/employee-directory/logout.php", {
        method: "POST",
      });
  
      console.log("Raw Response:", response);
  
      const data = await response.json();
  
      console.log("Parsed Response:", data);
  
      if (data.success) {
        setCurrentUser(null); // Clear user session
        alert(data.message || "Logged out successfully");
      } else {
        alert(data.error || "Failed to log out.");
      }
    } catch (err) {
      console.error("Error during logout:", err);
      alert("Logout failed. Please try again.");
    }
  };
  
  const fetchBirthdays = async () => {
    setLoadingBirthdays(true);
    try {
      const response = await fetch("http://localhost/workshop/employee-directory/getCurrentBirthdays.php");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setBirthdays(data);
    } catch (err) {
      console.error("Error fetching birthdays:", err);
    } finally {
      setLoadingBirthdays(false);
      setIsBirthdayModalOpen(true); // Open modal after fetching
    }
  };
  
  const fetchAbsenteeismReport = async () => {
    try {
      const { start_date, end_date } = reportFilters;
      const response = await fetch(
        `http://localhost/workshop/employee-directory/generateAbsenteeismReport.php?start_date=${start_date}&end_date=${end_date}`
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setAbsenteeismReport(data);
    } catch (err) {
      console.error("Error fetching absenteeism report:", err);
    }
  };

  const deleteEmployee = async (employeeId) => {
    const payload = { employee_id: employeeId, deleted_by: currentUser.user_id };
    console.log("Payload sent to deleteEmployee API:", payload);
  
    try {
      const response = await fetch("http://localhost/workshop/employee-directory/deleteEmployee.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      console.log("Raw API Response:", response);
  
      // Check if the response is empty
      const text = await response.text();
      console.log("Raw Response Text:", text);
  
      // Try parsing the response
      try {
        const json = JSON.parse(text);
        return json;
      } catch (error) {
        console.error("Error parsing response JSON:", error);
        return { error: "Invalid JSON response from the server." };
      }
    } catch (error) {
      console.error("Error in deleteEmployee API call:", error);
      return { error: "Network or server error occurred." };
    }
  };

  // Fetch employees from the backend
  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost/workshop/employee-directory/getEmployees.php");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setEmployees(data);
      setFilteredEmployees(data); // Initialize filtered employees
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to load employee data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filter employees dynamically
  useEffect(() => {
    // Start with all employees
    let filtered = [...employees];
  
    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter((emp) =>
        emp.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
  
    // Apply department filter
    if (filters.department) {
      filtered = filtered.filter((emp) => emp.department === filters.department);
    }
  
    // Apply job title filter
    if (filters.jobTitle) {
      filtered = filtered.filter((emp) => emp.position === filters.jobTitle);
    }
  
    // Update filtered employees
    setFilteredEmployees(filtered);
  }, [filters, employees]);

  // Fetch data on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch Individual Leave Balance
  const fetchEmployeeLeaveBalance = async (employeeId) => {
    try {
      console.log(`Fetching leave balance for employee ID: ${employeeId}`); // Debugging
      const response = await fetch(
        `http://localhost/workshop/employee-directory/getLeaveBalances.php?employee_id=${employeeId}`
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log("API Response:", data); // Debugging
      return data.annual_leave;
    } catch (err) {
      console.error("Error fetching leave balance:", err);
      return "N/A";
    }
  };

  // Fetch Leave balances
  const [leaveBalances, setLeaveBalances] = useState([]);

  const fetchLeaveBalances = async () => {
    try {
      const response = await fetch("http://localhost/workshop/employee-directory/getLeaveBalances.php");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setLeaveBalances(data);
    } catch (err) {
      console.error("Error fetching leave balances:", err);
    }
  };

  useEffect(() => {
    fetchLeaveBalances();
  }, []);

  // Fetch leave requests from the backend
  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch(
        "http://localhost/workshop/employee-directory/getPendingLeaveRequests.php"
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setLeaveRequests(data);
    } catch (err) {
      console.error("Error fetching leave requests:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchLeaveRequests();
  }, []);

  // Filter employees when filters change
  useEffect(() => {
    if (!employees.length) return;

    let filtered = employees;

    if (filters.search) {
      filtered = filtered.filter((emp) =>
        emp.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.department) {
      filtered = filtered.filter((emp) => emp.department === filters.department);
    }
    if (filters.jobTitle) {
      filtered = filtered.filter((emp) => emp.position === filters.jobTitle);
    }

    setFilteredEmployees(filtered);
  }, [filters, employees]);

  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        "http://localhost/workshop/employee-directory/getNotifications.php"
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log("Fetched Notifications:", data); // Debugging
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost/workshop/employee-directory/markNotificationAsRead.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notification_id: notificationId }),
        }
      );
  
      if (response.ok) {
        setNotifications((prevNotifications) => {
          const updatedNotifications = { ...prevNotifications };
  
          // Iterate through each manager's notifications
          Object.keys(updatedNotifications).forEach((managerId) => {
            updatedNotifications[managerId].notifications = updatedNotifications[managerId].notifications.filter(
              (notif) => notif.id !== notificationId
            );
          });
  
          // Return the updated notifications object
          return updatedNotifications;
        });
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Handle leave request approval/denial
  const handleUpdateLeaveRequest = (id, decision, leaveType, totalDays) => {
    fetch("http://localhost/workshop/employee-directory/approveLeaveRequest.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: decision, leave_type: leaveType, days: totalDays }),
    })
      .then((res) => {
        if (res.ok) {
          setLeaveRequests((prev) => prev.filter((request) => request.id !== id)); // Remove the processed request
          setIsApprovalModalOpen(false); // Close modal
        } else {
          throw new Error("Failed to update leave request.");
        }
      })
      .catch((err) => console.error("Error updating leave request:", err));
  };

  const handleDeleteEmployee = async (employeeId) => {
    const confirmation = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmation) return;
  
    if (!currentUser || !currentUser.user_id) {
      alert("You must be logged in to perform this action.");
      return;
    }
  
    const result = await deleteEmployee(employeeId); // Call the reusable API function
  
    console.log("API result in handleDeleteEmployee:", result); // Debugging
  
    if (result && result.message) {
      alert(result.message || "Employee deleted successfully.");
      fetchEmployees(); // Refresh the employee list
    } else if (result && result.error) {
      alert(result.error || "Failed to delete employee.");
    } else {
      alert("Unexpected error during deletion.");
    }
  };

    // Centralized Effect for Data Fetching
    useEffect(() => {
      if (currentUser) {
        fetchEmployees();
        fetchLeaveRequests();
        fetchNotifications();
        fetchLeaveBalances();
      }
    }, [currentUser]);
  
    useEffect(() => {
      fetchCurrentUser();
    }, []);

  
    // Loading State
    if (loading) return <h1>Loading employee data...</h1>;
    if (error) return <h1 className="error">{error}</h1>;

    if (!currentUser) {
      return <Login onLogin={setCurrentUser} />;
    }

  return (
    <div className="app">
      {/* <h1>Employee Directory</h1> */}

      {/* Navbar */}
      <Navbar onLogout={handleLogout} />

      {/* Search and Filter */}
      <SearchFilter
        filters={filters} 
        setFilters={setFilters} 
        employees={employees} 
      />

      {/* Add Action Buttons */}
      <div className="action-buttons">
        <button onClick={handleLogout}>Logout</button>
        <button onClick={fetchBirthdays} className="birthday-button">
          View Birthdays
        </button>
        {isBirthdayModalOpen && (
          <BirthdayModal
            birthdays={birthdays}
            onClose={() => setIsBirthdayModalOpen(false)}
            />
          )}

          {loadingBirthdays && <p>Loading birthdays...</p>}

        <button onClick={() => setIsAddModalOpen(true)}>Add Employee</button>
        <button onClick={() => setIsReportModalOpen(true)}>View Absenteeism Report</button>
        {selectedEmployee && (
          <>
            <button onClick={() => setIsUpdateModalOpen(true)}>Promote Employee</button>
            <button onClick={() => setIsLeaveRequestOpen(true)}>Request Leave</button>
          </>
        )}
        <button
        onClick={() => setIsLeaveRequestsModalOpen(true)}
        className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded shadow"
      >
        View Leave Requests
      </button>
        {/* <button onClick={() => fetchLeaveRequests()}>Refresh Leave Requests</button> */}
      </div>

      {/* Notifications */}
      <div className="notifications">
      <h2>Notifications</h2>
      {Object.keys(notifications).length > 0 ? (
        Object.entries(notifications).map(([managerId, managerData]) => (
          <div key={managerId} className="manager-notifications">
            <h3>{managerData.manager_name}'s Notifications</h3>
            <ul>
              {managerData.notifications.map((notification) => (
                <li key={notification.id}>
                  <p>{notification.message}</p>
                  <small>Created at: {new Date(notification.created_at).toLocaleString()}</small>
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="mark-as-read-button"
                  >
                    Mark as Read
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No new notifications.</p>
      )}
      </div>

      {/* Filters and Employee Grid */}
      <div className="employee-grid">
      {filteredEmployees.length > 0 ? (
        filteredEmployees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onClick={async () => {
              const leaveBalance = await fetchEmployeeLeaveBalance(employee.id);
              setSelectedEmployee({ ...employee, leaveBalance });
            }}
            onDelete={() => handleDeleteEmployee(employee.id)} // Add delete handler
          />
        ))
      ) : (
        <p>No employees found matching your criteria.</p>
      )}
    </div>

    {/* Leave Requests
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Pending Leave Requests</h2>
      {leaveRequests.length > 0 ? (
        <div className="space-y-4">
          {leaveRequests.map((request) => (
            <div
              key={request.id}
              className="p-4 bg-gray-100 rounded-lg border border-gray-300 hover:shadow-lg transition-shadow flex justify-between items-center"
            >
              <div>
                <p className="text-gray-700">
                  <span className="font-bold">{request.employee_name}</span> ({request.leave_type})
                </p>
                <p className="text-sm text-gray-500">
                  From: {request.start_date} To: {request.end_date}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedRequest(request);
                  setIsApprovalModalOpen(true);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
              >
                Review
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No pending leave requests.</p>
      )}
    </div> */}

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && setIsAddModalOpen(false)}>
          <AddEmployeeModal
            onClose={() => setIsAddModalOpen(false)}
            onAdd={(newEmployee) => {
              fetch("http://localhost/workshop/employee-directory/addEmployee.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEmployee),
              }).then(() => fetchEmployees());
            }}
          />
        </div>
      )}

      {/* Update Employee Modal */}
      {isUpdateModalOpen && selectedEmployee && (
        <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && setIsUpdateModalOpen(false)}>
          <UpdateEmployeeModal
            employee={selectedEmployee}
            onClose={() => setIsUpdateModalOpen(false)}
            onUpdate={(id, position, salaryIncrease) => {
              fetch("http://localhost/workshop/employee-directory/updateEmployee.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, position, salaryIncrease }),
              }).then(() => fetchEmployees());
            }}
          />
        </div>
      )}

      {/* Leave Request Form Modal */}
      {isLeaveRequestOpen && selectedEmployee && (
        <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && setIsLeaveRequestOpen(false)}>
          <LeaveRequestForm
          selectedEmployee={selectedEmployee} // Pass the selected employee
          onSubmit={(formData) => {
            console.log("Leave request payload received in App.js:", formData); // Log the payload

            fetch("http://localhost/workshop/employee-directory/submitLeaveRequest.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            })
              .then((res) => {
                console.log("API Response:", res); // Log API response
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
              })
              .then((data) => {
                console.log("API Data:", data); // Log API data
                setIsLeaveRequestOpen(false); // Close the modal after success
              })
              .catch((err) => console.error("Error submitting leave request:", err));
          }}
          onClose={() => setIsLeaveRequestOpen(false)}
          fetchNotifications={fetchNotifications}
          />
        </div>
      )}

      {/* Leave Approval Modal */}
      {isApprovalModalOpen && selectedRequest && (
        <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && setIsApprovalModalOpen(false)}>
          <LeaveApprovalModal
            request={selectedRequest}
            onClose={() => setIsApprovalModalOpen(false)}
            onUpdate={handleUpdateLeaveRequest}
          />
        </div>
      )}

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {/* Absenteeism Report Modal */}
      {isReportModalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && setIsReportModalOpen(false)}>
          <div className="modal-content">
            <h2>Absenteeism Report</h2>
            <label>
              Start Date:
              <input
                type="date"
                value={reportFilters.start_date}
                onChange={(e) => setReportFilters({ ...reportFilters, start_date: e.target.value })}
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={reportFilters.end_date}
                onChange={(e) => setReportFilters({ ...reportFilters, end_date: e.target.value })}
              />
            </label>
            <button onClick={fetchAbsenteeismReport}>Generate Report</button>

            <div className="report-table">
              {absenteeismReport.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Leave Type</th>
                      <th>Total Absences</th>
                      <th>Total Days Absent</th>
                      <th>Average Days Absent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {absenteeismReport.map((row, index) => (
                      <tr key={index}>
                        <td>{row.department}</td>
                        <td>{row.leave_type}</td>
                        <td>{row.total_absences}</td>
                        <td>{row.total_days_absent}</td>
                        <td>{row.average_days_absent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No data available for the selected period.</p>
              )}
            </div>
            <button className="close-button" onClick={() => setIsReportModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button onClick={() => setIsPayrollModalOpen(true)}>Generate Payroll Report</button>
      </div>

      {/* Payroll Report Modal */}
      {isPayrollModalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && setIsPayrollModalOpen(false)}>
          <PayrollReportModal onClose={() => setIsPayrollModalOpen(false)} />
        </div>
      )}

      {/* Leave Requests Modal */}
      {isLeaveRequestsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-3/4 max-h-3/4 overflow-y-auto rounded-lg shadow-lg">
            <div className="flex justify-between items-center p-4 bg-blue-600 text-white">
              <h2 className="text-xl font-bold">Pending Leave Requests</h2>
              <button
                onClick={() => setIsLeaveRequestsModalOpen(false)}
                className="text-sm bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Close
              </button>
            </div>
            <div className="p-4">
              {paginatedRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 mb-4 bg-gray-100 rounded-lg border border-gray-300 flex justify-between items-center"
                >
                  <div>
                    <p className="text-gray-700">
                      <span className="font-bold">{request.employee_name}</span> ({request.leave_type})
                    </p>
                    <p className="text-sm text-gray-500">
                      From: {request.start_date} To: {request.end_date}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setIsApprovalModalOpen(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
                  >
                    Review
                  </button>
                </div>
              ))}

              {/* Pagination Controls */}
              <div className="flex justify-center mt-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-l disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-white border">{currentPage}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-r disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
