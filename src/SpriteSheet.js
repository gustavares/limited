import gameLoop from './GameLoop.js';
const { framesRendered } = gameLoop;
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
        
        // todo: if the animation just started should render from the first sprite in the animation sequence
        const currentAnimationFrame = Math.floor(framesRendered/STAGGER_FRAMES) % currentState.numberOfFrames;

        return {
            x: currentAnimationFrame,
            y: currentStateIndex
        }
    }
}