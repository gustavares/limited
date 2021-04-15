import Vector from './Vector.js';

export default class GameObject {
    constructor({
        name,
        type,
        position,
        width,
        height,
        color,
        speed
    }) {
        this.name = name;
        this.type = type;
        this.position = position || new Vector({ x: 0, y: 0 })
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed || new Vector({ x: 0, y: 0});
    }

    update(dt) {
        return new GameObject({
            ...this,
            position: new Vector({
                x: this.position.x + (this.speed.x * dt),
                y: this.position.y + (this.speed.y * dt)
            }),
        })
    }
}