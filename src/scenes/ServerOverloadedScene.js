import Phaser from "phaser";

export default class ServerOverloadedScene extends Phaser.Scene {

    static NAME = 'ServerOverloaded';

    constructor() {
        super(ServerOverloadedScene.NAME);
    }

    init() {}
    
    preload() {}

    create() {
        this.add.text(380, 400, `Server is currently overloaded...`, { color: 'white', fontSize: '40px', fontStyle: 'bold' });
        this.add.text(450, 600, `Please try again later :)`, { color: 'white', fontSize: '40px', fontStyle: 'bold' });
    }

    update() {}
}