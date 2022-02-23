import Phaser from "phaser";
import { IMAGE_DIR_NAME, SOUND_DIR_NAME, GAME_FPS, GAME_HEIGHT_MAX, GAME_WIDTH_MAX } from "../Config";
import MenuScene from "./MenuScene";

// Sprites
const GROUND = 'ground';
const TILE = 'tile';
const ENEMY_WALK_LEFT = 'enemy-walk-left';
const ENEMY_WALK_RIGHT = 'enemy-walk-right';
const ENEMY_DEAD_LEFT = 'enemy-dead-left';
const ENEMY_DEAD_RIGHT = 'enemy-dead-right';
const PLAYER_1_IDLE_LEFT = 'player-1-idle-left';
const PLAYER_1_IDLE_RIGHT = 'player-1-idle-right';
const PLAYER_1_RUN_LEFT = 'player-1-run-left';
const PLAYER_1_RUN_RIGHT = 'player-1-run-right';
const PLAYER_1_JUMP_LEFT = 'player-1-jump-left';
const PLAYER_1_JUMP_RIGHT = 'player-1-jump-right';
// Movement
const IDLE_LEFT = 'idle_left';
const IDLE_RIGHT = 'idle_right';
const MOVE_LEFT = 'move_left';
const MOVE_RIGHT = 'move_right';
const JUMP_LEFT = 'jump_left';
const JUMP_RIGHT = 'jump_right';
// AUDIO
const SOUND_TILE_HIT = 'tile-hit';
const SOUND_PLAYER_JUMP = 'player-jump';
const SOUND_PLAYER_MOVE = 'player-move';
const SOUND_ENEMY_HIT = 'enemy-hit';
const SOUND_ENEMY_DEAD = 'enemy-dead';

export default class TutorialScene extends Phaser.Scene {

    static NAME = 'Tutorial';

    constructor() {
        super(TutorialScene.NAME);
    }

    init() {
        this.soundTileHit = undefined;
        this.soundPlayerJump = undefined;
        this.soundPlayerMove = undefined;
        this.soundEnemyHit = undefined;
        this.soundEnemyDead = undefined;
        this.player = undefined;
        this.enemy = undefined;
        this.realoadInProgress = false;
        this.tiles = [];
        this.counter = 0;
        this.actions = [
            { condition: () => this.counter++ > GAME_FPS * 2, operation: () => this.initializeMovement() },
            { condition: () => this.player.x <= GAME_WIDTH_MAX * 0.55, operation: () => this.displayText(500, 860, -0.7, 3000, 'JUMP!') },
            { condition: () => this.player.x <= GAME_WIDTH_MAX / 2, operation: () => this.playerJump() },
            { condition: () => this.player.y <= 832.5, operation: () => this.playerHitTile() },
            { condition: () => this.tiles[8].y <= 742.5, operation: () => this.tileBounceBack() },
            { condition: () => this.enemy.x - 40 <= this.tiles[8].x + 22.5, operation: () => this.killEnemy() },
            { condition: () => this.tiles[8].y >= 765, operation: () => this.freezeTile() },
            { condition: () => this.player.y >= 945, operation: () => this.landPlayerOnGround() },
            { condition: () => this.enemy.y >= 702.5, operation: () => this.freezeEnemy() },
            { condition: () => this.player.x >= 1250, operation: () => this.playerJumpOnTile() },
            { condition: () => this.player.x <= 1080 && this.player.y >= 697.5, operation: () => this.playerLandOnTile() },
            { condition: () => this.player.x - 45 <= this.enemy.x + 40, operation: () => this.playerHitsEnemy() },
            { condition: () => this.enemy.y - 40 > GAME_HEIGHT_MAX * 5, operation: () => {} },
        ];
    }

    initializeMovement() {
        this.player.setVelocityX(-200);
        this.player.anims.play(MOVE_LEFT, true);
        this.enemy.setVelocityX(-100);
        this.enemy.play(ENEMY_WALK_LEFT, true);
        this.soundPlayerMove.play({ loop: true });
    }

    playerJump() {
        this.player.setVelocityX(0);
        this.player.setVelocityY(-300);
        this.player.setGravityY(300);
        this.player.anims.play(JUMP_LEFT, true);
        this.soundPlayerMove.stop();
        this.soundPlayerJump.play();
    }

    playerHitTile() {
        this.player.setVelocityY(0);
        this.player.y = 832.5;
        this.tiles[8].setVelocityY(-100);
        this.soundTileHit.play();
    }

    killEnemy() {
        this.displayText(380, 560, -0.18, 4000, `The tile bounces and the zombie is hit`);
        this.enemy.setVelocityX(50);
        this.enemy.setVelocityY(-200);
        this.enemy.setGravityY(300);
        this.enemy.play(ENEMY_DEAD_RIGHT, true);
        this.soundEnemyHit.play();
    }

