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
    constructor({ gameObjects, textObjects, name, screen }) {
        this.gameObjects = gameObjects;
        this.textObjects = textObjects;
        this.name = name;
        this.screen = screen;
        this.keyboard = new Keyboard();
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
        this.gameObjects.forEach(go => go.update(dt));
    }

    render({ interpolation, previousState }) {
        this.screen.clear();
        this.screen.write(this.textObjects);
    
        const previousGameObjects = previousState ? previousState.getGameObjects() : [];
        this.screen.renderObjects(this.gameObjects, previousGameObjects, interpolation);
    }
}