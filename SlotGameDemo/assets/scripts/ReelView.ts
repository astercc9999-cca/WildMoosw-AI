import { _decorator, Component, Node, Prefab, instantiate, SpriteFrame, UITransform } from 'cc';
import { Symbol } from './Symbol';
const { ccclass, property } = _decorator;

@ccclass('ReelView')
export class ReelView extends Component {
    @property(Prefab)
    symbolPrefab: Prefab = null; // 預製 Symbol

    @property([SpriteFrame])
    symbolSpriteFrames: SpriteFrame[] = []; // 對應圖案

    @property
    spacing: number = 10; // Symbol 間距

    @property
    roundsPerSecond: number = 3; // 每秒轉幾圈

    @property
    spinDuration: number = 2.0; // 轉動時間

    private symbolNames: string[] = ['M1', 'M2', 'M3', 'M4', 'M5'];
    private visibleSymbols: Node[] = []; // 當前畫面上 Symbol

    private isSpinning: boolean = false;
    private speed: number = 1000;
    private symbolHeight: number = 0;

    start() {
        const prefabUI = this.symbolPrefab.data.getComponent(UITransform);
        this.symbolHeight = prefabUI.height; // 取得 prefab 高度
        this.initSymbols(); // 初始化符號
    }

    initSymbols() {
        this.visibleSymbols = [];
        const step = this.symbolHeight + this.spacing;

        for (let i = 0; i < 5; i++) {
            const symbolNode = instantiate(this.symbolPrefab);
            symbolNode.setParent(this.node);

            const y = step * (2 - i); // 垂直排列
            symbolNode.setPosition(0, y, 0);

            const index = Math.floor(Math.random() * this.symbolNames.length);
            const name = this.symbolNames[index];
            const frame = this.symbolSpriteFrames[index];

            const symbol = symbolNode.getComponent(Symbol);
            symbol.init(name, frame);

            this.visibleSymbols.push(symbolNode);
        }
    }

    spin() {
        if (this.isSpinning) return;
        this.isSpinning = true;

        const step = this.symbolHeight + this.spacing;
        this.speed = step * this.roundsPerSecond * 5;

        const spinEndTime = performance.now() + this.spinDuration * 1000;

        const updateSpin = () => {
            const now = performance.now();
            const deltaY = this.speed * 0.016; // 每幀移動距離

            for (let symbolNode of this.visibleSymbols) {
                let pos = symbolNode.getPosition();
                pos.y -= deltaY;

                // 超出畫面下方，從上補一個新的
                if (pos.y < -step * 2.5) {
                    pos.y += step * 5;

                    const index = Math.floor(Math.random() * this.symbolNames.length);
                    const name = this.symbolNames[index];
                    const frame = this.symbolSpriteFrames[index];

                    const symbol = symbolNode.getComponent(Symbol);
                    symbol.init(name, frame);
                }

                symbolNode.setPosition(pos);
            }

            if (now < spinEndTime) {
                requestAnimationFrame(updateSpin);
            } else {
                this.snapToCenter(step); // 補對齊
                this.isSpinning = false;
            }
        };

        requestAnimationFrame(updateSpin);
    }

    snapToCenter(step: number) {
        // 尋找最靠近 Y=0 的 Symbol
        let closest = this.visibleSymbols[0];
        let minDist = Math.abs(closest.getPosition().y);

        for (let node of this.visibleSymbols) {
            const dist = Math.abs(node.getPosition().y);
            if (dist < minDist) {
                closest = node;
                minDist = dist;
            }
        }

        const offset = closest.getPosition().y;

        // 全部調整補對齊
        for (let node of this.visibleSymbols) {
            const pos = node.getPosition();
            node.setPosition(pos.x, pos.y - offset, pos.z);
        }
    }

    // 回傳中線 Symbol 名稱（可作單線測試）
    getResultSymbol(): string {
        const step = this.symbolHeight + this.spacing;
        for (let node of this.visibleSymbols) {
            if (Math.abs(node.getPosition().y) < step / 2) {
                return node.getComponent(Symbol).symbolName;
            }
        }
        return '';
    }

    // 回傳 [上, 中, 下] Symbol 名稱（給 SlotController 判斷五條線）
    getSymbols(): string[] {
        const result: string[] = [];
        const step = this.symbolHeight + this.spacing;
        const targetYs = [step * 1, 0, -step * 1]; // 上、中、下

        for (let targetY of targetYs) {
            for (let node of this.visibleSymbols) {
                if (Math.abs(node.getPosition().y - targetY) < step / 2) {
                    result.push(node.getComponent(Symbol).symbolName);
                    break;
                }
            }
        }

        return result;
    }

    // 播放中獎動畫（row: 0=上, 1=中, 2=下）
    public playWinEffectAtRow(rowIndex: number) {
        const step = this.symbolHeight + this.spacing;
        const targetY = step * (1 - rowIndex);

        for (let node of this.visibleSymbols) {
            if (Math.abs(node.getPosition().y - targetY) < step / 2) {
                const symbol = node.getComponent(Symbol);
                symbol?.playWinEffect();
            }
        }
    }
}
