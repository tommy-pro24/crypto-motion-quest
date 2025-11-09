import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Preloader } from "@/components/Preloader";
import { CryptoChart } from "@/components/CryptoChart";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Preloader key="preloader" onComplete={handleLoadingComplete} />
        ) : (
          <CryptoChart key="chart" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
