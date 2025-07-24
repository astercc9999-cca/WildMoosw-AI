import { ReelModel } from './ReelModel';
import { SlotSymbolData } from './SlotConfig';

export class SlotModel {
    private reels: ReelModel[] = [];

    constructor(reelCount: number, symbolsPerReel: number, symbolSet: SlotSymbolData[]) {
        for (let i = 0; i < reelCount; i++) {
            const reel = new ReelModel(symbolsPerReel, symbolSet);
            this.reels.push(reel);
        }
    }

    /**
     * 每條轉輪生成新一組可視符號
     */
    public spinAll(): void {
        for (const reel of this.reels) {
            reel.generateVisibleSymbols();
        }
    }

    /**
     * 回傳所有 Reel 的可視符號（由上到下排列）
     */
    public getVisibleSymbols(): SlotSymbolData[][] {
        return this.reels.map(reel => reel.getVisibleSymbols());
    }

    public getReelCount(): number {
        return this.reels.length;
    }

    public getReel(index: number): ReelModel {
        return this.reels[index];
    }
}
