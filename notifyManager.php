<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "company_db");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Fetch pending leave requests and their managers
$sql = "SELECT lr.id AS leave_request_id, e.manager_id
        FROM leave_requests lr
        INNER JOIN employees e ON lr.employee_id = e.id
        WHERE lr.status = 'Pending' AND lr.notified = FALSE";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $notified_requests = []; // Track which requests are notified

    // Prepare the notification insertion statement
    $stmt = $conn->prepare("INSERT INTO notifications (manager_id, message) VALUES (?, ?)");
    while ($row = $result->fetch_assoc()) {
        $leave_request_id = $row['leave_request_id'];
        $manager_id = $row['manager_id'];

        // Create a notification message
        $message = "New leave request ID $leave_request_id requires your attention.";

        // Execute the prepared statement
        $stmt->bind_param("is", $manager_id, $message);
        if ($stmt->execute()) {
            $notified_requests[] = $leave_request_id;
        }
    }

    // Update the notified status for relevant leave requests
    if (!empty($notified_requests)) {
        $update_sql = "UPDATE leave_requests SET notified = TRUE WHERE id IN (" . implode(',', $notified_requests) . ")";
        $conn->query($update_sql);
    }

    echo json_encode(["message" => "Notifications sent to managers."]);
} else {
    echo json_encode(["message" => "No new leave requests to notify."]);
}

$conn->close();
?>