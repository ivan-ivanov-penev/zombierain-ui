import Phaser from "phaser";
import MenuScene from "./MenuScene";
import { SOUND_DIR_NAME } from '../Config';

const SOUND_CLICK = 'click';

export default class GameOverScene extends Phaser.Scene {

    static NAME = 'GameOver';

    constructor() {
        super(GameOverScene.NAME);
    }

    init(data) {
        this.player1EnemiesKilledCount = data.player1EnemiesKilledCount;
        this.player2EnemiesKilledCount = data.player2EnemiesKilledCount;
    }
    
    preload() {
        const soundDir = SOUND_DIR_NAME;
        this.load.audio(SOUND_CLICK, `${soundDir}/click.wav`);
    }

    create() {
        const soundClick = this.sound.add(SOUND_CLICK);
        this.add.text(600, 200, `GAME OVER`, { color: 'white', fontSize: '40px', fontStyle: 'bold' });
        this.add.text(500, 320, `Player 1 zombie kills: ${this.player1EnemiesKilledCount}`, { color: '#6b4416', fontSize: '40px', fontStyle: 'bold' });
        this.add.text(500, 440, `Player 2 zombie kills: ${this.player2EnemiesKilledCount}`, { color: '#702182', fontSize: '40px', fontStyle: 'bold' });

        const backToMenuText = this.add.text(600, 640, `Back to Menu`, { color: 'white', fontSize: '40px', fontStyle: 'bold' });
        backToMenuText.setInteractive();
        backToMenuText.on('pointerdown', () => {
            soundClick.play();
            location.reload(); // better to refresh the page since Phaser has some strange Scene.state management
        });
    }

    update() {}
}