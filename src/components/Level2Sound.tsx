import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, CheckCircle } from 'lucide-react';

interface Fader {
  id: number;
  value: number; // 0 to 100
  target: number;
  label: string;
}

export const Level2Sound = ({ onComplete, onBackToMenu }: { onComplete: (time: number) => void, onBackToMenu: () => void }) => {
  const [faders, setFaders] = useState<Fader[]>([
    { id: 1, value: 20, target: 80, label: 'БАРАБАНЫ' },
    { id: 2, value: 50, target: 40, label: 'СИНТ' },
    { id: 3, value: 80, target: 65, label: 'ВОКАЛ' },
    { id: 4, value: 20, target: 90, label: 'МАСТЕР' },
  ]);

  const [completed, setCompleted] = useState(false);
  const [canFinish, setCanFinish] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!completed) {
      const interval = setInterval(() => setTime(t => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [completed]);

  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 150);
      }
    }, 2000);
    return () => clearInterval(glitchInterval);
  }, []);

  const progressCount = faders.filter(f => Math.abs(f.value - f.target) < 5).length;
  const progress = Math.round((progressCount / faders.length) * 100);

  // Background pulse intensity based on progress
  const pulseScale = 1 + (progress / 200);

  const resetLevel = () => {
    setFaders(prev => prev.map(f => ({
      ...f,
      value: Math.random() * 40 + 10,
      target: Math.random() * 60 + 30
    })));
    setCompleted(false);
    setCanFinish(false);
  };

  const [allFadersMatched, setAllFadersMatched] = useState(false);

  useEffect(() => {
    const isMatched = faders.every(f => Math.abs(f.value - f.target) < 5);
    setAllFadersMatched(isMatched);
  }, [faders]);

  useEffect(() => {
    if (allFadersMatched) {
      const timer = setTimeout(() => {
        setCanFinish(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setCanFinish(false);
    }
  }, [allFadersMatched]);

  return (
    <div className={`flex flex-col items-center w-full max-w-6xl px-2 flex-1 min-h-0 transition-all duration-300 relative ${glitch ? 'invert-[0.05] brightness-125' : ''}`}>
      <AnimatePresence>
        {(completed || canFinish) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-green-500/10 pointer-events-none z-[100] border-[20px] border-green-500/20 mix-blend-overlay"
          />
        )}
      </AnimatePresence>

      {/* Background Pulsing Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ 
            opacity: [0.05, 0.15, 0.05],
            scale: [1, pulseScale, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-accent/10 blur-[150px] rounded-full"
        />
        {progress > 40 && (
           <motion.div 
             animate={{ opacity: [0, 0.1, 0] }}
             transition={{ duration: 0.1, repeat: Infinity, repeatDelay: Math.random() }}
             className="absolute inset-0 bg-white/5 mix-blend-overlay"
           />
        )}
      </div>

      {/* Data stream effect fragments */}
      {progress > 20 && (
        <div className="absolute top-20 left-10 opacity-20 pointer-events-none z-0 hidden lg:block">
           {[...Array(5)].map((_, i) => (
             <motion.div 
               key={i}
               animate={{ y: [0, -100], opacity: [0, 1, 0] }}
               transition={{ duration: 4, repeat: Infinity, delay: i * 0.8 }}
               className="text-[7px] font-mono text-accent/50 whitespace-nowrap mb-1"
             >
                {`0x${(Math.random() * 0xFFFFFF).toString(16).toUpperCase()} SYNC_STATUS_OK`}
             </motion.div>
           ))}
        </div>
      )}

      <div className="w-full grid grid-cols-12 gap-4 items-stretch flex-1 min-h-0 overflow-hidden relative z-10">
        {/* Professional Mixer Console */}
        <div className="col-span-12 lg:col-span-7 hud-border bg-[#1E1F23] rounded-sm flex flex-col p-4 shadow-2xl border-4 border-[#2B2C30] relative min-h-0 screen-effect overflow-hidden">
          {/* Cyber scanline effect */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
          
          {/* Dynamic Light Strips */}
          <div className="absolute top-0 left-0 w-full h-1 flex gap-1 opacity-50">
             {[...Array(10)].map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ opacity: [0.2, 0.8, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                  className="flex-1 h-full bg-accent"
                />
             ))}
          </div>

          <div className="hud-label !bg-[#111] !text-white/30 uppercase !tracking-[0.2em] !text-[7px]">КОНСОЛЬ: АУДИО МИКШЕР v2.0</div>
          
          <div className="flex-1 flex flex-col gap-2 mt-2">
             <div className="flex-1 flex justify-around items-end gap-2 px-2 bg-black/40 rounded-sm border border-white/5 py-4 overflow-hidden relative">
             {/* Removed background text and moved timer */}
            {faders.map(f => {
              const cubes = 12;
              const activeCubes = Math.floor((f.value / 100) * cubes);
              const diff = Math.abs(f.value - f.target);
              const isClose = diff < 5;
              const matchFactor = Math.max(0, 1 - (diff / 40)); // 1 is perfect, 0 is far
              
              const r = Math.round(255 * (1 - matchFactor));
              const g = Math.round(255 * matchFactor);
              
              return (
                <div key={f.id} className="flex flex-col items-center h-full gap-3 group relative flex-1 p-2 bg-black/20 rounded border border-white/5 shadow-inner">
                  {/* Target marker on the track */}
                  <div 
                    className="absolute left-1/2 -translate-x-1/2 w-8 h-[3px] bg-accent/20 border-t border-accent/40 pointer-events-none z-0"
                    style={{ bottom: `calc(${f.target}% * 0.8 + 45px)` }}
                  />

                  <div className="flex flex-col items-center">
                    <div 
                      className="w-2 h-2 rounded-full mb-1 transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                      style={{ 
                        backgroundColor: `rgb(${r}, ${g}, 0)`,
                        boxShadow: isClose ? `0 0 15px rgb(${r}, ${g}, 0)` : 'none'
                      }} 
                    />
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-tighter italic">{f.label}</span>
                  </div>

                  <div className="relative w-1.5 flex-1 bg-black/60 rounded-full border border-white/10 flex justify-center py-4 h-full touch-none">
                     {/* Measurement Lines */}
                     <div className="absolute inset-y-4 left-[-12px] flex flex-col justify-between text-[6px] font-mono text-white/10 select-none items-end w-8 pointer-events-none">
                        {['+12','+6','0','-6','-12','-24','-48','-∞'].map(val => <span key={val}>{val}</span>)}
                     </div>

                    <input
                      type="range" min="0" max="100" value={f.value}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFaders(prev => prev.map(item => item.id === f.id ? { ...item, value: val } : item));
                      }}
                      // standard mixer orientation: rotation -90 makes 100 at top
                      className="appearance-none w-[220px] h-10 bg-transparent rotate-[-90deg] origin-center absolute top-1/2 -translate-y-1/2 cursor-pointer z-10"
                      style={{ WebkitAppearance: 'none' }}
                    />
                    
                    {/* Console Fader Cap (Refined) */}
                    <div 
                      className="absolute w-9 h-12 bg-[#1A1A1A] rounded shadow-2xl z-0 pointer-events-none flex flex-col items-center justify-center border-y-[3px] border-[#333] transition-all duration-300 ease-out"
                      style={{ bottom: `calc(${f.value}% * 0.8 + 10px)` }}
                    >
                       <div className="w-full h-px bg-white/5 mb-0.5" />
                       <div className="w-full h-px bg-accent/40 shadow-neon" />
                       <div className="w-full h-px bg-white/5 mt-0.5" />
                    </div>
                  </div>

                  {/* Segment Indicator - progressively greener */}
                  <div className="w-2.5 h-32 flex flex-col-reverse gap-0.5 justify-start p-0.5 bg-black rounded border border-white/5">
                     {[...Array(cubes)].map((_, idx) => {
                       const isLevelActive = idx < activeCubes;
                       
                       let style = {};
                       if (isLevelActive) {
                         const matchFactor = Math.max(0, 1 - (diff / 40));
                         const r_val = Math.round(255 * (1 - matchFactor));
                         const g_val = Math.round(255 * matchFactor);
                         style = { 
                           backgroundColor: `rgb(${r_val}, ${g_val}, 0)`,
                           boxShadow: isClose ? `0 0 8px rgba(${r_val}, ${g_val}, 0, 0.4)` : 'none'
                         };
                       }

                       return (
                         <div 
                            key={idx} 
                            style={style}
                            className={`flex-1 w-full rounded-[1px] transition-all duration-300 ${!isLevelActive ? 'bg-white/5' : ''}`} 
                         />
                       );
                     })}
                  </div>

                  <motion.div 
                    initial={false}
                    animate={{ opacity: 1, scale: 1 }}
                    key={`sound-${f.value}`}
                    className="text-[9px] font-mono font-bold text-accent bg-black border border-white/5 w-full text-center py-0.5 shadow-inner rounded-sm"
                  >
                    {f.value.toFixed(0)} dB
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Console Side Panel */}
        <div className="col-span-5 flex flex-col gap-3 min-h-0">
          <div className="flex-1 hud-border p-4 bg-[#26272B] rounded-sm shadow-xl flex flex-col border-2 border-[#111] screen-effect relative">
            <div className="hud-label !text-[7px]">КОНСОЛЬ: МОНИТОР СИГНАЛА</div>
            
            <div className="flex-1 flex flex-col gap-3 py-2 mt-2">
               {/* Animated VU Meter */}
               <div className="flex-1 bg-black/60 rounded border border-white/5 p-4 flex flex-col justify-between relative overflow-hidden group">
                  {/* Glass reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                  
                  {/* Dynamic Grid Background */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                       style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '15px 15px' }} />

                  {/* Integrated Timer and Match stats */}
                  <div className="flex justify-between items-start z-10">
                    <div className="flex flex-col">
                       <span className="text-[8px] font-mono text-white/50 uppercase tracking-widest leading-tight">Главная Синхронизация</span>
                       <div className="flex items-baseline gap-2">
                          <span className={`text-2xl font-mono font-bold ${time >= 35 ? 'text-red-500 animate-pulse' : 'text-accent'}`}>{time}С</span>
                          <span className="text-white/20 text-[10px] font-mono italic">прошло</span>
                       </div>
                    </div>
                    <div className="flex flex-col items-end">
                       <div className="flex gap-1 mb-1">
                          {[...Array(4)].map((_, i) => (
                             <motion.div 
                               key={i} 
                               animate={{ opacity: [1, 0.2, 1] }}
                               transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                               className={`w-1 h-1 rounded-full ${progress > 75 ? 'bg-green-500' : 'bg-accent/40'}`}
                             />
                          ))}
                       </div>
                       <span className="text-[8px] font-mono text-accent/60 uppercase tracking-widest leading-tight">Точность Совпадения</span>
                       <span className="text-2xl font-mono font-bold text-accent">{progress}%</span>
                    </div>
                  </div>

                  {time >= 20 && (
                    <div className="absolute top-16 left-4 z-20">
                       <motion.div 
                         initial={{ opacity: 0, scale: 0.9 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className={`px-3 py-1 font-mono text-[9px] uppercase font-black border ${time >= 35 ? 'bg-red-500/30 border-red-500 text-red-500 animate-pulse' : 'bg-yellow-500/20 border-yellow-500 text-yellow-500'} shadow-2xl backdrop-blur-sm`}
                       >
                         {time >= 35 ? 'КРИТИЧЕСКИ: СИГНАЛ ПОТЕРЯН' : 'ПРЕДУПРЕЖДЕНИЕ: ДРЕЙФ СИНХ'}
                       </motion.div>
                    </div>
                  )}

                  <div className="flex-1 flex items-end gap-1 px-1 mt-4 relative">
                     {/* Horizontal guideline */}
                     <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 pointer-events-none" />
                     
                     {[...Array(32)].map((_, i) => {
                       // Accuracy determines if it's "even" and green
                       const jitter = (completed || canFinish) ? 0 : (100 - progress);
                       const barHeight = 30 + (Math.random() * 50) - (jitter / 4);
                       
                       return (
                        <motion.div 
                          key={i}
                          animate={{ 
                            height: (completed || canFinish) ? '80%' : [`${barHeight}%`, `${barHeight + 15}%`, `${barHeight - 10}%`] 
                          }}
                          transition={{ duration: 0.1, repeat: Infinity, repeatType: 'reverse' }}
                          className={`flex-1 rounded-t-[1px] transition-colors duration-300 ${
                            (completed || canFinish) 
                              ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' 
                              : (i > 24 ? 'bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.4)]' : i > 18 ? 'bg-yellow-500/80' : 'bg-accent/60 shadow-[0_0_10px_rgba(251,217,94,0.3)]')
                          }`}
                        />
                       );
                     })}
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                     <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[6px] font-mono text-white/40 uppercase">
                           <span>Лев_КАН</span>
                           <span>-3.2 dB</span>
                        </div>
                        <div className="h-1 bg-black rounded-full overflow-hidden border border-white/5">
                           <motion.div animate={{ width: '85%' }} className="h-full bg-accent shadow-neon" />
                        </div>
                     </div>
                     <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[6px] font-mono text-white/40 uppercase">
                           <span>Прав_КАН</span>
                           <span>-2.8 dB</span>
                        </div>
                        <div className="h-1 bg-black rounded-full overflow-hidden border border-white/5">
                           <motion.div animate={{ width: '82%' }} className="h-full bg-accent shadow-neon" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="hud-border bg-[#1A1B1E] rounded-sm shadow-xl flex flex-col border-2 border-[#111] overflow-hidden screen-effect">
            <AnimatePresence mode="wait">
              {completed ? (
                <motion.div 
                  key="victory"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="p-4 flex flex-col items-center text-center bg-accent/5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Music size={16} className="text-accent" />
                    <h3 className="text-sm font-black italic text-accent tracking-tighter uppercase font-mono">ЗВУК ГОТОВ</h3>
                  </div>
                  
                  <p className="text-white/40 font-mono text-[8px] uppercase tracking-widest mb-4">
                    Аудио-система откалибрована. <br/>Сигнал стабилен.
                  </p>

                  <div className="grid grid-cols-1 gap-2 w-full">
                    <button 
                      onClick={() => onComplete(time)}
                      className="py-2.5 bg-accent text-bg-dark font-black hover:bg-accent-hover transition-all uppercase tracking-widest text-[9px] shadow-neon flex items-center justify-center gap-2"
                    >
                      Далее »
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                       <button 
                         onClick={resetLevel}
                         className="py-2 bg-white/5 border border-white/10 text-white/60 font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-[8px]"
                       >
                         Заново
                       </button>
                       <button 
                         onClick={onBackToMenu}
                         className="py-2 bg-white/5 border border-white/10 text-white/40 font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-[8px]"
                       >
                         В меню
                       </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="status"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 flex flex-col"
                >
                  <div className="hud-label !relative !top-0 !left-0 mb-3 scale-75 origin-left !text-[7px]">МАСТЕР СЕКЦИЯ</div>
                  
                  <div className="bg-black/40 border border-white/5 p-3 rounded-sm mb-3">
                     <h4 className="text-accent text-[8px] font-black uppercase tracking-widest mb-1">ИНСТРУКЦИЯ</h4>
                     <p className="text-white/40 text-[7px] font-mono uppercase leading-tight italic text-left">
                        УСТАНОВИТЕ ВСЕ СЛАЙДЕРЫ В СООТВЕТСТВИИ С ЦВЕТНЫМИ МЕТКАМИ. В КОНЦЕ НАЖМИТЕ КНОПКУ "СОХРАНИТЬ РЕЗУЛЬТАТ".
                     </p>
                  </div>

                  <div className="min-h-[60px] flex items-center justify-center mb-2">
                    {canFinish && !completed && (
                      <motion.button 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setCompleted(true)}
                        className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black italic uppercase tracking-[0.2em] text-xs shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-400 animate-pulse transition-all rounded-sm"
                      >
                        СОХРАНИТЬ РЕЗУЛЬТАТ »
                      </motion.button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                     {[
                       { label: 'PFL', active: 'bg-accent' },
                       { label: 'MUTE', active: 'bg-red-500' },
                       { label: 'SOLO', active: 'bg-yellow-500' },
                       { label: 'LIMIT', active: 'bg-green-500' }
                     ].map(btn => (
                       <button key={btn.label} className="h-10 bg-black/40 border border-white/5 rounded flex flex-col items-center justify-center hover:bg-white/5 transition-all">
                          <span className="text-[7px] text-white/30 font-mono mb-1">{btn.label}</span>
                          <div className={`w-2 h-2 bg-white/5 rounded-full border border-white/5 ${completed ? btn.active + ' shadow-neon' : ''}`} />
                       </button>
                     ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 50px;
          height: 100px;
          background: transparent;
          cursor: pointer;
        }
        input[type=range]::-moz-range-thumb {
          width: 50px;
          height: 100px;
          background: transparent;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};
