<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

$conn = new mysqli("localhost", "root", "", "company_db");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Prepare the query
$sql = "SELECT 
    e.id AS employee_id, 
    e.name, 
    e.department, 
    e.position AS job_title, 
    e.salary AS base_salary,
    IFNULL(SUM(b.amount), 0) AS total_bonuses,
    IFNULL(SUM(d.amount), 0) AS total_deductions,
    (e.salary + IFNULL(SUM(b.amount), 0) - IFNULL(SUM(d.amount), 0)) AS net_pay
FROM employees e
LEFT JOIN bonuses_allowances b ON e.id = b.employee_id
LEFT JOIN deductions d ON e.id = d.employee_id
GROUP BY e.id, e.name, e.department, e.position, e.salary
ORDER BY e.department, e.position";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["error" => "Database error: " . $conn->error]);
    exit;
}

// Fetch the data into an array
$payrollData = [];
while ($row = $result->fetch_assoc()) {
    $payrollData[] = $row;
}

// Ensure only JSON is output
echo json_encode($payrollData);

$conn->close();