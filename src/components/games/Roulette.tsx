import React, { useState, useRef } from 'react';
import type { GameType, RouletteNumber, BetOption, RouletteResult } from './types';

interface RouletteGameProps {
    setCurrentGame: (game: GameType) => void;
    setResult: (result: RouletteResult | null) => void;
    setShowResult: (show: boolean) => void;
    showResult: boolean;
    result: RouletteResult | null;
}

export const RouletteGame: React.FC<RouletteGameProps> = ({
    setCurrentGame,
    setResult,
    setShowResult,
    showResult,
    result
}) => {
    const rouletteRef = useRef<SVGSVGElement>(null);
    const [spinning, setSpinning] = useState<boolean>(false);
    const [finalResult, setFinalResult] = useState<RouletteResult | null>(null);
    const [selectedBet, setSelectedBet] = useState<BetOption | null>(null);
    console.log(finalResult)
    const rouletteNumbers: RouletteNumber[] = [
        { number: 0, color: 'green' },
        { number: 32, color: 'red' }, { number: 15, color: 'black' }, { number: 19, color: 'red' },
        { number: 4, color: 'black' }, { number: 21, color: 'red' }, { number: 2, color: 'black' },
        { number: 25, color: 'red' }, { number: 17, color: 'black' }, { number: 34, color: 'red' },
        { number: 6, color: 'black' }, { number: 27, color: 'red' }, { number: 13, color: 'black' },
        { number: 36, color: 'red' }, { number: 11, color: 'black' }, { number: 30, color: 'red' },
        { number: 8, color: 'black' }, { number: 23, color: 'red' }, { number: 10, color: 'black' },
        { number: 5, color: 'red' }, { number: 24, color: 'black' }, { number: 16, color: 'red' },
        { number: 33, color: 'black' }, { number: 1, color: 'red' }, { number: 20, color: 'black' },
        { number: 14, color: 'red' }, { number: 31, color: 'black' }, { number: 9, color: 'red' },
        { number: 22, color: 'black' }, { number: 18, color: 'red' }, { number: 29, color: 'black' },
        { number: 7, color: 'red' }, { number: 28, color: 'black' }, { number: 12, color: 'red' },
        { number: 35, color: 'black' }, { number: 3, color: 'red' }, { number: 26, color: 'black' }
    ];

    const betOptions: BetOption[] = [
        { type: 'red', label: 'Red', payout: 2, color: 'bg-red-500' },
        { type: 'black', label: 'Black', payout: 2, color: 'bg-black' },
        { type: 'even', label: 'Even', payout: 2, color: 'bg-blue-500' },
        { type: 'odd', label: 'Odd', payout: 2, color: 'bg-purple-500' },
        { type: 'low', label: '1-18', payout: 2, color: 'bg-green-500' },
        { type: 'high', label: '19-36', payout: 2, color: 'bg-orange-500' },
    ];

    const simulateBackendCall = (): Promise<RouletteResult> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * rouletteNumbers.length);
                const winningNumber = rouletteNumbers[randomIndex];

                let payout = 0;
                if (selectedBet) {
                    switch (selectedBet.type) {
                        case 'red':
                            payout = winningNumber.color === 'red' ? selectedBet.payout * 10 : 0;
                            break;
                        case 'black':
                            payout = winningNumber.color === 'black' ? selectedBet.payout * 10 : 0;
                            break;
                        case 'even':
                            payout = winningNumber.number !== 0 && winningNumber.number % 2 === 0 ? selectedBet.payout * 10 : 0;
                            break;
                        case 'odd':
                            payout = winningNumber.number !== 0 && winningNumber.number % 2 === 1 ? selectedBet.payout * 10 : 0;
                            break;
                        case 'low':
                            payout = winningNumber.number >= 1 && winningNumber.number <= 18 ? selectedBet.payout * 10 : 0;
                            break;
                        case 'high':
                            payout = winningNumber.number >= 19 && winningNumber.number <= 36 ? selectedBet.payout * 10 : 0;
                            break;
                    }
                }

                resolve({
                    winningNumber,
                    winningIndex: randomIndex,
                    payout,
                    bet: selectedBet
                });
            }, 100);
        });
    };

    const spinRoulette = async (): Promise<void> => {
        if (spinning || !selectedBet) return;

        setSpinning(true);
        setShowResult(false);

        const backendResult = await simulateBackendCall();
        setFinalResult(backendResult);

        const segmentAngle = 360 / rouletteNumbers.length;
        const targetAngle = backendResult.winningIndex * segmentAngle;
        const finalAngle = 360 - targetAngle + (segmentAngle / 2);
        const totalRotation = 1800 + finalAngle;

        if (rouletteRef.current) {
            rouletteRef.current.style.transition = 'transform 4s cubic-bezier(0.23, 1, 0.32, 1)';
            rouletteRef.current.style.transform = `rotate(${totalRotation}deg)`;
        }

        setTimeout(() => {
            setSpinning(false);
            setShowResult(true);
            setResult(backendResult);
        }, 4000);
    };

    const resetRoulette = (): void => {
        if (rouletteRef.current) {
            rouletteRef.current.style.transition = 'none';
            rouletteRef.current.style.transform = 'rotate(0deg)';
        }
        setShowResult(false);
        setResult(null);
        setFinalResult(null);
        setSelectedBet(null);
    };

    return (
        <div className="flex flex-col items-center space-y-6 p-8">
            <div className="mb-6">
                <h3 className="text-white text-lg font-bold mb-4 text-center">Choose Your Bet:</h3>
                <div className="grid grid-cols-3 gap-2">
                    {betOptions.map((bet) => (
                        <button
                            key={bet.type}
                            onClick={() => setSelectedBet(bet)}
                            className={`px-4 py-2 text-white font-bold rounded-lg transition-all border-2 ${selectedBet?.type === bet.type
                                ? 'border-yellow-400 scale-105'
                                : 'border-transparent hover:scale-105'
                                } ${bet.color}`}
                        >
                            {bet.label}
                            <div className="text-xs">Pay {bet.payout}:1</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative">
                <div className="relative w-80 h-80">
                    <svg
                        ref={rouletteRef}
                        width="320"
                        height="320"
                        viewBox="0 0 320 320"
                        className="drop-shadow-lg"
                    >
                        {rouletteNumbers.map((slot, index) => {
                            const angle = (360 / rouletteNumbers.length) * index;
                            const nextAngle = (360 / rouletteNumbers.length) * (index + 1);
                            const x1 = 160 + 150 * Math.cos((angle * Math.PI) / 180);
                            const y1 = 160 + 150 * Math.sin((angle * Math.PI) / 180);
                            const x2 = 160 + 150 * Math.cos((nextAngle * Math.PI) / 180);
                            const y2 = 160 + 150 * Math.sin((nextAngle * Math.PI) / 180);

                            const largeArcFlag = nextAngle - angle > 180 ? 1 : 0;
                            const pathData = `M 160 160 L ${x1} ${y1} A 150 150 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                            const textAngle = angle + (360 / rouletteNumbers.length) / 2;
                            const textX = 160 + 120 * Math.cos((textAngle * Math.PI) / 180);
                            const textY = 160 + 120 * Math.sin((textAngle * Math.PI) / 180);

                            const segmentColor = slot.color === 'red' ? '#dc2626' : slot.color === 'black' ? '#1f2937' : '#059669';

                            return (
                                <g key={index}>
                                    <path d={pathData} fill={segmentColor} stroke="#fff" strokeWidth="2" />
                                    <text
                                        x={textX}
                                        y={textY}
                                        fill="white"
                                        fontSize="12"
                                        fontWeight="bold"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        {slot.number}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-2 z-10">
                    <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-white drop-shadow-lg"></div>
                </div>
            </div>

            <button
                onClick={spinRoulette}
                disabled={spinning || !selectedBet}
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-black text-white font-bold rounded-lg hover:from-red-700 hover:to-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {!selectedBet ? 'SELECT A BET FIRST' : spinning ? 'SPINNING...' : 'SPIN ROULETTE'}
            </button>

            {showResult && result && 'winningNumber' in result && (
                <div className="text-center space-y-4">
                    <div className="text-2xl font-bold text-white">
                        Winning Number: <span className={`${result.winningNumber.color === 'red' ? 'text-red-500' : result.winningNumber.color === 'black' ? 'text-gray-300' : 'text-green-500'}`}>
                            {result.winningNumber.number} {result.winningNumber.color.toUpperCase()}
                        </span>
                    </div>
                    <div className="text-4xl font-bold text-yellow-400 animate-pulse">
                        {result.payout > 0 ? `WON ${result.payout} COINS!` : 'BETTER LUCK NEXT TIME!'}
                    </div>
                    <button
                        onClick={resetRoulette}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Reset Roulette
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