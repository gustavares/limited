import GameObject from './engine/GameObject.js';
import Keyboard, { keyCodes } from './engine/Keyboard.js';
import Vector from './engine/Vector.js';

export default class Player extends GameObject {
    moveSpeed = 0.5;

    /**
     * 
     * @param {{
     *   position: Vector,
     *   keyboard: Keyboard
     * }} param0
     */
    constructor({
        name,
        position,
        speed,
        width,
        height,
        color,
        keyboard
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
        this.keyboard = keyboard || new Keyboard();
    }

    movement() {
        if (this.keyboard.keyState[keyCodes.W]) {
            return -this.moveSpeed;
        }

        if (this.keyboard.keyState[keyCodes.S]) {
            return this.moveSpeed;
        }

        return 0;
    }

    update(dt) {
        const speed = this.movement();
        
        const newPosition = this.position.plus({
            x: 0,
            y: speed * dt
        });

        if (newPosition.y >= 0 && newPosition.y <= 700 - this.height) {
            return new Player({
                ...this,
                position: newPosition
            });
        }
        
        return this;
    }
}