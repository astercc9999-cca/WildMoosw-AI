import { _decorator, Component, Node, Prefab, instantiate, SpriteFrame, UITransform } from 'cc';
import { SlotSymbolData } from './SlotConfig';
import { ReelModel } from './ReelModel';
import { SymbolView } from './SymbolView';
const { ccclass, property } = _decorator;

@ccclass('ReelView')
export class ReelView extends Component {
    @property(Prefab)
    symbolPrefab: Prefab = null;

    @property([SpriteFrame])
    symbolSpriteFrames: SpriteFrame[] = [];

    @property
    spacing: number = 10;

    @property
    symbolsPerReel: number = 3;

    private symbolViews: SymbolView[] = [];
    private reelModel: ReelModel;

    start() {
        this.initModel();
        this.createSymbolViews();
        this.refreshSymbols();
    }

    initModel() {
        const symbolList: SlotSymbolData[] = this.symbolSpriteFrames.map((spriteFrame, index) => ({
            name: `S${index + 1}`,
            spriteFrame: spriteFrame,
            payout: (index + 1) * 2
        }));
        this.reelModel = new ReelModel(this.symbolsPerReel, symbolList);
        this.reelModel.generateVisibleSymbols();
    }

    createSymbolViews() {
        const step = this.getSymbolHeight() + this.spacing;
        for (let i = 0; i < this.symbolsPerReel; i++) {
            const symbolNode = instantiate(this.symbolPrefab);
            symbolNode.setParent(this.node);
            symbolNode.setPosition(0, step * (this.symbolsPerReel - 1 - i), 0);
            const view = symbolNode.getComponent(SymbolView);
            this.symbolViews.push(view);
        }
    }

    refreshSymbols() {
        const visible = this.reelModel.getVisibleSymbols();
        for (let i = 0; i < this.symbolViews.length; i++) {
            this.symbolViews[i].setData(visible[i]);
        }
    }

    private getSymbolHeight(): number {
        const sample = this.symbolPrefab.data.getComponent(UITransform);
        return sample ? sample.height : 100;
    }
}
