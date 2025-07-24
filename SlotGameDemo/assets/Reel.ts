import { SlotSymbolData } from "./SlotConfig";
import { Reel } from "./Reel";

export class ReelModel {
    private allSymbols: SlotSymbolData[] = [];
    private symbolsPerReel: number;
    public readonly reel: Reel;

    constructor(symbolsPerReel: number, allSymbols: SlotSymbolData[]) {
        this.symbolsPerReel = symbolsPerReel;
        this.allSymbols = allSymbols;
        this.reel = new Reel(symbolsPerReel);
    }

    /**
     * 隨機生成一組可視符號
     */
    public generateVisibleSymbols(): void {
        const result: SlotSymbolData[] = [];

        for (let i = 0; i < this.symbolsPerReel; i++) {
            const symbol = this.getRandomSymbol();
            result.push(symbol);
        }

        this.reel.setSymbols(result);
    }

    /**
     * 傳回目前可視符號（上到下）
     */
    public getVisibleSymbols(): SlotSymbolData[] {
        return this.reel.visibleSymbols;
    }

    private getRandomSymbol(): SlotSymbolData {
        const index = Math.floor(Math.random() * this.allSymbols.length);
        return this.allSymbols[index];
    }
}
