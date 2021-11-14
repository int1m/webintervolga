<?php

namespace controllers;
use models\Authors;
use PDO;

require_once 'BaseController.php';
require_once 'models/Authors.php';

class AuthorsController extends BaseController {
    public $apiName = 'authors';
    public $permissions = ['users'];

    /**
     * Возвращает список авторов
     *
     * @return Response
     */
    public function getAction() {
        $authors = new Authors();

        $stmt = $authors->select();

        if ($stmt->rowCount() > 0) {
            $response = [
                'status' => true,
                'model' => [
                    'authors' => [],
                ],
                'errors' => [],
            ];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){

                $author = [
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'surname' => $row['surname'],
                    'patronymic' => $row['patronymic'],
                ];

                $response['model']['authors'][] = $author;
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