import { Socket, io } from 'socket.io-client';
import Zone from '../helpers/zone';
import Dealer from '../helpers/dealer';
import { gameConfig } from '..';
import getDecks from '../../action/getDecks';
import { BaseCard, BaseDeck } from '../../generated/graphql';

const getCards = (deck: BaseDeck) => {
    return deck.baseDeckCards.reduce((acc: BaseCard[], val) => {
        if (val.amount && val.baseCard) {
            let count = 0;
            while (count < val.amount) {
                acc.push(val.baseCard);
                count++;
            }
        }
        return acc;
    }, []);

}

export default class Game extends Phaser.Scene {
    private dealText: Phaser.GameObjects.Text

    private decks = {
        ready: false,
        A: [],
        B: [],
    }

    private dealer: Dealer
    private zone: Zone
    private dropZone: Phaser.GameObjects.Zone
    private outline: Phaser.GameObjects.Graphics
    private socket: Socket = io('http://localhost:3000')

    public isPlayerA = false;
    public opponentCards = [];
    public cardGroup: Phaser.Physics.Arcade.Group

    constructor() {
        super({
            key: 'Game'
        });
        getDecks().then(({baseDecks}) => {
            if (baseDecks.length > 1) {
                this.decks.A = Phaser.Math.RND.shuffle<BaseCard>(getCards(baseDecks[0]))
                this.decks.B = Phaser.Math.RND.shuffle<BaseCard>(getCards(baseDecks[1]))
                this.decks.ready = true
                console.log(this.decks)
            }
        })

    }

    init() {
        this.zone = new Zone(this);
        const background = this.add.sprite(gameConfig.width / 2, gameConfig.height / 2, "background")

		this.dealer = new Dealer(this, this.decks);
        this.dropZone = this.zone.renderZone();
        this.outline = this.zone.renderOutline(this.dropZone);

        this.cardGroup = this.physics.add.group();
    }

    preload() {
        this.load.image('cyanCardFront', 'assets/CyanCardFront.png');
        this.load.image('cyanCardBack', 'assets/CyanCardBack.png');
        this.load.image('magentaCardFront', 'assets/MagentaCardFront.png');
        this.load.image('magentaCardBack', 'assets/MagentaCardBack.png');

        this.load.image("background", "assets/background.png");
        this.load.spritesheet("cards", "assets/cards.png", {
            frameWidth: gameConfig._options.cardWidth,
            frameHeight: gameConfig._options.cardHeight
        });
    }

    create() {
        const intervallId = setInterval(() => {
            if (this.decks.ready) {
                this.init()

                this.dealText = this.add.text(75, 350, ['DEAL CARDS'])
                    .setFontSize(18)
                    .setFontFamily('Trebuchet MS')
                    .setColor('#00ffff')
                    .setInteractive();

                this.dealText.on('pointerdown', () => {
                    this.socket.emit("dealCards");
                })

                this.dealText.on('pointerover', () => {
                    this.dealText.setColor('#ff69b4');
                })

                this.dealText.on('pointerout', () => {
                    this.dealText.setColor('#00ffff');
                })

                
                this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
                    gameObject.x = dragX;
                    gameObject.y = dragY;
                })

                this.input.on('dragstart', (pointer, gameObject) => {
                    gameObject.setTint(0xff69b4);
                    this.children.bringToTop(gameObject);
                })

                this.input.on('dragend', (pointer, gameObject, dropped) => {
                    gameObject.setTint();
                    if (!dropped) {
                        gameObject.x = gameObject.input.dragStartX;
                        gameObject.y = gameObject.input.dragStartY;
                    }
                })

                this.input.on('drop', (pointer, gameObject, dropZone) => {
                    dropZone.data.values.cards++;
                    gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards * 50);
                    gameObject.y = dropZone.y;
                    gameObject.disableInteractive();
                    this.socket.emit('cardPlayed', gameObject, this.isPlayerA);
                })

                this.socket.on('connect', () => {
                    console.log('Connected!');
                });

                this.socket.on('isPlayerA', () => {
                    console.log("isPlayerA")
                    this.isPlayerA = true;
                })

                this.socket.on('dealCards', () => {
                    this.dealer.dealCards();
                    this.dealText.disableInteractive();
                })

                this.socket.on('cardPlayed', (gameObject, isPlayerA) => {
                    if (isPlayerA !== this.isPlayerA) {
                        console.log(gameObject)
                        let sprite = gameObject.textureKey;

                        this.opponentCards.shift().destroy();

                        this.dropZone.data.values.cards++;

                        // let card = new Card(this, "öööh");
                        // card.render(
                        //     ((this.dropZone.x - 350) + (this.dropZone.data.values.cards * 50)),
                        //     (this.dropZone.y),
                        //     sprite
                        // ).disableInteractive();
                    }
                })

                clearInterval(intervallId)
            }
        }, 100)
    }
    
    update() {
    
    }
}