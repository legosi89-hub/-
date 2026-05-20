import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, CheckCircle, Zap } from 'lucide-react';

interface LightSource {
  id: number;
  x: number;
  y: number;
  angle: number;
  targetId: number;
}

interface Target {
  id: number;
  x: number;
  y: number;
  active: boolean;
}

export const Level1Light = ({ onComplete, onBackToMenu }: { onComplete: (time: number) => void, onBackToMenu: () => void }) => {
  const [lights, setLights] = useState<LightSource[]>([
    { id: 1, x: 200, y: 460, angle: -45, targetId: 1 },
    { id: 2, x: 400, y: 460, angle: -90, targetId: 2 },
    { id: 3, x: 600, y: 460, angle: -135, targetId: 3 },
  ]);

  // For beam delay effect
  const [displayAngles, setDisplayAngles] = useState<number[]>([-45, -90, -135]);

  const [targets, setTargets] = useState<Target[]>([
    { id: 1, x: 250, y: 150, active: false },
    { id: 2, x: 400, y: 100, active: false },
    { id: 3, x: 550, y: 150, active: false },
  ]);

  const [time, setTime] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [canFinish, setCanFinish] = useState(false);
  const [allTargetsActive, setAllTargetsActive] = useState(false);

  useEffect(() => {
    if (!completed && isInitialized) {
      const interval = setInterval(() => setTime(t => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [completed, isInitialized]);

  const progress = Math.round((targets.filter(t => t.active).length / targets.length) * 100);

  // Smoothly move display angles towards actual light angles (Significant delay)
  useEffect(() => {
    let animationFrameId: number;
    const updateAngles = () => {
      setDisplayAngles(prev => prev.map((angle, i) => {
        const target = lights[i].angle;
        // Significant delay: 0.03 factor for even more lag as requested
        const diff = target - angle;
        if (Math.abs(diff) < 0.1) return target;
        return angle + diff * 0.03;
      }));
      animationFrameId = requestAnimationFrame(updateAngles);
    };
    animationFrameId = requestAnimationFrame(updateAngles);
    return () => cancelAnimationFrame(animationFrameId);
  }, [lights]);

  // Randomize targets on mount
  const resetLevel = useCallback(() => {
    const randomTargets = [
      { id: 1, x: 150 + Math.random() * 150, y: 80 + Math.random() * 150, active: false },
      { id: 2, x: 350 + Math.random() * 100, y: 80 + Math.random() * 150, active: false },
      { id: 3, x: 500 + Math.random() * 150, y: 80 + Math.random() * 150, active: false },
    ];
    setTargets(randomTargets);
    // Evenly distributed x positions for lights
    setLights([
      { id: 1, x: 200, y: 460, angle: -45, targetId: 1 },
      { id: 2, x: 400, y: 460, angle: -90, targetId: 2 },
      { id: 3, x: 600, y: 460, angle: -135, targetId: 3 },
    ]);
    setDisplayAngles([-45, -90, -135]);
    setCompleted(false);
    setCanFinish(false);
    setAllTargetsActive(false);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    resetLevel();
  }, []);

  const checkCollision = useCallback((lightAngle: number, lightX: number, lightY: number, target: Target) => {
    const dx = target.x - lightX;
    const dy = target.y - lightY;
    const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    const diff = Math.abs(lightAngle - targetAngle);
    const normalizedDiff = diff > 180 ? 360 - diff : diff;
    return normalizedDiff < 5.5;
  }, []);

  useEffect(() => {
    if (!isInitialized || completed) return;

    const newTargets = targets.map((t, i) => {
      const l = lights[i];
      // Use lights[i].angle for logic, displayAngles is just for visuals
      return { ...t, active: checkCollision(l.angle, l.x, l.y, t) };
    });

    if (JSON.stringify(newTargets) !== JSON.stringify(targets)) {
      setTargets(newTargets);
    }

    const allActive = newTargets.every(t => t.active);
    setAllTargetsActive(allActive);
  }, [lights, isInitialized, checkCollision, completed, targets]);

  useEffect(() => {
    if (allTargetsActive) {
      const timer = setTimeout(() => {
        setCanFinish(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setCanFinish(false);
    }
  }, [allTargetsActive]);

  return (
    <div className="flex flex-col items-center w-full max-w-7xl px-2 flex-1 min-h-0 overflow-hidden relative">
      <AnimatePresence>
        {(completed || canFinish) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-green-500/10 pointer-events-none z-[100] border-[20px] border-green-500/20 mix-blend-overlay"
          />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-12 gap-4 w-full items-stretch flex-1 min-h-0 overflow-hidden pb-4">
        {/* Stage Viewport - Styled as a monitor */}
        <div className="col-span-8 hud-border bg-[#090A0C] rounded-sm overflow-hidden relative shadow-2xl border-4 border-[#1A1B1E] flex flex-col min-h-0 screen-effect">
          {/* Moved label to a safer place inside top padding */}
          <div className="flex justify-between items-center px-4 py-2 bg-black/40 border-b border-white/5 relative z-50">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[8px] font-mono font-bold text-white/50 tracking-widest uppercase italic">ТРАНСЛЯЦИЯ: КАМ_01</span>
            </div>
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">00:15:23:09</span>
          </div>
          
          {/* Main Stage Floor */}
          <div className="flex-1 bg-[#0F1012] m-2 relative overflow-hidden border border-white/5 shadow-inner rounded-sm">
             {/* TV Scanlines / Noise simulation */}
             <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-50 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent)]" />
             <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-10" />
             
             {/* Stage Floor Grid */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                  style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

             {/* Screen Overlays: Timer and Progress */}
             <div className="absolute top-4 left-4 flex flex-col gap-1 z-50">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                   <span className="text-[10px] font-mono font-bold text-accent tracking-[0.3em] uppercase">ТРАНСЛЯЦИЯ: КАЛ_С1</span>
                </div>
                <div className="flex items-center gap-4 mt-2 bg-black/80 px-3 py-1.5 border border-white/10 rounded-sm">
                   <div className="flex flex-col">
                      <span className="text-[6px] font-mono text-white/40 uppercase">Время</span>
                      <span className={`text-lg font-mono font-bold leading-none ${time >= 35 ? 'text-red-500' : time >= 20 ? 'text-yellow-500' : 'text-accent'}`}>
                         {time < 10 ? `0${time}` : time}с
                      </span>
                   </div>
                   <div className="w-px h-6 bg-white/10" />
                   <div className="flex flex-col">
                      <span className="text-[6px] font-mono text-white/40 uppercase">Синх.</span>
                      <span className="text-lg font-mono font-bold leading-none text-accent">{progress}%</span>
                   </div>
                </div>
                {time >= 20 && (
                   <motion.div 
                     initial={{ x: -10, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     className="mt-1 px-2 py-0.5 bg-red-500/20 border border-red-500/40 text-red-500 font-mono text-[8px] uppercase font-black"
                   >
                     {time >= 35 ? 'СИНХ_ПОТЕРЯНА' : 'НИЗКАЯ СТАБИЛЬНОСТЬ'}
                   </motion.div>
                )}
             </div>
             
             {/* Mannequins (Targets) */}
             {targets.map((t, i) => {
               const angleRad = displayAngles[i] * (Math.PI / 180);
               const shadowLen = t.active ? 75 : 0;
               const sx = Math.cos(angleRad) * shadowLen;
               const sy = Math.sin(angleRad) * shadowLen;

               return (
                 <div
                   key={t.id}
                   className="absolute flex items-center justify-center pointer-events-none z-20"
                   style={{ left: t.x - 15, top: t.y - 15 }}
                 >
                   <div className="relative">
                      {/* Improved Shadow Cast (No black square, better soft shape) */}
                      <motion.div 
                        animate={{ 
                          x: sx, 
                          y: sy, 
                          opacity: t.active ? 0.75 : 0,
                          scaleX: t.active ? 1.4 : 0.2,
                          scaleY: t.active ? 1 : 0.2,
                          rotate: displayAngles[i] + 90
                        }}
                        className="absolute top-1/2 left-1/2 -ml-6 -mt-8 w-12 h-24 bg-gradient-to-b from-black/90 to-transparent blur-md rounded-full origin-top pointer-events-none -z-10"
                      />

                      <div className={`relative transition-all duration-700 ${t.active ? 'scale-90' : 'scale-75 opacity-70'}`}>
                         {/* Thinner Mannequin Figurine */}
                         <div className={`w-2.5 h-2.5 rounded-full bg-black border-2 transition-colors duration-500 ${t.active ? 'border-accent shadow-[0_0_15px_rgba(251,217,94,0.4)]' : 'border-white/10 shadow-xl'}`} />
                         <div className={`absolute top-2 -left-0.5 w-3.5 h-9 rounded-full bg-black border-2 transition-colors duration-500 ${t.active ? 'border-accent' : 'border-white/10'} shadow-2xl`} />
                         
                         {/* Subtle identification marker */}
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[7px] font-mono text-white/20 tracking-[0.2em] uppercase select-none">
                            БЛОК_{t.id}
                         </div>

                         {/* Status Ring */}
                         <AnimatePresence>
                           {t.active && (
                             <motion.div 
                               initial={{ scale: 0.5, opacity: 0 }}
                               animate={{ scale: 1.5, opacity: 0.15 }}
                               className="absolute -inset-6 border border-accent rounded-full"
                             />
                           )}
                         </AnimatePresence>
                      </div>
                   </div>
                 </div>
               );
             })}

             <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
              <defs>
                <radialGradient id="beamSpreadRev" cx="50%" cy="100%" r="100%">
                  <stop offset="0%" stopColor="#FBD95E" stopOpacity="0.3" />
                  <stop offset="70%" stopColor="#FBD95E" stopOpacity="0" />
                </radialGradient>
              </defs>
              {lights.map((l, i) => {
                const length = 1200;
                const angleRad = displayAngles[i] * (Math.PI / 180);
                const x2 = l.x + length * Math.cos(angleRad);
                const y2 = l.y + length * Math.sin(angleRad);
                
                return (
                  <g key={l.id}>
                    <path
                      d={`M ${l.x} ${l.y} L ${x2 + 130 * Math.sin(angleRad)} ${y2 - 130 * Math.cos(angleRad)} L ${x2 - 130 * Math.sin(angleRad)} ${y2 + 130 * Math.cos(angleRad)} Z`}
                      fill="url(#beamSpreadRev)"
                      style={{ filter: 'blur(30px)', opacity: 0.45 }}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Metal Rack / Truss */}
          <div className="absolute bottom-2 left-2 right-2 h-16 bg-[#111] border border-white/10 z-30 shadow-2xl rounded-sm overflow-hidden">
             <div className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{ backgroundImage: 'repeating-linear-gradient(45deg, #333, #333 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-45deg, #333, #333 1px, transparent 1px, transparent 10px)' }} 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-white/5" />
             <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[3px] bg-[#222] border-y border-white/5" />
          </div>

          {/* Spotlights hanging on truss (Updated to match reference - Pointing from above) */}
          {lights.map((l, i) => (
            <motion.div
              key={l.id}
              className="absolute z-40"
              style={{ left: l.x - 20, top: l.y - 15 }}
              animate={{ rotate: displayAngles[i] + 90 }}
            >
              <div className="relative group flex flex-col items-center">
                {/* Mounting Bracket - More robust from-above feel */}
                <div className="w-10 h-10 border-x-2 border-t-2 border-white/10 rounded-t-lg absolute -top-6 -z-10 bg-gradient-to-b from-[#111] to-transparent" />
                
                {/* Projector Body */}
                <div className="w-12 h-14 bg-gradient-to-b from-[#111] via-[#222] to-[#111] border border-white/10 rounded-sm shadow-2xl relative overflow-hidden flex flex-col items-center">
                   <div className="w-full h-1 bg-accent/20 absolute top-2" />
                   {/* Lens at the bottom pointing down */}
                   <div className="mt-auto mb-2 w-8 h-8 bg-black rounded-full border border-white/5 flex items-center justify-center p-1 shadow-inner">
                      <div className="w-full h-full bg-accent/30 rounded-full blur-[2px]" />
                      <div className="absolute w-2 h-2 bg-white/20 rounded-full blur-[1px] top-1 right-1" />
                   </div>
                   
                   {/* Cooling vents texture */}
                   <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5" />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Scale Rulers (Bottom Decoration) */}
          <div className="absolute bottom-1 w-full flex justify-between px-10 pointer-events-none opacity-20">
             {[...Array(20)].map((_, i) => (
               <div key={i} className={`w-0.5 bg-white ${i % 5 === 0 ? 'h-3' : 'h-1.5'}`} />
             ))}
          </div>
        </div>

        {/* Console: Professional UI Layout */}
        <div className="col-span-4 flex flex-col gap-3 min-h-0">
          <div className="flex-1 hud-border p-5 bg-[#141518] rounded-sm shadow-2xl flex flex-col relative overflow-hidden border-2 border-[#111] screen-effect">
            <div className="hud-label !bg-[#000] !text-white/20 uppercase !tracking-[0.3em] !text-[7px]">РЕДАКТОР АТРИБУТОВ</div>
            
            <div className="flex-1 flex justify-around items-end gap-3 py-4 mt-2 bg-black/20 rounded border border-white/5 shadow-inner">
              {lights.map((l, i) => {
                const percent = ((l.angle + 180) / 180) * 100;
                const cubes = 12;
                const activeCubes = Math.floor((percent / 100) * cubes);
                
                return (
                  <div key={l.id} className="flex flex-col items-center h-full gap-3 relative flex-1 p-2 bg-black/40 rounded border border-white/10 shadow-inner screen-effect">
                    <div className="text-[7px] font-mono font-bold text-accent italic bg-black px-2 py-0.5 border border-accent/10 uppercase tracking-tighter shadow-xl z-10 w-full text-center">КАН_{o_id(l.id)}</div>
                    
                    <div className="flex items-stretch gap-2.5 h-full flex-1 w-full justify-center">
                        <div className="relative w-2 bg-black rounded-full border border-white/5 flex justify-center py-2 h-full touch-none">
                          <input
                            type="range" min="-180" max="0" step="0.1" value={l.angle}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setLights(prev => prev.map(light => light.id === l.id ? { ...light, angle: val } : light));
                            }}
                            className="appearance-none w-[180px] h-8 bg-transparent rotate-[-90deg] origin-center absolute top-1/2 -translate-y-1/2 cursor-pointer z-20"
                            style={{ WebkitAppearance: 'none' }}
                          />
                          
                          <div 
                            className="absolute w-10 h-11 bg-[#111] rounded shadow-2xl z-10 pointer-events-none flex flex-col items-center justify-center border-y-[3px] border-[#333] transition-all duration-300 ease-out"
                            style={{ top: `calc(${100 - percent}% * 0.82 + 5px)` }}
                          >
                           <div className="w-full h-px bg-white/5 mb-0.5" />
                           <div className="w-full h-px bg-accent/40 shadow-neon" />
                           <div className="w-full h-px bg-white/5 mt-0.5" />
                        </div>
                      </div>

                      <div className="w-3 h-full flex flex-col-reverse gap-0.5 justify-start bg-black/60 p-0.5 rounded-sm border border-white/5">
                         {[...Array(cubes)].map((_, idx) => (
                           <div 
                              key={idx} 
                              className={`flex-1 w-full rounded-[1px] transition-all duration-300 ${
                                idx < activeCubes 
                                  ? (idx > (cubes * 0.8) ? 'bg-red-500 shadow-neon' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]') 
                                  : 'bg-white/5'
                              }`} 
                           />
                         ))}
                      </div>
                    </div>

                    <div className="h-4 flex items-center justify-center w-full">
                        <div className="text-[9px] font-mono font-bold text-white bg-black border border-white/10 w-full text-center py-0.5 shadow-inner rounded-sm">
                          {Math.abs(l.angle).toFixed(1)}°
                        </div>
                    </div>
                  </div>
                );
              })}
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
                  className="p-4 flex flex-col items-center text-center bg-accent/5 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle size={16} className="text-accent" />
                    <h3 className="text-sm font-black italic text-accent tracking-tighter uppercase font-mono">ГОТОВО К ШОУ</h3>
                  </div>
                  
                  <p className="text-white/40 font-mono text-[8px] uppercase tracking-widest mb-4">
                    Параметры света в допуске. <br/>Фокусировка завершена.
                  </p>

                  <div className="grid grid-cols-1 gap-2 w-full">
                    <button 
                      onClick={() => onComplete(time)}
                      className="py-2.5 bg-accent text-bg-dark font-black hover:bg-accent-hover transition-all uppercase tracking-widest text-[9px] shadow-neon flex items-center justify-center gap-2"
                    >
                      Следующий этап »
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
                         Меню
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
                  <div className="hud-label !relative !top-0 !left-0 mb-3 scale-75 origin-left opacity-30 !text-[7px]">СИСТЕМНАЯ ТЕЛЕМЕТРИЯ</div>
                  
                  <div className="bg-black/40 border border-white/5 p-3 rounded-sm mb-3">
                     <h4 className="text-accent text-[8px] font-black uppercase tracking-widest mb-1">ИНСТРУКЦИЯ</h4>
                     <p className="text-white/40 text-[7px] font-mono uppercase leading-tight italic text-left">
                        НАПРАВЬТЕ ВСЕ ПРОЖЕКТОРЫ НА СЕНСОРЫ СНИЗУ. ИСПОЛЬЗУЙТЕ СЛАЙДЕРЫ ДЛЯ ПОВОРОТА ЛУЧЕЙ. В КОНЦЕ НАЖМИТЕ КНОПКУ "СОХРАНИТЬ РЕЗУЛЬТАТ".
                     </p>
                  </div>

                  <div className="flex-1 min-h-[50px] flex items-center justify-center">
                    {canFinish && !completed && (
                      <motion.button 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setCompleted(true)}
                        className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black italic uppercase tracking-[0.2em] text-xs shadow-[0_0_20px_rgba(239,68,68,0.4)] border border-red-400 animate-pulse transition-all rounded-sm"
                      >
                        СОХРАНИТЬ РЕЗУЛЬТАТ »
                      </motion.button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                     <div className="h-10 bg-black/40 border border-white/5 rounded-sm flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-accent/5" />
                        <span className="text-[7px] text-white/30 font-mono mb-0.5 uppercase relative z-10">DMX_СИГНАЛ</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-neon relative z-10" />
                     </div>
                     <button onClick={resetLevel} className="h-10 bg-black/40 border border-white/5 rounded-sm flex flex-col items-center justify-center hover:bg-white/5 transition-all relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-all" />
                        <span className="text-[7px] text-white/30 font-mono mb-0.5 uppercase relative z-10">ПЕРЕЗАГРУЗКА</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 border border-blue-500/20 shadow-[0_0_5px_rgba(59,130,246,0.3)] relative z-10" />
                     </button>
                  </div>

                  <div className="flex flex-col gap-2 p-3 bg-black/40 rounded border border-white/10 overflow-hidden relative">
                     <div className="absolute top-0 right-0 p-1 opacity-10">
                        <Zap size={12} className="text-accent" />
                     </div>
                     <div className="flex justify-between items-center text-[7px] font-mono text-white/20 uppercase">
                        <span>ПОТОК ДАННЫХ</span>
                        <span className="text-accent/30 tracking-widest animate-pulse">ТРАНСЛЯЦИЯ</span>
                     </div>
                     <div className="h-1 w-full bg-black rounded-full overflow-hidden relative border border-white/5">
                        <motion.div 
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                          className="h-full w-1/4 bg-accent/50 blur-[2px]"
                        />
                     </div>
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
          width: 48px;
          height: 60px;
          background: transparent;
          cursor: pointer;
        }
        input[type=range]::-moz-range-thumb {
          width: 48px;
          height: 60px;
          background: transparent;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

const o_id = (id: number) => id.toString().padStart(2, '0');
