import GameObject from "./GameObject.js";
import Keyboard from "./Keyboard.js";

export default class State {

    /**
     * 
     * @param {{
     *  gameObjects: GameObject[],
     *  state: State
     * }} param0 
     */
    constructor({ gameObjects, textObjects, state, player1Serve }) {
        this.gameObjects = gameObjects;
        this.textObjects = textObjects;
        this.state = state;
        this.keyboard = new Keyboard();
        this.player1Serve = player1Serve;
    }

    setGameObjects(go) {
        this.gameObjects = go;
    }

    getGameObject(name) {
        return this.gameObjects.find((go) => go.name === name);
    }

    getGameObjectsByType(type) {
        return this.gameObjects.map((go) => go.type === type);
    }

    /**
     * @returns {GameObject[]} gameObjects
     */
    getGameObjects() {
        return this.gameObjects;
    }

    getTextObject(label) {
        return this.textObjects.find((to) => to.label === label);
    }

    deleteTextObject(label) {
        const index = this.textObjects.findIndex((to) => to.label === label);
        
        if (index !== -1) {
            this.textObjects.splice(index, 1);
        }
    }

    /**
     * @param {number} dt 
     * @returns {State}
     */
    update(dt) {
        const updatedGameObjects = [];
        for (const go of this.gameObjects) {
            updatedGameObjects.push(go.update(dt));
        }

        return new State({ ...this, gameObjects: updatedGameObjects });
    }
}