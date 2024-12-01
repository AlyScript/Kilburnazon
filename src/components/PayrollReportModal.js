import React, { useState } from "react";
import "../ModalStyles.css";

const PayrollReportModal = ({ onClose, userRole }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = payrollData.slice(indexOfFirstItem, indexOfLastItem);

  // Total and average summary
  const totalPayroll = payrollData.reduce((sum, row) => sum + parseFloat(row.net_pay || 0), 0);
  const averageSalary = payrollData.length > 0 ? (totalPayroll / payrollData.length).toFixed(2) : 0;

  // Fetch payroll report
  const fetchPayrollReport = async () => {
    if (!startDate || !endDate) {
      alert("Please select a start and end date.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost/workshop/employee-directory/payrollReport.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start_date: startDate, end_date: endDate }),
      });

      if (!response.ok) throw new Error("Failed to fetch payroll report.");

      const data = await response.json();
      setPayrollData(data);
      setCurrentPage(1); // Reset to first page
    } catch (err) {
      console.error("Error fetching payroll report:", err);
    } finally {
      setLoading(false);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvContent = [
      ["Name", "Department", "Job Title", "Base Salary", "Total Bonuses", "Total Deductions", "Net Pay"],
      ...payrollData.map((row) =>
        [row.name, row.department, row.job_title, row.base_salary, row.total_bonuses, row.total_deductions, row.net_pay]
      ),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "payroll_report.csv";
    link.click();
  };

  // Sorting functionality
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    const sortedData = [...payrollData].sort((a, b) => {
      if (direction === "asc") return a[field] > b[field] ? 1 : -1;
      return a[field] < b[field] ? 1 : -1;
    });
    setSortField(field);
    setSortDirection(direction);
    setPayrollData(sortedData);
  };

  // Pagination controls
  const nextPage = () => {
    if (currentPage < Math.ceil(payrollData.length / itemsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && onClose()}>
      <div className="modal-content">
        <h2>Payroll Report</h2>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
        {/* {userRole !== "executive" && (
          <p className="error">You are not authorized to view this report.</p>
        )} */}
        {(
          <>
            <label>
              Start Date:
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </label>
            <label>
              End Date:
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </label>
            <button onClick={fetchPayrollReport}>Generate Report</button>
            <button onClick={exportToCSV} disabled={!payrollData.length}>
              Export to CSV
            </button>

            {loading && <p>Loading...</p>}

            {payrollData.length > 0 && (
              <>
                <div className="report-summary">
                  <p>Total Payroll: ${totalPayroll.toFixed(2)}</p>
                  <p>Average Salary: ${averageSalary}</p>
                </div>
                <table className="report-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort("name")}>Name</th>
                      <th onClick={() => handleSort("department")}>Department</th>
                      <th onClick={() => handleSort("job_title")}>Job Title</th>
                      <th onClick={() => handleSort("base_salary")}>Base Salary</th>
                      <th onClick={() => handleSort("total_bonuses")}>Total Bonuses</th>
                      <th onClick={() => handleSort("total_deductions")}>Total Deductions</th>
                      <th onClick={() => handleSort("net_pay")}>Net Pay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((row, index) => (
                      <tr key={index}>
                        <td>{row.name}</td>
                        <td>{row.department}</td>
                        <td>{row.job_title}</td>
                        <td>{row.base_salary || "N/A"}</td>
                        <td>{row.total_bonuses}</td>
                        <td>{row.total_deductions}</td>
                        <td>{row.net_pay}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pagination-controls">
                  <button onClick={prevPage} disabled={currentPage === 1}>
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {Math.ceil(payrollData.length / itemsPerPage)}
                  </span>
                  <button onClick={nextPage} disabled={currentPage === Math.ceil(payrollData.length / itemsPerPage)}>
                    Next
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PayrollReportModal;