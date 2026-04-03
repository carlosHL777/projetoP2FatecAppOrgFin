<?php
header('Content-Type: application/json');
include 'db.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($data) {
    
    $stmt = $conn->prepare("INSERT INTO transacoes (codigo, data_reg, descricao, categoria, tipo, valor) VALUES (?, ?, ?, ?, ?, ?)");
    
    if (!$stmt) {
        echo json_encode(['success' => false, 'error' => $conn->error]);
        exit;
    }

    $stmt->bind_param("issssd", 
        $data['codigo'], 
        $data['data'], 
        $data['descricao'], 
        $data['categoria'], 
        $data['tipo'], 
        $data['valor']
    );
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Dados não recebidos pelo PHP']);
}
?>