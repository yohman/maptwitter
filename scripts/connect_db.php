<?php


$USERNAME = "yohmanco_car";
$PASSWORD = 'c@rmageddon';

$conn = mysql_connect("localhost", $USERNAME, $PASSWORD) or die("Could not connect: " .mysql_error());
mysql_select_db("yohmanco_carmageddon") or die("Could not select database ".mysql_error());
mysql_set_charset("utf8", $conn) or die ("Could not set charset to utf8: ".mysql_error());

?>