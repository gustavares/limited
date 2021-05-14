import { GameObject, keyCodes, Keyboard, Vector, State, SpriteSheet, framesRendered } from './../../../dist/limited.js';
import { GRAVITY } from './index.js';

export default class Player extends GameObject {
    moveSpeed = 0.2; canJump = true;

    /**
     * 
     * @param {{
     *   position: Vector,
     *   keyboard: Keyboard,
     *   state: State
     * }} param0
     */
    constructor({
        name,
        position,
        speed,
        width,
        height,
        color,
        state,
        keyboard = new Keyboard(),
        isOnGround = false
    }) {
        super({ 
            name,
            type: 'player', 
            position, 
            speed,
            color, 
            width, 
            height,
            sprite: new SpriteSheet({
                spriteSheetWidth: 414,
                spriteSheetHeight: 748,
                numberOfSprites: 99,
                maxSpritesPerRow: 6,
                numberOfRows: 17,
                src: 'images/Warrior_Sheet-Effect.png',
                currentAnimationStateName: 'running',
                animationStates: [
                    {
                        name:'idle',
                        frames: 6,
                        firstFrameIndex: {x: 0, y: 0}
                    },
                    {
                        name: 'running',
                        frames: 8,
                        firstFrameIndex: {x: 1, y: 1}
                    }
                ]
            })
        });
        this.isOnGround = isOnGround;
        this.state = state;
        this.keyboard = keyboard;
    }

    movement() {
        if (this.keyboard.keyState[keyCodes.A]) {
            return -this.moveSpeed;
        }

        if (this.keyboard.keyState[keyCodes.D]) {
            return this.moveSpeed;
        }
        
        return 0;
    }

    jump() {
        if (this.keyboard.keyState[keyCodes.SPACE]) {
            return -0.5;
        }

        return 0;
    }

    update(dt) {
        this.speed.x = this.movement();
        if (this.isOnGround) {
            this.speed.y = this.jump();
        } else {
            this.speed.y += GRAVITY;
        }
        
        const allGameObjects = this.state.getGameObjects();

        const newPosition = this.position.plus({
            y: this.speed.y * dt,
            x: this.speed.x * dt
        });

        let position = this.position;
        const collision = {};

        for (const gameObject of allGameObjects) {
            if (gameObject.name !== 'player') {

                const width = 0.5 * (this.width + gameObject.width);
                const height = 0.5 * (this.height + gameObject.height);
                const dx = (newPosition.x + (this.width / 2)) - gameObject.getCenter().x;
                const dy = (newPosition.y + (this.height / 2)) - gameObject.getCenter().y;

                if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
                    const crossWidth = width * dy;
                    const crossHeight = height * dx;
                    if (crossWidth > crossHeight) {
                        if (crossWidth > (-crossHeight)) {
                            collision['top'] = true;
                        } else { 
                            collision['right'] = true;
                        }
                    } else {
                        if (crossWidth > (-crossHeight)) {
                            collision['left'] = true;
                        } else {
                            collision['bottom'] = true;
                        }
                    }
                    collision['object'] = gameObject;
                }
            }
        }

        if (collision.bottom) {
            position.y = collision.object.position.y - this.height;
            position.x = newPosition.x;
            this.isOnGround = true;
            this.speed.y = 0;
        } else {
            position.x = newPosition.x;
            this.isOnGround = false;

            if (collision.top) {
                this.speed.y = 0;
                position.y = collision.object.position.y + collision.object.height;
            } else {
                position.y = newPosition.y;
                if (collision.left) {
                    this.speed.x = 0;
                    position.x = collision.object.position.x + collision.object.width;
                } else if (collision.right) {
                    this.speed.x = 0;
                    position.x = collision.object.position.x - this.width;
                } else {
                    position = newPosition;
                }
            }
        }

        return new Player({
            ...this,
            position
        });
    }
}