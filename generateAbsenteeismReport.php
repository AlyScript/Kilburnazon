<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "company_db");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Get filter parameters
$start_date = $_GET['start_date'] ?? null;
$end_date = $_GET['end_date'] ?? null;

if (!$start_date || !$end_date) {
    echo json_encode(["error" => "Start date and end date are required."]);
    http_response_code(400); // Bad Request
    exit;
}

// Query to fetch absenteeism data
$sql = "
    SELECT 
        e.department,
        lr.leave_type,
        COUNT(*) AS total_absences,
        SUM(DATEDIFF(lr.end_date, lr.start_date) + 1) AS total_days_absent,
        ROUND(SUM(DATEDIFF(lr.end_date, lr.start_date) + 1) / COUNT(DISTINCT e.id), 2) AS average_days_absent
    FROM leave_requests lr
    JOIN employees e ON lr.employee_id = e.id
    WHERE lr.status = 'Approved' 
      AND lr.start_date >= '$start_date' 
      AND lr.end_date <= '$end_date'
    GROUP BY e.department, lr.leave_type
    ORDER BY e.department, lr.leave_type
";

$result = $conn->query($sql);

if ($result) {
    $report = [];
    while ($row = $result->fetch_assoc()) {
        $report[] = $row;
    }
    echo json_encode($report);
} else {
    echo json_encode(["error" => "Error generating report: " . $conn->error]);
}

$conn->close();
?>