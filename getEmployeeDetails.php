<?php
// Database connection
$host = 'localhost';
$dbname = 'company_db'; // Change this to your database name
$username = 'root';
$password = '';

// Connect to MySQL
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get employee ID from request
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

$sql = "SELECT * FROM employees WHERE id = $id";
$result = $conn->query($sql);

$employee = null;
if ($result->num_rows > 0) {
    $employee = $result->fetch_assoc();
}

// Return as JSON
header('Content-Type: application/json');
echo json_encode($employee);

$conn->close();
?>