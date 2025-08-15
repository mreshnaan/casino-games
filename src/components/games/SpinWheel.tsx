import React, { useState, useRef } from 'react';
import type { GameType, WheelSegment, SpinResult } from './types';
interface SpinWheelProps {
    setCurrentGame: (game: GameType) => void;
    setResult: (result: SpinResult | null) => void;
    setShowResult: (show: boolean) => void;
    showResult: boolean;
    result: SpinResult | null;
}

export const SpinWheel: React.FC<SpinWheelProps> = ({
    setCurrentGame,
    setResult,
    setShowResult,
    showResult,
    result
}) => {
    const wheelRef = useRef<SVGSVGElement>(null);
    const [spinning, setSpinning] = useState<boolean>(false);
    const [finalResult, setFinalResult] = useState<SpinResult | null>(null);
    console.log(finalResult)
    const wheelSegments: WheelSegment[] = [
        { value: 100, color: '#ff6b6b', label: '100' },
        { value: 50, color: '#4ecdc4', label: '50' },
        { value: 25, color: '#45b7d1', label: '25' },
        { value: 0, color: '#96ceb4', label: 'LOSE' },
        { value: 200, color: '#ffd93d', label: '200' },
        { value: 75, color: '#ff9ff3', label: '75' },
        { value: 10, color: '#a8e6cf', label: '10' },
        { value: 500, color: '#ff8b94', label: '500' }
    ];

    const simulateBackendCall = (): Promise<SpinResult> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const randomSegment = wheelSegments[Math.floor(Math.random() * wheelSegments.length)];
                resolve(randomSegment);
            }, 100);
        });
    };

    const spinWheel = async (): Promise<void> => {
        if (spinning) return;

        setSpinning(true);
        setShowResult(false);

        const backendResult = await simulateBackendCall();
        setFinalResult(backendResult);

        const segmentAngle = 360 / wheelSegments.length;
        const targetIndex = wheelSegments.findIndex(seg => seg.value === backendResult.value);

        const segmentStartAngle = targetIndex * segmentAngle;
        const segmentCenterAngle = segmentStartAngle + (segmentAngle / 2);

        let targetRotation = 270 - segmentCenterAngle;
        if (targetRotation < 0) targetRotation += 360;

        const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.4;
        const finalRotation = targetRotation + randomOffset;
        const totalRotation = 5 * 360 + finalRotation;

        if (wheelRef.current) {
            wheelRef.current.style.transition = 'transform 4s cubic-bezier(0.23, 1, 0.32, 1)';
            wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
        }

        setTimeout(() => {
            setSpinning(false);
            setShowResult(true);
            setResult(backendResult);
        }, 4000);
    };

    const resetWheel = (): void => {
        if (wheelRef.current) {
            wheelRef.current.style.transition = 'none';
            wheelRef.current.style.transform = 'rotate(0deg)';
        }
        setShowResult(false);
        setResult(null);
        setFinalResult(null);
    };

    return (
        <div className="flex flex-col items-center space-y-6 p-8">
            <div className="relative">
                <div className="relative w-80 h-80">
                    <svg
                        ref={wheelRef}
                        width="320"
                        height="320"
                        viewBox="0 0 320 320"
                        className="drop-shadow-lg"
                    >
                        {wheelSegments.map((segment, index) => {
                            const segmentAngle = 360 / wheelSegments.length;
                            const startAngle = index * segmentAngle;
                            const endAngle = (index + 1) * segmentAngle;

                            const startRad = (startAngle * Math.PI) / 180;
                            const endRad = (endAngle * Math.PI) / 180;

                            const x1 = 160 + 150 * Math.cos(startRad);
                            const y1 = 160 + 150 * Math.sin(startRad);
                            const x2 = 160 + 150 * Math.cos(endRad);
                            const y2 = 160 + 150 * Math.sin(endRad);

                            const largeArcFlag = segmentAngle > 180 ? 1 : 0;
                            const pathData = `M 160 160 L ${x1} ${y1} A 150 150 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                            const textAngle = startAngle + (segmentAngle / 2);
                            const textRad = (textAngle * Math.PI) / 180;
                            const textX = 160 + 100 * Math.cos(textRad);
                            const textY = 160 + 100 * Math.sin(textRad);

                            return (
                                <g key={index}>
                                    <path d={pathData} fill={segment.color} stroke="#fff" strokeWidth="3" />
                                    <text
                                        x={textX}
                                        y={textY}
                                        fill="white"
                                        fontSize="14"
                                        fontWeight="bold"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        {segment.label}
                                    </text>
                                    <text
                                        x={textX}
                                        y={textY + 15}
                                        fill="white"
                                        fontSize="10"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        #{index}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-2 z-10">
                    <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-red-600 drop-shadow-lg"></div>
                    <div className="w-2 h-2 bg-red-600 rounded-full mx-auto mt-1"></div>
                </div>
            </div>

            <button
                onClick={spinWheel}
                disabled={spinning}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {spinning ? 'SPINNING...' : 'SPIN WHEEL'}
            </button>

            {showResult && result && (
                <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-green-500 animate-pulse">
                        {result.value > 0 ? `WON ${result.value} COINS!` : 'BETTER LUCK NEXT TIME!'}
                    </div>
                    <button
                        onClick={resetWheel}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Reset Wheel
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
}