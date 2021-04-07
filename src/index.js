import { start } from './engine/index.js';
import Vector from './engine/Vector.js';
import State from './engine/State.js';
import Player from './Player.js';

const ball = new Player({
    name: 'ball',
    position: new Vector({
        x: 50,
        y: 400
    }),
    speed: new Vector({
        x: 0.5,
        y: 0
    }),
    width: 15,
    height: 15,
    color: 'white'
});
const firstState = new State({
    gameObjects: [ ball ],
    state: 'playing'
});


start({ firstState });