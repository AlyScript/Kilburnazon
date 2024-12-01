<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "company_db");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

$request_id = $data['id'];
$status = $data['status'];

$sql = "UPDATE leave_requests SET status = '$status' WHERE id = '$request_id'";

if ($status === "Approved") {
    $leave_type = $data['leave_type'];
    $days = $data['days'];

    // Update leave balances
    $update_balance_sql = "
        UPDATE leave_balances 
        SET {$leave_type}_days_remaining = {$leave_type}_days_remaining - $days 
        WHERE employee_id = (SELECT employee_id FROM leave_requests WHERE id = $request_id)";
    $conn->query($update_balance_sql);
}

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "Leave request updated successfully."]);
} else {
    echo json_encode(["error" => "Error: " . $conn->error]);
}

$conn->close();
?>