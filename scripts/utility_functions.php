<?php

// Necessary because PHP's internal DATE_ATOM constant doesn't work with strftime
define('HCN_DATE_ATOM', '%Y-%m-%dT%H:%M:%S');
define('TIMEZONE_CORRECTION_INT', 57600);
define('TIMEZONE_CORRECTION_STR', '17 hours');
define('HOSTBASE', 'http://sendai.hypercities.com/');

function set_header () {
	header("Content-Type:application/json; charset=utf-8");
}

function report_error($error) {
	$error = array('error' => $error);
	die(json_encode($error));
}

function format_timestamp ($timestamp) {
	return strftime(HCN_DATE_ATOM, $timestamp);
}

function convert_tweet_record_to_array ($tweet) {
	$tweet = array (
		 "id"	=> (int)$record['id'],
		 "text"	=> $record['text'],
		 "username" => $record["username"],
		 "user_id"	=> (int)$record['user_id'],
		 "profile_image_url" => $record['profile_image_url'],
		 "time"	=> strftime(HCN_DATE_ATOM, strtotime($record['time'])),
		 "location" => $record['location'],
		 "twitter_id" => (int)$record['twitter_id']
	);
	if ($record['lat'] !== NULL) {
		$tweet['geo'] = array("lat" => $record['lat'], "lon" => $record['lon']);
	} else {
		$tweet['geo'] = NULL;
	}
	return $tweet;
}

function db_error($message) {
	die($message.": ".mysql_error());
}

?>