<?php
require 'app_tokens.php';
require 'tmhOAuth-master/tmhOAuth.php';

if (isset($_GET['q'])) 
{
    $q = $_GET['q'];
}
else
{
    $q = "ucla";
}

if (isset($_GET['geocode'])) 
{
    $geocode = $_GET['geocode'];
}
else
{
    $geocode = "";
}

if (isset($_GET['count'])) 
{
    $count = $_GET['count'];
}
else
{
    $count = "100";
}

if (isset($_GET['since_id'])) 
{
    $since_id = $_GET['since_id'];
}
else
{
    $since_id = "";
}

if (isset($_GET['callback'])) 
{
    $callback = $_GET['callback'];
}
else
{
    $callback = "";
}

$connection = new tmhOAuth(array(
    'consumer_key' => $consumer_key,
    'consumer_secret' => $consumer_secret,
    'user_token' => $user_token,
    'user_secret' => $user_secret
));
// Get the timeline with the Twitter API
$http_code = $connection->request('GET',
    $connection->url('1.1/search/tweets.json'),
    array('q' => $q, 'count' => $count, 'geocode' => $geocode, 'since_id' => $since_id, 'callback' => $callback));
// echo $http_code;

// Request was successful
if ($http_code == 200) {
    // Extract the tweets from the API response
    header ("Content-Type:text/json");  
    $response = $connection->response['response'];
    echo $response;
}
// Handle errors from API request
else {
    if ($http_code == 429) {
        print 'Error: Twitter API rate limit reached';
    }
    else {
         $response = $connection->response['response'];
    echo $response;
        print 'Error: Twitter was not able to process that request';
    }
} 
?>