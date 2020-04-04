// console colors
const escapeCharcters = "\x1b";
const resetColor = "\x1b[0m";
var cyan = escapeCharcters + "[36m";
var red = escapeCharcters + "[31m";
var yellow = escapeCharcters + "[33m";
var green = escapeCharcters + "[32m";
var white = escapeCharcters + "[37m";


// Get dependencies
var dateFormat = require('dateformat');
const Twitter = require('twit');

const client = new Twitter({
	consumer_key: 'h51dZgLoJydiSAqosut6vBbKn',
	consumer_secret: 'UJLFd0AD1Tgpn49cSNZ84FOtJBRVWheCfLkfXCRB9DBElpYLqx',
	access_token: '1240605934881308673-8m2RT83v1wga7kgZtafUBrD9VXMgPR',
	access_token_secret: 'YnRAb07vlX0QuIK1RBceX4gMAySEquj4i5hVwpbh77rE9'
});

// Set users for Fiona's tweet stream.
// var users = [Tom, Kit Collingwood, Rob_Stirling, GretaThunberg, MOJSpirit, Justice_Digital, taylorswift13, nealokelly];
var users = ["1927147742", "454288197"];

var phrases = ["Disagree", "👍", "This is great.", "This is fab.", "Celebrate this 👏", "Agree", "Not sure about this.", "Totally agree 👏", "Love this! 😍", "Awesome", "More of this please", "Less of this!", "🤔", "👏👏👏", "👋 tweeps!"];

console.log(getTimeStamp(), "The users variable has been seeded with the following users ids:");
console.log(users);



// Get list of ids for users that Fiona follows.
client.get('friends/ids', { screen_name: 'anton_fiona', stringify_ids: true },  function (err, data, response) {
	users = data.ids;
	console.log(getTimeStamp(), "The users variable has been updated with the following user ids that Fiona follows:");
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

			console.log(getTimeStamp(), "The Tweet is a: " + tweetType, white);


			if(tweetType!="Reply"){

				if (willRetweet()== true){
					console.log(getTimeStamp(), yellow + "Fiona is going to retweet " + tweet.user.name +"'s tweet.", resetColor);
					if(willQuote()== true) {
						console.log(getTimeStamp(), yellow + "Fiona has something to say about " + tweet.user.name +"'s tweet.", resetColor);
						
						var actionType = "retweet";
						delay = getDelay(actionType);	


						setTimeout(function () {
							//console.log("This is the URL Fiona will use: "+ "https://twitter.com/i/web/status/" + tweet.id_str)
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
		

				}// if(willRetweet())
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
	return decideToAct(.2);
}

function willFavorite(){
	return decideToAct(.15);
}

function willQuote(){
	return decideToAct(.5);
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