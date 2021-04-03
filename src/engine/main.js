import GameObject from "./GameObject.js";
import GameScreen from "./Screen.js";
import State from "./State.js";
import Vector from "./Vector.js";

const settings = {
    FPS: 60,
    MS_PER_UPDATE: Number((1000 / 60).toFixed(1))
};
const screen = new GameScreen();

export function start() {
    const 
        gameStates = [],
        timeStep = settings.MS_PER_UPDATE;
    
    let lag = 0.0, 
        previousTime = window.performance.now(),
        currentFps = 60,
        framesThisSecond = 0,
        lastFpsUpdate = 0;

    const ball = new GameObject({
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
    gameStates.push(firstState);

    const gameLoop = (currentTime) => {
        const elapsedTime = currentTime - previousTime;
        previousTime = currentTime;
        lag += elapsedTime;

        if (currentTime > lastFpsUpdate + 1000) {
            currentFps = 0.25 * framesThisSecond + (1 - 0.25) * currentFps;

            lastFpsUpdate = currentTime;
            framesThisSecond = 0;
        }
        framesThisSecond++;

        while (lag >= timeStep) {
            
            const currentState = gameStates[gameStates.length - 1];
            const newState = currentState.update(timeStep);
            gameStates.push(newState);
            
            lag -= timeStep;
        }
        render(
            { 
                state: gameStates[gameStates.length - 1],
                itensToWrite: {
                    'FPS': Math.round(currentFps)
                }
            }
        );

        window.requestAnimationFrame(gameLoop);
    };

    gameLoop(window.performance.now());
}

/**
 * 
 * @param {{
 *  dt: number,
 *  state: State
 * }} param0 
 */
function update({ dt, state }) {
    console.log(dt);

    return state.update(dt);
}

/**
 * @param {{
 *  state: State
 * }} params
 */
function render({ state, itensToWrite }) {
    screen.clear();
    screen.write(itensToWrite);
    screen.renderObjects(state.getGameObjects());
}