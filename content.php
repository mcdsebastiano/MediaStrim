<?php
 
require_once "init/Media.php"; 

if(isset($_GET['dir'])) 
  $path = $_GET['dir'];
else 
  $path = 'Videos';  

if(isset($_GET['q'])) {
    $q = $_GET['q'];
}else {
    $q = "";
}

$data = getDirContents($path);


echo json_encode($data);
