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

class GameLoop {
    framesRendered = 0;
    timeStep = settings.MS_PER_UPDATE;
    lag = 0.0; 
    currentState; previousState; previousTime;
    screen;

    _loop = (currentTime) => {
        const elapsedTime = currentTime - this.previousTime;
        this.previousTime = currentTime;
        this.lag += elapsedTime;
        
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

        while (this.lag >= this.timeStep) {
            this.previousState = this.currentState;
            this.currentState.update(this.timeStep);
            this.lag -= this.timeStep;
        }

        this.framesRendered++;

        // todo: create debug config logic to toggle fps display
        this.currentState.textObjects = [ this.getFpsTextObject() ];
        
        this.currentState.render({
            interpolation: this.lag / settings.MS_PER_UPDATE,
            previousState: this.previousState
        });

        window.requestAnimationFrame(this._loop);
    }

    start = ({
        firstState
    }) => {
        this.previousTime = window.performance.now();
        this.currentState = firstState; 

        this._loop(window.performance.now());
    }

    getFpsTextObject = () => {
        return new Text({ 
            content: `FPS: ${Math.round(settings.currentFps)}`,
            position: { x: 1400, y: 30 },
            label: 'FPS'
        });
    }
}

const gameLoop = new GameLoop();
export default gameLoop;