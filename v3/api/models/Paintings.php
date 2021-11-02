<?php

namespace models;

use Database;

require_once 'config/Database.php';
require_once 'BaseModel.php';

class Paintings extends BaseModel {
    protected $conn;
    public $modelName = 'paintings';
    public $fields = [
        'id',
        'name',
        'description',
        'yearOfCreation',
        'authorId',
    ];

    public function selectWithParams($requestParams) {
        $query = "select * from {$this->modelName}";

        $params = [];
        if (array_key_exists('name', $requestParams)) {
            $params[] = "name like '%{$requestParams['name']}%'";
        }

        if (array_key_exists('yearStart', $requestParams)) {
            $year = intval($requestParams['yearStart']);
            $params[] = "yearOfCreation > {$year}";
        }

        if (array_key_exists('yearEnd', $requestParams)) {
            $year = intval($requestParams['yearEnd']);
            $params[] = "yearOfCreation < {$year}";
        }

        if (array_key_exists('author', $requestParams)) {
            $author = intval($requestParams['author']);
            $params[] = "authorId = {$author}";
        }

        if ($params) {
            $query .= " where";

            foreach ($params as $key => $value) {
                if ($key != count($params) - 1) {
                    $query .= " {$value} and";
                } else {
                    $query .= " {$value}";
                }
            }
        }

        $stmt = $this->conn->prepare($query);

        $stmt->execute();
        return $stmt;
    }
}