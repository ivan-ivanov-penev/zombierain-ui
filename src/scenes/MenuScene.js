import Phaser from 'phaser';
import GameScene from './GameScene';
import { SOUND_DIR_NAME, API_URL_HTTP, API_URL_WS, API_PREFIX } from '../Config';
import { Client } from '@stomp/stompjs';
import TutorialScene from './TutorialScene';

const SOUND_CLICK = 'click';
const SOUND_START_GAME = 'start-game';

export default class MenuScene extends Phaser.Scene {

    static NAME = 'Menu';

    constructor() {
        super(MenuScene.NAME);
    }

    init() {
        this.wsClient = undefined;
        this.joinButton = undefined;
        this.gameIdInput = undefined;
        this.gameIdDomElement = undefined;
        this.soundClick = undefined;
        this.soundStartGame = undefined;
    }

    preload() {
        const soundDir = SOUND_DIR_NAME;
        this.load.audio(SOUND_CLICK, `${soundDir}/click.wav`);
        this.load.audio(SOUND_START_GAME, `${soundDir}/start_game.wav`);
    }

    create() {
        this.soundClick = this.sound.add(SOUND_CLICK);
        this.soundStartGame = this.sound.add(SOUND_START_GAME);
        this.input.keyboard.on('keydown-ENTER', () => {
            if (this.gameIdInput !== undefined) {
                this.attemptToJoinGame();
            }
        }, this);
        
        const hostGameText = this.add.text(600, 300, 'Host Game', { color: 'white', fontSize: '40px' });
        hostGameText.setInteractive();
        hostGameText.on('pointerdown', () => this.hostGame(hostGameText));

        const joinGameText = this.add.text(610, 420, 'Join Game', { color: 'white', fontSize: '40px' });
        joinGameText.setInteractive();
        joinGameText.on('pointerdown', () => this.joinGame());

        const howToPlayText = this.add.text(590, 640, 'How To Play', { color: 'white', fontSize: '40px' });
        howToPlayText.setInteractive();
        howToPlayText.on('pointerdown', () => {
            this.soundClick.play();
            this.scene.start(TutorialScene.NAME); 
        });
    }

    hostGame(hostGameText) {
        this.soundClick.play();
        const colorInactive = '#575757';
        if (hostGameText.style.color !== colorInactive && (this.joinButton === undefined || !this.joinButton.node.disabled)) {
            hostGameText.setColor(colorInactive);
            fetch(`${API_URL_HTTP}/host`, { method: 'POST' })
                .then((response) => response.json())
                .then((body) => this.waitForOtherPlayerToJoin(body.gameId))
                .catch(() => this.displayError('Server connection error', 450));
        }
    }

    waitForOtherPlayerToJoin(gameId) {
        this.add.rectangle(720, 190, 600, 120, 0xffffff);
        this.add.text(480, 160, 'Waiting for another player to join', { color: 'black', fontSize: '24px', fontStyle: 'bold' });
        this.add.text(530, 200, 'Your Game-ID is:', { color: 'black', fontSize: '24px', fontStyle: 'bold' });
        this.gameIdDomElement = this.add.dom(820, 170).createElement('p', 'font-size: 40px; font-weight: bold; color: red; font-family: monospace;', gameId);
        this.establishWsConnection(gameId, 1);
    }

    establishWsConnection(gameId, playerNumber, onConnectFunction = ()=>{}) {
        this.wsClient = new Client({ brokerURL: API_URL_WS });
        this.wsClient.debug = () => {};
        this.wsClient.onConnect = () => {
            this.wsClient.subscribe(`/${gameId}/start`, (response) => this.startGameScene(gameId, playerNumber, JSON.parse(response.body)));
            onConnectFunction();
        };
        this.wsClient.activate();

        // window.onbeforeunload = () => this.wsClient.deactivate();
    }

    startGameScene(gameId, playerNumber, gameState) {
        this.scene.start(GameScene.NAME, {
            wsClient: this.wsClient,
            gameId: gameId,
            playerNumber: playerNumber,
            gameState: gameState
        });
    }

    joinGame() {
        this.soundClick.play();
        if (this.gameIdInput === undefined) {
            const inputCss = `
                width: 100px; 
                height: 50px; 
                font: 28px Arial Black; 
                font-weight: bold; 
                font-family: monospace; 
                text-transform: uppercase; 
                box-sizing: border-box; 
                padding-left: 13px;
            `;
            this.gameIdInput = this.add.dom(590, 520).createElement('input', inputCss);
            this.gameIdInput.node.setAttribute('maxlength', 4);
            this.gameIdInput.node.setAttribute('placeholder', ' ID');
            this.gameIdInput.node.select();
            this.gameIdInput.node.focus();

            this.joinButton = this.add.dom(590, 585).createElement('button', 'width: 100px; height: 50px; font: 22px Consolas;', 'JOIN');
            this.joinButton.addListener('click');
            this.joinButton.on('click', () => this.attemptToJoinGame());

            this.tweens.add({
                targets: [this.gameIdInput, this.joinButton],
                x: 705,
                duration: 600,
                ease: 'Bounce'
            });
        }
    }

    attemptToJoinGame() {
        this.joinButton.node.disabled = true;
        const gameId = this.gameIdInput.node.value.toUpperCase();
        fetch(`${API_URL_HTTP}/join/${gameId}`, { method: 'POST' })
            .then((response) => this.joinGameOnValidCode(response.status, gameId))
            .catch(() => this.displayError('Server connection error', 450))
            .then(() => this.joinButton.node.disabled = false);
    }

    joinGameOnValidCode(responseStatus, gameId) {
        if (responseStatus === 200) {
            this.invokeRemoteGameStart(gameId);
        } else if (responseStatus === 404) {
            this.displayError('Invalid Game-ID', 530);
        } else {
            this.displayError('Received invalid code', 490);
        }
    }

    invokeRemoteGameStart(gameId) {
        const startGameFunction = () => { 
            this.soundStartGame.play();
            this.wsClient.publish({ destination: `${API_PREFIX}/${gameId}/invoke-start` }); 
        }
        if (this.wsClient === undefined) {
            this.establishWsConnection(gameId, 2, startGameFunction);
        } else {
            startGameFunction();
        }
    }

    displayError(text, textX) {
        const background = this.add.rectangle(720, 190, 600, 120, 0xffffff);
        const textBox = this.add.text(textX, 170, text, { color: 'red', fontSize: '40px', fontStyle: 'bold' });
        if (this.gameIdDomElement !== undefined) {
            // this.gameIdDomElement.node.remove(); TODO there is a potential overlap of the errors
            this.gameIdDomElement.node.style.visibility = 'hidden';
        }
        setTimeout(() => {
            background.destroy();
            textBox.destroy();
            if (this.gameIdDomElement !== undefined) {
                this.gameIdDomElement.node.style.visibility = 'visible';
            }
        }, 5000);
    }
}