import GameObject from './../../../src/GameObject.js';
import Keyboard, { keyCodes } from './../../../src/Keyboard.js'
import Vector from './../../../src/Vector.js';

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
        keyboard,
        isAi = false
    }) {
        super({ 
            name,
            type: 'paddle', 
            position, 
            speed,
            color, 
            width, 
            height
        });
        this.isAi = isAi;
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
        if (!this.isAi) {
            this.speed.x = this.movement();
        }

        const newPosition = this.position.plus({
            x: 0,
            y: this.speed.x * dt
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