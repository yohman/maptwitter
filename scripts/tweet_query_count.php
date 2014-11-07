<?php

require_once 'connect_db.php';
require_once 'utility_functions.php';

date_default_timezone_set('America/Los_Angeles');

//date_default_timezone_set("GMT");

//set_header();
//header("Content-Type:application/json; charset=utf-8");


$query = "SELECT Year, Month, Day, Hour, COUNT(Hour) AS 'Count'"
."FROM(SELECT YEAR(time) Year, MONTH(time) Month,DAY(time) Day, HOUR(time) Hour FROM tweets_encoded) temp "
."group by Year, Month, Day, Hour "
."order by Year desc, Month desc, Day desc, Hour desc";

$rsc = mysql_query($query) or report_error("Could not acquire tweets ".mysql_error());

$tweets = array("result" => array());
if (mysql_num_rows($rsc) == 0) {
	report_error("No rows found. Perhaps your start date was after your end date, or your page number was out of bounds?");
	print $start;
}

$inter = array();
//$tweets = array("result" => array());
while ($record = mysql_fetch_assoc($rsc)) {
	$tweet = array (
		 "year"	=> (int)$record['Year'],
		 "month"	=> $record['Month'],
		 "day" => $record["Day"],
		 "hour"	=> (int)$record['Hour'],
		 "count" => $record['Count'],
	);
	$inter[] = $tweet;
}
//$tweets["result"] = array_reverse($inter);
$tweets["result"] = $inter;
echo json_encode($tweets);

?>