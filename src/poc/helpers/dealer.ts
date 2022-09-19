import { BaseCard } from '../../generated/graphql';
import Game from '../scenes/game';
import Card from './card';

export default class Dealer {

    constructor(
        private scene: Game,
        private decks: {A: BaseCard[], B:BaseCard[], ready: boolean}
    ) {}

    dealCards = () => {
        let playerSprite;
        let opponentSprite;
        if (this.scene.isPlayerA) {
            playerSprite = 'cyanCardFront';
            opponentSprite = 'cards';
        } else {
            playerSprite = 'cards';
            opponentSprite = 'cyanCardBack';
        };

        console.log(this.decks)

		let startAngle = -20
        const playerCards = this.decks.A
            .filter((card, index) => index < 5)
            .forEach((card, index) => {
                let cardInstance = new Card(this.scene, card);
                cardInstance.render(475 + (index * 50), 700, playerSprite);
                cardInstance.elem.setOrigin(0.5, 1);
                cardInstance.elem.setDepth(this.decks.A.length - index);
                cardInstance.elem.angle = startAngle;
                if(index > 0){
                    cardInstance.elem.angle = startAngle + 10 * index;
                }
            })
            
        const opponentCards = this.decks.B
            .filter((card, index) => index < 5)
            .forEach((card, index) => {
                let cardInstance = new Card(this.scene, card);
                const renderedInstance = cardInstance.render(475 + (index * 100), 125, opponentSprite);
                renderedInstance.disableInteractive()
                this.scene.opponentCards.push(renderedInstance);
            })
    }
}