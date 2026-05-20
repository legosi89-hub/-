import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameLevel } from './types.ts';
import { Level1Light } from './components/Level1Light.tsx';
import { Level2Sound } from './components/Level2Sound.tsx';
import { Level3Show } from './components/Level3Show.tsx';
import { FinalScreen } from './components/FinalScreen.tsx';
import { MenuScreen } from './components/MenuScreen.tsx';
import { Volume2, Lightbulb, Zap, ArrowLeft } from 'lucide-react';

import { saveScore } from './lib/scores.ts';
import { LeaderboardEntry } from './components/LeaderboardEntry.tsx';
import { LeaderboardTable } from './components/LeaderboardTable.tsx';

export default function App() {
  const [currentLevel, setCurrentLevel] = useState<GameLevel>('menu');
  const [completedLevels, setCompletedLevels] = useState<GameLevel[]>([]);
  const [isMarathon, setIsMarathon] = useState(false);
  
  // Leaderboard states
  const [showEntry, setShowEntry] = useState(false);
  const [entryData, setEntryData] = useState<{ level: string; time: number } | null>(null);

  const handleLevelComplete = (time: number) => {
    setCompletedLevels(prev => [...prev, currentLevel]);
    
    // Set data for leaderboard entry
    setEntryData({ level: currentLevel, time });
    setShowEntry(true);
  };

  const proceedAfterEntry = () => {
    setShowEntry(false);
    if (isMarathon) {
      if (currentLevel === 'light') setCurrentLevel('sound');
      else if (currentLevel === 'sound') setCurrentLevel('show');
      else if (currentLevel === 'show') setCurrentLevel('finished');
    } else {
      setCurrentLevel('menu');
    }
  };

  const handleSaveScore = async (name: string) => {
    if (entryData) {
      await saveScore(name, entryData.level, entryData.time);
    }
    proceedAfterEntry();
  };

  const handleStartLevel = (level: GameLevel, marathon: boolean) => {
    setIsMarathon(marathon);
    setCurrentLevel(level);
    if (marathon) setCompletedLevels([]);
  };

  const steps = [
    { id: 'light', icon: Lightbulb, label: 'НАСТРОЙКА ОСВЕЩЕНИЯ' },
    { id: 'sound', icon: Volume2, label: 'АУДИО СИНХРОНИЗАЦИЯ' },
    { id: 'show', icon: Zap, label: 'ШОУ СИНХРОНИЗАЦИЯ' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentLevel);

  return (
    <div className="min-h-screen bg-bg-dark text-white font-sans selection:bg-accent selection:text-bg-dark border-0 sm:border-[8px] border-[#1a1a1c] relative flex flex-col overflow-hidden rhombus-bg">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-accent to-transparent shadow-[0_0_15px_#FBD95E]" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-accent to-transparent shadow-[0_0_15px_#FBD95E]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-10%,#35373E_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10 flex flex-col h-full min-h-screen overflow-y-auto sm:overflow-hidden lg:overflow-hidden">
        {/* Header */}
        <header className="p-4 flex justify-between items-center bg-black/40 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-4">
            {currentLevel !== 'menu' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setCurrentLevel('menu')}
                className="w-8 h-8 border border-white/10 bg-white/5 rounded flex items-center justify-center text-white/40 hover:text-accent hover:border-accent group transition-all"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              </motion.button>
            )}
            <div className="flex flex-col">
              <span className="text-[8px] text-white/40 tracking-[0.3em] uppercase font-mono">СИСТЕМА v1.0.4</span>
              <h1 className="text-lg font-black italic tracking-tighter text-accent leading-none uppercase">ЛАМПОВАЯ АРЕНДА</h1>
            </div>
          </div>
          
          <div className="flex gap-6 items-center">
            {currentLevel !== 'menu' && (
              <div className="text-right">
                <span className="text-[10px] font-mono text-accent/60">
                  {currentLevel === 'finished' ? 'ЗАВЕРШЕНО' : currentStepIndex !== -1 ? `ЭТАП_0${currentStepIndex + 1}` : '--'}
                </span>
              </div>
            )}
            {currentLevel !== 'menu' && currentLevel !== 'finished' && isMarathon && (
              <div className="h-8 px-3 hud-border flex items-center gap-2 border-white/10">
                {steps.map((step) => (
                  <div 
                    key={step.id} 
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      completedLevels.includes(step.id as GameLevel) || currentLevel === step.id 
                        ? 'bg-accent shadow-neon' 
                        : 'bg-white/10'
                    }`} 
                  />
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Level Content */}
        <main className="flex-1 flex flex-col p-4 overflow-y-auto sm:overflow-hidden min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLevel}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl mx-auto min-h-0"
            >
              {currentLevel === 'menu' && (
                <MenuScreen 
                  onSelectLevel={handleStartLevel} 
                  onViewLeaderboard={() => setCurrentLevel('leaderboard')}
                />
              )}
              {currentLevel === 'light' && (
                <Level1Light 
                  onComplete={handleLevelComplete} 
                  onBackToMenu={() => setCurrentLevel('menu')} 
                />
              )}
              {currentLevel === 'sound' && (
                <Level2Sound 
                  onComplete={handleLevelComplete} 
                  onBackToMenu={() => setCurrentLevel('menu')} 
                />
              )}
              {currentLevel === 'show' && (
                <Level3Show 
                  onComplete={handleLevelComplete} 
                  onBackToMenu={() => setCurrentLevel('menu')} 
                />
              )}
              {currentLevel === 'finished' && <FinalScreen />}
              {currentLevel === 'leaderboard' && (
                <div className="w-full max-w-4xl flex flex-col gap-6 h-full overflow-y-auto px-4 py-8">
                   <div className="flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                      <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <h2 className="text-3xl sm:text-4xl font-black italic text-white uppercase tracking-tighter">НАШИ ЧЕМПИОНЫ</h2>
                        <span className="text-[10px] font-mono text-accent/40 uppercase tracking-[0.5em]">ЗАЛ СЛАВЫ</span>
                      </div>
                      <button 
                        onClick={() => setCurrentLevel('menu')}
                        className="px-6 py-2 bg-accent/10 border border-accent/20 rounded-sm text-[10px] font-mono text-accent uppercase tracking-widest hover:bg-accent/20 transition-all shrink-0"
                      >
                        [ ВЕРНУТЬСЯ В МЕНЮ ]
                      </button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12">
                      {['light', 'sound', 'show'].map(lvl => (
                         <div key={lvl} className="h-[450px] flex flex-col">
                            <LeaderboardTable level={lvl} />
                         </div>
                      ))}
                   </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <AnimatePresence>
          {showEntry && entryData && (
            <LeaderboardEntry 
              level={entryData.level}
              time={entryData.time}
              onSave={handleSaveScore}
              onClose={proceedAfterEntry}
            />
          )}
        </AnimatePresence>

        {/* Footer Info */}
        <footer className="p-6 bg-black/60 flex flex-col sm:flex-row justify-between items-center border-t border-white/5 gap-4 sm:gap-0">
          <div className="flex gap-4 items-center overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-white/50 uppercase tracking-wider shrink-0">
              КАДРОВ: 60
            </div>
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-white/50 uppercase tracking-wider shrink-0">
              ЗАДЕРЖКА: 12МС
            </div>
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-white/50 uppercase tracking-wider flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              В ПРЯМОМ ЭФИРЕ
            </div>
          </div>
          
          <div className="text-[10px] font-mono text-white/30 tracking-widest uppercase">
            © {new Date().getFullYear()} ЛАМПОВАЯ АРЕНДА
          </div>
        </footer>
      </div>

      {/* Screen Effects */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.005),rgba(0,0,255,0.01))] bg-[length:100%_2px,3px_100%] opacity-20" />
      </div>
    </div>
  );
}
