// TODO: Clean up poorly named functions
// Separate files out to avoid the horribleness that is scrolling though this damn file
// Fix event-dependent logic

console.log("HELLO I AM HERE (main.js)");

// Instantiate new game!
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container');


// ---------- Debuggin' ---------- 

var characters;

// ---------- Game States ---------- 

var setup = {
  preload: function() {
    // load any needed images/data
    // Generic person placeholder
    game.load.image('person', 'assets/images/person.png');
    // JUST RECTANGLES
    game.load.image('cat1', 'assets/images/cat1.png');
    game.load.image('cat2', 'assets/images/cat2.png');
    game.load.image('cat3', 'assets/images/cat3.png');
    game.load.image('cat4', 'assets/images/cat4.png');
    game.load.image('cat5', 'assets/images/cat5.png');
    game.load.image('cat6', 'assets/images/cat6.png');
    // Indicators/cursors/etc
    game.load.spritesheet('wand', 'assets/images/magic_girl_wand.png', 128, 128, 1);
    game.load.image('indicator', 'assets/images/indicator.png');
    game.load.image('cancel', 'assets/images/structure/cancel_btn.png');
    game.load.image('replay', 'assets/images/structure/replay_btn.png');
    // Structural images
    game.load.image('modal_bg', 'assets/images/modal_bg.png');
    game.load.image('tweet_bg', 'assets/images/tweet_bg.png');
    game.load.image('left-menu', 'assets/images/left_menu.png');
    game.load.image('tweet_box', 'assets/images/structure/tweet_box.png');
    // Static lady images
    game.load.image('blanche', 'assets/images/gg1/GG1.png');
    game.load.image('dorothy', 'assets/images/gg2/GG2.png');
    game.load.image('rose', 'assets/images/gg3/gg3.png');
    // Lady sprites <3
    game.load.spritesheet('blanche_sprite', 'assets/images/gg1/gg1_sprite.png', 559, 625, 2);
    game.load.spritesheet('dorothy_sprite', 'assets/images/gg2/gg2_sprite.png', 343, 660, 2);
    game.load.spritesheet('rose_sprite', 'assets/images/gg3/gg3_sprite.png', 409, 647, 2);
    game.load.spritesheet('person_sprite', 'assets/images/person_sprite.png', 237, 519, 2);
    //sfx
    game.load.audio('fairy_wand', 'assets/audio/BrainJam_Fairy_Wand.wav');
    game.load.audio('pop', 'assets/audio/BrainJam_Pop.wav');
    game.load.audio('select', 'assets/audio/BrainJam_UI_Click.wav');
    // gif attacks!!
    game.load.audio('attack', 'assets/audio/BrainJam_Dogs_GIF.wav');
    // music
    game.load.audio('stage_one', 'assets/audio/ambient_stage_one.wav');
    // game.load.audio('stage_two', 'assets/audio/BrainJam_Fairy_Wand.wav');

    // data
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
    // Play stage one music!
    game.gameData.stageOneMusic = game.add.audio('stage_one');
    game.gameData.stageOneMusic.loopFull();

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

      var nextTweetDelay = Math.round(2 + Math.random() * 5) * 1000;
      // call the addTweet function again on a delay
      game.time.events.add(nextTweetDelay, addTweet, this, character);
    });
    // game.time.events.loop(5000, function(){
    //   characters.forEach(addTweet);
    // }, this)
  }
}

