import GameObject from "./GameObject.js";

export default class State {

    /**
     * 
     * @param {{
     *  gameObjects: GameObject[],
     *  state: State
     * }} param0 
     */
    constructor({ gameObjects, state }) {
        this.gameObjects = gameObjects;
        this.state = state;
    }

    setGameObjects(go) {
        this.gameObjects = go;
    }

    /**
     * @returns {GameObject[]} gameObjects
     */
    getGameObjects() {
        return this.gameObjects;
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

        return new State({ gameObjects: updatedGameObjects, state: this.state });
    }
}