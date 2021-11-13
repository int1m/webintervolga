<?php

namespace controllers;
use models\User;
use PDO;

require_once 'BaseController.php';
require_once 'models/User.php';

class ImagesController extends BaseController {
    public $apiName = 'images';

    /**
     * Возвращает список авторов
     *
     * @return Response
     */
    public function getAction() {
        $folder = array_key_first($this->requestParams);

        $element = $this->requestParams[$folder];

        $path = "storage/images/$folder/$element";


        $image = null;

        if (file_exists($path)) {
            $image = file_get_contents($path);
        }

        return $this->responseImage($image, 200);
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