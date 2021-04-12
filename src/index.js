import { start } from './engine/index.js';
import Vector from './engine/Vector.js';
import State from './engine/State.js';
import Player from './Player.js';
import Ball from './Ball.js';
import GameScreen from './engine/Screen.js';

export const settings = {
    screen: {
        height: 700,
        width: 1500
    }
};

const screen = new GameScreen({
    width: settings.screen.width,
    height: settings.screen.height
});
const player = new Player({
    name: 'player1',
    position: new Vector({
        x: 25,
        y: 320
    }),
    width: 10,
    height: 100,
    color: 'white'
});
const player2 = new Player({
    name: 'player2',
    position: new Vector({
        x: 1470,
        y: 320
    }),
    width: 10,
    height: 100,
    color: 'white',
    keyboard: {},
    isAi: true
});
const ball = new Ball({
    name: 'ball',
    position: new Vector({
        x: screen.canvas.width / 2,
        y: screen.canvas.height / 2
    }),
    width: 15,
    height: 15,
    color: 'white'
});
const firstState = new State({
    gameObjects: [ player, ball, player2 ],
    state: 'playing'
});

start({ firstState, screen });