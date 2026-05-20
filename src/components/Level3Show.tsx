import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, CheckCircle, Zap } from 'lucide-react';

const Touchpad = ({ value, onChange, label }: { value: number, onChange: (val: number) => void, label: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const trailRef = useRef<{ x: number, y: number, life: number, size: number }[]>([]);

  const updatePhase = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const newVal = (x / rect.width) * 628;
    onChange(newVal);
  }, [onChange]);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    updatePhase(clientX);
  };

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        trailRef.current.push({ 
            x: clientX - rect.left, 
            y: clientY - rect.top, 
            life: 1.0,
            size: 8 // Starting thickness
        });
    }
    updatePhase(clientX);
  }, [isDragging, updatePhase]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    } else {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  // Trail Animation logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update trail
      trailRef.current = trailRef.current
        .map(p => ({ ...p, life: p.life - 0.02, size: p.size * 0.96 }))
        .filter(p => p.life > 0 && p.size > 0.5);

      if (trailRef.current.length > 0) {
        for (let i = 0; i < trailRef.current.length; i++) {
          const pt = trailRef.current[i];
          ctx.beginPath();
          ctx.fillStyle = '#FBD95E';
          ctx.globalAlpha = pt.life * 0.4;
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;
      }

      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  const percent = (value / 628) * 100;

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <div className="flex justify-between items-center px-1">
         <span className="text-[7px] font-mono font-bold text-accent italic uppercase tracking-widest opacity-70">{label}</span>
         <span className="text-[9px] font-mono text-white/40">{(value / 10).toFixed(0)}%</span>
      </div>
      <div 
        ref={containerRef}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        className="relative flex-1 bg-black/60 rounded border-2 border-white/5 shadow-inner cursor-crosshair overflow-hidden touch-none group"
      >
        <canvas 
          ref={canvasRef}
          width={300}
          height={150}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        {/* Position Indicator */}
        <motion.div 
          animate={{ left: `${percent}%` }}
          className="absolute top-0 bottom-0 w-px bg-accent/40 shadow-neon z-10"
        />
        
        {/* Visual feedback text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
           <span className="text-[10px] font-mono text-accent/30 tracking-[0.5em] uppercase italic">ТАЧПАД_АКТИВЕН</span>
        </div>
      </div>
    </div>
  );
};

export const Level3Show = ({ onComplete, onBackToMenu }: { onComplete: (time: number) => void, onBackToMenu: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [completed, setCompleted] = useState(false);
  const [canFinish, setCanFinish] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!completed) {
      const interval = setInterval(() => setTime(t => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [completed]);

  const [player, setPlayer] = useState({
    amp: 40,
    freq: 3,
    phase: 0
  });

  const [target, setTarget] = useState({
    amp: 80,
    freq: 5,
    phase: 150
  });

  const resetLevel = () => {
    setPlayer({
      amp: 20 + Math.random() * 40,
      freq: 2 + Math.random() * 4,
      phase: Math.random() * 300
    });
    setTarget({
      amp: 80 + Math.random() * 40,
      freq: 5 + Math.random() * 3,
      phase: 100 + Math.random() * 400
    });
    setCompleted(false);
    setCanFinish(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const drawBackgroundGrid = () => {
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const drawTargetWave = () => {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(251, 217, 94, 0.2)';
      ctx.lineWidth = 4;
      for (let x = 0; x < canvas.width; x++) {
        // Wider calculation
        const y = canvas.height / 2 + Math.sin(x * 0.005 * target.freq + target.phase * 0.01) * (target.amp * 1.5);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const drawPlayerWave = () => {
      ctx.beginPath();
      ctx.strokeStyle = '#FBD95E';
      ctx.lineWidth = 6;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#FBD95E';
      for (let x = 0; x < canvas.width; x++) {
        // Wider calculation
        const y = canvas.height / 2 + Math.sin(x * 0.005 * player.freq + player.phase * 0.01) * (player.amp * 1.5);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset for other drawings
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackgroundGrid();
      drawTargetWave();
      drawPlayerWave();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [player, target]);

  const diffAmp = Math.abs(player.amp - target.amp);
  const diffFreq = Math.abs(player.freq - target.freq);
  const diffPhase = Math.abs(player.phase - target.phase);
  
  const confidence = Math.round(100 - (diffFreq * 10 + diffAmp * 0.5 + diffPhase * 0.1));
  const progress = Math.max(0, Math.min(100, confidence));

  const isStableSync = progress >= 97;

  useEffect(() => {
    if (completed) return;

    if (isStableSync) {
      const timer = setTimeout(() => {
        setCanFinish(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setCanFinish(false);
    }
  }, [completed, isStableSync]);

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

      <div className="w-full flex justify-between items-center mb-2 px-2 shrink-0">
        <div className="flex flex-col">
          <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-1">МОДУЛЬ: ВОЛНОВАЯ_СИНХРОНИЗАЦИЯ</span>
          <h2 className="text-xl font-black italic text-white tracking-widest leading-none flex items-center gap-2 uppercase">
            <Activity size={20} className="text-accent" /> СИНХРОНИЗАЦИЯ
          </h2>
        </div>
        <button onClick={onBackToMenu} className="text-[9px] bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 uppercase tracking-widest font-mono text-white/40 transition-all">
          ОТКЛЮЧИТЬ_СВЯЗЬ
        </button>
      </div>

      <div className="grid grid-cols-1 shadow-2xl xl:grid-cols-12 gap-3 w-full items-stretch flex-1 min-h-0 overflow-hidden">
        {/* Signal Viewport */}
        <div className="col-span-1 xl:col-span-8 hud-border bg-[#0C0D0F] rounded-sm overflow-hidden relative flex items-center justify-center border-4 border-[#2B2C30] min-h-[300px] xl:min-h-0 screen-effect">
          <div className="flex justify-between items-center absolute top-0 left-0 w-full px-4 py-1.5 bg-black/40 border-b border-white/5 z-50">
            <div className="flex items-center gap-2">
              <Activity size={10} className="text-accent animate-pulse" />
              <span className="text-[8px] font-mono font-bold text-white/50 tracking-[0.2em] uppercase italic">ОСЦИЛЛОГРАФ: OSC_03_SYNC</span>
            </div>
            <div className="flex gap-4">
               <span className="text-[7px] font-mono text-white/20 uppercase tracking-tighter">НАПР: 1.2V</span>
               <span className="text-[7px] font-mono text-white/20 uppercase tracking-tighter">ЧАСТ: {player.freq.toFixed(2)}ГЦ</span>
            </div>
          </div>
          
          <canvas 
            ref={canvasRef}
            width={800}
            height={550}
            className="w-full h-full opacity-80"
          />

          <div className="absolute bottom-4 left-4 z-20 bg-black/80 p-3 border border-white/10 rounded-sm backdrop-blur-md max-w-[200px] pointer-events-none">
             <h4 className="text-accent text-[9px] font-black uppercase tracking-widest mb-1">ИНСТРУКЦИЯ</h4>
             <p className="text-white/60 text-[8px] font-mono uppercase leading-relaxed text-left">
                ИСПОЛЬЗУЙТЕ СЛАЙДЕРЫ И ТАЧПАД, ЧТОБЫ СОВМЕСТИТЬ ЖЕЛТУЮ ВОЛНУ С ФОНОВОЙ. В КОНЦЕ НАЖМИТЕ КНОПКУ "СОХРАНИТЬ РЕЗУЛЬТАТ".
             </p>
          </div>

          {/* Guidelines / Grid */}
          <div className="absolute inset-0 pointer-events-none border border-white/5 flex flex-col justify-around">
            {[...Array(5)].map((_, i) => <div key={i} className="w-full h-[1px] bg-white/5" />)}
          </div>
          <div className="absolute inset-0 pointer-events-none flex justify-around">
            {[...Array(8)].map((_, i) => <div key={i} className="h-full w-[1px] bg-white/5" />)}
          </div>

          <div className="absolute top-12 right-4 flex flex-col items-end gap-1 z-50">
            <div className={`px-2 py-0.5 rounded-sm border font-mono text-[8px] italic font-bold tracking-widest ${completed ? 'bg-green-500/20 border-green-500 text-green-500 shadow-neon' : 'bg-accent/10 border-accent/40 text-accent/60 animate-pulse'}`}>
               {completed ? 'СИГНАЛ_ЗАХВАЧЕН' : 'ОЖИДАНИЕ_СИНХ...'}
            </div>
            <div className="text-[8px] text-white/20 font-mono tracking-tighter uppercase p-1 bg-black/60 rounded border border-white/5 backdrop-blur-sm">Точность: {progress}%</div>
          </div>

          {/* Text Overlays */}
          <div className="absolute top-12 left-4 flex flex-col gap-2 z-50 pointer-events-none">
             <div className="flex items-center gap-4 bg-black/80 px-3 py-1.5 border border-white/10 rounded-sm screen-effect">
                <div className="flex flex-col">
                   <span className="text-[6px] font-mono text-white/40 uppercase">Связь_Системы</span>
                   <span className={`text-lg font-mono font-bold leading-none ${time >= 35 ? 'text-red-500' : time >= 20 ? 'text-yellow-500' : 'text-accent'}`}>
                     {time < 10 ? `0${time}` : time}с
                   </span>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex flex-col">
                   <span className="text-[6px] font-mono text-white/40 uppercase">Точность_Синх</span>
                   <span className="text-lg font-mono font-bold leading-none text-accent">{progress}%</span>
                </div>
             </div>
             {time >= 20 && (
                <div className={`px-2 py-0.5 font-mono text-[7px] uppercase font-black border ${time >= 35 ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-yellow-500/20 border-yellow-500 text-yellow-500'}`}>
                  {time >= 35 ? 'СЛИШКОМ ДОЛГО: СИГНАЛ ПОТЕРЯН' : 'БЫСТРЕЕ: ДРЕЙФ СИНХ'}
                </div>
             )}
          </div>

          <div className="absolute bottom-4 left-4 flex flex-col gap-0.5 pointer-events-none">
             <span className="text-[7px] font-mono text-accent/40 font-bold uppercase tracking-widest">Буфер_Синх: АКТИВЕН</span>
             <div className="flex gap-1 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[6px] font-mono text-white/30 uppercase">Сила_Сигнала: 98%</span>
             </div>
          </div>

          <div className="absolute bottom-4 right-4 text-right pointer-events-none">
             <span className="text-[7px] font-mono text-white/10 uppercase block">Блок_Обработки: АЛЬФА-09</span>
             <span className="text-[6px] font-mono text-accent/20 italic">0x44_СИНХ_ЗАХВАЧЕН</span>
          </div>
        </div>

        {/* Unified Output Console (Solid Piece) */}
        <div className="col-span-1 xl:col-span-4 flex flex-col min-h-0 bg-[#1E1F23] rounded-sm shadow-xl border-4 border-[#111] screen-effect overflow-hidden">
          <div className="hud-label !relative !top-0 !left-0 w-full !text-[7px] !bg-black/60">КОНСОЛЬ_УПРАВЛЕНИЯ_V3</div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
             {/* Parameters Section - Vertical Layout */}
             <div className="grid grid-cols-2 gap-4 h-64 shrink-0 mt-2">
                {[
                  { key: 'freq', label: 'ЧАСТОТА', min: 1, max: 10, step: 0.1, val: player.freq },
                  { key: 'amp', label: 'АМПЛИТУДА', min: 10, max: 150, step: 1, val: player.amp }
                ].map(param => {
                  const abs_max = min_max(param.key);
                  const percent = ((param.val - param.min) / (abs_max - param.min)) * 100;

                  return (
                    <div key={param.key} className="flex flex-col gap-3 h-full bg-black/20 p-3 rounded border border-white/5 relative overflow-hidden">
                      <div className="flex justify-between items-center px-1 shrink-0">
                         <div className="text-[7px] font-mono font-bold text-accent italic uppercase tracking-widest opacity-50">{param.label}</div>
                         <div className="text-[8px] font-mono font-bold text-white mb-0.5">{param.val.toFixed(1)}</div>
                      </div>
                      
                      <div className="flex-1 flex justify-center relative my-2">
                         <div className="relative w-3 h-full bg-black/60 rounded border-2 border-white/10 overflow-hidden shadow-inner translate-y-0">
                            <motion.div 
                              className="absolute bottom-0 w-full bg-accent shadow-neon border-t-4 border-white/30"
                              animate={{ height: `${percent}%` }}
                              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                         </div>
                         
                         <input
                           type="range" min={param.min} max={abs_max} step={param.step}
                           value={param.val}
                           onChange={(e) => setPlayer((prev: any) => ({ ...prev, [param.key]: Number(e.target.value) }))}
                           className="appearance-none w-[180px] h-10 bg-transparent cursor-pointer rotate-[-90deg] origin-center absolute top-1/2 -translate-y-1/2 z-10"
                           style={{ WebkitAppearance: 'none' }}
                         />
                      </div>
                    </div>
                  );
                })}
             </div>

             <div className="h-32 mt-2">
                <Touchpad 
                  label="ТАЧПАД СИНХРОНИЗАЦИИ"
                  value={player.phase}
                  onChange={(val) => setPlayer(prev => ({ ...prev, phase: val }))}
                />
             </div>

             {/* Status and Action Section */}
             <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[6px] font-mono text-white/20 uppercase">Состояние_Системы</span>
                        <span className="text-[9px] font-mono font-bold text-accent tracking-widest">АКТИВЕН</span>
                    </div>
                    <div className="text-right">
                        <span className="text-[6px] font-mono text-white/20 uppercase">Точность</span>
                        <span className="text-[9px] font-mono font-bold text-accent tracking-widest">{progress}%</span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                  {completed ? (
                    <motion.div 
                      key="victory"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col gap-2"
                    >
                      <button 
                        onClick={() => onComplete(time)}
                        className="py-3 bg-accent text-bg-dark font-black hover:bg-accent-hover transition-all uppercase tracking-[0.2em] text-[10px] shadow-neon flex items-center justify-center gap-2"
                      >
                        ЗАВЕРШИТЬ МИССИЮ »
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                         <button onClick={resetLevel} className="py-2 bg-white/5 border border-white/10 text-white/60 font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-[8px]">СБРОС</button>
                         <button onClick={onBackToMenu} className="py-2 bg-white/5 border border-white/10 text-white/40 font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-[8px]">МЕНЮ</button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col gap-2">
                       {canFinish && (
                         <motion.button 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           onClick={() => setCompleted(true)}
                           className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black italic uppercase tracking-[0.2em] text-[10px] shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-400 animate-pulse transition-all rounded-sm"
                         >
                           СОХРАНИТЬ РЕЗУЛЬТАТ »
                         </motion.button>
                       )}
                       <div className="grid grid-cols-2 gap-2">
                          <button onClick={resetLevel} className="h-10 bg-black/40 border border-white/10 rounded flex flex-col items-center justify-center hover:bg-white/5 transition-all group">
                            <span className="text-[7px] text-white/30 font-mono mb-0.5 group-hover:text-red-500 transition-colors uppercase">ПЕРЕЗАГРУЗКА</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500/20" />
                          </button>
                          <div className="h-10 bg-black/40 border border-white/10 rounded flex flex-col items-center justify-center">
                            <span className="text-[7px] text-white/30 font-mono mb-0.5 uppercase">АВТО_СИНХ</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-accent/20" />
                          </div>
                       </div>
                    </div>
                  )}
                </AnimatePresence>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 32px;
          height: 32px;
          background: transparent;
          cursor: pointer;
        }
        input[type=range]::-moz-range-thumb {
          width: 32px;
          height: 32px;
          background: transparent;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

const min_max = (key: string) => {
  if (key === 'freq') return 10;
  if (key === 'amp') return 150;
  return 628;
};
