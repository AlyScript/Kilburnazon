<?php
session_start();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "company_db");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'];
$password = $data['password'];

$sql = "SELECT id, username, password, role FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && hash('sha256', $password) === $user['password']) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role'] = $user['role'];
    echo json_encode(["message" => "Login successful", "user_id" => $user['id'], "role" => $user['role']]);
} else {
    echo json_encode(["error" => "Invalid username or password"]);
}

$conn->close();
?>