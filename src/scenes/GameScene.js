import Phaser from "phaser";
import { IMAGE_DIR_NAME, API_PREFIX, GAME_WIDTH_MAX, GAME_HEIGHT_MAX, SOUND_DIR_NAME } from "../Config";
import GameOverScene from "./GameOverScene";
import ServerOverloadedScene from "./ServerOverloadedScene";

// Sprites
const BACKGROUND = 'background';
const GROUND = 'ground';
const TILE = 'tile';
const ENEMY_WALK_LEFT = 'enemy-walk-left';
const ENEMY_WALK_RIGHT = 'enemy-walk-right';
const ENEMY_DEAD_LEFT = 'enemy-dead-left';
const ENEMY_DEAD_RIGHT = 'enemy-dead-right';
const PLAYER_1_LIFE = 'player-1-life';
const PLAYER_1_IDLE_LEFT = 'player-1-idle-left';
const PLAYER_1_IDLE_RIGHT = 'player-1-idle-right';
const PLAYER_1_RUN_LEFT = 'player-1-run-left';
const PLAYER_1_RUN_RIGHT = 'player-1-run-right';
const PLAYER_1_JUMP_LEFT = 'player-1-jump-left';
const PLAYER_1_JUMP_RIGHT = 'player-1-jump-right';
const PLAYER_1_DEAD_LEFT = 'player-1-dead-left';
const PLAYER_1_DEAD_RIGHT = 'player-1-dead-right';
const PLAYER_1_SQUASHED_LEFT = 'player-1-squashed-left';
const PLAYER_1_SQUASHED_RIGHT = 'player-1-squashed-right';
const PLAYER_2_LIFE = 'player-2-life';
const PLAYER_2_IDLE_LEFT = 'player-2-idle-left';
const PLAYER_2_IDLE_RIGHT = 'player-2-idle-right';
const PLAYER_2_RUN_LEFT = 'player-2-run-left';
const PLAYER_2_RUN_RIGHT = 'player-2-run-right';
const PLAYER_2_JUMP_LEFT = 'player-2-jump-left';
const PLAYER_2_JUMP_RIGHT = 'player-2-jump-right';
const PLAYER_2_DEAD_LEFT = 'player-2-dead-left';
const PLAYER_2_DEAD_RIGHT = 'player-2-dead-right';
const PLAYER_2_SQUASHED_LEFT = 'player-2-squashed-left';
const PLAYER_2_SQUASHED_RIGHT = 'player-2-squashed-right';
// Movement
const IDLE_LEFT = 'idle_left';
const IDLE_RIGHT = 'idle_right';
const MOVE_LEFT = 'move_left';
const MOVE_RIGHT = 'move_right';
const JUMP_LEFT = 'jump_left';
const JUMP_RIGHT = 'jump_right';
const DEAD_LEFT = 'dead_left';
const DEAD_RIGHT = 'dead_right';
const SQUASHED_LEFT = 'squashed_left';
const SQUASHED_RIGHT = 'squashed_right';
// AUDIO
const SOUND_GAME_OVER = 'game-over';
const SOUND_TILE_HIT = 'tile-hit';
const SOUND_PLAYER_JUMP = 'player-jump';
const SOUND_PLAYER_MOVE = 'player-move';
const SOUND_PLAYER_DEAD = 'player-dead';
const SOUND_PLAYER_SPAWN = 'player-spawn';
const SOUND_ENEMY_HIT = 'enemy-hit';
const SOUND_ENEMY_DEAD = 'enemy-dead';
const SOUND_ENEMY_SPAWN = 'enemy-spawn';

export default class GameScene extends Phaser.Scene {

    static NAME = 'Game';

    constructor() {
        super(GameScene.NAME);
    }

    init(data) {
        this.wsClient = data.wsClient;
        this.playerNumber = data.playerNumber;
        this.gameId = data.gameId;
        this.gameState = data.gameState;

        this.tiles = [];
        this.enemies = [];
        this.updateQueue = [];
        this.player1Lives = [];
        this.player2Lives = [];

        this.enemyCounter = undefined;
        this.cursors = undefined;
        this.player1 = undefined;
        this.player2 = undefined;
        this.player = undefined;
        this.soundGameOver = undefined;
    }

