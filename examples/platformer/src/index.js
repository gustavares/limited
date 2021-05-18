import { start, GameScreen, Vector, Text, State, keyCodes } from './../../../dist/limited.js';
import Platform from './Platform.js';
import Player from './Player.js';

export const GRAVITY = 0.05;
export const settings = {
    screen: {
        height: 700,
        width: 1500
    }
};

const screen = new GameScreen({
    canvasId: 'platformer-canvas',
    width: settings.screen.width,
    height: settings.screen.height
});

const firstState = new State({
    gameObjects: [
        new Player({
            name: 'player',
            position: new Vector({
                x: 200,
                y: 320
            }),
            width: 64, 
            height: 44,
            color: 'white'
        }),
        new Platform({
            name: 'bedrock',
            position: new Vector({
                x: 0,
                y: settings.screen.height - 10
            }),
            width: settings.screen.width,
            height: 150,
            color: 'red'
        }),
        new Platform({
            name: 'platform1',
            position: new Vector({
                x: 200,
                y: 500
            }),
            width: 200,
            height: 100,
            color: 'red'
        })
    ],
    textObjects: [

    ],
    state: 'playing'
});

const player = firstState.getGameObject('player');
player.state = firstState;

const update = ({ state, dt }) => {
    
}

start({
    firstState,
    update,
    screen
})