<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "company_db");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$sql = "SELECT * FROM CurrentMonthBirthdays";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $birthdays = [];
    while ($row = $result->fetch_assoc()) {
        $birthdays[] = $row;
    }
    echo json_encode($birthdays);
} else {
    echo json_encode([]);
}

$conn->close();
?>