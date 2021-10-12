<?php

$requestUri = implode('/', array_slice(explode('/', substr(strtok($_SERVER['REQUEST_URI'], '?'), 1)), 3));
$requestParams = $_REQUEST;

$router = [
    'paintings' => 'PaintingsController',
    'authors' => 'AuthorsController',
    '/home/news'  => 'HomeController@news',
    '/api/staff' => 'HomeController@apiStaff'
];

try {
    if (isset($router[$requestUri])) {
        $file = "controllers/{$router[$requestUri]}.php";
        if (file_exists($file)) {
            require_once $file;
        } else {
            echo json_encode(Array('errors' => 'File Not Found'));
        }
        $controllerName = "controllers\\{$router[$requestUri]}";
        if ($controllerName) {
            $controller = new $controllerName();
            echo $controller->run();
        } else {
            echo json_encode(Array('errors' => 'Class Not Found'));
        }
    } else {
        echo json_encode(Array('errors' => 'API Not Found'));
    }
} catch (Exception $e) {
    echo json_encode(Array('error' => $e->getMessage()));
}