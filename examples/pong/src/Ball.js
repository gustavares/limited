import { GameObject, Vector } from './../../../dist/limited.js';
import Player from './Player.js';
import { settings } from './index.js';

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

        if (newPosition.y <= 0 || newPosition.y >= settings.screen.height - this.height) {
            this.speed.y *= -1;
        }

        if (newPosition.x <= 0) {
            // point to player1
        }

        if ( newPosition.x >= settings.screen.width - this.width) {
            // point to player2
        }

        return new Ball({
            ...this,
            position: newPosition
        });
    }

    /**
     * 
     * @param {Player} player 
     */
    collidesWith(player, dt) {
        const newPosition = this.position.plus({
            x: this.speed.x * dt,
            y: this.speed.y * dt
        });
 
        if (newPosition.x > player.position.x + player.width || player.position.x > newPosition.x + this.width ) {
            return false;
        }

        if (newPosition.y > player.position.y + player.height || player.position.y > newPosition.y + this.height) {
            return false;
        }

        return true;
    }

    reset(position) {
        this.position.x = position.x || 0;
        this.position.y = position.y || 0;
        this.speed.x = 0;
        this.speed.y = 0; 
    }

    serve(player1Serve) {
        const direction = player1Serve ? 1 : -1;

        this.speed = new Vector({
            x: getRandomArbitrary(0.5, 0.7) * direction, 
            y: getRandomArbitrary(0.3, 0.5) * getRandomDirection()
        });
    }

    serveRandom() {
        this.speed =  new Vector({
            x: getRandomArbitrary(0.5, 0.7) * getRandomDirection(), 
            y: getRandomArbitrary(0.3, 0.5) * getRandomDirection()
        });
    }
}