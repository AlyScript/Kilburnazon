<?php
header('Access-Control-Allow-Origin: http://localhost:3000'); // Update with your frontend URL
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

session_start();
header('Content-Type: application/json');

if (session_destroy()) {
    echo json_encode(["success" => true, "message" => "Logged out successfully."]);
} else {
    echo json_encode(["success" => false, "error" => "Failed to destroy the session."]);
}
?>