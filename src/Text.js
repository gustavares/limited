import Vector from "./Vector.js";

export default class Text {
    /**
     * 
     * @param {{
     *  content: string
     *  position: Vector
     *  font: string
     * label: string
     * }} param0 
     */
    constructor({ content, label, position, font = '18px verdana' }) {
        Object.assign(this, { content, label, position, font });
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    write(context) {
        context.font = this.font;
        context.fillText(this.content, this.position.x, this.position.y);
    }

    update(newContent) {
        this.content = newContent;

        return this;
    }
}