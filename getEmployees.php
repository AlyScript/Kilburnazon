<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
?>

<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>

<?php
// Database connection
$host = 'localhost';
$dbname = 'company_db'; // Change this to your database name
$username = 'root'; // Default XAMPP username
$password = ''; // Default XAMPP password

// Connect to MySQL
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch employees
$sql = "SELECT id, name, position, department, salary, email, office, hired_date FROM employees";
$result = $conn->query($sql);

$employees = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $employees[] = $row;
    }
}

// Return as JSON
header('Content-Type: application/json');
echo json_encode($employees);

$conn->close();
?>