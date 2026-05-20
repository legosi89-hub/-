import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface KnobProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
  size?: number;
}

export const Knob = ({ label, min, max, value, onChange, size = 120 }: KnobProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const knobRef = useRef<HTMLDivElement>(null);

  const angle = ((value - min) / (max - min)) * 270 - 135;

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !knobRef.current) return;

    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    
    let deg = Math.atan2(dy, dx) * (180 / Math.PI);
    deg = (deg + 90 + 360) % 360; 
    
    let knobDeg = deg - 180;
    if (knobDeg < -180) knobDeg += 360;
    
    if (knobDeg < -135) knobDeg = -135;
    if (knobDeg > 135) knobDeg = 135;
    
    const newValue = ((knobDeg + 135) / 270) * (max - min) + min;
    onChange(newValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col items-center gap-2 p-3 bg-[#111] rounded border-2 border-white/5 shadow-inner screen-effect w-full h-full justify-between overflow-hidden">
      <div className="text-[7px] font-mono font-black text-white/40 italic bg-black/40 px-3 py-0.5 border border-white/5 uppercase tracking-[0.4em] shadow-xl z-20 w-full text-center">
        {label}_ДИСК
      </div>
      
      <div className="flex items-center gap-2 w-full justify-center flex-1">
        <div 
          ref={knobRef}
          className="relative cursor-pointer select-none touch-none"
          style={{ width: size, height: size }}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          {/* Background Track with more industrial look */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
             <circle 
               cx="50" cy="50" r="44" 
               fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="10"
               strokeDasharray="208" strokeDashoffset="0"
             />
             <circle 
               cx="50" cy="50" r="44" 
               fill="none" stroke="#FBD95E" strokeWidth="3"
               strokeDasharray="208" 
               strokeDashoffset={208 - (208 * 0.75 * ((value - min) / (max - min)))}
               className="transition-all duration-300 shadow-neon opacity-40"
               style={{ strokeLinecap: 'butt' }}
             />
          </svg>

          {/* Knob Body (Industrial Heavy Look) */}
          <div 
            className="absolute inset-2 bg-gradient-to-br from-[#222] via-[#111] to-[#050505] rounded-full border-[6px] border-[#333] shadow-[0_10px_30px_rgba(0,0,0,1)] flex items-center justify-center group"
            style={{ transform: `rotate(${angle}deg)` }}
          >
             {/* Brushed metal texture overlay */}
             <div className="absolute inset-0 rounded-full opacity-20 pointer-events-none" 
                  style={{ backgroundImage: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.1), transparent 25%, rgba(255,255,255,0.1), transparent 50%, rgba(255,255,255,0.1), transparent 75%, rgba(255,255,255,0.1), transparent)' }} />

             {/* Inner circle with more depth */}
             <div className="w-1/2 h-1/2 rounded-full border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] flex items-center justify-center bg-[#080808]">
                <div className="w-1/3 h-1/3 bg-accent/10 rounded-full blur-[2px]" />
             </div>
             
             {/* Industrial Spoke (Crank) */}
             <div className="absolute top-1 bottom-1 w-1.5 bg-gradient-to-b from-white/10 to-transparent rounded-full z-0 opacity-40" />

             {/* The Handle / Crank Tip - Proximity to edge like a real crank */}
             <div className="absolute top-2 w-5 h-5 bg-[#1a1a1a] rounded-full shadow-2xl border-2 border-[#444] transition-transform group-hover:scale-110">
                <div className="absolute inset-1.5 bg-accent/60 rounded-full shadow-neon" />
                <div className="absolute top-1 left-1 w-1 h-1 bg-white/20 rounded-full" />
             </div>
             
             {/* Grip Marks (More subtle, industrial) */}
             {[...Array(24)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute w-[1px] h-1.5 bg-white/5" 
                  style={{ transform: `rotate(${i * 15}deg) translateY(-32px)` }}
                />
             ))}
          </div>
        </div>
      </div>

      <div className="w-full bg-black/60 border border-white/5 rounded px-3 py-1.5 mt-1">
         <div className="flex justify-between items-center">
            <span className="text-[6px] font-mono text-white/20 uppercase tracking-tight">Состояние Синх.</span>
            <span className="text-accent text-[9px] font-mono font-bold tracking-widest">{value.toFixed(1)}</span>
         </div>
      </div>
    </div>
  );
};
