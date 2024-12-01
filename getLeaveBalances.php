<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "company_db");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$employee_id = $_GET['employee_id'] ?? null;

if (!$employee_id) {
    echo json_encode(["error" => "Employee ID is required"]);
    http_response_code(400); // Bad Request
    exit;
}

$sql = "SELECT annual_leave FROM leave_balances WHERE employee_id = $employee_id";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode(["annual_leave" => $row['annual_leave']]);
} else {
    echo json_encode(["annual_leave" => "N/A"]);
}

$conn->close();
?>