import GameObject from "./GameObject.js";
import GameScreen from "./Screen.js";
import State from "./State.js";
import Vector from "./Vector.js";

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

const
    ONE_SECOND = 1000,
    FPS = 60;

const settings = {
    currentFps: FPS,
    framesThisSecond : 0,
    lastFpsUpdate: 0,
    decayRatio: 0.25,
    MS_PER_UPDATE: Number((ONE_SECOND / FPS).toFixed(1))
};
const screen = new GameScreen();

export function start() {
    const 
        gameStates = [],
        timeStep = settings.MS_PER_UPDATE;
    
    let lag = 0.0, 
        previousTime = window.performance.now();

    gameStates.push(firstState);

    const gameLoop = (currentTime) => {
        const elapsedTime = currentTime - previousTime;
        previousTime = currentTime;
        lag += elapsedTime;
        
        if (currentTime > settings.lastFpsUpdate + ONE_SECOND) {
            /**
             * Weighted moving average to calculate FPS
             * https://gamedev.stackexchange.com/questions/141325/finding-average-input-value-over-time-in-seconds
             * 
             * https://stackoverflow.com/questions/4687430/c-calculating-moving-fps
             */
            settings.currentFps = settings.decayRatio * settings.framesThisSecond + (1 - settings.decayRatio) * settings.currentFps;

            settings.lastFpsUpdate = currentTime;
            settings.framesThisSecond = 0;
        }
        settings.framesThisSecond++;

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
                    'FPS': Math.round(settings.currentFps)
                },
                interpolation: lag / settings.MS_PER_UPDATE
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
 *  itemsToWrite: Object
 *  interpolation: number
 * }} params
 */
function render({ state, interpolation, itensToWrite }) {
    screen.clear();
    screen.write(itensToWrite);
    screen.renderObjects(state.getGameObjects(), interpolation);
}