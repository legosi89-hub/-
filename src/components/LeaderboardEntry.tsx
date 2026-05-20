import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Send, X } from 'lucide-react';
import { isProfane, sanitizeName } from '../lib/profanity';

interface LeaderboardEntryProps {
  level: string;
  time: number;
  onSave: (name: string) => void;
  onClose: () => void;
}

export const LeaderboardEntry = ({ level, time, onSave, onClose }: LeaderboardEntryProps) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = sanitizeName(name);
    
    if (sanitized.length !== 4) {
      setError('ИМЯ ДОЛЖНО БЫТЬ ИЗ 4 СИМВОЛОВ');
      return;
    }

    if (isProfane(sanitized)) {
      setError('НЕДОПУСТИМОЕ ИМЯ');
      return;
    }

    onSave(sanitized);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md hud-border bg-[#1E1F23] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4 border-[#2B2C30] relative overflow-hidden"
      >
        <div className="hud-label !bg-accent !text-bg-dark">РЕКОРД ЗАФИКСИРОВАН</div>
        
        <div className="absolute top-0 right-0 p-2">
           <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
              <X size={20} />
           </button>
        </div>

        <div className="flex flex-col items-center gap-6 mt-4">
           <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center border-2 border-accent shadow-neon">
              <Trophy size={32} className="text-accent" />
           </div>

            <div className="text-center">
              <h3 className="text-xl font-black italic text-white tracking-widest uppercase mb-1">
                 НОВЫЙ РЕКОРД
              </h3>
              <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest italic">
                 ВАШ РЕЗУЛЬТАТ НЕОБХОДИМО ЗАФИКСИРОВАТЬ
              </p>
           </div>

           <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <div className="relative">
                 <input 
                   autoFocus
                   type="text"
                   value={name}
                   onChange={(e) => {
                      setName(e.target.value.toUpperCase().slice(0, 4));
                      setError('');
                   }}
                   placeholder="ИМЯ"
                   className="w-full bg-black/60 border-2 border-white/10 rounded-sm py-4 text-center text-4xl font-mono font-bold text-accent tracking-[0.5em] focus:border-accent focus:outline-none transition-all placeholder:text-white/5"
                 />
                 <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent/20" />
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 font-mono text-[10px] text-center uppercase tracking-widest"
                >
                  {error}
                </motion.p>
              )}

              <div className="flex flex-col gap-2">
                <button 
                  type="submit"
                  className="w-full py-4 bg-accent text-bg-dark font-black uppercase tracking-[0.3em] italic text-xs hover:bg-accent-hover transition-all shadow-neon flex items-center justify-center gap-2 group"
                >
                  СОХРАНИТЬ РЕЗУЛЬТАТ <Send size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 bg-white/5 text-white/40 font-mono uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
                >
                  [ ОТМЕНИТЬ ]
                </button>
              </div>
           </form>

           <div className="text-[9px] font-mono text-white/10 uppercase tracking-widest text-center mt-2 px-8">
              Вводя имя, вы соглашаетесь на публикацию результата в глобальном списке.
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
