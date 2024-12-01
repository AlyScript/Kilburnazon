import React from "react";
import "../App.css";

const SearchFilter = ({ filters, setFilters, employees }) => {
    // Safely handle employees array
    const uniqueDepartments = employees
      ? [...new Set(employees.map((emp) => emp.department))]
      : [];
    const uniqueJobTitles = employees
      ? [...new Set(employees.map((emp) => emp.position))]
      : [];
  
    return (
      <div className="search-filter">
        {/* Search by name */}
        <input
          type="text"
          placeholder="Search by name"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
  
        {/* Filter by department */}
        <select
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
        >
          <option value="">All Departments</option>
          {uniqueDepartments.map((dept, index) => (
            <option key={index} value={dept}>
              {dept}
            </option>
          ))}
        </select>
  
        {/* Filter by job title */}
        <select
          value={filters.jobTitle}
          onChange={(e) => setFilters({ ...filters, jobTitle: e.target.value })}
        >
          <option value="">All Job Titles</option>
          {uniqueJobTitles.map((title, index) => (
            <option key={index} value={title}>
              {title}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  export default SearchFilter;