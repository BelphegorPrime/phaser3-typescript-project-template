import 'phaser';
import Game from "./scenes/game";

export const gameConfig = {
    type: Phaser.AUTO,
    parent: 'phaser',
	dom: {
		createContainer: true
	},
    width: 1280,
    height: 780,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [
        Game
    ],
    _options: {
        startingCards: 5,
        cardWidth: 265,
        cardHeight: 400,
        cardDistance: 50,
        cardAngle: 5
    }
};

const game = new Phaser.Game(gameConfig);