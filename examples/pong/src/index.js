import { start } from './../../../src/index.js';
import Vector from './../../../src/Vector.js';
import State from './../../../src/State.js';
import Player from './Player.js';
import Ball from './Ball.js';
import GameScreen from './../../../src/Screen.js';
import { keyCodes } from './../../../src/Keyboard.js';
import Text from './../../../src/Text.js';

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

const WINNING_MESSAGE_PARAMS = {
    label: "winningMessage",            
    font: '48px verdana',
    position: new Vector({ 
        x: (settings.screen.width / 2) - 160, 
        y: (settings.screen.height / 2) - 50
    }
)};

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
    textObjects: [
        new Text({
            content: '0',
            label: 'player1Score',
            position: { x: (settings.screen.width / 2) - 140, y: 50 },
            font: '36px verdana'
        }),
        new Text({
            content: '0',
            label: 'player2Score',
            position: { x: (settings.screen.width / 2) + 110, y: 50 },
            font: '36px verdana'
        })
    ],
    state: 'serving'
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
            if (points.player1 !== 0 || points.player2 !== 0) {            
                ball.serve(state.player1Serve);
            } else {
                ball.serveRandom();
            }
        }
        
        if (ball.position.x <= 0) {
            state.state = 'serving';
            points.player2++;
            const scoreText = state.getTextObject('player2Score');
            scoreText.content = points.player2.toString();
            state.player1Serve = true;
        } else if (ball.position.x >= settings.screen.width - ball.width) {
            state.state = 'serving';
            points.player1++;
            const scoreText = state.getTextObject('player1Score');
            scoreText.content = points.player1.toString();
            state.player1Serve = false;
        }

        if (points.player1 === 10) {
            state.textObjects.push(new Text({
                content: 'Player 1 WON!',
                ...WINNING_MESSAGE_PARAMS
            }));
            state.state = 'final';
        } else if (points.player2 === 1) {
            state.textObjects.push(new Text({
                content: 'Player 2 WON!',
                ...WINNING_MESSAGE_PARAMS
            }));
            state.state = 'final';
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
    } else if (state.state === 'final') {
        ball.reset(BALL_STARTING_POSITION);

        if (state.keyboard.keyState[keyCodes.SPACE]) {
            points.player1 = 0;
            points.player2 = 0;

            state.getTextObject('player1Score').content = 0;
            state.getTextObject('player2Score').content = 0;
            state.deleteTextObject('winningMessage');

            state.state = 'playing';
        }

        return state;
    }
};

start({ firstState, screen, update });