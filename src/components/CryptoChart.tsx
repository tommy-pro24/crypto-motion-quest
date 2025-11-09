import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { SiBitcoin, SiSolana } from "react-icons/si";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";
import { Card } from "@/components/ui/card";

// Mock data generator
const generateMockData = (days: number = 30) => {
  const data = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  let btcPrice = 42000 + Math.random() * 3000;
  let solPrice = 100 + Math.random() * 20;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * dayMs);
    
    // Random walk with some trend
    btcPrice += (Math.random() - 0.48) * 2000;
    solPrice += (Math.random() - 0.48) * 8;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      bitcoin: Math.round(btcPrice),
      solana: Math.round(solPrice * 100) / 100,
    });
  }
  
  return data;
};

type CryptoType = 'bitcoin' | 'solana';

interface CryptoStats {
  current: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
}

export const CryptoChart = () => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoType>('bitcoin');
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  
  const data = useMemo(() => {
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    return generateMockData(days);
  }, [timeframe]);

  const stats = useMemo((): CryptoStats => {
    const prices = data.map(d => d[selectedCrypto]);
    const current = prices[prices.length - 1];
    const previous = prices[prices.length - 2];
    const change = current - previous;
    const changePercent = (change / previous) * 100;
    const high24h = Math.max(...prices.slice(-7));
    const low24h = Math.min(...prices.slice(-7));
    
    return { current, change, changePercent, high24h, low24h };
  }, [data, selectedCrypto]);

  const handleCryptoChange = useCallback((crypto: CryptoType) => {
    setSelectedCrypto(crypto);
  }, []);

  const isPositive = stats.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background p-4 md:p-8"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-2"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2 animate-pulse-glow">
            Crypto Trading Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Real-time cryptocurrency market analysis</p>
        </motion.div>

        {/* Crypto selector */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 justify-center"
        >
          <button
            onClick={() => handleCryptoChange('bitcoin')}
            className={`group flex items-center gap-3 px-8 py-5 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
              selectedCrypto === 'bitcoin'
                ? 'bg-gradient-to-br from-chart-bitcoin/20 to-chart-bitcoin/5 border-2 border-chart-bitcoin shadow-2xl shadow-chart-bitcoin/40'
                : 'bg-card hover:bg-card/80 border border-border'
            }`}
          >
            <SiBitcoin className={`h-10 w-10 transition-transform duration-300 ${selectedCrypto === 'bitcoin' ? 'text-chart-bitcoin animate-pulse-glow' : 'text-chart-bitcoin/70 group-hover:scale-110'}`} />
            <div className="text-left">
              <div className="font-bold text-foreground text-lg">Bitcoin</div>
              <div className="text-sm text-muted-foreground">BTC</div>
            </div>
          </button>

          <button
            onClick={() => handleCryptoChange('solana')}
            className={`group flex items-center gap-3 px-8 py-5 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
              selectedCrypto === 'solana'
                ? 'bg-gradient-to-br from-chart-solana/20 to-chart-solana/5 border-2 border-chart-solana shadow-2xl shadow-chart-solana/40'
                : 'bg-card hover:bg-card/80 border border-border'
            }`}
          >
            <SiSolana className={`h-10 w-10 transition-transform duration-300 ${selectedCrypto === 'solana' ? 'text-chart-solana animate-pulse-glow' : 'text-chart-solana/70 group-hover:scale-110'}`} />
            <div className="text-left">
              <div className="font-bold text-foreground text-lg">Solana</div>
              <div className="text-sm text-muted-foreground">SOL</div>
            </div>
          </button>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
            <div className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">Current Price</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ${stats.current.toLocaleString()}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
            <div className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">24h Change</div>
            <div className={`text-3xl font-bold flex items-center gap-2 ${
              isPositive ? 'text-success drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'text-destructive drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]'
            }`}>
              {isPositive ? <HiTrendingUp className="animate-pulse-glow" /> : <HiTrendingDown className="animate-pulse-glow" />}
              {isPositive ? '+' : ''}{stats.changePercent.toFixed(2)}%
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
            <div className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">24h High</div>
            <div className="text-3xl font-bold text-success">
              ${stats.high24h.toLocaleString()}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
            <div className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">24h Low</div>
            <div className="text-3xl font-bold text-destructive">
              ${stats.low24h.toLocaleString()}
            </div>
          </Card>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-8 bg-gradient-to-br from-card via-card/95 to-card/80 border-border shadow-2xl backdrop-blur-sm">
            {/* Timeframe selector */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Price Chart</h2>
              <div className="flex gap-2 bg-muted/50 p-1 rounded-xl">
                {(['7d', '30d', '90d'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                      timeframe === tf
                        ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg transform scale-105'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div className="h-[500px] relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-lg"></div>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="bitcoinGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-bitcoin))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-bitcoin))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="solanaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-solana))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-solana))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '13px', fontWeight: '500' }}
                    tickMargin={10}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '13px', fontWeight: '500' }}
                    tickMargin={10}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '2px solid hsl(var(--border))',
                      borderRadius: '12px',
                      color: 'hsl(var(--foreground))',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                      padding: '12px 16px',
                    }}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '8px' }}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '20px',
                      fontWeight: '600',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="bitcoin"
                    stroke="hsl(var(--chart-bitcoin))"
                    strokeWidth={selectedCrypto === 'bitcoin' ? 4 : 2}
                    fill="url(#bitcoinGradient)"
                    opacity={selectedCrypto === 'bitcoin' ? 1 : 0.2}
                    name="Bitcoin (BTC)"
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="solana"
                    stroke="hsl(var(--chart-solana))"
                    strokeWidth={selectedCrypto === 'solana' ? 4 : 2}
                    fill="url(#solanaGradient)"
                    opacity={selectedCrypto === 'solana' ? 1 : 0.2}
                    name="Solana (SOL)"
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
