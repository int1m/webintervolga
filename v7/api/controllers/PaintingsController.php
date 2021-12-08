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
    public $permissions = ['users'];

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

                $img = null;
                $path = "storage/images/paintings/${row['p_guid']}.jpg";

                if (file_exists($path)) {
                    $img = file_get_contents($path);
                }

                $painting = [
                    'p_guid' => $row['p_guid'],
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'yearOfCreation' => $row['yearOfCreation'],
                    'image' => base64_encode($img),
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

        $paintings = new Paintings();

        $createResponse = $paintings->create($_POST, $_FILES);

        if ($createResponse['status']) {
            $response['model'] = 'Картина успешно добавлена';
        } else {
            $response = $createResponse;
        }

        return $this->response($response, 200);
    }

    public function http_put_data(\stdClass &$a_data) {
        $input = file_get_contents('php://input');
        preg_match('/boundary=(.*)$/', $_SERVER['CONTENT_TYPE'], $matches);
        if ($matches) {
            $boundary = $matches[1];
            $a_blocks = preg_split("/-+$boundary/", $input);
            array_pop($a_blocks);
        } else {
            parse_str($input, $a_blocks);
        }

        foreach ($a_blocks as $id => $block) {
            if (empty($block))
                continue;


            if (strpos($block, 'application/octet-stream') !== FALSE) {
                preg_match("/name=\"([^\"]*)\".*stream[\n|\r]+([^\n\r].*)?$/s", $block, $matches);
            }
            else {
                preg_match('/name=\"([^\"]*)\"[\n|\r]+([^\n\r].*)?\r$/s', $block, $matches);
            }
            if ($matches) {
                $a_data->{$matches[1]} = $matches[2];
            } else {
                $a_data->{$id} = $block;
            }
        }
    }

    public function putAction() {
        $response = [
            'status' => true,
            'model' => 'putAction',
            'errors' => [],
        ];

        $paintings = new Paintings();

        $params = (object)[];
        $this->http_put_data($params);
        echo '<pre>';
        print_r($_REQUEST);
        exit();

//        if (isset($this->requestParams['p_guid'])) {
//            $response = $paintings->deleteByGuid($this->requestParams['p_guid']);
//        } else {
//            $response['errors'][] = 'Параметр p_guid не указан';
//        }

        return $this->response($response, 200);
    }

    public function deleteAction() {
        $response = [
            'status' => true,
            'model' => 'deleteAction',
            'errors' => [],
        ];

        $paintings = new Paintings();

        if (isset($this->requestParams['p_guid'])) {
            $response = $paintings->deleteByGuid($this->requestParams['p_guid']);
        } else {
            $response['errors'][] = 'Параметр p_guid не указан';
        }

        return $this->response($response, 200);
    }
}