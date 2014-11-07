<?php
require 'app_tokens.php';
require 'tmhOAuth-master/tmhOAuth.php';

if (isset($_GET['screen_name'])) 
{
    $screen_name = $_GET['screen_name'];
}
else
{
    $screen_name = "NHK_HORIJUN";
}

if (isset($_GET['count'])) 
{
    $count = $_GET['count'];
}
else
{
    $count = "200";
}

if (isset($_GET['since_id'])) 
{
    $since_id = $_GET['since_id'];
}
else
{
    $since_id = "";
}

if (isset($_GET['max_id'])) 
{
    $max_id = $_GET['max_id'];
}
else
{
    $max_id = "";
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

// print_r($connection->url('1.1/statuses/user_timeline.json?user_id=130313189&'));
//     array('screen_name' => $screen_name, 'count' => $count));

$params = array('screen_name' => $screen_name, 'count' => $count);

if($since_id !== "")
{
    $params = array('screen_name' => $screen_name, 'count' => $count, 'since_id' => $since_id);
}

if($max_id !== "")
{
    $params = array('screen_name' => $screen_name, 'count' => $count, 'max_id' => $max_id);
}
    
// Get the timeline with the Twitter API
$http_code = $connection->request('GET',
    $connection->url('1.1/statuses/user_timeline'),$params);



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