import { _decorator, Component, Node } from 'cc';
import { ReelView } from './ReelView';
const { ccclass, property } = _decorator;

// 每個 symbol 對應中獎倍率
const symbolPayTable: Record<string, number> = {
    M1: 2,
    M2: 3,
    M3: 5,
    M4: 8,
    M5: 10,
    WILD: 15,
    SC: 0
};

@ccclass('SlotController')
export class SlotController extends Component {
    @property(Node) reel1: Node = null;
    @property(Node) reel2: Node = null;
    @property(Node) reel3: Node = null;

    private isSpinning: boolean = false;

    onSpinButtonClick() {
        if (this.isSpinning) return;
        this.isSpinning = true;
        console.log('🎰 開始轉軸');

        const r1 = this.reel1.getComponent(ReelView);
        const r2 = this.reel2.getComponent(ReelView);
        const r3 = this.reel3.getComponent(ReelView);

        // 設定每軸速度與轉動秒數
        r1.roundsPerSecond = 5;
        r1.spinDuration = 1.5;

        r2.roundsPerSecond = 4;
        r2.spinDuration = 2.0;

        r3.roundsPerSecond = 3;
        r3.spinDuration = 2.5;

        // 開始旋轉
        r1.spin();
        r2.spin();
        r3.spin();

        // 等待結束（保守估約 2.8 秒）
        setTimeout(() => {
            const [r1top, r1mid, r1bot] = r1.getSymbols();
            const [r2top, r2mid, r2bot] = r2.getSymbols();
            const [r3top, r3mid, r3bot] = r3.getSymbols();

            const lineNames = ['上線', '中線', '下線', '↘斜線', '↗斜線'];
            const allLines = [
                [r1top, r2top, r3top],     // 上
                [r1mid, r2mid, r3mid],     // 中
                [r1bot, r2bot, r3bot],     // 下
                [r1top, r2mid, r3bot],     // ↘
                [r1bot, r2mid, r3top]      // ↗
            ];

            const rowMap = [0, 1, 2, 0, 2]; // 每條線對應的 Row 索引（↘↗ 需特別處理）
            const winLines: string[] = [];
            let totalWin = 0;

            console.log('🎯 五線結果：');
            console.log(`上線：${allLines[0].join(' | ')}`);
            console.log(`中線：${allLines[1].join(' | ')}`);
            console.log(`下線：${allLines[2].join(' | ')}`);
            console.log(`↘斜線：${allLines[3].join(' | ')}`);
            console.log(`↗斜線：${allLines[4].join(' | ')}`);

            for (let i = 0; i < allLines.length; i++) {
                const [s1, s2, s3] = allLines[i];

                // 判斷是否同一組（支援 WILD）
                const isSameOrWild = (a: string, b: string) =>
                    a === b || a === 'WILD' || b === 'WILD';

                const isWin = isSameOrWild(s1, s2) && isSameOrWild(s2, s3);

                if (isWin) {
                    winLines.push(lineNames[i]);

                    // 找出中獎的主 Symbol 名稱（排除 WILD）
                    const coreSymbol = [s1, s2, s3].find(s => s !== 'WILD') || 'WILD';
                    const payout = symbolPayTable[coreSymbol] ?? 0;
                    totalWin += payout;

                    console.log(`⭐ ${lineNames[i]} → ${coreSymbol} × ${payout} 倍`);

                    // 播放中獎動畫
                    const rows = i < 3 ? [rowMap[i], rowMap[i], rowMap[i]]
                              : i === 3 ? [0, 1, 2]  // ↘
                              : [2, 1, 0];           // ↗

                    const reels = [r1, r2, r3];
                    for (let j = 0; j < 3; j++) {
                        reels[j].playWinEffectAtRow(rows[j]);
                    }
                }
            }

            if (winLines.length > 0) {
                console.log(`🎉 中獎線：${winLines.join('、')}`);
                console.log(`💰 總得分：${totalWin} 金幣`);
            } else {
                console.log('😢 沒中獎');
            }

            this.isSpinning = false;
        }, 2800);
    }
}
