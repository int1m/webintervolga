<?php

namespace models;
use Database;

require_once 'config/Database.php';

abstract class BaseModel {
    protected $conn;
    public $modelName = '';
    public $fields = [];

    public function __construct(){
        $database = new Database();
        $db = $database->getConnection();
        $this->conn = $db;
    }

    public function select() {
        $query = "select * from {$this->modelName}";

        $stmt = $this->conn->prepare($query);

        // выполняем запрос
        $stmt->execute();
        return $stmt;
    }
}