    preload() {
        const imgDir = IMAGE_DIR_NAME;
        this.load.image(BACKGROUND, `${imgDir}/background.png`);
        this.load.image(GROUND, `${imgDir}/ground.png`);
        this.load.image(TILE, `${imgDir}/tile.png`);
        this.load.image(PLAYER_1_LIFE, `${imgDir}/player1_life.png`);
        this.load.image(PLAYER_2_LIFE, `${imgDir}/player2_life.png`);
        this.load.spritesheet(ENEMY_WALK_LEFT, `${imgDir}/enemy_walk_left.png`, { frameWidth: 82, frameHeight: 99 });
        this.load.spritesheet(ENEMY_WALK_RIGHT, `${imgDir}/enemy_walk_right.png`, { frameWidth: 82, frameHeight: 99 });
        this.load.spritesheet(ENEMY_DEAD_LEFT, `${imgDir}/enemy_dead_left.png`, { frameWidth: 120, frameHeight: 90 });
        this.load.spritesheet(ENEMY_DEAD_RIGHT, `${imgDir}/enemy_dead_right.png`, { frameWidth: 120, frameHeight: 90 });
        this.load.spritesheet(PLAYER_1_IDLE_LEFT, `${imgDir}/player1_idle_left.png`, { frameWidth: 67, frameHeight: 102 });
        this.load.spritesheet(PLAYER_1_IDLE_RIGHT, `${imgDir}/player1_idle_right.png`, { frameWidth: 67, frameHeight: 102 });
        this.load.spritesheet(PLAYER_1_RUN_LEFT, `${imgDir}/player1_run_left.png`, { frameWidth: 87, frameHeight: 106 });
        this.load.spritesheet(PLAYER_1_RUN_RIGHT, `${imgDir}/player1_run_right.png`, { frameWidth: 87, frameHeight: 106 });
        this.load.spritesheet(PLAYER_1_JUMP_LEFT, `${imgDir}/player1_jump_left.png`, { frameWidth: 85, frameHeight: 113 });
        this.load.spritesheet(PLAYER_1_JUMP_RIGHT, `${imgDir}/player1_jump_right.png`, { frameWidth: 85, frameHeight: 113 });
        this.load.spritesheet(PLAYER_1_DEAD_LEFT, `${imgDir}/player1_dead_left.png`, { frameWidth: 123, frameHeight: 126 });
        this.load.spritesheet(PLAYER_1_DEAD_RIGHT, `${imgDir}/player1_dead_right.png`, { frameWidth: 123, frameHeight: 126 });
        this.load.spritesheet(PLAYER_1_SQUASHED_LEFT, `${imgDir}/player1_squashed_left.png`, { frameWidth: 67, frameHeight: 102 });
        this.load.spritesheet(PLAYER_1_SQUASHED_RIGHT, `${imgDir}/player1_squashed_right.png`, { frameWidth: 67, frameHeight: 102 });
        this.load.spritesheet(PLAYER_2_IDLE_LEFT, `${imgDir}/player2_idle_left.png`, { frameWidth: 67, frameHeight: 102 });
        this.load.spritesheet(PLAYER_2_IDLE_RIGHT, `${imgDir}/player2_idle_right.png`, { frameWidth: 67, frameHeight: 102 });
        this.load.spritesheet(PLAYER_2_RUN_LEFT, `${imgDir}/player2_run_left.png`, { frameWidth: 87, frameHeight: 106 });
        this.load.spritesheet(PLAYER_2_RUN_RIGHT, `${imgDir}/player2_run_right.png`, { frameWidth: 87, frameHeight: 106 });
        this.load.spritesheet(PLAYER_2_JUMP_LEFT, `${imgDir}/player2_jump_left.png`, { frameWidth: 85, frameHeight: 113 });
        this.load.spritesheet(PLAYER_2_JUMP_RIGHT, `${imgDir}/player2_jump_right.png`, { frameWidth: 85, frameHeight: 113 });
        this.load.spritesheet(PLAYER_2_DEAD_LEFT, `${imgDir}/player2_dead_left.png`, { frameWidth: 123, frameHeight: 126 });
        this.load.spritesheet(PLAYER_2_DEAD_RIGHT, `${imgDir}/player2_dead_right.png`, { frameWidth: 123, frameHeight: 126 });
        this.load.spritesheet(PLAYER_2_SQUASHED_LEFT, `${imgDir}/player2_squashed_left.png`, { frameWidth: 67, frameHeight: 102 });
        this.load.spritesheet(PLAYER_2_SQUASHED_RIGHT, `${imgDir}/player2_squashed_right.png`, { frameWidth: 67, frameHeight: 102 });

        const sndDir = SOUND_DIR_NAME;
        this.load.audio(SOUND_GAME_OVER, `${sndDir}/game_over.wav`);
        this.load.audio(SOUND_TILE_HIT, `${sndDir}/tile_hit.wav`);
        this.load.audio(SOUND_PLAYER_JUMP, `${sndDir}/player_jump.wav`);
        this.load.audio(SOUND_PLAYER_MOVE, `${sndDir}/player_move.wav`);
        this.load.audio(SOUND_PLAYER_DEAD, `${sndDir}/player_dead.wav`);
        this.load.audio(SOUND_PLAYER_SPAWN, `${sndDir}/player_spawn.wav`);
        this.load.audio(SOUND_ENEMY_HIT, `${sndDir}/enemy_hit.wav`);
        this.load.audio(SOUND_ENEMY_DEAD, `${sndDir}/enemy_dead.wav`);
        this.load.audio(SOUND_ENEMY_SPAWN, `${sndDir}/enemy_spawn.wav`);
    }

