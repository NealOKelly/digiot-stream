// console colors
const escapeCharcters = "\x1b";
const resetColor = "\x1b[0m";
var cyan = escapeCharcters + "[36m";
var red = escapeCharcters + "[31m";
var yellow = escapeCharcters + "[33m";
var green = escapeCharcters + "[32m";
var white = escapeCharcters + "[37m";

// Get environment variables
// See https://itnext.io/how-to-use-environment-variables-in-node-js-cb2ef0e9574a
require('dotenv').config();

const consumerKey = process.env['CONSUMER_KEY'];
const consumerSecret = process.env['CONSUMER_SECRET'];
const accessToken = process.env['ACCESS_TOKEN'];
const accessKey = process.env['ACCESS_TOKEN_SECRET'];


// Get dependencies
var dateFormat = require('dateformat');
const Twitter = require('twit');

const client = new Twitter({
	consumer_key: consumerKey,
	consumer_secret: consumerSecret,
	access_token: accessToken,
	access_token_secret: accessKey
});

// Get list of ids for users that Fiona follows.
var followers;

client.get('followers/ids', { screen_name: 'anton_fiona', stringify_ids: true },  function (err, data, response) {
	followers = data.ids;
	console.log(getTimeStamp(), "Fiona will attempt for follow the users who follow her (with the following ids):");
	console.log(followers);
});

// Follow users who follow Fiona
setTimeout(function () {

	for (i = 0; i < followers.length; ++i) {

		// Follow all users in the array
		client.post('friendships/create', { user_id : followers[i] }, function(err, data, response) {

			})
	}
}, 10000); // wait for 30s before initiating the stream to ensure that the users variable has been updated.


var phrases = ["Disagree", "👍", "This is great.", "This is fab.", "Celebrate this 👏", "Agree", "Not sure about this.", "Totally agree 👏", "Love this! 😍", "Awesome", "More of this please", "Less of this!", "🤔", "👏👏👏", "👋 tweeps!"];

console.log("isActive() = " + isActive())



const fs = require('fs')
	
	fs.writeFile(

    './phrases.json',

    JSON.stringify(phrases),

    function (err) {
        if (err) {
            console.error('Crap happens');
        }
    }
);

fs.readFile('./phrases.json', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  //console.log("data = " + data)
})


// Get list of ids for users that Fiona follows.
client.get('friends/ids', { screen_name: 'anton_fiona', stringify_ids: true },  function (err, data, response) {
	users = data.ids;
	console.log(getTimeStamp(), "Fiona will follow the tweets of the users with the following ids:");
	console.log(users);
});

setTimeout(function () {

	// Subscribe to stream events.
	var stream = client.stream('statuses/filter', {follow: users});
	stream.on('tweet', function (tweet) {
	
		if (users.indexOf(tweet.user.id_str) > -1) {

			// Log info about the Tweet
			console.log(getTimeStamp(), tweet.user.name + " has tweeted.", resetColor);
			console.log(getTimeStamp(), "The text of the tweet is: " + tweet.text, resetColor);
			//console.log(tweet);

			// Determine what type of tweet it is.
			var tweetType = "Basic Tweet";

			if(tweet.in_reply_to_status_id!=null){
				tweetType = "Reply";
			}
			else if(tweet.hasOwnProperty("retweeted_status")){
				tweetType = "Retweet";
				}
			else if(tweet.hasOwnProperty("quoted_status")){
				tweetType = "Quoted Retweet";
				}

			console.log(getTimeStamp(), "The Tweet is a: " + tweetType);

			if(isActive==true){
				//console.log("Fiona may act.");
				if(tweetType!="Reply"){

					if (willRetweet()== true){
						console.log(getTimeStamp(), yellow + "Fiona is going to retweet " + tweet.user.name +"'s tweet.", resetColor);
						if(willQuote()== true) {
							console.log(getTimeStamp(), yellow + "Fiona has something to say about " + tweet.user.name +"'s tweet.", resetColor);

							var actionType = "retweet";
							delay = getDelay(actionType);	

							setTimeout(function () {
								console.log("This is the URL Fiona will use: "+ "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str);
								  client.post('statuses/update', { status:  getRandomArrayElements(phrases, 1), attachment_url:  "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str }, function(err, data, response) {
								  console.log(getTimeStamp(), green + "Fiona has commented on " + tweet.user.name + "'s tweet.", resetColor);
								  //console.log(response);
								})

							}, delay);
						}
						else{

							var actionType = "retweet";
							delay = getDelay(actionType);	


							setTimeout(function () {
								client.post('statuses/retweet/:id', { id: tweet.id_str }, function (err, data, response) {
								console.log(getTimeStamp(), green + "Fiona has retweeted " + tweet.user.name + "'s tweet.", resetColor);
									//console.log(data)
								})
							}, delay);	
						}
					}  // END: if(willRetweet()){};
					else{
						console.log(getTimeStamp(), "Fiona has decided that she WILL NOT retweet " + tweet.user.name + "'s tweet on this occasion.")
					}	

					if (willFavorite()== true){

							var actionType = "favorite";
							delay = getDelay(actionType);	


							setTimeout(function () {
								client.post('favorites/create', { id: tweet.id_str }, function (err, data, response) {
									console.log(getTimeStamp(), green + "Fiona has favorited " + tweet.user.name + "'s tweet.", resetColor);
									//console.log(data)
							})
						}, delay);			

					}// if(willRetweet())
					else{
						console.log(getTimeStamp(), "Fiona has decided that she WILL NOT favorite " + tweet.user.name + "'s tweet on this occasion.")
					}

				}
				else{
					console.log(getTimeStamp(), "Fiona does not currently respond to replies because she doesn't want to seem demented.")
				}

			}
			else{
				console.log(getTimeStamp(), "Fiona is sleeping.")
			}
		}
})

}, 10000); // wait for 30s before initiating the stream to ensure that the users variable has been updated.


// get amount of time to wait before carrying out the action (max 25 minutes)
function getDelay(actionType){
	var delay = Math.random() * 1500000;
	//console.log('Time to delay before carrying out action : ' + delay);
	//console.log("Action Type:" + actionType);
	return delay;
}

function willRetweet(){
	return decideToAct(.025);
}

function willFavorite(){
	return decideToAct(.5);
}

function willQuote(){
	return decideToAct(.15);
	// note that Quoting is a subset of retweeting, hence the relatively high probability.
}

function decideToAct(probability){
	if(Math.random() <= probability){
		return true;
	}
	else{
		return false;
	}
}
		   
			   
// Common functions			   
function getRandomArrayElements(arr, count) {
	// function borrowed from https://stackoverflow.com/questions/7158654/how-to-get-random-elements-from-an-array
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

function getTimeStamp(){
	// function used to return timestamps for use with console logging.
	// See https://www.npmjs.com/package/dateformat
	now = Date();
	return cyan + dateFormat(now, "dd-mm-yyyy, HH:MM:ss") + " :" + resetColor;
}

function isActive(){
	
	var startTime = '12:00:00';
	var endTime = '23:00:00';

	currentDate = new Date()   

	startDate = new Date(currentDate.getTime());
	startDate.setHours(startTime.split(":")[0]);
	startDate.setMinutes(startTime.split(":")[1]);
	startDate.setSeconds(startTime.split(":")[2]);

	endDate = new Date(currentDate.getTime());
	endDate.setHours(endTime.split(":")[0]);
	endDate.setMinutes(endTime.split(":")[1]);
	endDate.setSeconds(endTime.split(":")[2]);

	// toggle this to put Fiona into inactive mdoe.
	//return false;  
	return startDate < currentDate && endDate > currentDate;

}


