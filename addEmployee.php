<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Content-Type: application/json');

// If the request method is OPTIONS, terminate the script early to handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "company_db"); // Adjust as necessary

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);

$name = $data["name"];
$position = $data["position"];
$department = $data["department"];
$salary = $data["salary"];
$email = $data["email"];
$office = $data["office"];
$dob = $data["dob"];
$hired_date = $data["hired_date"];

$sql = "INSERT INTO employees (name, position, department, salary, email, office, dob, hired_date)
        VALUES ('$name', '$position', '$department', '$salary', '$email', '$office', '$dob', '$hired_date')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "Employee added successfully"]);
} else {
    echo json_encode(["error" => "Error: " . $conn->error]);
}

$conn->close();
?>