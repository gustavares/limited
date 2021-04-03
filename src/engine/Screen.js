import GameObject from './GameObject.js';

const DOM = {
    canvas: document.getElementById('pong-canvas')
};

export default class GameScreen {
    constructor() {
        this.canvas = DOM.canvas;
        this.canvas.width = 1500;
        this.canvas.height = 700;
        this.context = this.canvas.getContext('2d');
        
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * 
     * @param {GameObject[]} gameObjects 
     */
    renderObjects(gameObjects) {

        for (const object of gameObjects) {
            const { width, height, color } = object;
            const { x, y } = object.position;

            if (x === undefined) throw Error('x not found');
            if (y === undefined) throw Error('y not found');
            if (width === undefined) throw Error('width not found');
            if (height === undefined) throw Error('height not found');
            if (color === undefined) throw Error('color not found');

            this.context.fillStyle = color;
            this.context.fillRect(x, y, width, height);
        }
    }

    write(labelValueMap) {
        let y = 30;
        this.context.font = '18px verdana';
        for (const label in labelValueMap) {
            this.context.fillText(`${label}: ${labelValueMap[label]}`, 1410, y);
            y += 30;
        }
    }
}