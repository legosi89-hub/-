import React from 'react';
import { motion } from 'motion/react';
import { Lightbulb, Volume2, Zap, Play, Trophy } from 'lucide-react';
import { GameLevel } from '../types';

interface MenuScreenProps {
  onSelectLevel: (level: GameLevel, isMarathon: boolean) => void;
  onViewLeaderboard: () => void;
}

export const MenuScreen = ({ onSelectLevel, onViewLeaderboard }: MenuScreenProps) => {
  const levels = [
    { id: 'light', title: 'УСТАНОВКА СВЕТА', icon: Lightbulb, desc: 'Настройка DMX-прожекторов' },
    { id: 'sound', title: 'НАСТРОЙКА ЗВУКА', icon: Volume2, desc: 'Калибровка частот микшера' },
    { id: 'show', title: 'СИНХРОНИЗАЦИЯ', icon: Zap, desc: 'Синхронизация волнового сигнала' },
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-4xl py-4 sm:py-10 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-16"
      >
        <p className="text-accent font-mono text-[10px] sm:text-sm tracking-[0.4em] uppercase mb-2 sm:mb-4">ВЫБЕРИТЕ РЕЖИМ РАБОТЫ</p>
        <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter text-white mb-2 uppercase">ЦЕНТР УПРАВЛЕНИЯ</h2>
        <div className="h-1 w-20 sm:w-32 bg-accent shadow-neon mx-auto" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 w-full max-h-[60vh] overflow-y-auto md:overflow-visible pr-2 sm:pr-0">
        {/* Main Marathon Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSelectLevel('light', true)}
          className="col-span-1 md:col-span-2 group relative overflow-hidden hud-border p-8 sm:p-12 bg-accent text-bg-dark flex flex-col items-center justify-center transition-all shadow-neon screen-effect !rounded-none min-h-[150px] sm:min-h-[200px] border-4 border-white/20"
        >
          <motion.div 
            animate={{ 
              boxShadow: ['0 0 20px rgba(251,217,94,0.4)', '0 0 40px rgba(251,217,94,0.7)', '0 0 20px rgba(251,217,94,0.4)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 z-[-1]"
          />
          <div className="absolute inset-0 bg-accent group-hover:bg-accent-hover transition-colors z-[-1]" />
          <Play size={48} className="mb-2 sm:mb-4 sm:size-16 fill-current drop-shadow-2xl animate-pulse" />
          <h3 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter mb-1 sm:mb-2 drop-shadow-md">ИГРАТЬ ЗА СКИДКУ</h3>
          <p className="text-bg-dark font-mono text-[10px] sm:text-sm font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase opacity-90 text-center bg-black/5 px-4 py-1">ПОЛУЧИТЕ ПРОМОКОД НА АРЕНДУ СВЕТА И ЗВУКА</p>
          
          {/* Reflective shine */}
          <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-45deg] group-hover:left-[150%] transition-all duration-1000 ease-in-out" />
        </motion.button>

        {/* Individual Levels */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {levels.map((level, idx) => (
            <motion.button
              key={level.id}
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                boxShadow: '0 0 30px rgba(251,217,94,0.15)'
              }}
              animate={{
                boxShadow: ['0 0 10px rgba(251,217,94,0)', '0 0 15px rgba(251,217,94,0.1)', '0 0 10px rgba(251,217,94,0)']
              }}
              transition={{ duration: 3, repeat: Infinity }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectLevel(level.id as GameLevel, false)}
              className="hud-border p-8 bg-black/40 hover:bg-black/60 flex flex-col items-center text-center gap-4 transition-all group screen-effect"
            >
              <div className="w-14 h-14 rounded-full bg-bg-dark/80 border border-white/10 flex items-center justify-center text-accent group-hover:text-white group-hover:border-accent group-hover:shadow-neon transition-all">
                <level.icon size={24} />
              </div>
              <div>
                <div className="text-[10px] text-accent/40 font-mono mb-2 tracking-[0.3em]">0{idx + 1} // МОДУЛЬ</div>
                <h4 className="text-xl font-bold italic uppercase tracking-tighter text-white/90 group-hover:text-accent transition-colors">{level.title}</h4>
                <p className="text-[10px] text-white/30 font-mono uppercase mt-2 leading-relaxed">{level.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-8 sm:mt-16 flex flex-col items-center gap-6">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewLeaderboard}
          className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] sm:text-xs font-mono text-accent uppercase tracking-[0.4em] hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
        >
          <Trophy size={14} className="group-hover:rotate-12 transition-transform" /> 
          <span>НАШИ ЧЕМПИОНЫ</span>
        </motion.button>
        
        <div className="flex gap-6 opacity-30">
          <div className="text-[8px] font-mono uppercase tracking-[0.2em]">Готов к работе</div>
          <div className="text-[8px] font-mono uppercase tracking-[0.2em]">•</div>
          <div className="text-[8px] font-mono uppercase tracking-[0.2em]">Все системы в норме</div>
          <div className="text-[8px] font-mono uppercase tracking-[0.2em]">•</div>
          <div className="text-[8px] font-mono uppercase tracking-[0.2em]">Stage Master OS</div>
        </div>
      </div>
    </div>
  );
};
