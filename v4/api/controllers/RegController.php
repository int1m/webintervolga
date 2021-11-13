<?php

namespace controllers;
use models\User;
use PDO;

require_once 'BaseController.php';
require_once 'models/User.php';

class RegController extends BaseController {
    public $apiName = 'reg';

    public function getAction() {
        $response = [
            'status' => true,
            'model' => 'getAction',
            'errors' => [],
        ];
        return $this->response($response, 200);
    }

    /**
     * Возвращает JWT токен при успешной регистрации
     *
     * @return Response
     */
    public function postAction() {
        $params = $_POST;

        $response = [
            'status' => true,
            'errors' => [],
        ];

        $user = new User();
        $createResponse = $user->create($params);

        if ($createResponse['status']) {
            $jwt = $user->tokenGenerate();

            $response['model'] = [
                'token' => $jwt,
            ];
        } else {
            $response = $createResponse;
        }

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