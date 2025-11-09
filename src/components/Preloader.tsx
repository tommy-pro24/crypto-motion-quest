import { motion } from "framer-motion";
import { SiBitcoin, SiSolana } from "react-icons/si";
import { useEffect, useState } from "react";

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader = ({ onComplete }: PreloaderProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      
      {/* Rotating icons */}
      <div className="relative mb-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <SiBitcoin className="h-24 w-24 text-chart-bitcoin drop-shadow-[0_0_25px_rgba(247,147,26,0.5)]" />
        </motion.div>
        
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-4 -right-4"
        >
          <SiSolana className="h-16 w-16 text-chart-solana drop-shadow-[0_0_20px_rgba(148,76,255,0.5)]" />
        </motion.div>
      </div>

      {/* Loading text */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-3xl font-bold text-transparent"
      >
        Loading Crypto Dashboard
      </motion.h2>

      {/* Progress bar */}
      <div className="relative w-80 h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-primary to-accent"
        />
      </div>

      {/* Progress percentage */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 text-muted-foreground font-mono"
      >
        {progress}%
      </motion.p>

      {/* Animated dots */}
      <div className="flex gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="h-2 w-2 rounded-full bg-primary"
          />
        ))}
      </div>
    </motion.div>
  );
};
