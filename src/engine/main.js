import GameScreen from "./Screen.js";
import State from "./State.js";

const
    ONE_SECOND = 1000,
    UPDATES_PER_SECOND = 60;

const settings = {
    currentFps: 1,
    framesThisSecond : 0,
    lastFpsUpdate: 0,
    decayRatio: 0.25,
    MS_PER_UPDATE: Number((ONE_SECOND / UPDATES_PER_SECOND).toFixed(1))
};
const screen = new GameScreen();

/**
 * 
 * @param {{
 *  firstState: State
 * }} param0 
 */
export function start({ firstState }) {
    const 
        gameStates = [firstState],
        timeStep = settings.MS_PER_UPDATE;
    
    let lag = 0.0, 
        previousTime = window.performance.now();

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
            
            const previousState = gameStates[gameStates.length - 1];
            const currentState = previousState.update(timeStep);
            gameStates.push(currentState);
            
            lag -= timeStep;
        }
        render(
            { 
                currentState: gameStates[gameStates.length - 1], 
                previousState: gameStates[gameStates.length - 2],
                itensToWrite: {
                    'FPS': Math.round(settings.currentFps)
                },
                interpolation:  lag / settings.MS_PER_UPDATE
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
 *  currentState: State
 *  previousState: State
 *  itemsToWrite: Object
 *  interpolation: number
 * }} params
 */
function render({ currentState, previousState, interpolation, itensToWrite }) {
    screen.clear();
    screen.write(itensToWrite);

    const previousGameObjects = previousState ? previousState.getGameObjects() : [];
    screen.renderObjects(currentState.getGameObjects(), previousGameObjects, interpolation);
}