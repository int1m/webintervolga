<?php

namespace User;

require_once 'config/Core.php';
include_once 'libs/php-jwt-master/src/BeforeValidException.php';
include_once 'libs/php-jwt-master/src/ExpiredException.php';
include_once 'libs/php-jwt-master/src/SignatureInvalidException.php';
include_once 'libs/php-jwt-master/src/JWT.php';

use Firebase\JWT\JWT;

namespace models;
use Config;
use DateTimeImmutable;
use Exception;
use Firebase\JWT\JWT;
use PDO;

require_once 'BaseModel.php';
require_once 'FailedAuthorization.php';

class User extends BaseModel {
    protected $conn;
    public $modelName = 'users';
    public $fields = [
        'email' => null,
        'surname' => null,
        'name' => null,
        'patronymic' => null,
        'vk' => null,
        'date' => null,
        'sex' => null,
        'password' => null
    ];

    public function create($params) {
        $response = [
            'status' => true,
            'errors' => [],
        ];

        $query = "INSERT INTO " . $this->modelName . "
                SET
                    email = :email,
                    surname = :surname,
                    name = :name,
                    patronymic = :patronymic,
                    vk = :vk,
                    date = :date,
                    sex = :sex,
                    password = :password";

        $stmt = $this->conn->prepare($query);

        $regFields = [
            'email' => null,
            'surname' => null,
            'name' => null,
            'patronymic' => null,
            'vk' => null,
            'date' => null,
            'sex' => null,
            'password' => null
        ];

        foreach (array_keys($regFields) as $field) {
            if (!array_key_exists($field, $params)) {
                $response['errors'][] = "Поле $field не отправлено";
                $response['status'] = false;
            }
        }

        if ($response['status']) {
            if (!filter_var($params['email'], FILTER_VALIDATE_EMAIL)) {
                $response['errors'][] = "Введен некорректный e-mail";
                $response['status'] = false;
            }

            $filterNumber = preg_match('@[0-9]@', $params['password']);
            $filterUppercase = preg_match('@[A-Z]@', $params['password']);
            $filterLowercase = preg_match('@[a-z]@', $params['password']);
            $filterSpecialChars = preg_match('@[^\w]@', $params['password']);

            if (strlen($params['password'] < 6) || !$filterNumber || !$filterUppercase || !$filterLowercase || !$filterSpecialChars) {
                $response['errors'][] = "Пароль должен быть длиннее 6 символов, содержать большие буквы, маленькие буквы, и спец. символы";
                $response['status'] = false;
            }
        }

        if ($response['status']) {
            foreach (array_keys($regFields) as $key) {
                $this->fields[$key] = $params[$key];
            }
            $this->fields['password'] = password_hash($params['password'], PASSWORD_BCRYPT);

            if (!$this->userIdentify()) {

                foreach (array_keys($regFields) as $key) {
                    $stmt->bindParam(":$key", $this->fields[$key]);
                }

                $stmt->execute();
            } else {
                $response['status'] = false;
                $response['errors'][] = 'Пользователь с таким e-mail уже существует';
            }
        }

        return $response;
    }

    public function login($params) {
        $response = [
            'status' => true,
            'errors' => [],
        ];

        $loginFields = [
            'email' => null,
            'password' => null,
        ];

        foreach (array_keys($loginFields) as $field) {
            if (!array_key_exists($field, $params)) {
                $response['errors'][] = "Поле $field не отправлено";
                $response['status'] = false;
            }
        }

        if ($response['status']) {
            $this->fields['email'] = $params['email'];
            $loginFields['password'] = $params['password'];

            $userIdentifyResponse = $this->userIdentify();

            $userFailedAuthorization = new FailedAuthorization();

            if ($userFailedAuthorization->fields['loginFreezeDateTime']) {
                $dateTimeCurrent = date('Y-m-d H:i:s', time());
                $dateTimeFreeze = date('Y-m-d H:i:s', strtotime( $userFailedAuthorization->fields['loginFreezeDateTime'] ));

                if ($dateTimeFreeze > $dateTimeCurrent) {
                    $response['status'] = false;
                    $response['errors'][] = 'Авторизация временно заблокированна. Попробуйте позже';
                } else {
                    $userFailedAuthorization->fields['loginFreezeDateTime'] = null;
                    $userFailedAuthorization->createOrUpdate();
                }
            }

            if ($response['status']) {
                if (!$userIdentifyResponse || !password_verify($loginFields['password'], $this->fields['password'])) {
                    $response['status'] = false;
                    $response['errors'][] = 'Неверный e-mail или пароль'; // пароль неверный

                    if (!$userFailedAuthorization->fields['countLoginFailed']) {
                        $userFailedAuthorization->fields['countLoginFailed'] = 1;
                    } else if ($userFailedAuthorization->fields['countLoginFailed'] < 2) {
                        $userFailedAuthorization->fields['countLoginFailed'] += 1;
                    } else {
                        $userFailedAuthorization->fields['countLoginFailed'] = null;
                        $dateTimeFreeze = date('Y-m-d H:i:s', time() + 60);
                        $userFailedAuthorization->fields['loginFreezeDateTime'] = $dateTimeFreeze;
                    }
                    $userFailedAuthorization->createOrUpdate();
                } else {
                    if ($userFailedAuthorization->fields['countLoginFailed']) {
                        $userFailedAuthorization->fields['countLoginFailed'] = null;
                        $userFailedAuthorization->createOrUpdate();
                    }
                }
            }
        }

        return $response;
    }

    public function userUpdate() {
        $query = "UPDATE " . $this->modelName . " 
                SET countLoginFailed = :countLoginFailed,
                loginFreezeDateTime = :loginFreezeDateTime
                WHERE email = :email";

        $stmt = $this->conn->prepare( $query );

        $stmt->bindParam(":email", $this->fields["email"]);
        $stmt->bindParam(":countLoginFailed", $this->fields["countLoginFailed"]);
        $stmt->bindParam(":loginFreezeDateTime", $this->fields["loginFreezeDateTime"]);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function userIdentify() {
        $query = "SELECT id, surname, name, patronymic, vk, date, sex, password
            FROM " . $this->modelName . "
            WHERE email = :email
            LIMIT 0,1";

        $stmt = $this->conn->prepare( $query );

        $stmt->bindParam(":email", $this->fields["email"]);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            foreach (array_keys($this->fields) as $key) {
                if ($key !== 'email') {
                    $this->fields[$key] = $row[$key];
                }
            }

            return true;
        } else {
            return false;
        }
    }

    public function tokenGenerate() {
        $config = new Config();

        $token = array(
            "iss" => $config->iss,
            "aud" => $config->aud,
            "iat" => $config->iat,
            "nbf" => $config->nbf,
            "data" => array(
                "email" => $this->fields['email'],
                "surname" => $this->fields['surname'],
                "name" => $this->fields['name'],
            )
        );

        return JWT::encode($token, $config->key);
    }

    static public function tokenValidate() {
        if (!array_key_exists('HTTP_AUTHORIZATION', $_SERVER) || ! preg_match('/Bearer\s(\S+)/', $_SERVER['HTTP_AUTHORIZATION'], $matches)) {
            return false;
        }

        $jwt = $matches[1];

        if ($jwt) {
            try {
                $config = new Config();
                $jwtDecoded = JWT::decode($jwt, $config->key, ['HS256']);

                return $jwtDecoded->data;
            } catch (Exception $e) {
                return false;
            }
        } else {
            return false;
        }
    }
}