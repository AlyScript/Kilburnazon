<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "company_db");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$sql = "SELECT lr.id, e.name AS employee_name, lr.leave_type, lr.start_date, lr.end_date, 
               DATEDIFF(lr.end_date, lr.start_date) + 1 AS total_days, lr.comments
        FROM leave_requests lr
        JOIN employees e ON lr.employee_id = e.id
        WHERE lr.status = 'Pending'";

$result = $conn->query($sql);
$data = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);

$conn->close();
?>