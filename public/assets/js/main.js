console.log("HELLO I AM HERE (main.js)");

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container');

var characters;

var setUpGame = {
    preload: function() {
      // load any needed images/data
      game.load.image('person', 'assets/images/person.png');
      game.load.image('modal_bg', 'assets/images/modal_bg.png');
      game.load.image('tweet_bg', 'assets/images/tweet_bg.png');
      game.load.image('indicator', 'assets/images/indicator.png');
      game.load.text('char_data', 'assets/data/characters.json');
      // Set up timer here?
    },
    create: function() {
      // create all characters!
      // pull in data from cache & parse from JSON to object
      var charData = JSON.parse(game.cache.getText('char_data'));

      characters = game.add.group();

      charData.forEach(function(character, idx) {
        var currentCharacter = game.add.image(95 + 200 * idx, game.world.centerY, 'person');
        currentCharacter.anchor.set(0.5);
        currentCharacter.scale.setTo(0.5, 0.5);
        // Give them the data!!
        currentCharacter.data = character;
        currentCharacter.currentTweets = [];
        // Set up character to take input
        currentCharacter.inputEnabled = true;
        currentCharacter.events.onInputDown.add(showTweets, this);
        // add an indicator to character that will be hidden if they're clicked on
        currentCharacter.indicator = game.add.image(95 + 200 * idx, game.world.centerY - 150, 'indicator')
        currentCharacter.indicator.alpha = 0;
        characters.add(currentCharacter);
      });
      // determine who's depressed & set that up
      var depressedChar = characters.getRandom();
      depressedChar.depressed = true;
      // Create a "new tweet indicator"
      // start every char off with one tweet
      characters.forEach(function(character){

        var nextTweetDelay = Math.round(2 + Math.random() * 10) * 1000;
        // call the addTweet function again on a delay
        game.time.events.add(nextTweetDelay, addTweet, this, character);
      });
      // game.time.events.loop(5000, function(){
      //   characters.forEach(addTweet);
      // }, this)
    }
  }

// Add single tweet to char's current tweets
function addTweet(character) {
  switch (character.depressed) {
    case true:
      if (character.data.tweets.sad.length < 1) return;
      var randIdx = Math.floor(Math.random() * character.data.tweets.sad.length);
      randomTweet = character.data.tweets.sad.splice(randIdx, 1)[0];
      character.currentTweets.push(randomTweet);
      break;
    default:
      if (character.data.tweets.neutral.length < 1) return;
      var randIdx = Math.floor(Math.random() * character.data.tweets.neutral.length);
      randomTweet = character.data.tweets.neutral.splice(randIdx, 1)[0];
      character.currentTweets.push(randomTweet);
  }
  // show new tweet indicator if not already shown
  showIndicator(character);
  // Set a time for the next tweet to pop up - between two & fifteen seconds
  var nextTweetDelay = Math.round(2 + Math.random() * 15) * 1000;
  // call the addTweet function again on a delay
  game.time.events.add(nextTweetDelay, addTweet, this, character);

}
// Show new tweet indicator
function showIndicator (character) {
  character.indicator.alpha = 1;
  console.log('New tweet from ' + character.data.name + '!')
}


// View Tweets
function showTweets(character) {
  // Hide new tweet indicator
  character.indicator.alpha = 0;

  // Create a new group that will contain modal & stuff
  var tweetView = game.add.group();
  // Add two new rectangles to the game space - modal bg and white bg for tweets
  var modalBg = game.add.image(game.world.centerX, game.world.centerY, 'modal_bg');
  var tweetBg = game.add.image(game.world.centerX, game.world.centerY, 'tweet_bg');
  // Centering both rectangles
  modalBg.anchor.set(0.5);
  tweetBg.anchor.set(0.5);
  // Font styles for twitter handle!
  var twitterHandleStyle = {
    font: "bold 32px Arial",
    fill: "#369"
  };
  // add txt
  var twitterHandle = game.add.text(game.world.centerX, 100, character.data.twitterHandle, twitterHandleStyle);
  twitterHandle.anchor.set(0.5);
  // add avatar
  // create group to hold all rendered tweets
  var tweetsContainer = game.add.group();

  var tweetStyle = {font: "20px Helvetica"};
  character.currentTweets.forEach(function(tweet, idx) {
    var tweetText = game.add.text(game.world.centerX, 200 + 100 * idx, tweet, tweetStyle);
    tweetText.anchor.set(0.5);
    tweetsContainer.add(tweetText);
  });

  console.log(character.currentTweets);
  // Add magical girl wand

  // Add our stuffs to the group
  tweetView.add(modalBg);
  tweetView.add(tweetBg);
  tweetView.add(twitterHandle);
  tweetView.add(tweetsContainer);

  // Setting up modal to have "click out of meee" functionality
  modalBg.inputEnabled = true;
  modalBg.events.onInputDown.add(function(modalBg) {
    modalBg.parent.removeAll(true);
  }, this);

}


// need intial game state to determine depressed person
// Need to save this to a currentGameData var or something. Hmm.
game.state.add('play-game', setUpGame);

game.state.start('play-game');