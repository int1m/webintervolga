<?php

namespace controllers;

require_once 'BaseController.php';

class WorkerController extends BaseController {
    public $apiName = 'worker';

    /**
     * Возвращает список авторов
     *
     * @return Response
     */
    public function getAction() {
        $response = [
            'status' => true,
            'errors' => [],
        ];

        return $this->response($response, 200);
    }

    public function postAction() {
        $response = [
            'status' => true,
            'errors' => [],
        ];

        $uploadPath = "storage/public/files/";
        $uploadFile = $uploadPath . basename($_FILES['file']['name']);

        if ($_FILES) {
            if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadFile)) {
                $response['model'] = [
                    'fileSrc' => $uploadFile,
                    'fileName' => basename($_FILES['file']['name']),
                ];
            } else {
                $response['status'] = false;
                $response['errors'][] = 'Произошла ошибка при перемещении загруженного файла';
            }
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