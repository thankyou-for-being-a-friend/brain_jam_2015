console.log("HELLO I AM HERE (main.js)");

// Instantiate new game!
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container');


// ---------- Debuggin' ---------- 

var characters;

// ---------- Game States ---------- 

var setup = {
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
    game.load.spritesheet('wand', 'assets/images/magic_girl_wand.png', 128, 128, 1);
    game.load.spritesheet('blanche_sprite', 'assets/images/gg1/gg1_sprite.png', 559, 625, 2);
    game.load.spritesheet('dorothy_sprite', 'assets/images/gg2/gg2_sprite.png', 343, 660, 2);
    game.load.spritesheet('person_sprite', 'assets/images/person_sprite.png', 237, 519, 2);
    game.load.image('modal_bg', 'assets/images/modal_bg.png');
    game.load.image('tweet_bg', 'assets/images/tweet_bg.png');
    game.load.image('indicator', 'assets/images/indicator.png');
    game.load.text('char_data', 'assets/data/characters.json');
    game.gameData = {};
  },
  create: function() {
    // pull in data from cache & parse from JSON to object
    charData = JSON.parse(game.cache.getText('char_data'));

    game.gameData.charData = charData.map(function(character, idx) {
      character.currentTweets = [];
      return character;
    });
    // determine who's depressed & set that up
    var randIdx = Math.floor(Math.random() * charData.length);
    game.gameData.charData[randIdx].depressed = true; 
    game.state.start('stageOne');   
  }
}

var stageOne = {
  create: function() {
    // create all characters!

    characters = game.add.group();

    game.gameData.charData.forEach(function(character, idx) {
      var currentCharacter = game.add.image(95 + 200 * idx, game.world.centerY, character.imgKey);
      // add Twitter handle below character
      var twitterHandleStyle = {
        font: 'bold 20px Arial',
        fill: '#369',
      };
      var twitterHandle = game.add.text(95 + 200 * idx, 475, "@" + character.twitterHandle, twitterHandleStyle);

      twitterHandle.anchor.set(0.5);
      currentCharacter.anchor.set(0.5);
      currentCharacter.scale.setTo(0.5, 0.5);
      // Give them the data!!
      // currentCharacter.name = character.name;
      currentCharacter.data = character;
    //   // Set up character to take input
      currentCharacter.inputEnabled = true;
      currentCharacter.events.onInputDown.add(showTweets, this);
    //   // add an indicator to character that will be hidden if they're clicked on
      currentCharacter.indicator = game.add.image(95 + 200 * idx, game.world.centerY - 150, 'indicator')
      currentCharacter.indicator.alpha = 0;
      characters.add(currentCharacter);
    });
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
    var leftMenuRect = game.add.image(0, 0, 'left-menu');
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

    gifCategories = game.add.group();
    // 100 60 190
    // create six category indicators (isOdd to alternate)
    for (var i = 1, x = 40, y = 100; i < 7; i++) {
        var category = game.add.button(x, y, 'cat' + i, categoryBtnClick);
      if (i % 2 === 0) {
        x = 40;
        y += 100;
      } else {
        x += 100;
      }
      category.alpha = 0.5;

      category.inputEnabled = true;
      category.events.onInputOver.add(function(category) {
        category.alpha = 1
      }, this);

      category.events.onInputOut.add(function(category) {
        if (game.gameData.chosenCategory === category) return;
        category.alpha = 0.5
      }, this);

      gifCategories.add(category);
    }
    game.gameData.chosenCategory = gifCategories.getRandom();
    game.gameData.chosenCategory.alpha = 1;
    // Create "back" button
    game.add.button(250, 550, 'indicator', function() {
      game.state.start('stageOne');
    }, this)


    // place character on screen
    var currentCharacter = game.add.sprite(game.width/2 + 150, 300,  game.gameData.chosenCharacter.data.imgKey + '_sprite');
    currentCharacter.anchor.set(0.5);
    currentCharacter.scale.setTo(0.65, 0.65);
    currentCharacter.inputEnabled = true;
    // hover effects
    currentCharacter.events.onInputOver.add(function(character) {
      character.frame = 1;
    });
    currentCharacter.events.onInputOut.add(function(character) {
      character.frame = 0;
    });
    // Click handler to adjust happiness level/click counter
    currentCharacter.events.onInputDown.add(function(character) {
      console.log('Check to see what you\'re throwing at me.');
    });
    // render helper text (click [charname] to send gifs)
    // Create cursor img that follows mouse
    game.gameData.wand = game.add.sprite(game.width - 75, 75, 'wand');
    game.gameData.wand.anchor.set(1);

  },
  update: function() {
    game.gameData.wand.position.x = game.input.mousePointer.position.x + 100;
    game.gameData.wand.position.y = game.input.mousePointer.position.y + 100;
  }
}

// ---------- Function Definitions ---------- 
// Todo - modularize

function categoryBtnClick(category) {
  console.log(game.gameData.chosenCategory.position)
  game.gameData.chosenCategory.alpha = 0.5;
  game.gameData.chosenCategory = category;
  game.gameData.chosenCategory.alpha = 1;
  console.log(game.gameData.chosenCategory.position)
}

// Add single tweet to char's current tweets
function addTweet(character) {
  switch (character.data.depressed) {
    case true:
      if (character.data.tweets.sad.length < 1) return;
      nextTweet = character.data.tweets.sad.shift();
      character.data.currentTweets.push(nextTweet);
      break;
    default:
      if (character.data.tweets.neutral.length < 1) return;
      nextTweet = character.data.tweets.neutral.shift();
      character.data.currentTweets.push(nextTweet);
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

  // This is THE CHOSEN ONE (for now anyhow)
  game.gameData.chosenCharacter = character;

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
  character.data.currentTweets.forEach(function(tweet, idx) {
    var tweetText = game.add.text(125, 150 + 75 * idx, tweet, tweetStyle);
    tweetsContainer.add(tweetText);
  });
  // Add magical girl wand
  var wand = game.add.image(game.width - 75, 75, 'wand');
  wand.anchor.set(0.5);
  wand.inputEnabled = true;
  wand.events.onInputDown.add(function(character) {
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
}

// ---------- Game State Setup & GO! ---------- 

game.state.add('setup', setup);
game.state.add('stageOne', stageOne);
game.state.add('stageTwo', stageTwo);
game.state.start('setup');