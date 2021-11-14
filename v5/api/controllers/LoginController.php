<?php

namespace controllers;
use models\User;

require_once 'BaseController.php';
require_once 'models/User.php';

class LoginController extends BaseController {
    public $apiName = 'login';

    public function getAction() {
        $response = [
            'status' => true,
            'model' => 'getAction',
            'errors' => [],
        ];
        return $this->response($response, 200);
    }

    /**
     * Возвращает JWT токен при успешной авторизации
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
        $loginResponse = $user->login($params);

        if ($loginResponse['status']) {
            $jwt = $user->tokenGenerate();

            $response['model'] = [
                'token' => $jwt,
            ];
        } else {
            $response = $loginResponse;
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