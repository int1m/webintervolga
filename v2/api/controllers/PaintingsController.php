<?php

namespace controllers;
use models\Authors;
use models\Paintings;
use PDO;

require_once 'BaseController.php';
require_once 'models/Paintings.php';
require_once 'models/Authors.php';

class PaintingsController extends BaseController {
    public $apiName = 'paintings';

    /**
     * Возвращает список картин
     *
     * @return Response
     */
    public function getAction() {
        $paintings = new Paintings();
        $authors = new Authors();

        $stmt = $paintings->selectWithParams($this->requestParams);
        $authors = $authors->select()->fetchAll(PDO::FETCH_ASSOC);

        if ($stmt->rowCount() > 0) {
            $response = [
                'status' => true,
                'model' => [
                    'paintings' => [],
                ],
                'errors' => [],
            ];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $author = $authors[array_search($row['authorId'], array_column($authors, 'id'))];

                $painting = [
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'yearOfCreation' => $row['yearOfCreation'],
                    'author' => [
                        'authorId' => $row['authorId'],
                        'authorFullName' => "{$author['name']} {$author['surname']}",
                    ],
                ];

                $response['model']['paintings'][] = $painting;
            }
        } else {
            $response = [
                'status' => false,
                'errors' => ['Записей не найдено'],
            ];
        }
        return $this->response($response, 200);
    }

    public function postAction() {
        $response = [
            'status' => true,
            'model' => 'postAction',
            'errors' => [],
        ];
        return $this->response($response, 200);
    }

    public function putAction() {
        $response = [
            'status' => true,
            'model' => 'putAction',
            'errors' => [],
        ];
        return $this->response($response, 200);
    }

    public function deleteAction() {
        $response = [
            'status' => true,
            'model' => 'deleteAction',
            'errors' => [],
        ];
        return $this->response($response, 200);
    }
}