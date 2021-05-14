import { framesRendered } from './main.js';
const STAGGER_FRAMES = 6;

export default class SpriteSheet extends Image {
    constructor({
        spriteSheetWidth,
        spriteSheetHeight,
        numberOfSprites,
        maxSpritesPerRow,
        numberOfRows,
        currentAnimationStateName,
        animationStates,
        src
    }) {
        super(spriteSheetWidth/maxSpritesPerRow, spriteSheetHeight/numberOfRows);
        this.maxSpritesPerRow = maxSpritesPerRow;
        this.numberOfSprites = numberOfSprites;
        this.numberOfRows = numberOfRows;
        this.spriteSheetWidth = spriteSheetWidth;
        this.spriteSheetHeight = spriteSheetHeight;
        this.currentAnimationStateName = currentAnimationStateName;
        this.animationStates = animationStates;
        this.src = src;
    }

    getCurrentSpritePosition() {
        const currentStateIndex = this.animationStates.findIndex((state) => state.name === this.currentAnimationStateName);
        const currentState = this.animationStates[currentStateIndex];
        
        const currentAnimationFrame = Math.floor(framesRendered/STAGGER_FRAMES) % currentState.frames;
        const x = currentAnimationFrame % this.maxSpritesPerRow;

        const firstAnimationSprite = this.animationStates.filter((state, index) => index < currentStateIndex).reduce((totalFrames, state) => totalFrames + state.frames, 0);
        const y = Math.floor((firstAnimationSprite + currentAnimationFrame) / this.maxSpritesPerRow);

        return {
            x,
            y
        }
    }
}