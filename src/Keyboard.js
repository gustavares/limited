export const keyCodes = {
    UP: 38,
    DOWN: 40,
    RIGHT: 39,
    LEFT: 37,
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    SPACE: 32
}

export default class Keyboard {
    keyState = {};

    constructor() { 
        window.addEventListener("keydown", this.keyDownHandler);

        window.addEventListener("keyup", this.keyUpHandler);
    }

    keyDownHandler = (event) => {
        event.preventDefault();
        this.keyState[event.keyCode || event.which] = true;
    }

    keyUpHandler = (event) => {
        event.preventDefault();
        this.keyState[event.keyCode || event.which] = false;
    }
}
