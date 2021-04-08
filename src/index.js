import { start } from './engine/index.js';
import Vector from './engine/Vector.js';
import State from './engine/State.js';
import Player from './Player.js';
import GameScreen from './engine/Screen.js';

const screen = new GameScreen();
const ball = new Player({
    name: 'ball',
    position: new Vector({
        x: 25,
        y: 320
    }),
    width: 10,
    height: 100,
    color: 'white'
});
const firstState = new State({
    gameObjects: [ ball ],
    state: 'playing'
});


start({ firstState, screen });