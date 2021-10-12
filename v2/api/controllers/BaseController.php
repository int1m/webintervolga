<?php

namespace controllers;

use Exception;
use RuntimeException;

abstract class BaseController {
    public $apiName = '';

    protected $method = ''; // GET|POST|PUT|DELETE

    public $requestUri = [];
    public $requestParams = [];

    protected $action = ''; // Выбранный метод

    /**
     * Конструктор класса. Определяется метод запроса
     *
     */
    public function __construct() {
        header("Access-Control-Allow-Orgin: *");
        header("Access-Control-Allow-Methods: *");
        header("Content-Type: application/json");

        $this->requestUri = array_slice(explode('/', substr(strtok($_SERVER['REQUEST_URI'], '?'), 1)), 2);
        $this->requestParams = $_REQUEST;

        $this->method = $_SERVER['REQUEST_METHOD'];
        if ($this->method == 'POST' && array_key_exists('HTTP_X_HTTP_METHOD', $_SERVER)) {
            if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'DELETE') {
                $this->method = 'DELETE';
            } else if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'PUT') {
                $this->method = 'PUT';
            } else {
                throw new Exception("Unexpected Header");
            }
        }
    }

    /**
     * Определение действия для обработки
     *
     * @return Action
     */
    public function run() {
//        echo '<pre>';
//        print_r($this->requestUri);
        if(array_shift($this->requestUri) !== 'api' || array_shift($this->requestUri) !== $this->apiName){
            throw new RuntimeException('API Not Found', 404);
        }

        // Определение действия для обработки
        $this->action = $this->choiceAction();

        // Если метод (действие) определен в дочернем классе
        if (method_exists($this, $this->action)) {
            return $this->{$this->action}();
        } else {
            throw new RuntimeException('Invalid Method', 405);
        }
    }

    /**
     * Формирует ответ сервера
     *
     * @param  array $data  int $status
     * @return Response
     */
    static public function response($data, $status = 500) {
        header("HTTP/1.1 " . $status . " " . BaseController::requestStatus($status));
        return json_encode($data);
    }

    /**
     * Формирует статус ответва
     *
     * @param  int  $code
     * @return Ststus
     */
    static public function requestStatus($code) {
        $status = array(
            200 => 'OK',
            404 => 'Not Found',
            405 => 'Method Not Allowed',
            500 => 'Internal Server Error',
        );
        return ($status[$code])?$status[$code]:$status[500];
    }

    /**
     * Определяет действие
     *
     * @return string
     */
    protected function choiceAction()
    {
        $method = $this->method;
        switch ($method) {
            case 'GET':
                return 'getAction';
                break;
            case 'POST':
                return 'postAction';
                break;
            case 'PUT':
                return 'putAction';
                break;
            case 'DELETE':
                return 'deleteAction';
                break;
            default:
                return null;
        }
    }

    abstract protected function getAction();
    abstract protected function postAction();
    abstract protected function putAction();
    abstract protected function deleteAction();
}