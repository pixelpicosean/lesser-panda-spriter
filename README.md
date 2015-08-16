# Spriter for LesserPanda

## Usage

1. Save as SCON instead of SCML
2. Generate texture atlas from Spriter (Note: make sure "smart folder" is on)
3. Make texture atlas and scon file are on the same folder inside `media`
4. Load `your_anim.scon` using `addAsset`
5. Create `game.SpriterAnimation` instance and call `play`

```javascript
addAsset('GreyGuy/player.scon', 'player.scon');

var player = new game.SpriterAnimation('player.scon', 'Player')
  .addTo(this.stage);

player.play('walk');
```

## TODO

- Inverse the scale.y since it's set to -1 to display correctly ;)

## ChangeLog

### v0.1.0

- Make it a LesserPanda plugin, no more PIXI related stuff

### v0.0.1

- SpriterAnimation class
- Eventline: trigger events called "eventline" with event name as its data
- Valline: trigger events called "valline" with variable name and new value
- Tagline: trigger events called "tagline" with current available tags

---

The MIT License (MIT)

Copyright (c) 2015 Sean Bohan

Based on [spriter.js] made by:

- Jason Andersen jgandersen@gmail.com
- Isaac Burns isaacburns@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
