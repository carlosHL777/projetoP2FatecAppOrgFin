<?php
$host = "localhost";
$user = "root";
$pass = "usbw"; 
$db   = "p12semteste_paginicial";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}