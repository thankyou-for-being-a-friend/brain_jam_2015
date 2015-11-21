console.log("HELLO I AM HERE (main.js)");

window.onload = function() {
  var game = Phaser.Game(800, 600, Phaser.AUTO, 'game-container', {
    preload: preload,
    create: create,
    update: update
  })

  function preload () {
    game.load.image('person', '/img/person.png')
  }

  function create () {
    var dude = game.add.image(0,0,'person');
  }

  function update () {

  }
};