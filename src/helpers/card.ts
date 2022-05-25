export default class Card {
    constructor(private scene: Phaser.Scene) {
        this.scene = scene
    }

    public render = (x, y, sprite) => {
        let card = this.scene.add.image(x, y, sprite)
            .setScale(0.3, 0.3)
            .setInteractive();

        this.scene.input.setDraggable(card);

        return card;
    }
}