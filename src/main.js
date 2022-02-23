import Phaser from 'phaser';
import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';
import GameOverScene from './scenes/GameOverScene';
import ServerOverloadedScene from './scenes/ServerOverloadedScene';
import { GAME_FPS, GAME_WIDTH_MAX, GAME_HEIGHT_MAX, GAME_WIDTH_MIN, GAME_HEIGHT_MIN } from './Config';
import TutorialScene from './scenes/TutorialScene';

var config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH_MAX,
    height: GAME_HEIGHT_MAX,
    scale: {
        parent: 'game',
        mode: Phaser.Structs.Size.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        max: {
            width: GAME_WIDTH_MAX,
            height: GAME_HEIGHT_MAX,
        },
        min: {
            width: GAME_WIDTH_MIN,
            height: GAME_HEIGHT_MIN,
        }
    },
    dom: {
        createContainer: true // needed in order to display the input for the 'Join Game'
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            fps: GAME_FPS, // this actually only simulates lower FPS :facepalm:
        }
    },
    fps: {
        target: GAME_FPS,
        forceSetTimeOut: true,
    },
    scene: [MenuScene, GameScene, TutorialScene, GameOverScene, ServerOverloadedScene]
};

export default new Phaser.Game(config);
