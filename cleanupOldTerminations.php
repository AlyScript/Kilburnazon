<?php
$conn = new mysqli("localhost", "root", "", "company_db");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "DELETE FROM contract_terminations WHERE termination_date < NOW() - INTERVAL 3 YEAR";
$conn->query($sql);
$conn->close();
?>