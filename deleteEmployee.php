<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Database connection
$conn = new mysqli("localhost", "root", "", "company_db");
if ($conn->connect_error) {
    error_log("Database connection failed: " . $conn->connect_error);
    echo json_encode(["error" => "Database connection failed."]);
    exit;
}

// Parse JSON input
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    error_log("Invalid JSON input.");
    echo json_encode(["error" => "Invalid JSON input."]);
    exit;
}

$employee_id = $data['employee_id'] ?? null;
$deleted_by = $data['deleted_by'] ?? null;

if (!$employee_id || !$deleted_by) {
    error_log("Missing required fields: employee_id or deleted_by.");
    echo json_encode(["error" => "Missing required fields."]);
    exit;
}

error_log("Attempting to delete employee ID: $employee_id by user ID: $deleted_by");

// Fetch employee details
$fetch_sql = "SELECT id, name, department, position FROM employees WHERE id = ?";
$fetch_stmt = $conn->prepare($fetch_sql);
if (!$fetch_stmt) {
    error_log("Prepare failed: " . $conn->error);
    echo json_encode(["error" => "Database error: " . $conn->error]);
    exit;
}
$fetch_stmt->bind_param("i", $employee_id);
$fetch_stmt->execute();
$result = $fetch_stmt->get_result();

if ($result->num_rows === 0) {
    error_log("Employee ID $employee_id not found.");
    echo json_encode(["error" => "Employee not found."]);
    exit;
}

$employee = $result->fetch_assoc();
$name = $employee['name'];
$department = $employee['department'];
$position = $employee['position'];

// Log termination
$log_sql = "INSERT INTO contract_terminations (employee_id, name, department, position, deleted_by) 
            VALUES (?, ?, ?, ?, ?)";
$log_stmt = $conn->prepare($log_sql);
if (!$log_stmt) {
    error_log("Prepare failed for logging: " . $conn->error);
    echo json_encode(["error" => "Database error: " . $conn->error]);
    exit;
}
$log_stmt->bind_param("isssi", $employee_id, $name, $department, $position, $deleted_by);
if (!$log_stmt->execute()) {
    error_log("Error logging termination for employee ID $employee_id: " . $log_stmt->error);
    echo json_encode(["error" => "Error logging termination."]);
    exit;
}

// Delete employee
$delete_sql = "DELETE FROM employees WHERE id = ?";
$delete_stmt = $conn->prepare($delete_sql);
if (!$delete_stmt) {
    error_log("Prepare failed for delete: " . $conn->error);
    echo json_encode(["error" => "Database error: " . $conn->error]);
    exit;
}
$delete_stmt->bind_param("i", $employee_id);
if ($delete_stmt->execute()) {
    if ($delete_stmt->affected_rows > 0) {
        error_log("Employee ID $employee_id deleted successfully.");
        echo json_encode(["message" => "Employee deleted successfully."]);
    } else {
        error_log("No rows affected for employee ID $employee_id.");
        echo json_encode(["error" => "Employee deletion failed."]);
    }
} else {
    error_log("Error deleting employee ID $employee_id: " . $delete_stmt->error);
    echo json_encode(["error" => "Error deleting employee."]);
}

$conn->close();
?>