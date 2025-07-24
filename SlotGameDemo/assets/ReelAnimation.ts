import { _decorator, Component, Node, Vec3 } from 'cc';
import { ReelView } from './ReelView';
const { ccclass, property } = _decorator;

@ccclass('ReelAnimation')
export class ReelAnimation extends Component {
    @property(ReelView)
    reelView: ReelView = null;

    @property
    spinDuration: number = 2.0;

    @property
    speed: number = 1000;

    private isSpinning = false;
    private elapsedTime = 0;
    private onComplete: () => void = null;

    start() {
        // 你也可以自動 spin 看爽
        // this.spin(() => console.log('Auto Done'));
    }

    update(dt: number) {
        if (!this.isSpinning) return;

        const symbols = this.reelView.node.children;

        for (let symbol of symbols) {
            const pos = symbol.position;
            pos.y -= this.speed * dt;

            const height = this.reelView.getSymbolHeight() + this.reelView.spacing;
            if (pos.y < -height) {
                pos.y += height * symbols.length;
                this.reelView.randomizeSymbol(symbol);
            }

            symbol.setPosition(pos);
        }

        this.elapsedTime += dt;
        if (this.elapsedTime >= this.spinDuration) {
            this.isSpinning = false;
            this.snapToGrid();
            this.onComplete?.();
        }
    }

    public spin(onComplete?: () => void) {
        if (this.isSpinning) return;
        this.elapsedTime = 0;
        this.isSpinning = true;
        this.onComplete = onComplete ?? null;
    }

    private snapToGrid() {
        const step = this.reelView.getSymbolHeight() + this.reelView.spacing;
        const symbols = this.reelView.node.children;

        // 找出最接近中線的 Symbol
        let closest = symbols[0];
        let minDist = Math.abs(closest.position.y);
        for (let s of symbols) {
            const dist = Math.abs(s.position.y);
            if (dist < minDist) {
                closest = s;
                minDist = dist;
            }
        }

        const offset = closest.position.y;
        for (let s of symbols) {
            const pos = s.position;
            s.setPosition(pos.x, pos.y - offset, pos.z);
        }
    }
}
