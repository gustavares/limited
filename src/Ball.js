import GameObject from './engine/GameObject.js';
import Vector from './engine/Vector.js';

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomDirection() {
    return Math.round(Math.random()) ? 1 : -1;
}

export default class Ball extends GameObject {
    /**
     * 
     * @param {{
     *   position: Vector,
     * }} param0
     */
    constructor({
        name,
        position,
        speed,
        width,
        height,
        color,
    }) {
        super({
            name,
            type: 'ball',
            position,
            speed: speed || new Vector({
                x: getRandomArbitrary(0.5, 0.7) * getRandomDirection(), 
                y: getRandomArbitrary(0.3, 0.5) * getRandomDirection()
            }),
            color,
            width,
            height
        });
    }

    update(dt) {
        const newPosition = this.position.plus({
            x: this.speed.x * dt,
            y: this.speed.y * dt
        });

        return new Ball({
            ...this,
            position: newPosition
        });
    }
}