import {
    start
} from './engine/index.js';
import Vector from './engine/Vector.js';
import GameObject from './engine/GameObject.js';
import State from './engine/State.js';

const ball = new GameObject({
    name: 'ball',
    position: new Vector({
        x: 50,
        y: 400
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