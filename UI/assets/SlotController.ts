import { _decorator, Component, Node, Label, Button } from 'cc';
import { Reel } from './Reel';
const { ccclass, property } = _decorator;

@ccclass('SlotController')
export class SlotController extends Component {
    @property([Node])
    reels: Node[] = [];

    @property(Label)
    balanceLabel: Label = null;

    @property(Label)
    winLabel: Label = null;

    @property(Label)
    betLabel: Label = null;

    @property(Button)
    spinButton: Button = null;

    @property(Button)
    addButton: Button = null;

    @property(Button)
    minusButton: Button = null;

    @property(Button)
    autoButton: Button = null;

    private balance: number = 50000000;
    private totalWin: number = 0;
    private betAmount: number = 100;
    private isAuto: boolean = false;
    private autoTimer: number = 0;
    private autoInterval: number = 1.5;
    private results: string[] = [];

    start() {
        this.updateAllLabels();
        console.log("🎰 遊戲初始化完成");
    }

    update(dt: number) {
        if (this.isAuto) {
            this.autoTimer += dt;
            if (this.autoTimer >= this.autoInterval) {
                this.autoTimer = 0;
                this.performSpin();
            }
        }
    }

    private performSpin() {
        if (this.balance < this.betAmount) {
            console.log('❌ 金幣不足');
            this.isAuto = false;
            return;
        }

        console.log('🔁 開始轉動');
        this.balance -= this.betAmount;
        this.totalWin = 0;
        this.updateAllLabels();
        this.results = [];

        this.reels.forEach((reelNode, i) => {
            const comp = reelNode.getComponent(Reel)!;
            comp.spin(1.5 + i * 0.3);
        });

        this.scheduleOnce(() => {
            this.evaluateResult();
        }, 2.5);
    }

    private evaluateResult() {
        this.results = this.reels.map(reelNode => {
            const comp = reelNode.getComponent(Reel)!;
            return comp.getCenterSymbolName();
        });

        const [a, b, c] = this.results;
        if (a === b && b === c) {
            const winAmount = this.betAmount * 3;
            this.balance += winAmount;
            this.totalWin = winAmount;
            console.log(`🎉 中獎：${a}！獲得 ${winAmount} 金幣`);
        } else {
            this.totalWin = 0;
            console.log('😢 沒中，再試一次');
        }

        this.updateAllLabels();

        if (this.isAuto) {
            this.scheduleOnce(() => this.performSpin(), 0.8);
        }
    }

    public onSpinClick() {
        if (this.isAuto) return;
        this.performSpin();
    }

    public onAddBet() {
        if (this.isAuto) return;
        this.betAmount += 100;
        this.updateAllLabels();
    }

    public onMinusBet() {
        if (this.isAuto) return;
        if (this.betAmount > 100) {
            this.betAmount -= 100;
            this.updateAllLabels();
        }
    }

    public onToggleAuto() {
        this.isAuto = !this.isAuto;
        this.autoTimer = 0;
        if (this.isAuto) {
            this.performSpin();
        }
    }

    private updateAllLabels() {
        this.balanceLabel.string = this.formatNumber(this.balance);
        this.winLabel.string = this.formatNumber(this.totalWin);
        this.betLabel.string = this.formatNumber(this.betAmount);
    }

    private formatNumber(num: number): string {
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }
}
