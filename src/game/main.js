import engine from 'engine/core';
import Scene from 'engine/scene';
import PIXI from 'engine/pixi';
import loader from 'engine/loader';

import 'game/loading';

import * as spriter from 'plugins/spriter';

// Load textures
loader.addAsset('GreyGuy/player.scon', 'player');

class Main extends Scene {
  constructor() {
    super();

    let player = new spriter.SpriterAnimation('player', 'Player')
      .addTo(this.stage);
    player.position.set(engine.width * 0.5, engine.height - 40);
    player.play('walk');
    player.scale.set(0.5, -0.5);

    window.p = player;
  }
  awake() {
  }
  update() {
  }
};
engine.addScene('Main', Main);

engine.startWithScene('Loading');
