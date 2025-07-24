import { SpriteFrame } from 'cc';

export interface SlotSymbolData {
    name: string;               // 符號代碼名稱
    spriteFrame: SpriteFrame;   // 對應圖像
    payout: number;             // 中獎倍數
    isWild?: boolean;           // 是否為 Wild（可選）
    isScatter?: boolean;        // 是否為 Scatter（可選）
}
