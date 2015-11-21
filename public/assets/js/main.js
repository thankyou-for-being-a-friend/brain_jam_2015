console.log("HELLO I AM HERE (main.js)");

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container');

var characters;

allCharsState = {
  preload: function() {
    game.load.image('person', 'img/person.png')
    game.load.image('tweet_bg', 'img/tweet_bg.png')
  },
  create: function() {
    // test data
    // pull in data from cache & parse from JSON to object
    var charData = [
      {name: "bob", dislikes: "everything"},
      {name: "fred", dislikes: "fur"},
      {name: "jim", dislikes: "bottlecaps"},
      {name: "anna", dislikes: "nothing"}
    ]

    characters = game.add.group();

    // Loop through all character data & create new game object from each
    charData.forEach(function(char, idx) {
      var currentCharacter = game.add.image(95 + 200 * idx, game.world.centerY,'person');
      currentCharacter.anchor.set(0.5);
      // enable any kind of input on the dude
      currentCharacter.inputEnabled = true;
      currentCharacter.dislikes = char.dislikes;
      currentCharacter.scale.setTo(0.5,0.5);
      currentCharacter.events.onInputDown.add(function(char) {
        game.state.start('view-tweets-state', false, false, currentCharacter);
      }, this);
      characters.add(currentCharacter);
    });
  }
}


viewTweetsState = {
  // there's definitely a better way to do this...
  init: function(character) {
    // Add a new rectangle to the game space
    tweetBg = game.add.image(game.world.centerX, game.world.centerY, 'tweet_bg');
    tweetBg.anchor.set(0.5);
    tweetText = game.add.text(0,0,"helloooo");
    console.log(character.dislikes);
    game.events.onInputDown.add()
  },
  create: function () {

  }
} 

game.state.add('all-char-state', allCharsState);
game.state.add('view-tweets-state', viewTweetsState);

game.state.start('all-char-state');

