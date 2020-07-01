<?php
$user_name = 'root';
$password = '';
$server = 'localhost';
$db_name = "contactsdb";

$con = mysqli_connect($server, $user_name, $password, $db_name);
if($con) {
    $Name = $_GET['name'];
    $query = "insert into contacts(name) values ('".$Name."');";
    $result = mysqli_query($con, $query);

    if($result) {
$response_array['status'] = 'OK';
    }
    else {
        $response_array['status'] = 'FAILED';
    }
}
else {
    $response_array['status'] = 'FAILED';
}
echo json_encode($response_array);
mysqli_close($con);
?>