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
file_put_contents("debug_log.txt", print_r($data, true), FILE_APPEND); // Debugging

$request_id = $data['id'];
$status = $data['status'];
$leave_type = $data['leave_type'];
$days = $data['days'];

// Update leave request status
$sql = "UPDATE leave_requests SET status = '$status' WHERE id = '$request_id'";

if ($conn->query($sql) === TRUE) {
    if ($status === "Approved") {
        // Ensure the employee has a leave balance entry
        $check_balance_sql = "INSERT INTO leave_balances (employee_id, annual_leave) 
                              SELECT employee_id, 30 
                              FROM leave_requests 
                              WHERE id = $request_id 
                              AND NOT EXISTS (
                                  SELECT 1 
                                  FROM leave_balances 
                                  WHERE employee_id = (SELECT employee_id FROM leave_requests WHERE id = $request_id)
                              )";
        $conn->query($check_balance_sql);

        // Update leave balance
        $balance_update_sql = "
            UPDATE leave_balances 
            SET annual_leave = annual_leave - $days
            WHERE employee_id = (SELECT employee_id FROM leave_requests WHERE id = $request_id)";
        
        if ($conn->query($balance_update_sql) === TRUE) {
            echo json_encode(["message" => "Leave request updated successfully and leave balance adjusted."]);
        } else {
            file_put_contents("debug_log.txt", "Error updating balance: " . $conn->error . "\n", FILE_APPEND);
            echo json_encode(["message" => "Leave request updated, but leave balance adjustment failed.", "error" => $conn->error]);
        }
    } else {
        echo json_encode(["message" => "Leave request updated successfully."]);
    }
} else {
    echo json_encode(["error" => "Error updating leave request: " . $conn->error]);
}

$conn->close();
?>