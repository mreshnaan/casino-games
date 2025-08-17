import React, { useState } from 'react';
import type { GameType, SlotsResult } from './types';

interface SlotsGameProps {
    setCurrentGame: (game: GameType) => void;
    setResult: (result: SlotsResult | null) => void;
    setShowResult: (show: boolean) => void;
    showResult: boolean;
    result: SlotsResult | null;
}

export const SlotsGame: React.FC<SlotsGameProps> = ({
    setCurrentGame,
    setResult,
    setShowResult,
    showResult,
    result
}) => {
    const [spinning, setSpinning] = useState<boolean>(false);
    const [reels, setReels] = useState<string[][]>([
        ['🍒', '🍒', '🍒'],
        ['🍒', '🍒', '🍒'],
        ['🍒', '🍒', '🍒']
    ]);
    const [reelPositions, setReelPositions] = useState<number[]>([0, 0, 0]);
    const [reelStopped, setReelStopped] = useState<boolean[]>([false, false, false]);
    const [finalResult, setFinalResult] = useState<SlotsResult | null>(null);
    console.log(finalResult)
    const slotSymbols: string[] = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '🎰', '🔔'];
    const payouts: Record<string, number> = {
        '💎💎💎': 1000,
        '🎰🎰🎰': 500,
        '⭐⭐⭐': 250,
        '🔔🔔🔔': 100,
        '🍇🍇🍇': 75,
        '🍊🍊🍊': 50,
        '🍋🍋🍋': 25,
        '🍒🍒🍒': 10,
        '💎💎': 50,
        '🎰🎰': 25,
        '⭐⭐': 15,
        '🔔🔔': 10,
    };

    const generateReel = (): string[] => {
        const reel: string[] = [];
        for (let i = 0; i < 20; i++) {
            reel.push(slotSymbols[Math.floor(Math.random() * slotSymbols.length)]);
        }
        return reel;
    };

    const simulateBackendCall = (): Promise<SlotsResult> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const isWin = Math.random() < 0.3;

                if (isWin) {
                    const winTypes = Object.keys(payouts);
                    const randomWin = winTypes[Math.floor(Math.random() * winTypes.length)];

                    if (randomWin.length === 6) {
                        const symbol = randomWin.charAt(0);
                        resolve({
                            reels: [symbol, symbol, symbol],
                            payout: payouts[randomWin],
                            combination: randomWin
                        });
                    } else {
                        const symbol = randomWin.charAt(0);
                        const otherSymbol = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
                        resolve({
                            reels: [symbol, symbol, otherSymbol],
                            payout: payouts[randomWin],
                            combination: randomWin
                        });
                    }
                } else {
                    const reel1 = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
                    let reel2: string, reel3: string;
                    do {
                        reel2 = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
                        reel3 = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
                    } while (reel1 === reel2 && reel2 === reel3);

                    resolve({
                        reels: [reel1, reel2, reel3],
                        payout: 0,
                        combination: null
                    });
                }
            }, 100);
        });
    };

    const spinSlots = async (): Promise<void> => {
        if (spinning) return;

        setSpinning(true);
        setShowResult(false);
        setReelStopped([false, false, false]);

        const backendResult = await simulateBackendCall();
        setFinalResult(backendResult);

        const newReels = [generateReel(), generateReel(), generateReel()];
        newReels[0][10] = backendResult.reels[0];
        newReels[1][10] = backendResult.reels[1];
        newReels[2][10] = backendResult.reels[2];

        setTimeout(() => {
            setReels(newReels);
        }, 200);

        const spinIntervals: number[] = [];
        const currentPositions = [...reelPositions];

        const reel1Interval = setInterval(() => {
            currentPositions[0] = (currentPositions[0] + 1) % 20;
            setReelPositions([currentPositions[0], currentPositions[1], currentPositions[2]]);
        }, 100);
        spinIntervals.push(reel1Interval);

        const reel2Interval = setInterval(() => {
            currentPositions[1] = (currentPositions[1] + 1) % 20;
            setReelPositions([currentPositions[0], currentPositions[1], currentPositions[2]]);
        }, 120);
        spinIntervals.push(reel2Interval);

        const reel3Interval = setInterval(() => {
            currentPositions[2] = (currentPositions[2] + 1) % 20;
            setReelPositions([currentPositions[0], currentPositions[1], currentPositions[2]]);
        }, 140);
        spinIntervals.push(reel3Interval);

        setTimeout(() => {
            clearInterval(reel1Interval);
            setReelPositions(prev => [10, prev[1], prev[2]]);
            setReelStopped(prev => [true, prev[1], prev[2]]);
        }, 2200);

        setTimeout(() => {
            clearInterval(reel2Interval);
            setReelPositions(prev => [prev[0], 10, prev[2]]);
            setReelStopped(prev => [prev[0], true, prev[2]]);
        }, 3200);

        setTimeout(() => {
            clearInterval(reel3Interval);
            setReelPositions(prev => [prev[0], prev[1], 10]);
            setReelStopped([true, true, true]);
            setSpinning(false);
            setShowResult(true);
            setResult(backendResult);
        }, 4200);
    };

    const resetSlots = (): void => {
        setReels([
            ['🍒', '🍒', '🍒'],
            ['🍒', '🍒', '🍒'],
            ['🍒', '🍒', '🍒']
        ]);
        setReelPositions([0, 0, 0]);
        setReelStopped([false, false, false]);
        setShowResult(false);
        setResult(null);
        setFinalResult(null);
    };

    return (
        <div className="flex flex-col items-center space-y-6 p-8">
            <div className="bg-gradient-to-b from-yellow-400 to-yellow-600 p-8 rounded-3xl shadow-2xl border-4 border-yellow-300">
                <div className="bg-black p-6 rounded-2xl">
                    <div className="flex space-x-4 mb-6 relative overflow-hidden h-24">
                        {reels.map((reel, reelIndex) => (
                            <div key={reelIndex} className="relative w-20 h-20 bg-white rounded-lg border-4 border-gray-300 overflow-hidden">
                                <div
                                    className={`absolute w-full transition-transform duration-75 ease-linear ${reelStopped[reelIndex] ? 'transition-transform duration-500 ease-out' : ''
                                        }`}
                                    style={{
                                        transform: `translateY(-${reelPositions[reelIndex] * 80}px)`,
                                    }}
                                >
                                    {reel.map((symbol, symbolIndex) => (
                                        <div
                                            key={symbolIndex}
                                            className="w-20 h-20 flex items-center justify-center text-4xl bg-white"
                                            style={{ height: '80px' }}
                                        >
                                            {symbol}
                                        </div>
                                    ))}
                                </div>

                                <div className="absolute bottom-0 left-0 text-xs bg-black text-white px-1">
                                    Pos: {reelPositions[reelIndex]}
                                </div>
                                <div className="absolute bottom-0 right-0 text-xs bg-blue-500 text-white px-1">
                                    {reel[reelPositions[reelIndex]]}
                                </div>

                                {reelStopped[reelIndex] && (
                                    <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full m-1"></div>
                                )}
                            </div>
                        ))}

                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 opacity-50 transform -translate-y-1/2"></div>
                        </div>
                    </div>

                    <div className="text-white text-xs mb-4">
                        <div className="grid grid-cols-2 gap-1">
                            <div>💎💎💎 = 1000</div><div>🎰🎰🎰 = 500</div>
                            <div>⭐⭐⭐ = 250</div><div>🔔🔔🔔 = 100</div>
                            <div>🍇🍇🍇 = 75</div><div>🍊🍊🍊 = 50</div>
                            <div>🍋🍋🍋 = 25</div><div>🍒🍒🍒 = 10</div>
                        </div>
                    </div>
                </div>
            </div>

            {!spinning && !showResult && (
                <button
                    onClick={spinSlots}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg hover:from-red-600 hover:to-pink-600 transition-all text-xl"
                >
                    SPIN SLOTS
                </button>
            )}

            {spinning && (
                <button
                    disabled
                    className="px-8 py-3 bg-gray-500 text-white font-bold rounded-lg opacity-50 cursor-not-allowed text-xl"
                >
                    SPINNING...
                </button>
            )}

            {!spinning && showResult && (
                <div className="flex space-x-4">
                    <button
                        onClick={spinSlots}
                        className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg hover:from-red-600 hover:to-pink-600 transition-all text-xl"
                    >
                        SPIN AGAIN
                    </button>
                    <button
                        onClick={resetSlots}
                        className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-all"
                    >
                        RESET
                    </button>
                </div>
            )}

            {spinning && (
                <div className="flex space-x-4 text-sm">
                    {reelStopped.map((stopped, index) => (
                        <div key={index} className={`px-3 py-1 rounded ${stopped ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                            Reel {index + 1}: {stopped ? 'STOPPED' : 'SPINNING'}
                        </div>
                    ))}
                </div>
            )}

            {showResult && result && (
                <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-yellow-400 animate-pulse">
                        {result.payout > 0 ? `JACKPOT! WON ${result.payout} COINS!` : 'TRY AGAIN!'}
                    </div>
                    <button
                        onClick={resetSlots}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Reset Slots
                    </button>
                </div>
            )}

            <button
                onClick={() => setCurrentGame('menu')}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
                Back to Menu
            </button>
        </div>
    );
};