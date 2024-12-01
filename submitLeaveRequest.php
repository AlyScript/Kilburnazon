<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$conn = new mysqli("localhost", "root", "", "company_db");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

$employee_id = $data['employee_id'];
$leave_type = $data['leave_type'];
$start_date = $data['start_date'];
$end_date = $data['end_date'];
$comments = $data['comments'];

// Insert leave request
$sql = "INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, comments)
        VALUES ('$employee_id', '$leave_type', '$start_date', '$end_date', '$comments')";

if ($conn->query($sql) === TRUE) {
    // Fetch the manager for this employee
    file_put_contents("debug_log.txt", "Leave request added successfully.\n", FILE_APPEND);
    $managerSql = "SELECT manager_id FROM employees WHERE id = '$employee_id'";
    $managerResult = $conn->query($managerSql);
    
    if ($managerResult && $managerResult->num_rows > 0) {
        $managerRow = $managerResult->fetch_assoc();
        $manager_id = $managerRow['manager_id'];

        // Insert notification for the manager
        $message = "New leave request from employee ID $employee_id";
        $notificationSql = "INSERT INTO notifications (manager_id, message) VALUES ('$manager_id', '$message')";
        $conn->query($notificationSql);
    }

    echo json_encode(["message" => "Leave request submitted successfully."]);
} else {
    file_put_contents("debug_log.txt", "SQL Error: " . $conn->error . "\n", FILE_APPEND);
    echo json_encode(["error" => "Error: " . $conn->error]);
}

$conn->close();
?>