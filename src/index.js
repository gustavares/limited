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

const firstState = new State({
    gameObjects: [ 
        new Player({
            name: 'player1',
            position: new Vector({
                x: 25,
                y: 320
            }),
            width: 10,
            height: 100,
            color: 'white'
        }), 
        new Player({
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
        }),
        new Ball({
            name: 'ball',
            position: new Vector({
                x: screen.canvas.width / 2,
                y: screen.canvas.height / 2
            }),
            width: 15,
            height: 15,
            color: 'white'
        })
    ],
    state: 'playing'
});

/**
 * 
 * @param {{
 *  state: State
 *  dt: number
 * }} params 
 * 
 * @returns {State} current state
 */
const update = ({ state, dt }) => {
    const player1 = state.getGameObjectByName('player1');
    const player2 = state.getGameObjectByName('player2');
    const ball = state.getGameObjectByName('ball');


    if (ball.collidesWith(player1, dt) || ball.collidesWith(player2, dt)) {
        ball.speed.x *= -1;
    }

    return state.update(dt);
};

start({ firstState, screen, update });