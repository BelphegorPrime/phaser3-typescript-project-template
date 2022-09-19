import { gameConfig } from "..";
import { BaseCard } from "../../generated/graphql";
import Game from "../scenes/game";

export default class Card {
    public elem: Phaser.GameObjects.RenderTexture
    constructor(
        private scene: Game,
        private card: BaseCard
    ) {}

    public render = (x, y, sprite) => {
        // elem is no longer a sprite but a renderTexture
        this.elem = this.scene.add.renderTexture(
            x,
            y,
            gameConfig._options.cardWidth,
            gameConfig._options.cardHeight
        )
            .setInteractive();
        // renderTexture does not have default origin at its center, so we set it manually
        this.elem.setOrigin(0.5)
        // renderTexture can't be created as a physics object on the fly so we add it to physics world manually
        this.scene.physics.add.existing(this.elem);
        this.scene.cardGroup.add(this.elem);

        const cardSprite = this.scene.add.image(x, y, sprite)
            .setScale(0.3, 0.3)
            .setInteractive();
        this.elem.draw(cardSprite, x, y)

        const text = this.scene.add.text(x, y, this.card.name)
                .setFontSize(18)
                .setFontFamily('Trebuchet MS')
                .setColor('#00ffff')
                .setInteractive();
        this.elem.draw(text, x, y)

        this.scene.input.setDraggable(this.elem);

        return this.elem;
    }
}