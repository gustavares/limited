import { framesRendered } from './main.js';
const STAGGER_FRAMES = 6;

export default class Sprite extends Image {
    constructor({
        width,
        height,
        column,
        row,
        spriteSheetWidth,
        spriteSheetHeight,
        maxFramesPerRow,
        numberOfRows,
        animationStates,
        src
    }) {
        super(width, height);
        this.column = column;
        this.row = row;
        this.maxFramesPerRow = maxFramesPerRow;
        this.numberOfRows = numberOfRows;
        this.spriteSheetWidth = spriteSheetWidth;
        this.spriteSheetHeight = spriteSheetHeight;
        this.animationStates = animationStates;
        this.src = src;
    }

    getCurrentSpritePosition() {
        const currentStateIndex = this.animationStates.findIndex((state) => state.name === 'idle');
        const currentState = this.animationStates[currentStateIndex];
        
        const position = Math.floor(framesRendered/STAGGER_FRAMES) % currentState.frames;
        
        return {
            x: position,
            y: currentStateIndex
        }
    }
}