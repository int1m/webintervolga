<?php

namespace controllers;
use models\Authors;
use models\Paintings;
use PDO;

require_once 'BaseController.php';
require_once 'models/Paintings.php';
require_once 'models/Authors.php';

class PaintingsEditController extends BaseController {
    public $apiName = 'paintings';
    public $permissions = ['users'];

    /**
     * Возвращает список картин
     *
     * @return Response
     */
    public function getAction() {
        $response = [
            'status' => true,
            'model' => 'getAction',
            'errors' => [],
        ];

        return $this->response($response, 200);
    }

    public function postAction() {
        $response = [
            'status' => true,
            'model' => 'postAction',
            'errors' => [],
        ];

        $paintings = new Paintings();

        if (isset($this->requestParams['p_guid'])) {
            $editResponse = $paintings->edit($_POST, $_FILES, $this->requestParams['p_guid']);

            if ($editResponse['status']) {
                $response['model'] = 'Картина успешно изменена';
            } else {
                $response = $editResponse;
            }
        } else {
            $response['errors'][] = 'Параметр p_guid не указан';
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