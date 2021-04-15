import GameObject from './GameObject.js';
import Text from './Text.js';

const DOM = {
    canvas: document.getElementById('pong-canvas')
};

export default class GameScreen {
    constructor({ width, height }) {
        this.canvas = DOM.canvas;
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
            const { name, width, height, color } = object;
            let { x, y } = object.position;

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

            this.context.fillStyle = color;
            this.context.fillRect(x, y, width, height);
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