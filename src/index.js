import { start } from './engine/index.js';
import Vector from './engine/Vector.js';
import State from './engine/State.js';
import Player from './Player.js';
import Ball from './Ball.js';
import GameScreen from './engine/Screen.js';
import Keyboard, { keyCodes } from './engine/Keyboard.js';

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

const BALL_STARTING_POSITION =  new Vector({
    x: screen.canvas.width / 2,
    y: screen.canvas.height / 2
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
            position: BALL_STARTING_POSITION,
            width: 15,
            height: 15,
            color: 'white'
        })
    ],
    state: 'playing'
});

const points = {
    player1: 0,
    player2: 0
};

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
    const player1 = state.getGameObject('player1');
    const player2 = state.getGameObject('player2');
    const ball = state.getGameObject('ball');

    if (state.state === 'playing') {

        if (ball.speed.x === 0 && ball.speed.y === 0) {
            ball.serve(state.player1Serve);
        }
        
        if (ball.position.x <= 0) {
            state.state = 'serving';
            points.player1++;
            state.player1Serve = false;
        } else if (ball.position.x >= settings.screen.width - ball.width) {
            state.state = 'serving';
            points.player2++;
            state.player1Serve = true;
        }

        if (ball.collidesWith(player1, dt) || ball.collidesWith(player2, dt)) {
            ball.speed.x *= -1;
        }

        if (ball.speed.x > 0) {
            if (ball.position.y > player2.position.y + 50) {
                player2.speed.x = player2.moveSpeed;
            } else if (ball.position.y < player2.position.y + 50) {
                player2.speed.x = -player2.moveSpeed;
            }
        } else {
            player2.speed.x = 0;
        }

        return state.update(dt);
    } else if (state.state === 'serving') {
        ball.reset(BALL_STARTING_POSITION);

        if (state.keyboard.keyState[keyCodes.SPACE]) {
            state.state = 'playing';
        }
        
        return state;
    }

    
};

start({ firstState, screen, update });