    tileBounceBack() {
        this.tiles[8].y = 742.5;
        this.tiles[8].setVelocityY(100);
    }

    freezeTile() {
        this.tiles[8].y = 765.5;
        this.tiles[8].setVelocityY(0);
        this.tiles[8].refreshBody();
    }

    landPlayerOnGround() {
        this.player.setVelocityY(0);
        this.player.setGravityY(0);
        this.player.y = 945;
        this.player.setVelocityX(200); 
        this.player.anims.play(MOVE_RIGHT, true);
        this.player.refreshBody();
        this.soundPlayerMove.play({ loop: true });
    }

    freezeEnemy() {
        this.enemy.setVelocityX(0);
        this.enemy.setVelocityY(0);
        this.enemy.setGravityY(0);
        this.enemy.y = 702.5;
        this.enemy.refreshBody();
    }

    playerJumpOnTile() {
        this.displayText(920, 520, 0.12, 4000, `Go and kick the zombie!`);
        this.player.setVelocityX(-100);
        this.player.setVelocityY(-450);
        this.player.setGravityY(300);
        this.player.anims.play(JUMP_LEFT, true);
        this.soundPlayerMove.stop();
        this.soundPlayerJump.play();
    }

    playerLandOnTile() {
        this.player.setVelocityY(0);
        this.player.setGravityY(0);
        this.player.y = 694.5;
        this.player.setVelocityX(-200);
        this.player.anims.play(MOVE_LEFT, true);
        this.soundPlayerMove.play({ loop: true });
        // this.player.refreshBody();
    }

    playerHitsEnemy() {
        this.displayText(500, 180, 0, 5000, `Watch for the zombie count`);
        this.displayText(505, 220, 0, 5000, `if it reaches 15 you will be`);
        this.displayText(500, 260, 0, 5000, `overrun and lose the game!`);
        this.player.setVelocityX(0);
        this.player.anims.play(IDLE_LEFT, true);
        this.enemy.setVelocityX(-170);
        this.enemy.setVelocityY(-300);
        this.enemy.setGravityY(500);
        this.soundPlayerMove.stop();
        this.soundEnemyDead.play();
    }

    preload() {
        const dir = IMAGE_DIR_NAME;
        this.load.image(GROUND, `${dir}/ground.png`);
        this.load.image(TILE, `${dir}/tile.png`);
        this.load.spritesheet(ENEMY_WALK_LEFT, `${dir}/enemy_walk_left.png`, { frameWidth: 82, frameHeight: 99 });
        this.load.spritesheet(ENEMY_WALK_RIGHT, `${dir}/enemy_walk_right.png`, { frameWidth: 82, frameHeight: 99 });
        this.load.spritesheet(ENEMY_DEAD_LEFT, `${dir}/enemy_dead_left.png`, { frameWidth: 120, frameHeight: 90 });
        this.load.spritesheet(ENEMY_DEAD_RIGHT, `${dir}/enemy_dead_right.png`, { frameWidth: 120, frameHeight: 90 });
        this.load.spritesheet(PLAYER_1_IDLE_LEFT, `${dir}/player1_idle_left.png`, { frameWidth: 67, frameHeight: 102 });
        this.load.spritesheet(PLAYER_1_IDLE_RIGHT, `${dir}/player1_idle_right.png`, { frameWidth: 67, frameHeight: 102 });
        this.load.spritesheet(PLAYER_1_RUN_LEFT, `${dir}/player1_run_left.png`, { frameWidth: 87, frameHeight: 106 });
        this.load.spritesheet(PLAYER_1_RUN_RIGHT, `${dir}/player1_run_right.png`, { frameWidth: 87, frameHeight: 106 });
        this.load.spritesheet(PLAYER_1_JUMP_LEFT, `${dir}/player1_jump_left.png`, { frameWidth: 85, frameHeight: 113 });
        this.load.spritesheet(PLAYER_1_JUMP_RIGHT, `${dir}/player1_jump_right.png`, { frameWidth: 85, frameHeight: 113 });

        const sndDir = SOUND_DIR_NAME;
        this.load.audio(SOUND_TILE_HIT, `${sndDir}/tile_hit.wav`);
        this.load.audio(SOUND_PLAYER_JUMP, `${sndDir}/player_jump.wav`);
        this.load.audio(SOUND_PLAYER_MOVE, `${sndDir}/player_move.wav`);
        this.load.audio(SOUND_ENEMY_HIT, `${sndDir}/enemy_hit.wav`);
        this.load.audio(SOUND_ENEMY_DEAD, `${sndDir}/enemy_dead.wav`);
    }

