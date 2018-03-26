$(document).ready(function () {
  verkrijgenJsonTweetBestand();
});

function verkrijgenJsonTweetBestand(){
  var jsonData = "js/json/tweets.json";
  var tweets = [];
  var i = 0;

  $.ajax({
      type:'get',
      dataType: 'json',
      cache: false,
      url: jsonData,
      success: function (data) {
          $.each(data, function (key) {
            if(key == "statuses"){
              $.each(this, function(key, value) {
                tweets.push(new Tweet(value.text, value.name));
              });
            }
          });
      },
      complete: function (data) {tonenTweets(tweets);}
  });
}

function Tweet(tekst, naam){
  this.tekst = tekst;
  this.naam = naam;
}

function tonenTweets(tweets){
  for(var i = 0; i < 10; i++){
    toevoegenTweet(tweets, i);
  }
  var tweetInterval = setInterval(vervangenTweet, 3000, tweets);
}

function toevoegenTweet(tweets, tweetId){
  var tmpRandomY = 0;
  var randomX = Math.floor(Math.random() * 40) + 8;
  randomX *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
  var randomY = Math.floor(Math.random() * 20) + tmpRandomY;
  randomYtmp = randomY;
  var i = Math.floor(Math.random() * tweets.length);
  $("#scene-group-2").append('<a-entity class="tweet" id="tweet-'+tweetId+'" bmfont-text="text: +'+tweets[i].tekst+'; fnt: fonts/DejaVu-sdf.fnt; fntImage: fonts/DejaVu-sdf.png; color: #FFFFFF" scale="4 4 4" position="'+randomX+' '+randomY+' 0" rotation="0 180 0"></a-entity>');
}

function verwijderenTweet(tweetId){
  $('#tweet-'+tweetId+'').remove();
}

function vervangenTweet(tweets){
  var tweetId = Math.floor(Math.random() * 5) + 1;
  verwijderenTweet(tweetId);
  toevoegenTweet(tweets, tweetId);
}
