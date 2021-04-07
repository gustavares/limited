import GameObject from './engine/GameObject.js';
import Vector from './engine/Vector.js';

export default class Player extends GameObject {
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
            type: 'player', 
            position, 
            speed,
            color, 
            width, 
            height
        });
    }

    update(dt) {
        if (this.position.x <= 25 || this.position.x >= 1450) {
            this.speed.x = -this.speed.x;
        }

        const newPosition = new Vector({
            x: this.position.x + (this.speed.x * dt),
            y: this.position.y
        });

        return new Player({
            ...this,
            position: newPosition
        });
    }
}