var stageTwo = {
  preload: function(stageOneMusic) {
    game.gameData.categories = [
      "cats",
      "puppies",
      "bunnies",
      "ducklings",
      "whatever",
      "whatever"
    ]
    game.gameData.stageOneMusic.fadeOut(1000);

    // Create group with high z-index to keep cursor on top
    game.gameData.cursorGroup = game.add.group();
    // game.gameData.cursorGroup.bringToTop()
  },
  create: function() {
    // Play stage two music!

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
    game.gameData.cancelBtn = game.add.button(700, 550, 'cancel', function() {
      game.state.start('stageOne');
    }, this)

    game.gameData.cancelBtn.anchor.set(0.5);

    // place character on screen
    var currentCharacter = game.add.sprite(550, 300, game.gameData.chosenCharacter.data.imgKey + '_sprite');
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
    currentCharacter.events.onInputDown.add(attackWithGif, this);
    // render helper text (click [charname] to send gifs)
    // Create cursor img that follows mouse
    game.gameData.wand = game.add.sprite(game.width - 75, 75, 'wand');
    game.gameData.wand.anchor.set(1);
    game.gameData.wand.position.z = 2;
    game.gameData.cursorGroup.add(game.gameData.wand);

  },
  update: function() {
    game.gameData.wand.position.x = game.input.mousePointer.position.x + 100;
    game.gameData.wand.position.y = game.input.mousePointer.position.y + 100;
    game.world.bringToTop(game.gameData.cursorGroup);
  }
}

// ---------- Function Definitions ---------- 
// Todo - get these outta this file IT'S SO MESSY OH GAWD

function animateSquare() {
  // Create new category-square image
  var square = game.add.image(game.gameData.chosenCategory.position.x + 2, game.gameData.chosenCategory.position.y + 2, 'cat1');

  // tween it to the character's location
  var squareTween = game.add.tween(square)
  squareTween.to({
    x: 500,
    y: 250
  }, 200, Phaser.Easing.Linear.None, true);
  // once that's done: 
  squareTween.onComplete.add(function(square) {
    // remove square from game
    square.destroy();
  });

  // Need a separate tween for scale <3
  var squareScaleTween = game.add.tween(square.scale).to({
    x: 0.1,
    y: 0.1
  }, 200, Phaser.Easing.Linear.None, true);

  // animate particle effects on char?

}