    create() {
        if (this.gameState.message === undefined) {
            this.createGameWorld();
        } else {
            this.wsClient.deactivate();
            this.scene.start(ServerOverloadedScene.NAME);
        }
    }

    createGameWorld() {
        this.soundGameOver = this.sound.add(SOUND_GAME_OVER);
        this.add.image(720, 540, BACKGROUND);
        this.cursors = this.input.keyboard.createCursorKeys();
        for (let i = 0; i < this.gameState.tiles.length; i++) {
            const tile = this.gameState.tiles[i];
            const tileGameObject = this.physics.add.sprite(tile.x, tile.y, TILE);
            tileGameObject.soundTileHit = this.sound.add(SOUND_TILE_HIT);            
            this.tiles.push(tileGameObject);
        }
        this.add.image(720, GAME_HEIGHT_MAX + 87, GROUND);
        this.player1 = this.createPlayer(this.gameState.player1, {
            movingLeft: false, 
            idleLeft: PLAYER_1_IDLE_LEFT, 
            idleRight: PLAYER_1_IDLE_RIGHT, 
            runLeft: PLAYER_1_RUN_LEFT, 
            runRight: PLAYER_1_RUN_RIGHT,
            jumpLeft: PLAYER_1_JUMP_LEFT,
            jumpRight: PLAYER_1_JUMP_RIGHT,
            deadLeft: PLAYER_1_DEAD_LEFT,
            deadRight: PLAYER_1_DEAD_RIGHT,
            squashedLeft: PLAYER_1_SQUASHED_LEFT,
            squashedRight: PLAYER_1_SQUASHED_RIGHT
        });
        this.player2 = this.createPlayer(this.gameState.player2, {
            movingLeft: true, 
            idleLeft: PLAYER_2_IDLE_LEFT, 
            idleRight: PLAYER_2_IDLE_RIGHT, 
            runLeft: PLAYER_2_RUN_LEFT, 
            runRight: PLAYER_2_RUN_RIGHT,
            jumpLeft: PLAYER_2_JUMP_LEFT,
            jumpRight: PLAYER_2_JUMP_RIGHT,
            deadLeft: PLAYER_2_DEAD_LEFT,
            deadRight: PLAYER_2_DEAD_RIGHT,
            squashedLeft: PLAYER_2_SQUASHED_LEFT,
            squashedRight: PLAYER_2_SQUASHED_RIGHT
        });
        this.player = this.playerNumber === 1 ? this.player1 : this.player2;
        this.wsClient.subscribe(`/${this.gameId}/game-over`, (response) => this.transitionToGameOverScene(JSON.parse(response.body)));
        this.wsClient.subscribe(`/${this.gameId}/update`, (response) => this.addFrameForProcessing(response));

        this.add.text(GAME_WIDTH_MAX / 2 - 95, 30, `ZOMBIE COUNT:`, { color: 'white', fontSize: '24px' }); // static text
        this.enemyCounter = this.add.text(GAME_WIDTH_MAX / 2, 90, `0`, { color: 'white', fontSize: '28px', fontStyle: 'bold' });
    }

