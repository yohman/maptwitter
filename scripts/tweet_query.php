<?php

require_once 'connect_db.php';
require_once 'utility_functions.php';

date_default_timezone_set('America/Los_Angeles');

//date_default_timezone_set("GMT");

set_header();
//header("Content-Type:application/json; charset=utf-8");

$conditional = FALSE;

$start = NULL;
$orig_start = NULL;
if (isset($_GET['start'])) {
	//$start = mysql_real_escape_string($_GET['start']);
	$conditional = TRUE;
	$orig_start = $_GET['start'];
	$start = strftime(HCN_DATE_ATOM, strtotime($orig_start." - ".TIMEZONE_CORRECTION_STR));
} //else report_error("start must be specified in for YYYY-MM-DDTHH:MM:SS.");

$end = NULL;
$orig_end = NULL;
if (isset($_GET['end'])) {
	//$end = mysql_real_escape_string($_GET['end']);
	$orig_end = $_GET['end'];
	$end = strftime(HCN_DATE_ATOM, strtotime($_GET['end']." - ".TIMEZONE_CORRECTION_STR)); // "-0800"
	$conditional = TRUE;
}

$text = '';
if (isset($_GET['text'])) {
	$conditional = TRUE;
	$text = mysql_real_escape_string($_GET['text']);
}

$page = 1;
if (isset($_GET['page'])) {
	$page = (int)$_GET['page'];
}

$query = "SELECT id, text, username, user_id, profile_image_url, `time`, lat, lon, location, twitter_id"
	." FROM tweets_encoded ";

if ($conditional) $query .= " WHERE ";
if ($start) {
	$query .= " `time` >= '$start'";
		if (!$end) {
		$query .= " AND `time` <= DATE_ADD('$start', INTERVAL 6 HOUR)";
	} else {
		$query .= " AND `time` <= '$end'";
	}
}

if ($text) {
	$query .= " (text LIKE '%$text%' OR username LIKE '%$text%' )";
}

$query .= " ORDER BY `time` ASC";

// The number 18446744073709551615 is an arbitrarily large length so as to get
// all the remaining records in the table, as suggested by the MySQL docs.
// http://dev.mysql.com/doc/refman/5.1/en/select.html.
$limit = " LIMIT ".(100 * ($page - 1)).",18446744073709551615";
$rsc = mysql_query($query.$limit) or report_error("Could not acquire tweets ".mysql_error());

$tweets = array("result" => array());
if (mysql_num_rows($rsc) == 0) {
	report_error("No rows found. Perhaps your start date was after your end date, or your page number was out of bounds?");
	print $start;
}
if (mysql_num_rows($rsc) > 100) {
	$tweets['next_page'] = HOSTBASE."tweet_query.php?page=".($page + 1)."&start=$orig_start";
	if ($end) $tweets['next_page'] .="&end=$orig_end";
}
//$tweets["total_tweets"] = mysql_num_rows($rsc);
$limit = " LIMIT ".(100 * ($page - 1)).",100";
$rsc = mysql_query($query.$limit) or report_error("Could not acquire tweets ".mysql_error());
$inter = array();
//$tweets = array("result" => array());
while ($record = mysql_fetch_assoc($rsc)) {
	$tweet = array (
		 "id"	=> (int)$record['id'],
		 "text"	=> $record['text'],
		 "username" => $record["username"],
		 "user_id"	=> (int)$record['user_id'],
		 "profile_image_url" => $record['profile_image_url'],
		 "time"	=> strftime(HCN_DATE_ATOM, strtotime($record['time']." + " .TIMEZONE_CORRECTION_STR)),
		 "location" => $record['location'],
		 "twitter_id" => (int)$record['twitter_id']
	);
	if ($record['lat'] !== NULL) {
		$tweet['geo'] = array("lat" => round($record['lat'], 2), "lon" => round($record['lon'], 2));
	} else {
		$tweet['geo'] = NULL;
	}
	$inter[] = $tweet;
}
//$tweets["result"] = array_reverse($inter);
$tweets["result"] = $inter;
echo json_encode($tweets);

?>