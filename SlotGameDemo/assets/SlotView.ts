import { _decorator, Component, Node } from 'cc';
import { SlotModel } from './SlotModel';
import { SlotSymbolData } from './SlotConfig';
import { ReelView } from './ReelView';
const { ccclass, property } = _decorator;

@ccclass('SlotView')
export class SlotView extends Component {
    @property([Node])
    reelNodes: Node[] = [];

    private reelViews: ReelView[] = [];

    onLoad() {
        this.reelViews = this.reelNodes.map(n => n.getComponent(ReelView));
    }

    /**
     * 更新畫面符號（用 SlotModel 的資料）
     */
    public updateFromModel(slotModel: SlotModel) {
        for (let i = 0; i < this.reelViews.length; i++) {
            const view = this.reelViews[i];
            const symbols = slotModel.getReel(i).getVisibleSymbols();
            view.setVisibleSymbols(symbols);
        }
    }

    /**
     * 播放中獎動畫（根據獲勝行的資料）
     */
    public playWinEffects(winLines: { row: number, reelIndex: number }[]) {
        for (const win of winLines) {
            const view = this.reelViews[win.reelIndex];
            view.playWinEffectAtRow(win.row);
        }
    }
}
