<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "company_db");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

$request_id = $data['id'];
$status = $data['status'];

$sql = "UPDATE leave_requests SET status = '$status' WHERE id = '$request_id'";

if ($conn->query($sql) === TRUE) {
    if ($status === "Approved") {
        $leave_type = $data['leave_type'];
        $days = $data['days'];

        // Update leave balances
        $balance_update_sql = "
            UPDATE leave_balances 
            SET {$leave_type}_days_remaining = {$leave_type}_days_remaining - $days
            WHERE employee_id = (SELECT employee_id FROM leave_requests WHERE id = $request_id)";
        $conn->query($balance_update_sql);
    }

    echo json_encode(["message" => "Leave request updated successfully."]);
} else {
    echo json_encode(["error" => "Error: " . $conn->error]);
}

$conn->close();
?>