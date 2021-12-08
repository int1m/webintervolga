<?php

namespace controllers;
use models\Paintings;

require_once 'BaseController.php';
require_once 'models/Paintings.php';

class FilesController extends BaseController {
    public $apiName = 'files';
    public $permissions = ['users'];

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


        $paintings = new Paintings();
        $exportResponse = $paintings->exportPaintingsToExternalScript();

        if ($exportResponse) {
            if ($exportResponse->status) {
                $response['model'] = $exportResponse->model;
            }
        }

        return $this->response($response, 200);
    }

    public function postAction() {
        $response = [
            'status' => true,
            'errors' => [],
        ];

        $params = $_POST;

        $paintings = new Paintings();

        if (isset($params['filePath'])) {
            $importResponse = $paintings->importPaintingsFromLocalFile($params['filePath']);
            if ($importResponse['status']) {
                $response['model'] = $importResponse['model'];
            } else {
                foreach ($importResponse['errors'] as $error) {
                    $response['errors'][] = $error;
                }
            }
        } else {
            $response['errors'][] = "Не передано поле filePath";
        }

        if ($response['errors']) {
            $response['status'] = false;
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