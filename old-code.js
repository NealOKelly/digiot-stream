// JavaScript Document

		
		
		
		if (interactWithTweet() == true) {

			var actionType = "qwerty";
			var delay = getDelay(actionType);	
			
			setTimeout(function () {
  				console.log(tweet.user.name + ": " + tweet.text);
        		client.post('statuses/retweet/:id', { id: tweet.id_str }, function (err, data, response) {
            		console.log(data)
					
					
				client.post('favorites/create', {id: tweet.id_str}, function (err, data, response) {
    		   		console.log(data)
  				});
					
        		})
  			}, delay);
		}