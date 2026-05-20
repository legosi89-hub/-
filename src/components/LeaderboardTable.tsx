import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getTopScores, LeaderboardEntry } from '../lib/scores';
import { Trophy, Clock } from 'lucide-react';

export const LeaderboardTable = ({ level }: { level: string }) => {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = () => {
      setLoading(true);
      const data = getTopScores(level);
      setScores(data);
      setLoading(false);
    };
    fetchScores();
  }, [level]);

  return (
    <div className="w-full hud-border bg-black/40 rounded-sm overflow-hidden flex flex-col min-h-0 border-2 border-white/5 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <div className="bg-white/5 px-4 py-2 flex justify-between items-center border-b border-white/5">
         <span className="text-[10px] font-mono font-black text-accent uppercase tracking-[0.2em]">{level.toUpperCase()} // РЕКОРДЫ</span>
         <Trophy size={12} className="text-accent/40 animate-pulse" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono">
         {loading ? (
            <div className="h-40 flex items-center justify-center gap-3">
               <div className="w-2 h-2 bg-accent animate-ping" />
               <span className="text-[10px] text-accent/40 uppercase tracking-[0.5em] italic">ЗАГРУЗКА...</span>
            </div>
         ) : scores.length === 0 ? (
            <div className="h-40 flex items-center justify-center flex-col gap-2 opacity-10 grayscale">
               <Clock size={32} />
               <span className="text-[10px] uppercase tracking-widest text-center px-4 leading-relaxed">
                  ДАННЫЕ ОТСУТСТВУЮТ
               </span>
            </div>
         ) : (
            <div className="flex flex-col gap-2">
               {scores.map((score, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={idx} 
                    className={`flex items-center justify-between py-2 border-b border-white/5 last:border-0 group ${idx === 0 ? 'text-accent' : 'text-white/60'}`}
                  >
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold opacity-30 w-5">
                           {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="flex flex-col">
                           <span className={`text-sm font-black tracking-[0.2em] group-hover:translate-x-1 transition-transform`}>
                              {score.name}
                           </span>
                           <span className="text-[7px] opacity-30 uppercase">
                              {new Date(score.createdAt).toLocaleDateString()}
                           </span>
                        </div>
                     </div>
                     
                     <div className="text-right">
                        <span className="text-xs font-black tracking-widest">
                           {score.time.toFixed(2)}s
                        </span>
                     </div>
                  </motion.div>
               ))}
            </div>
         )}
      </div>

      <div className="p-3 bg-black border-t border-white/5 flex justify-between items-center text-[7px] font-mono">
         <div className="flex items-center gap-2">
            <span className="text-green-500">●</span>
            <span className="text-white/30 uppercase tracking-[0.3em]">SECURE_LINK_ESTABLISHED</span>
         </div>
         <span className="text-white/10 uppercase italic">v1.0.4-LDR</span>
      </div>
    </div>
  );
};
