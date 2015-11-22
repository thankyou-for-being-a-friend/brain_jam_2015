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
    
    game.load.spritesheet('wand', 'assets/images/magic_girl_wand.png', 128, 128, 1);
    game.load.image('indicator', 'assets/images/indicator.png');
    
    game.load.image('modal_bg', 'assets/images/modal_bg.png');
    game.load.image('tweet_bg', 'assets/images/tweet_bg.png');
    game.load.image('left-menu', 'assets/images/left_menu.png');
    game.load.image('tweet_box', 'assets/images/structure/tweet_box.png');
    
    game.load.image('blanche', 'assets/images/gg1/GG1.png');
    game.load.image('dorothy', 'assets/images/gg2/GG2.png');
    
    game.load.spritesheet('blanche_sprite', 'assets/images/gg1/gg1_sprite.png', 559, 625, 2);
    game.load.spritesheet('dorothy_sprite', 'assets/images/gg2/gg2_sprite.png', 343, 660, 2);
    game.load.spritesheet('person_sprite', 'assets/images/person_sprite.png', 237, 519, 2);
    
    game.load.audio('fairy_wand', 'assets/audio/BrainJam_Fairy_Wand.wav');
    game.load.audio('pop', 'assets/audio/BrainJam_Pop.wav');
    game.load.audio('attack', 'assets/audio/BrainJam_Dogs_GIF.wav');

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
  preload: function() {
    game.gameData.categories = [
      "cats",
      "puppies",
      "bunnies",
      "ducklings",
      "whatever",
      "whatever"
    ]
    // game.gameData.clickCounter = 0;
  },
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

    game.gameData.gifCategories = game.add.group();
    // 100 60 190
    // create six category indicators (alternate on odds)
    for (var i = 1, x = 40, y = 100; i < 7; i++) {
      var category = game.add.button(x, y, 'cat' + i, categoryBtnClick);
      category.catName = game.gameData.categories[i - 1];
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

      game.gameData.gifCategories.add(category);
    }
    game.gameData.chosenCategory = game.gameData.gifCategories.getRandom();
    game.gameData.chosenCategory.alpha = 1;
    // Create "back" button
    game.add.button(250, 550, 'indicator', function() {
      game.state.start('stageOne');
    }, this)


    // place character on screen
    var currentCharacter = game.add.sprite(550, 300,  game.gameData.chosenCharacter.data.imgKey + '_sprite');
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
    currentCharacter.events.onInputDown.add(attackWithGif);
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
// Todo - get these outta this file IT'S SO MESSY OH GAWD

function showResponse(character, depressed, likesCategory) {
  // Disable clicks on all categories
  game.gameData.gifCategories.forEach(function(gifCategory) {

  });
  if (!depressed) {
    // Start shooting gifs! Shoot for 3 - 5 seconds
    var attackMusic = game.add.audio('attack');
    attackMusic.play();
    var shootGifsTimer = game.time.events.repeat(100, 20, function() {
    //play music
    // Create new category-square image
      var square = game.add.image(game.gameData.chosenCategory.position.x + 2, game.gameData.chosenCategory.position.y + 2, 'cat1');

      // tween it to the character's location
      var squareTween = game.add.tween(square)
      squareTween.to({x: game.gameData.chosenCharacter.position.x + 35, y: game.gameData.chosenCharacter.position.y - 75}, 200, Phaser.Easing.Linear.None, true);
      // once that's done: 
      squareTween.onComplete.add(function(square) {
        // remove square from game
        square.destroy();
      });

      // Need a separate tween for scale <3
      var squareScaleTween = game.add.tween(square.scale).to({x: 0.1, y: 0.1}, 200, Phaser.Easing.Linear.None, true);

        // animate particle effects on char?

    }, this);
    // After timer event completes looping, display "not depressed" fail message
    // Note to self - refactor, do this with a callback
    game.time.events.add(3000, function(attackMusic) {
      console.log(character.data.tweets.unnecessary[0]);
      attackMusic.fadeOut(1000);
    }, this, attackMusic);
  } else if (depressed && !likesCategory) {
    console.log(character.data.tweets.wrongGifs[0]);
  } else {
    console.log(character.data.tweets.correct[0]);
  }
}

function attackWithGif(character) {
  // game.gameData.clickCounter++;
  // if (game.gameData.clickCounter < 10) return;

  // Check to see if chosen character likes this gif!
  if (!game.gameData.chosenCharacter.data.depressed) {
    // Args: showResponse(character, depressed[, likesCategory])
    showResponse(game.gameData.chosenCharacter, false);
  } else if (game.gameData.chosenCharacter.data.likes.indexOf(game.gameData.chosenCategory.catName) > -1 || game.gameData.chosenCategory.catName === 'whatever') {
    showResponse(game.gameData.chosenCharacter, true, true);
    // game.gameData.clickCounter = 0;
  } else {
    showResponse(game.gameData.chosenCharacter, true, false);
    // game.gameData.clickCounter = 0;
  }
    

}

function categoryBtnClick(category) {
  game.gameData.chosenCategory.alpha = 0.5;
  game.gameData.chosenCategory = category;
  game.gameData.chosenCategory.alpha = 1;
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
  if (character.indicator.alpha != 1) {
    character.indicator.alpha = 1;
    game.add.audio('pop').play();
  }
  console.log('New tweet from ' + character.data.name + '!');
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
    var fairySound = game.add.sound('fairy_wand', 0.5);
    fairySound.play();
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