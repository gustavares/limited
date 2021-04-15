export default class Vector {
    constructor({
        x, y
    }) {
        this.x = x;
        this.y = y;
    }
    plus(other) {
        return new Vector({
          x: this.x + other.x, 
          y: this.y + other.y
        });
      }
}