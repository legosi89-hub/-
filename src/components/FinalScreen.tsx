import React from 'react';
import { motion } from 'motion/react';
import { Copy, PartyPopper, CheckCircle } from 'lucide-react';

export const FinalScreen = () => {
  const [copied, setCopied] = React.useState(false);
  const promoCode = 'LIGHTSHOW5';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center text-center max-w-2xl w-full px-4 sm:px-10 py-10 overflow-y-auto max-h-full"
    >
      <div className="relative mb-8 sm:mb-12 shrink-0">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-16 opacity-30"
        >
          <div className="w-full h-full border border-dashed border-accent rounded-full" />
        </motion.div>
        
        <div className="w-32 h-32 glass-panel rounded-full shadow-neon relative z-10 flex items-center justify-center border-accent/20">
          <PartyPopper size={48} className="text-accent" />
          
          {/* Animated glow */}
          <motion.div
            animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-accent rounded-full blur-2xl -z-10"
          />
        </div>
      </div>

      <div className="mb-8 sm:mb-12 shrink-0">
        <h1 className="text-3xl sm:text-5xl font-black text-accent mb-4 tracking-tighter italic uppercase leading-tight sm:leading-none">
          МИССИЯ ВЫПОЛНЕНА
        </h1>
        <p className="text-white/40 font-mono text-[10px] sm:text-xs tracking-widest uppercase mb-1">НАГРАДА РАЗБЛОКИРОВАНА</p>
        <div className="h-px w-24 bg-accent/30 mx-auto" />
      </div>
      
      <p className="text-white/60 mb-8 sm:mb-10 text-xs sm:text-sm font-mono tracking-wide max-w-md mx-auto text-center shrink-0 leading-relaxed">
        СИСТЕМА ОТКАЛИБРОВАНА С ТОЧНОСТЬЮ 100%. ВАШ ПРОМОКОД ГОТОВ К ИСПОЛЬЗОВАНИЮ.
      </p>

      <div className="w-full hud-border p-6 sm:p-8 bg-black/60 shadow-2xl mb-8 sm:mb-12 relative overflow-hidden group shrink-0">
        <div className="hud-label">ПРОМОКОД ПОЛУЧЕН</div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1">
             <span className="text-[10px] text-accent/40 font-mono tracking-widest uppercase">ВАША СКИДКА: 05%</span>
             <span className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-[0.2em] sm:tracking-[0.3em]">{promoCode}</span>
          </div>
          
          <button 
            onClick={copyToClipboard}
            className={`px-6 py-4 rounded-sm font-bold tracking-widest uppercase text-xs transition-all flex items-center gap-2 ${
              copied 
                ? 'bg-green-500 text-bg-dark' 
                : 'bg-accent text-bg-dark hover:bg-accent-hover shadow-neon'
            }`}
          >
            {copied ? (
              <><CheckCircle size={16} /> КОПИРОВАНО</>
            ) : (
              <><Copy size={16} /> КОПИРОВАТЬ</>
            )}
          </button>
        </div>
        
        {/* Background circuit lines effect */}
        <div className="absolute inset-0 opacity-5 pointer-events-none -z-10" style={{ backgroundImage: 'linear-gradient(90deg, var(--color-accent) 1px, transparent 1px), linear-gradient(0deg, var(--color-accent) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      </div>

      <motion.a 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        href="mailto:Legosi89@gmail.com"
        className="w-full max-w-sm py-5 bg-bg-mid border border-white/10 text-accent font-black tracking-[0.2em] uppercase text-sm rounded-sm hover:border-accent hover:shadow-neon transition-all flex items-center justify-center gap-3"
      >
        СВЯЗАТЬСЯ С НАМИ
      </motion.a>
      
      <div className="mt-12 flex items-center gap-8 opacity-20">
         <div className="text-[8px] font-mono uppercase tracking-widest">UID: StageMaster_v1</div>
         <div className="text-[8px] font-mono uppercase tracking-widest">Время: {new Date().toLocaleTimeString()}</div>
         <div className="text-[8px] font-mono uppercase tracking-widest">Шифр: TLS_ЗАШИФРОВАНO</div>
      </div>
    </motion.div>
  );
};
