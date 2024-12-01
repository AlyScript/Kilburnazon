<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Connect to the database
$conn = new mysqli("localhost", "root", "", "company_db");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Query to fetch unread notifications for all managers
$sql = "
    SELECT 
        n.id AS notification_id,
        n.manager_id,
        n.message,
        n.created_at,
        n.status,
        e.name AS manager_name
    FROM notifications n
    JOIN employees e ON n.manager_id = e.id
    WHERE n.status = 'unread'
    ORDER BY n.manager_id, n.created_at DESC
";

// Log the query
file_put_contents("debug_log.txt", "SQL Query: " . $sql . "\n", FILE_APPEND);

$result = $conn->query($sql);

if ($result) {
    $notifications = [];
    while ($row = $result->fetch_assoc()) {
        $manager_id = $row['manager_id'];
        if (!isset($notifications[$manager_id])) {
            $notifications[$manager_id] = [
                'manager_name' => $row['manager_name'],
                'notifications' => []
            ];
        }
        $notifications[$manager_id]['notifications'][] = [
            'id' => $row['notification_id'],
            'message' => $row['message'],
            'created_at' => $row['created_at']
        ];
    }

    echo json_encode($notifications);
} else {
    file_put_contents("debug_log.txt", "Error: " . $conn->error . "\n", FILE_APPEND);
    echo json_encode(["error" => "Error fetching notifications: " . $conn->error]);
}

$conn->close();
?>