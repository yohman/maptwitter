<?php
require 'app_tokens.php';
require 'tmhOAuth-master/tmhOAuth.php';
$query = htmlspecialchars($_GET['query']);
if (empty($query)) {
    $query = "html5";
}
$connection = new tmhOAuth(array(
    'consumer_key' => $consumer_key,
    'consumer_secret' => $consumer_secret,
    'user_token' => $user_token,
    'user_secret' => $user_secret
));
// Get the timeline with the Twitter API
$http_code = $connection->request('GET',
    $connection->url('1.1/search/tweets'),
    array('q' => $query, 'count' => 10, 'lang' => 'en'));
// Request was successful
if ($http_code == 200) {
    // Extract the tweets from the API response
    $response = json_decode($connection->response['response'],true);
    $tweet_data = $response['statuses'];

    // Accumulate tweets from results
    $tweet_stream = '[';
    foreach ($tweet_data as $tweet) {
        // Add this tweet's text to the results
        $tweet_stream .= ' { "tweet": ' . json_encode($tweet['text']) . ' },';
    }
    $tweet_stream = substr($tweet_stream, 0, -1);
    $tweet_stream .= ']';
    // Send the tweets back to the Ajax request
    print $tweet_stream;
}
// Handle errors from API request
else {
    if ($http_code == 429) {
        print 'Error: Twitter API rate limit reached';
    }
    else {
        print 'Error: Twitter was not able to process that request';
    }
} 
?>