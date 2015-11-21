# Phaser Notes!

Inital impressions from reading through the Phaser docs prior to getting started on the codestuffs

### Pieces of Phaser We'll Probably Need

#### Major Pieces

- `Game`
- `World`
- `Camera`
- `Stage`

#### Game States

#### Loader

- For caching images, sound, data

#### Game Scaling

- `ScaleManager`

#### Signals

- `Events`! :D

### Game Objects

- `GameObjectFactory` (`add`) - creates a new game object and automatically adds it to the world/correct group! SWEET!
- `Group` - organize our Game Objects, search through them/sort/etc
- `InputHandler`
- `Events`

#### Display

- `Sprite` - capable of running animation, input events & physics (possibly not necessary for our game.)
- `Image` - "lighter" Game Object - has texture & can handle input, but no physics/animation handlers (probably better)
- `Button` (fer sher breh)

#### Graphics

- `Graphics` (vector)
- `BitmapData` (blank HTML5 canvas object)

#### Text

- `Text` (system or web fonts), `BitmapText`, `RetroFont` (both texture-based)

#### Animation

- Don't know as we'll be animating a heck of a lot, if anything

### Geometry

- Can draw basic shapes, lines, points, rounded rectangles.

### Time

- `Time` - Phaser's internal clock!
- `Timer` - contains TimerEvents!
- `TimerEvent` - time-related event object! Tweet at intervals

### Math

- `RandomDataGenerator` - innnteresting! Possibly good for pseudo-rando tweets?

### Network

- `Net` - Redirect to tumblr?

### Particles

- Could use an emitter for magical girl wand

### Input

- Event listeners for pointers, keys, mouse, etc

### Sound

- Includes a `SoundManager` and `Sound`s!


### Utils

- Enhanced Array class(`ArraySet`), Color, Debug, etc.

---

