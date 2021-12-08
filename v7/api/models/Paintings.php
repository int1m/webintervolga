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

        if (array_key_exists('p_guid', $requestParams)) {
            $p_guid= intval($requestParams['p_guid']);
            $params[] = "p_guid = {$p_guid}";
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

    private function guid($data = null) {
        // Generate 16 bytes (128 bits) of random data or use the data passed into the function.
        $data = $data ?? random_bytes(16);
        assert(strlen($data) == 16);

        // Set version to 0100
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        // Set bits 6-7 to 10
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);

        // Output the 36 character UUID.
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    public function create($params, $files) {
        $response = [
            'status' => true,
            'errors' => [],
        ];

        $query = "INSERT INTO " . $this->modelName . "
                SET
                    name = :name,
                    description = :description,
                    yearOfCreation = :yearOfCreation,
                    authorId = :authorId,
                    p_guid = :p_guid";

        $stmt = $this->conn->prepare($query);

        $paintingsFields = [
            'name' => null,
            'description' => null,
            'yearOfCreation' => null,
            'authorId' => null,
        ];

        foreach (array_keys($paintingsFields) as $field) {
            if (!array_key_exists($field, $params)) {
                $response['errors'][] = "Поле $field не отправлено";
                $response['status'] = false;
            }
        }


        if (!isset($files['file'])) {
            $response['errors'][] = "Файл не отправлен";
            $response['status'] = false;
        }

        if ($response['status']) {
            foreach (array_keys($paintingsFields) as $key) {
                $this->fields[$key] = $params[$key];
            }

            foreach (array_keys($paintingsFields) as $key) {
                $stmt->bindParam(":$key", $this->fields[$key]);
            }

            $guid = $this->guid();

            $stmt->bindParam(":p_guid", $guid);

            if (!$stmt->execute()) {
                $response['errors'][] = 'Ошибка выполнения запроса создания записи';
                return $response;
            }

            $uploadPath = "storage/images/paintings/";
            $uploadFile = $uploadPath . $guid . '.jpg';

            move_uploaded_file($_FILES['file']['tmp_name'], $uploadFile);
        }

        return $response;
    }

    public function edit($params, $files, $p_guid) {
        $response = [
            'status' => true,
            'errors' => [],
        ];

        $query = "SELECT *
            FROM " . $this->modelName . "
            WHERE p_guid = :p_guid
            LIMIT 0,1";
        $stmt = $this->conn->prepare( $query );
        $stmt->bindParam(":p_guid", $p_guid);

        if (!$stmt->execute()) {
            $response['errors'][] = 'Ошибка выполнения запроса выборки';
            return $response;
        }

        if ($stmt->rowCount() > 0) {
            $paintingsFields = [
                'name' => null,
                'description' => null,
                'yearOfCreation' => null,
                'authorId' => null,
            ];

            foreach (array_keys($paintingsFields) as $field) {
                if (!array_key_exists($field, $params)) {
                    $response['errors'][] = "Поле $field не отправлено";
                    $response['status'] = false;
                }
            }

            if ($response['status']) {
                $query = "UPDATE " . $this->modelName . "
                SET
                    name = :name,
                    description = :description,
                    yearOfCreation = :yearOfCreation,
                    authorId = :authorId,
                    p_guid = :p_guid
                    WHERE p_guid = :p_guid
                    ";

                $stmt = $this->conn->prepare( $query );
                $stmt->bindParam(":p_guid", $p_guid);

                foreach (array_keys($paintingsFields) as $key) {
                    $this->fields[$key] = $params[$key];
                }

                foreach (array_keys($paintingsFields) as $key) {
                    $stmt->bindParam(":$key", $this->fields[$key]);
                }

                $stmt->bindParam(":p_guid", $p_guid);

                if (!$stmt->execute()) {
                    $response['errors'][] = 'Ошибка выполнения запроса обновления';
                    return $response;
                }

                if (isset($files['file'])) {
                    $imagePath = "storage/images/paintings/{$p_guid}.jpg";

                    if (file_exists($imagePath)) {
                        unlink($imagePath);
                    }

                    $uploadPath = "storage/images/paintings/";
                    $uploadFile = $uploadPath . $p_guid . '.jpg';

                    move_uploaded_file($_FILES['file']['tmp_name'], $uploadFile);
                }
            }
        } else {
            $response['errors'][] = "Запись {$p_guid} не найдена";
        }

        return $response;
    }

    public function deleteByGuid($p_guid) {
        $response = [
            'status' => false,
            'model' => 'putAction',
            'errors' => [],
        ];

        $query = "SELECT *
            FROM " . $this->modelName . "
            WHERE p_guid = :p_guid
            LIMIT 0,1";
        $stmt = $this->conn->prepare( $query );
        $stmt->bindParam(":p_guid", $p_guid);

        if (!$stmt->execute()) {
            $response['errors'][] = 'Ошибка выполнения запроса выборки';
            return $response;
        }

        if ($stmt->rowCount() > 0) {
            $query = "DELETE
                FROM " . $this->modelName . "
                WHERE p_guid = :p_guid";

            $stmt = $this->conn->prepare( $query );
            $stmt->bindParam(":p_guid", $p_guid);

            if (!$stmt->execute()) {
                $response['errors'][] = 'Ошибка выполнения запроса удаления';
                return $response;
            }

            $imagePath = "storage/images/paintings/{$p_guid}.jpg";

            if (file_exists($imagePath)) {
                unlink($imagePath);
            }

            $response['status'] = true;
            $response['model'] = 'Картина успешна удалена';

        } else {
            $response['errors'][] = "Запись {$p_guid} не найдена";
        }

        return $response;
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