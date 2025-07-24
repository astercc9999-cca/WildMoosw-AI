import { _decorator, Component, Sprite, SpriteFrame, tween, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Symbol')
export class Symbol extends Component {
    @property({ type: Sprite })
    public sprite: Sprite = null;

    public symbolName: string = '';

    public init(name: string, spriteFrame: SpriteFrame) {
        this.symbolName = name;
        this.sprite.spriteFrame = spriteFrame;
    }

    public playWinEffect() {
        const uiOpacity = this.getComponent(UIOpacity) || this.addComponent(UIOpacity);
        uiOpacity.opacity = 255;

        tween(uiOpacity)
            .repeat(6,
                tween().to(0.15, { opacity: 50 })
                      .to(0.15, { opacity: 255 })
            )
            .start();
    }
}
