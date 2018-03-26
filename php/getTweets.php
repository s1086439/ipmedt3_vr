<?php
require "php/library/twitteroauth/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;
ophalenTweets(60);

function ophalenTweets($tijd){
    $bestand = 'js/json/tweets.json';
    $connection = new TwitterOAuth("S2MaJqCR0CaZSPIXkFt7ycikZ", "ZVpV24jynzXPB6Dse43LsUddgDyRPmMtkCbAxSL8NjR8jlW41T", "812394337107673088-0R1Qz3NJL0hNEpnOUY2EMf53OYv7h3s", "hPRUNcBqmSZ8QwA1a01ypIt8t0eiUVcOTmKQIxhpI37JV");
    $content = $connection->get("account/verify_credentials");
    $tweets = $connection->get("search/tweets", ["q" => "ikea", "count" => 10, "exclude_replies" => true, "lang" => "nl"]);
    file_put_contents($bestand, json_encode($tweets));
}
?>
