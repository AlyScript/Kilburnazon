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
$notification_id = $data['notification_id'] ?? null;

if (!$notification_id) {
    echo json_encode(["error" => "Notification ID is required."]);
    http_response_code(400);
    exit;
}

$sql = "UPDATE notifications SET status = 'read' WHERE id = '$notification_id'";
if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "Notification marked as read."]);
} else {
    echo json_encode(["error" => "Error: " . $conn->error]);
}

$conn->close();
?>