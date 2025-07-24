import { _decorator, Component, Node } from 'cc';
import { SlotModel } from './SlotModel';
import { SlotSymbolData } from './SlotConfig';
import { WinEvaluator } from './WinEvaluator';
import { ReelView } from './ReelView';
import { ReelAnimation } from './ReelAnimation';

const { ccclass, property } = _decorator;

@ccclass('SlotController')
export class SlotController extends Component {
    @property([Node])
    reelViews: Node[] = [];

    private slotModel: SlotModel;
    private evaluator: WinEvaluator;
    private completedCount: number = 0;

    start() {
        // 假設所有 ReelView 預設都有相同 symbolSet
        const sampleView = this.reelViews[0].getComponent(ReelView);
        const symbolSet = sampleView['symbolSpriteFrames'].map((spriteFrame, index) => ({
            name: `S${index + 1}`,
            spriteFrame,
            payout: (index + 1) * 2
        }));

        this.slotModel = new SlotModel(this.reelViews.length, 3, symbolSet);
        this.evaluator = new WinEvaluator();
    }

    public onSpinClick() {
        this.completedCount = 0;
        this.slotModel.spinAll();

        for (let i = 0; i < this.reelViews.length; i++) {
            const view = this.reelViews[i].getComponent(ReelView);
            const anim = this.reelViews[i].getComponent(ReelAnimation);

            view.refreshSymbols(); // 提前預設（可選）
            anim.spin(() => this.onReelSpinEnd());
        }
    }

    private onReelSpinEnd() {
        this.completedCount++;
        if (this.completedCount >= this.reelViews.length) {
            this.onAllReelsStopped();
        }
    }

    private onAllReelsStopped() {
        const results = this.slotModel.getVisibleSymbols();
        const winLines = this.evaluator.evaluate(results);

        if (winLines.length > 0) {
            console.log('🎉 Win Lines:', winLines);
        } else {
            console.log('😢 沒中獎');
        }
    }
}
