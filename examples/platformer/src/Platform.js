import { GameObject } from "./../../../dist/limited.js";

export default class Platform extends GameObject {
    constructor({
        name,
        position,
        speed,
        width,
        height,
        color
    }) {
        super({
            name,
            type: 'platform',
            position,
            speed,
            width,
            height,
            color
        })
    }

}