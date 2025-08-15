// types.ts
export interface WheelSegment {
    value: number;
    color: string;
    label: string;
}

export interface SpinResult {
    value: number;
    color: string;
    label: string;
}

export interface SlotsResult {
    reels: string[];
    payout: number;
    combination: string | null;
}

export interface RouletteNumber {
    number: number;
    color: 'red' | 'black' | 'green';
}

export interface BetOption {
    type: string;
    label: string;
    payout: number;
    color: string;
}

export interface RouletteResult {
    winningNumber: RouletteNumber;
    winningIndex: number;
    payout: number;
    bet: BetOption | null;
}

export type GameType = 'menu' | 'wheel' | 'slots' | 'roulette';