
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
class Vector {
    constructor({
        x, y
    }) {
        this.x = x;
        this.y = y;
    }
    plus(other) {
        return new Vector({
          x: this.x + other.x, 
          y: this.y + other.y
        });
      }
}

class GameObject {
    constructor({
        name,
        type,
        position,
        width,
        height,
        color,
        speed,
        sprite
    }) {
        this.name = name;
        this.type = type;
        this.position = position || new Vector({ x: 0, y: 0 });
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed || new Vector({ x: 0, y: 0});
        this.sprite = sprite;
    }

    getCenter() {
        return new Vector({
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        })
    }

    update(dt) {
        this.position = new Vector({
            x: this.position.x + (this.speed.x * dt),
            y: this.position.y + (this.speed.y * dt)
        });
    }
}

const keyCodes = {
    UP: 38,
    DOWN: 40,
    RIGHT: 39,
    LEFT: 37,
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    SPACE: 32
};

class Keyboard {
    keyState = {};

    constructor() { 
        window.addEventListener("keydown", this.keyDownHandler);

        window.addEventListener("keyup", this.keyUpHandler);
    }

    keyDownHandler = (event) => {
        event.preventDefault();
        this.keyState[event.keyCode || event.which] = true;
    }

    keyUpHandler = (event) => {
        event.preventDefault();
        this.keyState[event.keyCode || event.which] = false;
    }
}

class State {

    /**
     * 
     * @param {{
     *  gameObjects: GameObject[],
     *  state: State
     * }} param0 
     */
    constructor({ gameObjects, textObjects, state }) {
        this.gameObjects = gameObjects;
        this.textObjects = textObjects;
        this.state = state;
        this.keyboard = new Keyboard();
    }

    setGameObjects(go) {
        this.gameObjects = go;
    }

    getGameObject(name) {
        return this.gameObjects.find((go) => go.name === name);
    }

    getGameObjectsByType(type) {
        return this.gameObjects.map((go) => go.type === type);
    }

    /**
     * @returns {GameObject[]} gameObjects
     */
    getGameObjects() {
        return this.gameObjects;
    }

    getTextObject(label) {
        return this.textObjects.find((to) => to.label === label);
    }

    deleteTextObject(label) {
        const index = this.textObjects.findIndex((to) => to.label === label);
        
        if (index !== -1) {
            this.textObjects.splice(index, 1);
        }
    }

    /**
     * @param {number} dt 
     * @returns {State}
     */
    update(dt) {
        this.gameObjects.forEach(go => go.update(dt));
    }
}

class Text {
    /**
     * 
     * @param {{
     *  content: string
     *  position: Vector
     *  font: string
     * label: string
     * }} param0 
     */
    constructor({ content, label, position, font = '18px verdana' }) {
        Object.assign(this, { content, label, position, font });
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    write(context) {
        context.font = this.font;
        context.fillText(this.content, this.position.x, this.position.y);
    }

    update(newContent) {
        this.content = newContent;

        return this;
    }
}

class GameScreen {
    constructor({ canvasId, width, height }) {
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');
        
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * 
     * @param {GameObject[]} currentGameObjects 
     * @param {GameObject[]} previousGameObjects 
     * @param {number} interpolation
     */
    renderObjects(currentGameObjects, previousGameObjects, interpolation) {

        for (const object of currentGameObjects) {
            const { name, width, height, color, sprite, currentAnimationStateName, position } = object;
            let { x, y } = position;

            if (name === undefined) throw Error('name not found');
            if (x === undefined) throw Error('x not found');
            if (y === undefined) throw Error('y not found');
            if (width === undefined) throw Error('width not found');
            if (height === undefined) throw Error('height not found');
            if (color === undefined) throw Error('color not found');

            if (previousGameObjects.length) {
                const previousGo = previousGameObjects.find((go) => go.name === name);
                if (previousGo) {
                    const prevX = previousGo.position.x;
                    const prevY = previousGo.position.y;

                    x = x * interpolation + prevX * (1 - interpolation);
                    y = y * interpolation + prevY * (1 - interpolation);
                }
            }

        
            if (sprite !== undefined) {
               const spritePosition = sprite.getCurrentSpritePosition();
               this.context.drawImage(sprite, spritePosition.x * width, spritePosition.y * height, sprite.width, sprite.height, x, y, width, height);
            } else {
                this.context.fillStyle = color;
                this.context.fillRect(x, y, width, height);
            }
        }
    }

    /**
     * 
     * @param {Text[]} texts 
     */
    write(texts) {
        for (const text of texts) {
            text.write(this.context);
        }
    }
}

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
let framesRendered = 0;

/**
 * 
 * @param {{
 *  firstState: State
 *  screen: GameScreen
 *  update: Function
 * }} param0 
 */
function start({ firstState, screen, update }) {
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

const STAGGER_FRAMES = 6;

class SpriteSheet extends Image {
    constructor({
        spriteSheetWidth,
        spriteSheetHeight,
        numberOfSprites,
        maxSpritesPerRow,
        numberOfRows,
        currentAnimationStateName,
        animationStates,
        src
    }) {
        super(spriteSheetWidth/maxSpritesPerRow, spriteSheetHeight/numberOfRows);
        this.maxSpritesPerRow = maxSpritesPerRow;
        this.numberOfSprites = numberOfSprites;
        this.numberOfRows = numberOfRows;
        this.spriteSheetWidth = spriteSheetWidth;
        this.spriteSheetHeight = spriteSheetHeight;
        this.currentAnimationStateName = currentAnimationStateName;
        this.animationStates = animationStates;
        this.src = src;
    }

    getCurrentSpritePosition() {
        const currentStateIndex = this.animationStates.findIndex((state) => state.name === this.currentAnimationStateName);
        const currentState = this.animationStates[currentStateIndex];
        
        // todo: if the animation just started should render from the first sprite in the animation sequence
        const currentAnimationFrame = Math.floor(framesRendered/STAGGER_FRAMES) % currentState.numberOfFrames;

        return {
            x: currentAnimationFrame,
            y: currentStateIndex
        }
    }
}

class AnimationState {
    constructor({
        name, 
        numberOfFrames
    }) {
        this.name = name;
        this.numberOfFrames = numberOfFrames;
    }
}

export { AnimationState as AnimationSequence, GameObject, GameScreen, Keyboard, SpriteSheet, State, Text, Vector, framesRendered, keyCodes, start };
