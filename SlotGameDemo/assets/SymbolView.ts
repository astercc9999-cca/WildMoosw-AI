import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
import { SlotSymbolData } from './SlotConfig';
const { ccclass, property } = _decorator;

@ccclass('SymbolView')
export class SymbolView extends Component {
    @property(Sprite)
    sprite: Sprite = null;

    private data: SlotSymbolData;

    public setData(data: SlotSymbolData) {
        this.data = data;
        if (this.sprite && data.spriteFrame) {
            this.sprite.spriteFrame = data.spriteFrame;
        }
    }

    public getSymbolName(): string {
        return this.data?.name ?? '';
    }

    public getPayout(): number {
        return this.data?.payout ?? 0;
    }

    public getSymbolData(): SlotSymbolData {
        return this.data;
    }
}
