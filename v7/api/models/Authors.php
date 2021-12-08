<?php

namespace models;
require_once 'BaseModel.php';

class Authors extends BaseModel {
    protected $conn;
    public $modelName = 'authors';
    public $fields = [
        'id',
        'name',
        'surname',
        'patronymic'
    ];
}