    create() {
        this.soundTileHit = this.sound.add(SOUND_TILE_HIT);
        this.soundPlayerJump = this.sound.add(SOUND_PLAYER_JUMP);
        this.soundPlayerMove = this.sound.add(SOUND_PLAYER_MOVE, { volume: 0.3 });
        this.soundEnemyHit = this.sound.add(SOUND_ENEMY_HIT);
        this.soundEnemyDead = this.sound.add(SOUND_ENEMY_DEAD);
        this.generateTiles();
        this.add.image(720, GAME_HEIGHT_MAX + 87, GROUND);
        this.player = this.physics.add.sprite(1000, 945, PLAYER_1_IDLE_LEFT);
        this.player.anims.create({
            key: IDLE_LEFT,
            frames: this.anims.generateFrameNumbers(PLAYER_1_IDLE_LEFT, { start: 0, end: 0 }),
            frameRate: 20,
            repeat: -1
        });
        this.player.anims.create({
            key: IDLE_RIGHT,
            frames: this.anims.generateFrameNumbers(PLAYER_1_IDLE_RIGHT, { start: 0, end: 0 }),
            frameRate: 20,
            repeat: -1
        });
        this.player.anims.create({
            key: MOVE_LEFT,
            frames: this.anims.generateFrameNumbers(PLAYER_1_RUN_LEFT, { start: 0, end: 9 }),
            frameRate: 20,
            repeat: -1
        });
        this.player.anims.create({
            key: MOVE_RIGHT,
            frames: this.anims.generateFrameNumbers(PLAYER_1_RUN_RIGHT, { start: 0, end: 9 }),
            frameRate: 20,
            repeat: -1
        });
        this.player.anims.create({
            key: JUMP_LEFT,
            frames: this.anims.generateFrameNumbers(PLAYER_1_JUMP_LEFT, { start: 0, end: 9 }),
            frameRate: 20,
            repeat: 0
        });
        this.player.anims.create({
            key: JUMP_RIGHT,
            frames: this.anims.generateFrameNumbers(PLAYER_1_JUMP_RIGHT, { start: 0, end: 9 }),
            frameRate: 20,
            repeat: 0
        });
        this.enemy = this.physics.add.sprite(1000, 702.5, ENEMY_WALK_LEFT);
        this.enemy.anims.create({
            key: ENEMY_WALK_LEFT,
            frames: this.anims.generateFrameNumbers(ENEMY_WALK_LEFT, { start: 0, end: 9 }),
            frameRate: 20,
            repeat: -1
        });
        this.enemy.anims.create({
            key: ENEMY_WALK_RIGHT,
            frames: this.anims.generateFrameNumbers(ENEMY_WALK_RIGHT, { start: 0, end: 9 }),
            frameRate: 20,
            repeat: -1
        });
        this.enemy.anims.create({
            key: ENEMY_DEAD_LEFT,
            frames: this.anims.generateFrameNumbers(ENEMY_DEAD_LEFT, { start: 0, end: 9 }),
            frameRate: 20,
            repeat: 0
        });
        this.enemy.anims.create({
            key: ENEMY_DEAD_RIGHT,
            frames: this.anims.generateFrameNumbers(ENEMY_DEAD_RIGHT, { start: 0, end: 9 }),
            frameRate: 20,
            repeat: 0
        });
        this.add.text(GAME_WIDTH_MAX / 2 - 95, 30, `ZOMBIE COUNT:`, { color: 'white', fontSize: '24px' });
        this.add.text(GAME_WIDTH_MAX / 2, 90, `1`, { color: 'white', fontSize: '28px', fontStyle: 'bold' });
        this.displayText(850, 820, 0.09, 4000, `Move the player with the arrow keys`);
    }

    displayText(x, y, radians, duration, message) {
        const text = this.add.text(x, y, message, { color: 'white', fontSize: '28px', fontStyle: 'bold' });
        text.setRotation(radians);
        setTimeout(() => text.destroy(), duration);
    }

    generateTiles() {
        // ground floor
        for (let i = 0; i < 32; i++) {
            this.physics.add.sprite(22.5 + i * 45, GAME_HEIGHT_MAX - 22.5, TILE);
            this.physics.add.sprite(22.5 + i * 45, GAME_HEIGHT_MAX - 67.5, TILE);
        }
        // first floor
        const numberOfTiles = 16;
        for (let i = 0; i < numberOfTiles; i++) {
            this.tiles.push(this.physics.add.sprite(((GAME_WIDTH_MAX - 45 * numberOfTiles) / 2) + i * 45, GAME_HEIGHT_MAX - 7 * 45, TILE));
        }
    }

    update() {
        if (this.actions.length > 0) {
            if (this.actions[0].condition()) {
                this.actions[0].operation();
                this.actions.shift();
            }
        } else if (this.realoadInProgress !== true) {
            this.realoadInProgress = true;
            location.reload();
        }
    }
}