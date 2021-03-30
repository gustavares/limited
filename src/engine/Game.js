const settings = {
    FPS: 60,
    MS_PER_UPDATE: Number((1000/60).toFixed(1))
};

export default class Game {
    previous; lag;

    constructor() { }

    start() {
        this.lag = 0.0;
        this.previous = window.performance.now();

        // const state = {
        //     current: 0,
        //     previous: 0
        // };

        const gameLoop = (current) => {
            const elapsed = current - this.previous;
            this.previous = current;
            this.lag += elapsed;
            
            // @todo process input

            while (this.lag >= settings.MS_PER_UPDATE) { 
                // state.previous = state.current;
                this.update({
                   dt: settings.MS_PER_UPDATE,
                });
                this.lag -= settings.MS_PER_UPDATE; 
            }
            // const alpha = this.lag / settings.MS_PER_UPDATE;
            this.render();
            
            window.requestAnimationFrame(gameLoop);
        };

        gameLoop(window.performance.now());
    }

    update({ dt }) {
        console.log(dt)
    }

    render() {}

}