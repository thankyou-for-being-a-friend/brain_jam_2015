console.log("HELLO I AM HERE (main.js)");

// Instantiate new game!
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container');


// ---------- Debuggin' ---------- 

var characters;

// ---------- Game States ---------- 

var setUpGame = {
  init: function() {

    // FUCK THIS PLUGIN I'll do it later.

    // // ---------- Plugins -----------
    // this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);
    // this.game.kineticScrolling.configure({
    //   kineticMovement: true,
    //   timeConstantScroll: 325, //really mimic iOS
    //   horizontalScroll: true,
    //   verticalScroll: true,
    //   horizontalWheel: false,
    //   verticalWheel: true,
    //   deltaWheel: 40
    // });
  },
  preload: function() {
    // load any needed images/data
    game.load.image('person', 'assets/images/person.png');
    game.load.image('cat1', 'assets/images/cat1.png');
    game.load.image('cat2', 'assets/images/cat2.png');
    game.load.image('cat3', 'assets/images/cat3.png');
    game.load.image('cat4', 'assets/images/cat4.png');
    game.load.image('cat5', 'assets/images/cat5.png');
    game.load.image('cat6', 'assets/images/cat6.png');
    game.load.image('left-menu', 'assets/images/left_menu.png');
    game.load.image('blanche', 'assets/images/gg1/GG1.png');
    game.load.image('dorothy', 'assets/images/gg2/GG2.png');
    game.load.image('wand', 'assets/images/magic_girl_wand.png');
    game.load.image('modal_bg', 'assets/images/modal_bg.png');
    game.load.image('tweet_bg', 'assets/images/tweet_bg.png');
    game.load.image('indicator', 'assets/images/indicator.png');
    game.load.text('char_data', 'assets/data/characters.json');
    game.gameData = {};
    game.gameData.charNames = ['person', 'dorothy', 'blanche', 'person'];
  },
  create: function() {
    // Start up that scrollin'
    // this.game.kineticScrolling.start();
    // create all characters!
    // pull in data from cache & parse from JSON to object
    var charData = JSON.parse(game.cache.getText('char_data'));

    characters = game.add.group();

    charData.forEach(function(character, idx) {
      var currentCharacter = game.add.image(95 + 200 * idx, game.world.centerY, game.gameData.charNames[idx]);
      var twitterHandleStyle = {
        font: 'bold 20px Arial',
        fill: '#369',
      };
      // add txt
      var twitterHandle = game.add.text(95 + 200 * idx, 475, "@" + character.twitterHandle, twitterHandleStyle);
      
      twitterHandle.anchor.set(0.5);
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
    characters.forEach(function(character) {

      var nextTweetDelay = Math.round(2 + Math.random() * 10) * 1000;
      // call the addTweet function again on a delay
      game.time.events.add(nextTweetDelay, addTweet, this, character);
    });
    // game.time.events.loop(5000, function(){
    //   characters.forEach(addTweet);
    // }, this)
  }
}

var stageTwo = {
  preload: function() {},
  create: function() {
    // Create the game board!
    var leftMenuGroup = game.add.group();
    // make a rectangle for the lefthand menu
    var leftMenuRect = game.add.image(0,0,'left-menu');
    // Menu title (choose your weapon)
    var menuTitleStyle = {
      font: 'bold 20px Helvetica',
      fill: '#fff',
      align: 'center',
      wordWrap: true,
      wordWrapWidth: 200
    }
    var menuTitle = game.add.text(125, 50, "Choose Your Weapon!", menuTitleStyle);
    menuTitle.anchor.set(0.5);
    // Add all to leftMenuGroup
    leftMenuGroup.add(leftMenuRect);
    leftMenuGroup.add(menuTitle);

    var gifCategories = game.add.group();
    // 100 60 190
    // create six category indicators (isOdd to alternate)
    for (var i = 1, x = 40, y = 100; i < 7; i++) {
      if (i % 2 === 0) {
        var category = game.add.image(x, y, 'cat' + i);
        x = 40;
        y += 100;
      } else {
        var category = game.add.image(x, y, 'cat' + i);
        x += 100;
      }
      category.inputEnabled = true;
      category.events.onInputOver.add(function(event) {
        console.log('You\'re over me!');
      }, this);
      category.events.onInputOut.add(function(event) {
        console.log('You\'re away!');
      }, this);
      // Put click handlers on all to change gameData.category
    }



    // place character on screen
      // Click handler to adjust happiness level/click counter
    // render helper text (click [charname] to send gifs)
    // Create cursor img that follows mouse
    game.gameData.wand = game.add.image(game.width - 75, 75,'wand');
    game.gameData.wand.anchor.set(1);
    // game.input.mouse.onMouseMove.add(function(event) {
    //   game.gameData.wand.position.x = event.x + 100;
    //   game.gameData.wand.position.y = event.y + 45;
    // });
  }
}

// ---------- Function Definitions ---------- 
// Todo - modularize

// Add single tweet to char's current tweets
function addTweet(character) {
  switch (character.depressed) {
    case true:
      if (character.data.tweets.sad.length < 1) return;
      nextTweet = character.data.tweets.sad.shift();
      character.currentTweets.push(nextTweet);
      break;
    default:
      if (character.data.tweets.neutral.length < 1) return;
      nextTweet = character.data.tweets.neutral.shift();
      character.currentTweets.push(nextTweet);
  }
  // show new tweet indicator if not already shown
  showIndicator(character);
  // Set a time for the next tweet to pop up - between two & seventeen seconds
  var nextTweetDelay = Math.round(2 + Math.random() * 15) * 1000;
  // call the addTweet function again on a delay
  game.time.events.add(nextTweetDelay, addTweet, this, character);

}
// Show new tweet indicator
function showIndicator(character) {
  character.indicator.alpha = 1;
  console.log('New tweet from ' + character.data.name + '!')
}


// View Tweets
function showTweets(character) {
  // Hide new tweet indicator
  character.indicator.alpha = 0;

  // ------- KINETIC SCROLLING NOT WORKINGSJKSD -------
  // Set game boundaries because boundaries are important.
  // game.world.setBounds(0,0, game.width, 250 + 75 * character.currentTweets.length);
  // --------------------------------------------------

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
    font: 'bold 32px Arial',
    fill: '#369',
  };
  
  // add txt
  var twitterHandle = game.add.text(game.world.centerX, 100, character.data.twitterHandle, twitterHandleStyle);
  twitterHandle.anchor.set(0.5);
  // add avatar
  // create group to hold all rendered tweets
  var tweetsContainer = game.add.group();

  var tweetStyle = {
    font: "14px Helvetica",
    align: 'left',
    wordWrap: true,
    wordWrapWidth: 550
  };
  character.currentTweets.forEach(function(tweet, idx) {
    var tweetText = game.add.text(125, 150 + 75 * idx, tweet, tweetStyle);
    tweetsContainer.add(tweetText);
  });
  // Add magical girl wand
  var wand = game.add.image(game.width - 75, 75,'wand');
  wand.anchor.set(0.5);
  wand.inputEnabled = true;
  wand.events.onInputDown.add(function(character) {
    game.gameData.chosenCharacter = character;
    game.state.start('stageTwo');
  });

  // Setting up modal to have "click out of meee" functionality
  modalBg.inputEnabled = true;
  modalBg.events.onInputDown.add(function(modalBg) {
    modalBg.parent.removeAll(true);
  }, this);

  // Add all components to the tweetView group
  tweetView.add(modalBg);
  tweetView.add(tweetBg);
  tweetView.add(twitterHandle);
  tweetView.add(tweetsContainer);
  tweetView.add(wand);
  // debugger
  // this.game.world.setBounds(0, 0, 320 * this.rectangles.length, this.game.height);

}

// ---------- Game State Setup & GO! ---------- 

game.state.add('stageOne', setUpGame);
game.state.add('stageTwo', stageTwo);
game.state.start('stageOne');