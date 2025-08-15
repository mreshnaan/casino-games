import React, { useState } from 'react';
import type { GameType, RouletteResult, SlotsResult, SpinResult } from './components/games/types';
import { GameMenu } from './components';
import { SpinWheel } from './components/games/SpinWheel';
import { SlotsGame } from './components/games/Slots';
import { RouletteGame } from './components/games/Roulette';

const CasinoGames: React.FC = () => {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');
  const [result, setResult] = useState<SpinResult | SlotsResult | RouletteResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto">
        {currentGame === 'menu' && <GameMenu setCurrentGame={setCurrentGame} />}
        {currentGame === 'wheel' && (
          <SpinWheel
            setCurrentGame={setCurrentGame}
            setResult={setResult}
            setShowResult={setShowResult}
            showResult={showResult}
            result={result as SpinResult}
          />
        )}
        {currentGame === 'slots' && (
          <SlotsGame
            setCurrentGame={setCurrentGame}
            setResult={setResult}
            setShowResult={setShowResult}
            showResult={showResult}
            result={result as SlotsResult}
          />
        )}
        {currentGame === 'roulette' && (
          <RouletteGame
            setCurrentGame={setCurrentGame}
            setResult={setResult}
            setShowResult={setShowResult}
            showResult={showResult}
            result={result as RouletteResult}
          />
        )}
      </div>
    </div>
  );
};

export default CasinoGames;