    createPlayer(state, sprites) {
        const initialSprite = sprites.movingLeft ? sprites.idleLeft : sprites.idleRight;
        const player = this.physics.add.sprite(state.x, state.y, initialSprite);
        player.lives = state.lives;
        player.isInAir = state.isInAir;
        player.dead = state.dead;
        player.squashed = state.squashed;
        player.previousVelocityX = 0;
        player.velocityX = 0;
        player.velocityY = 0;
        player.deadAnimationPlayed = false;
        player.spawnSoundPlayed = true;
        player.anims.create({
            key: IDLE_LEFT,
            frames: this.anims.generateFrameNumbers(sprites.idleLeft, { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
        player.anims.create({
            key: IDLE_RIGHT,
            frames: this.anims.generateFrameNumbers(sprites.idleRight, { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
        player.anims.create({
            key: MOVE_LEFT,
            frames: this.anims.generateFrameNumbers(sprites.runLeft, { start: 0, end: 9 }),
            frameRate: 20,
            repeat: -1
        });
        player.anims.create({
            key: MOVE_RIGHT,
            frames: this.anims.generateFrameNumbers(sprites.runRight, { start: 0, end: 9 }),
            frameRate: 20,
            repeat: -1
        });
        player.anims.create({
            key: JUMP_LEFT,
            frames: this.anims.generateFrameNumbers(sprites.jumpLeft, { start: 0, end: 9 }),
            frameRate: 20,
            repeat: 0
        });
        player.anims.create({
            key: JUMP_RIGHT,
            frames: this.anims.generateFrameNumbers(sprites.jumpRight, { start: 0, end: 9 }),
            frameRate: 20,
            repeat: 0
        });
        player.anims.create({
            key: DEAD_LEFT,
            frames: this.anims.generateFrameNumbers(sprites.deadLeft, { start: 0, end: 9 }),
            frameRate: 20,
            repeat: 0
        });
        player.anims.create({
            key: DEAD_RIGHT,
            frames: this.anims.generateFrameNumbers(sprites.deadRight, { start: 0, end: 9 }),
            frameRate: 20,
            repeat: 0
        });
        player.anims.create({
            key: SQUASHED_LEFT,
            frames: this.anims.generateFrameNumbers(sprites.squashedLeft, { start: 0, end: 11 }),
            frameRate: 12,
            repeat: 0
        });
        player.anims.create({
            key: SQUASHED_RIGHT,
            frames: this.anims.generateFrameNumbers(sprites.squashedRight, { start: 0, end: 11 }),
            frameRate: 12,
            repeat: 0
        });
        player.anims.play(sprites.movingLeft ? IDLE_LEFT : IDLE_RIGHT);
        player.soundPlayerJump = this.sound.add(SOUND_PLAYER_JUMP);
        player.soundPlayerMove = this.sound.add(SOUND_PLAYER_MOVE, { volume: 0.5, rate: 1.7 });
        player.soundPlayerDead = this.sound.add(SOUND_PLAYER_DEAD);
        player.soundPlayerSpawn = this.sound.add(SOUND_PLAYER_SPAWN);
        return player;
    }

    addFrameForProcessing(response) {
        if (!document.hidden) {
            this.updateQueue.push(JSON.parse(response.body));
        }
    }

    transitionToGameOverScene(score) {
        this.soundGameOver.play();
        this.cameras.main.setBackgroundColor('black');
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start(GameOverScene.NAME, score);
            this.wsClient.deactivate();
        })
    }

    update() {
        const gameState = this.updateQueue.shift();
        if (gameState !== undefined) {
            this.updateGameWithNewState(gameState);
        }

        if (this.player.dead !== true && this.player.squashed !== true) {
            this.processPressedKeys();
        }
        this.animatePlayer(this.player1);
        this.animatePlayer(this.player2);
    }

    updateGameWithNewState(gameState) {
        this.updatePlayer(this.player1, gameState.player1);
        this.updatePlayer(this.player2, gameState.player2);

        for (let i = 0; i < gameState.tiles.length; i++) {
            const tile = gameState.tiles[i];
            const tileGameObject = this.tiles[tile.index];
            tileGameObject.y = tile.y;
            if (!tileGameObject.soundTileHit.isPlaying) {
                tileGameObject.soundTileHit.play();
            }
        }

        this.updateEnemies(gameState);
        this.displayLives();
    }

    updatePlayer(inMemoryState, newState) {
        inMemoryState.previousVelocityX = inMemoryState.velocityX;
        inMemoryState.x = newState.x;
        inMemoryState.y = newState.y;
        inMemoryState.velocityX = newState.velocityX;
        inMemoryState.velocityY = newState.velocityY;
        inMemoryState.lives = newState.lives;
        inMemoryState.isInAir = newState.isInAir;
        inMemoryState.dead = newState.dead;
        inMemoryState.squashed = newState.squashed;
    }

    updateEnemies(gameState) {
        this.enemies = this.enemies.filter(e => this.findEnemy(gameState.enemies, e.id) !== undefined);
        for (let i = 0; i < gameState.enemies.length; i++) {
            const enemyState = gameState.enemies[i];
            let enemyToUpdate = this.findEnemy(this.enemies, enemyState.id);
            if (enemyToUpdate === undefined) {
                enemyToUpdate = this.createEnemy(enemyState);
                this.enemies.push(enemyToUpdate);
            }
            this.updateEnemy(enemyToUpdate, enemyState);
            this.animateEnemy(enemyToUpdate);
        }
        this.enemyCounter.setText(gameState.enemies.length);
        this.enemyCounter.setColor(gameState.enemies.length >= 10 ? 'red' : 'white');
    }

    findEnemy(enemiesArray, enemyId) {
        for (let i = 0; i < enemiesArray.length; i++) {
            if (enemiesArray[i].id === enemyId) {
                return enemiesArray[i];
            }
        }
        return undefined;
    }

    createEnemy(state) {
        const enemy = this.physics.add.sprite(state.x, state.y, ENEMY_WALK_LEFT);
        enemy.id = state.id;
        enemy.deadAnimaitonPlayed = false;
        enemy.anims.create({
            key: ENEMY_WALK_LEFT,
            frames: this.anims.generateFrameNumbers(ENEMY_WALK_LEFT, { start: 0, end: 9 }),
            frameRate: 20,
            repeat: -1
        });
        enemy.anims.create({
            key: ENEMY_WALK_RIGHT,
            frames: this.anims.generateFrameNumbers(ENEMY_WALK_RIGHT, { start: 0, end: 9 }),
            frameRate: 20,
            repeat: -1
        });
        enemy.anims.create({
            key: ENEMY_DEAD_LEFT,
            frames: this.anims.generateFrameNumbers(ENEMY_DEAD_LEFT, { start: 0, end: 9 }),
            frameRate: 20,
            repeat: 0
        });
        enemy.anims.create({
            key: ENEMY_DEAD_RIGHT,
            frames: this.anims.generateFrameNumbers(ENEMY_DEAD_RIGHT, { start: 0, end: 9 }),
            frameRate: 20,
            repeat: 0
        });
        enemy.soundEnemyHit = this.sound.add(SOUND_ENEMY_HIT);
        enemy.soundEnemyDead = this.sound.add(SOUND_ENEMY_DEAD, { volume: 0.5 });
        enemy.soundEnemySpawn = this.sound.add(SOUND_ENEMY_SPAWN);
        return enemy;
    }

    updateEnemy(inMemoryState, newState) {
        inMemoryState.x = newState.x;
        inMemoryState.y = newState.y;
        inMemoryState.velocityX = newState.velocityX;
        inMemoryState.hit = newState.hit;
        inMemoryState.dead = newState.dead;
        inMemoryState.aggressive = newState.aggressive;
        inMemoryState.goingToReviveSoon = newState.goingToReviveSoon;
    }
    
    animateEnemy(enemy) {
        if (enemy.spawnSoundPlayed !== true) {
            enemy.spawnSoundPlayed = true;
            enemy.soundEnemySpawn.play();
        }

        if (enemy.hit === true) {
            if (enemy.deadAnimaitonPlayed !== true) {
                enemy.deadAnimaitonPlayed = true;
                enemy.anims.play(enemy.velocityX < 0 ? ENEMY_DEAD_LEFT : ENEMY_DEAD_RIGHT, true);
                enemy.soundEnemyHit.play();
            }
        } else {
            enemy.deadAnimaitonPlayed = false;
            enemy.anims.play(enemy.velocityX < 0 ? ENEMY_WALK_LEFT : ENEMY_WALK_RIGHT, true);
        }

        if (enemy.goingToReviveSoon) {
            enemy.setTint(0xfc0320);
        } else if (enemy.aggressive) {
            enemy.setTint(0x72d466);
        }

        if (enemy.dead === true && enemy.deadSoundPlayed !== true) {
            enemy.deadSoundPlayed = true;
            enemy.soundEnemyDead.play();
        }
    }

    displayLives() {
        this.player1Lives.forEach(e => e.destroy());
        this.player2Lives.forEach(e => e.destroy());
        this.player1Lives = [];
        this.player2Lives = [];

        for (let i = 0; i < this.player1.lives; i++) {
            this.player1Lives.push(this.physics.add.sprite(60 + 80 * i, 90, PLAYER_1_LIFE));
        }

        for (let i = 0; i < this.player2.lives; i++) {
            this.player2Lives.push(this.physics.add.sprite(GAME_WIDTH_MAX - (60 + 80 * i), 90, PLAYER_2_LIFE));
        }
    }

    processPressedKeys() {
        if (this.cursors.left.isDown) {
            if (this.player.movingLeft === false || this.player.movingLeft === undefined) {
                this.wsClient.publish({ destination: `${API_PREFIX}/${this.gameId}/player/${this.playerNumber}/move/left` });
            }
            this.player.movingLeft = true;
        } else if (this.cursors.right.isDown) {
            if (this.player.movingLeft === true || this.player.movingLeft === undefined) {
                this.wsClient.publish({ destination: `${API_PREFIX}/${this.gameId}/player/${this.playerNumber}/move/right` });   
            }
            this.player.movingLeft = false;
        } else {
            if (this.player.movingLeft !== undefined) {
                this.wsClient.publish({ destination: `${API_PREFIX}/${this.gameId}/player/${this.playerNumber}/stop` });
            }
            this.player.movingLeft = undefined;
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.wsClient.publish({ destination: `${API_PREFIX}/${this.gameId}/player/${this.playerNumber}/jump` });
        }
    }

    animatePlayer(player) {
        // player.x += (player.velocityX / this.game.loop.actualFps);
        // player.y += (player.velocityY / this.game.loop.actualFps);

        if (player.dead === true) {
            if (player.deadAnimationPlayed !== true) {
                player.anims.play(this.checkIfPlayerIsFacingLeft(player) ? DEAD_LEFT : DEAD_RIGHT, true);
            }
        } else if (player.isInAir === true) {
            player.anims.play({
                key: this.checkIfPlayerIsFacingLeft(player) ? JUMP_LEFT : JUMP_RIGHT,
                startFrame: player.anims.getName().startsWith('jump') ? player.anims.currentFrame.index - 1 : 0
            }, true);
        } else if (player.squashed === true) {
            player.anims.play(player.anims.getName().endsWith('left') ? SQUASHED_LEFT : SQUASHED_RIGHT, true);
        } else {
            if (player.velocityX > 0) {
                player.anims.play(MOVE_RIGHT, true);
            } else if (player.velocityX < 0) {
                player.anims.play(MOVE_LEFT, true);
            } else {
                player.anims.play(this.checkIfPlayerIsFacingLeft(player) ? IDLE_LEFT : IDLE_RIGHT, true);
            }
        }
        player.deadAnimationPlayed = player.dead;

        this.playSoundForPlayer(player);
    }

    checkIfPlayerIsFacingLeft(player) {
        if (player.previousVelocityX != 0) {
            return player.previousVelocityX < 0;
        } else {
            return player.anims.getName().endsWith('left');
        }
    }

    playSoundForPlayer(player) {
        if (player.spawnSoundPlayed !== true && player.y < 0) {
            player.spawnSoundPlayed = true;
            player.soundPlayerSpawn.play();
        }

        if (!player.soundPlayerMove.isPlaying && player.velocityX !== 0 && player.velocityY === 0) {
            player.soundPlayerMove.play();
        }

        if (player.dead === true) {
            if (player.deadSoundPlayed !== true) {
                player.deadSoundPlayed = true;
                player.soundPlayerDead.play();
            }
        } else if (player.velocityY < 0) {
            if (player.jumpSoundPlayed !== true) {
                player.jumpSoundPlayed = true;
                player.soundPlayerJump.play();
            }
        } else {
            player.jumpSoundPlayed = false;
        }

        if (player.y > GAME_HEIGHT_MAX) {
            player.spawnSoundPlayed = false;
        }
        player.deadSoundPlayed = player.dead;
    }
}
