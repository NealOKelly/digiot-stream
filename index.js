// JavaScript Document
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
var users = ["19962797", "396536542", "175750974", "1006419421244678144", "1686415056", "1927147742", "17919972", "454288197"];

var phrases = ["Disagree", "👍", "This is great.", "This is fab.", "Celebrate this 👏", "Agree", "Not sure about this.", "Totally agree 👏", "Love this! 😍", "Awesome", "More of this please", "Less of this!", "🤔", "👏👏👏", "👋 tweeps!"];

console.log(getTimeStamp() + "The users variable has been seeded with the following users ids:");
console.log(users);



// Get list of ids for users that Fiona follows.
client.get('friends/ids', { screen_name: 'anton_fiona', stringify_ids: true },  function (err, data, response) {
	users = data.ids;
	console.log(getTimeStamp() + "The users variable has been updated with the following user ids that Fiona follows:");
	console.log(users);
});

setTimeout(function () {

	// Subscribe to stream events.
	var stream = client.stream('statuses/filter', {follow: users});
	stream.on('tweet', function (tweet) {
	
		if (users.indexOf(tweet.user.id_str) > -1) {

			// Log info about the Tweet
			console.log(getTimeStamp() + tweet.user.name + " has tweeted.");
			console.log(getTimeStamp() + "The text of the tweet is: " + tweet.text);
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

			console.log(getTimeStamp() + "The Tweet is a: " + tweetType);


			if(tweetType!="Reply"){

				if (willRetweet()== true){
					console.log(getTimeStamp() +"Fiona is going to retweet " + tweet.user.name +"'s tweet.'");
					if(willQuote()== true) {
						console.log("Fiona would quote this.");
					}
					else{
												
						var actionType = "retweet";
						delay = getDelay(actionType);	


						setTimeout(function () {
							client.post('statuses/retweet/:id', { id: tweet.id_str }, function (err, data, response) {
							console.log(getTimeStamp() + "Fiona has retweeted " + tweet.user.name + "'s tweet.");
								//console.log(data)
							})
						}, delay);	
					}
		

				}// if(willRetweet())
				else{
					console.log(getTimeStamp() + "Fiona has decided that she WILL NOT retweet " + tweet.user.name + "'s tweet on this occasion.")
				}	
				
				if (willFavorite()== true){

						var actionType = "favorite";
						delay = getDelay(actionType);	


						setTimeout(function () {
							client.post('favorites/create', { id: tweet.id_str }, function (err, data, response) {
								console.log(getTimeStamp() + "Fiona has favorited " + tweet.user.name + "'s tweet.");
								//console.log(data)
						})
					}, delay);			

				}// if(willRetweet())
				else{
					console.log(getTimeStamp() + "Fiona has decided that she WILL NOT favorite " + tweet.user.name + "'s tweet on this occasion.")
				}
				
			}
			else{
				console.log(getTimeStamp() + "Fiona does not currently respond to replies because she doesn't want to seem demented.")
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
	return decideToAct(.1);
}

function willFavorite(){
	return decideToAct(.15);
}

function willQuote(){
	return decideToAct(.15);
}

function decideToAct(probability){
	if(Math.random() <= probability){
		return true;
	}
	else{
		return false;
	}
}

function getRandomArrayElements(arr, count) {
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
	return dateFormat(now, "dd-mm-yyyy HH:MM:ss") + ": ";
}