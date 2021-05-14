import Vector from './Vector.js';

export default class GameObject {
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
        this.position = position || new Vector({ x: 0, y: 0 })
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