import React from 'react';
import type { GameType } from './games/types';

interface GameMenuProps {
    setCurrentGame: (game: GameType) => void;
}

export const GameMenu: React.FC<GameMenuProps> = ({ setCurrentGame }) => (
    <div className="flex flex-col items-center space-y-8 p-8">
        <h1 className="text-4xl font-bold text-purple-600 mb-8">🎰 Casino Games 🎰</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
                onClick={() => setCurrentGame('wheel')}
                className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
                <div className="text-6xl mb-4">🎡</div>
                <div className="text-2xl font-bold">Spin Wheel</div>
                <div className="text-sm opacity-80">Win up to 500 coins!</div>
            </button>

            <button
                onClick={() => setCurrentGame('slots')}
                className="p-6 bg-gradient-to-br from-yellow-500 to-red-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
                <div className="text-6xl mb-4">🎰</div>
                <div className="text-2xl font-bold">Slot Machine</div>
                <div className="text-sm opacity-80">Hit the jackpot for 1000 coins!</div>
            </button>

            <button
                onClick={() => setCurrentGame('roulette')}
                className="p-6 bg-gradient-to-br from-red-600 to-black text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
                <div className="text-6xl mb-4">🔴</div>
                <div className="text-2xl font-bold">Roulette</div>
                <div className="text-sm opacity-80">Bet on red, black, or numbers!</div>
            </button>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center">
            <h3 className="font-bold text-lg mb-2">How it works:</h3>
            <p className="text-sm text-gray-600">
                Results are predetermined by the server before animation starts.
                The game animates to show the predetermined outcome!
            </p>
        </div>
    </div>
);