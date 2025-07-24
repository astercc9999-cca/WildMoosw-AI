import { SlotSymbolData } from './SlotConfig';

export class WinEvaluator {
    // 中獎條件：同樣 symbol 或含 WILD，並排三個
    evaluate(reels: SlotSymbolData[][]): string[] {
        const results: string[] = [];

        const lineNames = ['上線', '中線', '下線', '↘斜線', '↗斜線'];
        const rowIndexMap = [
            [0, 0, 0], // 上
            [1, 1, 1], // 中
            [2, 2, 2], // 下
            [0, 1, 2], // ↘
            [2, 1, 0]  // ↗
        ];

        for (let i = 0; i < rowIndexMap.length; i++) {
            const [r0, r1, r2] = rowIndexMap[i];
            const s1 = reels[0][r0];
            const s2 = reels[1][r1];
            const s3 = reels[2][r2];

            if (this.isMatch(s1, s2) && this.isMatch(s2, s3)) {
                const core = [s1, s2, s3].find(s => !s.isWild) ?? s1;
                results.push(`${lineNames[i]}：${core.name} × ${core.payout}`);
            }
        }

        return results;
    }

    private isMatch(a: SlotSymbolData, b: SlotSymbolData): boolean {
        return a.name === b.name || a.isWild || b.isWild;
    }
}
