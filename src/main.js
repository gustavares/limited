import GameScreen from "./Screen.js";
import State from "./State.js";
import Text from './Text.js';

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
export let framesRendered = 0;

/**
 * 
 * @param {{
 *  firstState: State
 *  screen: GameScreen
 *  update: Function
 * }} param0 
 */
export function start({ firstState, screen, update }) {
    const timeStep = settings.MS_PER_UPDATE;
    
    let lag = 0.0, 
        previousTime = window.performance.now();
    let currentState = firstState; 
    let previousState;
    
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

            previousState = currentState;
            update({ state: currentState, dt: timeStep});
            currentState.update(timeStep);
            lag -= timeStep;
        }

        framesRendered++;
        render(
            screen,
            { 
                currentState,
                previousState,
                texts: [
                    new Text({ 
                        content: `FPS: ${Math.round(settings.currentFps)}`,
                        position: { x: 1400, y: 30 },
                        label: 'FPS'
                    }),
                    ...currentState.textObjects
                ],
                interpolation:  lag / settings.MS_PER_UPDATE
            }
        );

        window.requestAnimationFrame(gameLoop);
    };

    gameLoop(window.performance.now());
}

/**
 * @param {{
 *  currentState: State
 *  previousState: State
 *  texts: Text[]
 *  interpolation: number
 * }} params
 */
function render(screen, { currentState, previousState, interpolation, texts }) {
    screen.clear();
    screen.write(texts);

    const previousGameObjects = previousState ? previousState.getGameObjects() : [];
    screen.renderObjects(currentState.getGameObjects(), previousGameObjects, interpolation);
}