function showResponse(character, depressed, likesCategory) {
  game.gameData.cancelBtn.input.enabled = false;
  // Disable clicks on all categories & char
  character.input.enabled = false;
  character.input.enabled = false;
  game.gameData.gifCategories.forEach(function(gifCategory) {
    gifCategory.input.enabled = false;
  });

  if (!depressed) {
    console.log('not depressed')
      // Start shooting gifs! Shoot for 3 - 5 seconds
    var attackMusic = game.add.audio('attack');
    attackMusic.play();

    var shootGifsTimer = game.time.events.repeat(100, 20, animateSquare, this);

    // After timer event completes looping, display "not depressed" fail message
    // Note to self - refactor, do this with a callback
    game.time.events.add(3000, function(attackMusic) {

      //create twitter bg img
      var twitterBg = game.add.image(400, 450, 'tweet_box');
      twitterBg.anchor.set(0.5);
      // Create new text node w/content of character.data.tweets.unnecessary[0]
      var tweetStyle = {
        font: 'bold 24px Arial',
        fill: '#369',
        wordWrap: true,
        wordWrapWidth: 500,
        align: 'left'
      };
      var tweetText = game.add.text(400, 450, game.gameData.chosenCharacter.data.tweets.unnecessary[0], tweetStyle);
      tweetText.anchor.set(0.5);

      // Create new text node - Try again!
      var tryAgainStyle = {
        font: 'bold 48px fantasy',
        fill: 'yellow'
      };
      var tryAgainText = game.add.text(400, 250, 'Try Again! <3', tryAgainStyle);
      tryAgainText.anchor.set(0.5);

      //fade out attack music
      attackMusic.fadeOut(1000);
      game.time.events.add(5000, function() {
        console.log('going back to stage one');
        game.state.start('stageOne');
      }, this)
    }, this, attackMusic);
  } else if (depressed && !likesCategory) {
    console.log('depressed, not right gif');
    // Start shooting gifs! Shoot for 3 - 5 seconds
    var attackMusic = game.add.audio('attack');
    attackMusic.play();
    var shootGifsTimer = game.time.events.repeat(100, 20, animateSquare, this);

    // After timer event completes looping, display "wrong gif" fail message
    // Note to self - refactor, do this with a callback
    game.time.events.add(3000, function(attackMusic) {

      //group to contain tweet
      var tweetGroup = game.add.group();
      //create twitter bg img
      var twitterBg = game.add.image(400, 450, 'tweet_box');
      twitterBg.anchor.set(0.5);
      // Create new text node w/content of character.data.tweets.unnecessary[0]
      var tweetStyle = {
        font: 'bold 24px Arial',
        fill: '#369',
        wordWrap: true,
        wordWrapWidth: 500,
        align: 'left'
      };
      var tweetText = game.add.text(400, 450, game.gameData.chosenCharacter.data.tweets.wrongGifs[0], tweetStyle);
      tweetText.anchor.set(0.5);

      // Create new text node - Try again!
      var tryAgainStyle = {
        font: 'bold 48px fantasy',
        fill: 'yellow'
      };
      var tryAgainText = game.add.text(400, 250, 'Try Again! <3', tryAgainStyle);
      tryAgainText.anchor.set(0.5);

      tweetGroup.add(twitterBg);
      tweetGroup.add(tweetText);
      tweetGroup.add(tryAgainText);

      //fade out attack music
      attackMusic.fadeOut(1000);
      // Get rid of tweet after 5 seconds
      game.time.events.add(5000, function() {
        tweetGroup.destroy();
        console.log('halllo');
        // re-enable clicks on all categories & char
        game.gameData.gifCategories.forEach(function(gifCategory) {
          gifCategory.input.enabled = true;
        });
        character.input.enabled = true;
        game.gameData.cancelBtn.input.enabled = true;
      }, this, tweetGroup)

    }, this, attackMusic);

    // If your character is not depressed AND you chose the right gif... YOU WIN YAY
  } else {
    // For later:
    // var attackMusic = game.add.audio('attack' + game.gameData.chosenCategory.catName);
    var attackMusic = game.add.audio('attack');
    attackMusic.play();
    var shootGifsTimer = game.time.events.repeat(100, 20, animateSquare, this);

    // After timer event completes looping, display "wrong gif" fail message
    // Note to self - refactor, do this with a callback
    game.time.events.add(3000, function(attackMusic) {

      //create twitter bg img
      var twitterBg = game.add.image(400, 450, 'tweet_box');
      twitterBg.anchor.set(0.5);

      var tweetStyle = {
        font: 'bold 24px Arial',
        fill: '#369',
        wordWrap: true,
        wordWrapWidth: 500,
        align: 'left'
      };
      var tweetText = game.add.text(400, 450, game.gameData.chosenCharacter.data.tweets.correct[0], tweetStyle);
      tweetText.anchor.set(0.5);

      // Create new text node - Try again!
      var tryAgainStyle = {
        font: 'bold 48px fantasy',
        fill: 'yellow'
      };
      var tryAgainText = game.add.text(400, 200, 'Nice job!', tryAgainStyle);
      tryAgainText.anchor.set(0.5);

      var playAgain = game.add.button(400, 250, 'replay', function() {
        game.state.start('setup');
      })
      playAgain.anchor.set(0.5);

      //fade out attack music
      attackMusic.fadeOut(1000);
    }, this, attackMusic);
  }
}

function attackWithGif(character) {
  // Check to see if chosen character likes this gif!
  if (!game.gameData.chosenCharacter.data.depressed) {
    // Args: showResponse(character, depressed[, likesCategory])
    showResponse(character, false);
  } else if (game.gameData.chosenCharacter.data.likes.indexOf(game.gameData.chosenCategory.catName) > -1 || game.gameData.chosenCategory.catName === 'whatever') {
    showResponse(character, true, true);
  } else {
    showResponse(character, true, false);
  }
}

function categoryBtnClick(category) {
  var clickNoise = game.add.audio('select');
  clickNoise.play();
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
  var clickNoise = game.add.audio('select');
  clickNoise.play();
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
    game.state.start('stageTwo', true, false, game.gameData.stageOneMusic);
  }, this);

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