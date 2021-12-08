<?php

namespace models;
use PDO;

require_once 'BaseModel.php';

class FailedAuthorization extends BaseModel {
    protected $conn;
    public $modelName = 'failed_authorization';
    public $fields = [
        'ip' => null,
        'countLoginFailed' => null,
        'loginFreezeDateTime' => null,
    ];


    public function __construct() {
        parent::__construct();
        $query = "SELECT ip, countLoginFailed, loginFreezeDateTime
            FROM " . $this->modelName . "
            WHERE ip = :ip
            LIMIT 0,1";

        $stmt = $this->conn->prepare( $query );

        $stmt->bindParam(":ip", $_SERVER['REMOTE_ADDR']);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            $this->fields['ip'] = $row['ip'];
            $this->fields['countLoginFailed'] = $row['countLoginFailed'];
            $this->fields['loginFreezeDateTime'] = $row['loginFreezeDateTime'];
        }
    }


    public function createOrUpdate(): bool {
        if (!$this->fields['ip']) {
            $query = "INSERT INTO " . $this->modelName . "
                SET
                    ip = :ip,
                    countLoginFailed = :countLoginFailed,
                    loginFreezeDateTime = :loginFreezeDateTime";
        } else {
            $query = "UPDATE " . $this->modelName . " 
                SET countLoginFailed = :countLoginFailed,
                loginFreezeDateTime = :loginFreezeDateTime
                WHERE ip = :ip";
        }

        $stmt = $this->conn->prepare( $query );

        $stmt->bindParam(":ip", $_SERVER['REMOTE_ADDR']);
        $stmt->bindParam(":countLoginFailed", $this->fields["countLoginFailed"]);
        $stmt->bindParam(":loginFreezeDateTime", $this->fields["loginFreezeDateTime"]);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

}