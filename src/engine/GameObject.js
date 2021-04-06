import Vector from './Vector.js';

export default class GameObject {
    speed = 0.5

    constructor({
        name,
        position,
        width,
        height,
        color,
        speed
    }) {
        this.name = name;
        this.position = position || new Vector({ x: 0, y: 0 })
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed || this.speed;
    }

    newXPosition(dt) {
        if (this.position.x <= 25 || this.position.x >= 1450) {
            this.speed = -this.speed;
        }

        return new Vector({
            x: this.position.x + (this.speed * dt),
            y: this.position.y
        });
    }

    update(dt) {
        const newX = this.newXPosition(dt);

        return new GameObject({
            ...this,
            position: new Vector({
                x: newX.x,
                y: this.position.y
            }),
        })
    }
}