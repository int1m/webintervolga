<?php

namespace models;

use CURLFile;
use PDO;

require_once 'config/Database.php';
require_once 'BaseModel.php';

class Paintings extends BaseModel {
    protected $conn;
    public $modelName = 'paintings';
    public $fields = [
        'name',
        'description',
        'yearOfCreation',
        'authorId',
        'paintingId',
        'p_guid',
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

    public function exportPaintingsToExternalScript() {
        $stmt = $this->select();
        $paintingsArray = [];
        $paintingsArray[] = $this->fields;

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $line = [];
            foreach ($this->fields as $field) {
                $line[] = $row[$field];
            }
            $paintingsArray[] = $line;
        }

        $filePath = "storage/public/tmpFiles/paintings_exported.csv";
        $file = fopen($filePath, 'w');

        foreach ($paintingsArray as $line) {
            fputcsv($file, $line, ';');
        }

        fseek($file, 0);

        $mime = mime_content_type($filePath);
        $output = new CURLFile($filePath, $mime, 'paintings_exported.csv');

        if($curl=curl_init()) {
            $data = array(
                'file' => $output,
            );

            curl_setopt($curl, CURLOPT_URL, 'http://localhost/tretyakovgallery/v5/api/worker');
            curl_setopt($curl, CURLOPT_POST, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            $result = curl_exec($curl);
            curl_close($curl);
            fclose($file);

            return json_decode($result);
        } else {
            return false;
        }
    }

    public function importPaintingsFromLocalFile($filePath): array {
        $response = [
            'status' => true,
            'errors' => [],
        ];

        $errors = [];

        if (!file_exists($filePath)) {
            $errors[] = "$filePath не найден";
        }

        if ('csv' !== substr(strrchr($filePath, '.'), 1)) {
            $errors[] = "Файл должен быть с расширением CSV";
        }

        if (!$errors) {
            $handle = fopen($filePath, 'r');
            $headers = fgetcsv($handle, 10000, ';');

            $fieldCheck = true;
            foreach ($headers as $key => $field) {
                if (isset($this->fields[$key])) {
                    if ($field !== $this->fields[$key]) {
                        $fieldCheck = false;
                    }
                } else {
                    $fieldCheck = false;
                }
            }

            if (!$fieldCheck) {
                $headersString = implode(';', $headers);
                $errors[] = "$headersString не соответствуют заголовкам таблицы в базе данных";
            }
        }


        if (!$errors) {
            while (false !== ($row = fgetcsv($handle, 10000, ';'))) {
                if (count($row) === count($this->fields)) {
                    $associativeRow = [];
                    foreach ($row as $key => $field) {
                        $associativeRow[$this->fields[$key]] = $field;
                    }

                    $queryResponse = $this->insertOrUpdate($associativeRow);
                    if (!$queryResponse) {
                        $rowString = implode(';', $row);
                        $errors[] = "Ошибка при добавлении $rowString";
                    }
                } else {
                    $rowString = implode(';', $row);
                    $errors[] = "$rowString имеет неверное кол-во полей";
                }
            }
        }

        if ($errors) {
            $response['status'] = false;
            $response['errors'] = $errors;
        } else {
            $count = $this->count();

            $response['model'] = [
              'result' => "Файл с данными получен из {$filePath} и обработан. Таблица {$this->modelName} обновлена. Количество записей в таблице: {$count}",
            ];
        }

        return $response;
    }

    public function insertOrUpdate($associativeRow): bool {
        $query = "SELECT *
            FROM " . $this->modelName . "
            WHERE p_guid = :p_guid
            LIMIT 0,1";
        $stmt = $this->conn->prepare( $query );
        $stmt->bindParam(":p_guid", $associativeRow['p_guid']);

        if (!$stmt->execute()) {
            return false;
        }

        $updateOrInsert = false;

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            $inputSumString = "";
            $currentSumString = "";
            foreach ($this->fields as $fieldName) {
                $inputSumString = $inputSumString . $associativeRow[$fieldName];
                $currentSumString = $currentSumString . $row[$fieldName];
            }

            $inputSum = crc32($inputSumString);
            $currentSum = crc32("$currentSumString");

            if ($inputSum !== $currentSum) {
                $query = "UPDATE " . $this->modelName . " 
                    SET 
                        name = :name,
                        description = :description,
                        yearOfCreation = :yearOfCreation,
                        authorId = :authorId,
                        paintingId = :paintingId
                        WHERE p_guid = :p_guid";

                $updateOrInsert = true;
            }
        } else {
            $query = "INSERT INTO " . $this->modelName . "
                SET
                    name = :name,
                    description = :description,
                    yearOfCreation = :yearOfCreation,
                    authorId = :authorId,
                    paintingId = :paintingId,
                    p_guid = :p_guid";

            $updateOrInsert = true;
        }

        if ($updateOrInsert) {
            $stmt = $this->conn->prepare( $query );

            foreach ($this->fields as $fieldName) {
                $stmt->bindParam(":{$fieldName}", $associativeRow[$fieldName]);
            }

            if ($stmt->execute()) {
                return true;
            }
        } else {
            return true;
        }

        return false;
    }


    public function count() {
        $query = "SELECT count(*) FROM " . $this->modelName;
        $stmt = $this->conn->query( $query );

        return $stmt->fetchColumn();
    }
}