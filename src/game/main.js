game.module(
  'game.main'
)
.require(
  'plugins.spriter'
)
.body(function() { 'use strict';

  game.addAsset('GreyGuy/player.scon', 'player');

  game.createScene('Main', {
    backgroundColor: 0xb9bec7,

    init: function() {
      var player = new game.SpriterAnimation('player', 'Player').addTo(this.stage);
      player.position.set(300, 300);
      player.play('walk');
    }
  });

});
