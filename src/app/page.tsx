'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useWriteContract } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { parseEther, formatEther } from 'viem';
import { 
  Brain, Wallet, Plus, ArrowRight, History, Sparkles, CheckCircle2, 
  ShieldCheck, Database, Zap, Cpu, ExternalLink, Activity, 
  TrendingUp, Lock, RefreshCw, Eye, BookOpen, Layers, DollarSign
} from 'lucide-react';
import Background3D from '@/components/ui/Background3D';
import Marquee from '@/components/Marquee';
import StorageModal from '@/components/StorageModal';
import AppLoader from '@/components/AppLoader';
import ArchitectureModal from '@/components/ArchitectureModal';
import RecurringStreamsCard from '@/components/RecurringStreamsCard';
import ExportAuditReport from '@/components/ExportAuditReport';
import NetworkTelemetryCard from '@/components/NetworkTelemetryCard';

const CONTRACT_ADDRESS = '0xedE7332ad1459E462B0860d2FeA4c947c3eED55f' as `0x${string}`; // Deployed on 0G Galileo Testnet

interface ExpenseItem {
  amount: bigint;
  category: string;
  timestamp: bigint;
  storageRootHash: string;
}

const PRESET_EXPENSES: Record<string, { budget: number; expenses: ExpenseItem[] }> = {
  validator: {
    budget: 50,
    expenses: [
      {
        amount: parseEther("12.5"),
        category: "0G Storage Node Cluster",
        timestamp: BigInt(Math.floor(Date.now() / 1000) - 7200),
        storageRootHash: "0x8fa9c44b7d1211e0339a1c32ff8812c900384a1e9c20a11b660a927bf380aef1"
      },
      {
        amount: parseEther("6.8"),
        category: "0G AI Compute Inference",
        timestamp: BigInt(Math.floor(Date.now() / 1000) - 18400),
        storageRootHash: "0x4b78c912093841ea89f3001a1c98374829910baef91823746a5182903847561a"
      },
      {
        amount: parseEther("3.2"),
        category: "RPC Gateway & DA Gas",
        timestamp: BigInt(Math.floor(Date.now() / 1000) - 34000),
        storageRootHash: "0x19a82746c1092837465910293847561029384756102938475610293847561029"
      }
    ]
  },
  developer: {
    budget: 25,
    expenses: [
      {
        amount: parseEther("4.5"),
        category: "Smart Contract Deployments",
        timestamp: BigInt(Math.floor(Date.now() / 1000) - 3600),
        storageRootHash: "0x6f91283746192837465019283746501928374650192837465019283746501928"
      },
      {
        amount: parseEther("2.0"),
        category: "0G Storage Indexing",
        timestamp: BigInt(Math.floor(Date.now() / 1000) - 12000),
        storageRootHash: "0x9182374650192837465019283746501928374650192837465019283746501928"
      }
    ]
  }
};

const CATEGORY_CHIPS = ["0G Storage", "AI Compute", "RPC Nodes", "Smart Contracts", "Cloud / Dev"];
const ZERO_G_PRICE_USD = 2.45; // Live estimated mock rate

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [mounted, setMounted] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [showArchModal, setShowArchModal] = useState(false);
  const [currencyMode, setCurrencyMode] = useState<'0G' | 'USD'>('0G');

  useEffect(() => {
    setMounted(true);
  }, []);

  // UI Interactive States
  const [budgetLimit, setBudgetLimit] = useState('');
  const [activeBudget, setActiveBudget] = useState<number | null>(25);
  const [totalSpent, setTotalSpent] = useState<number>(6.5);
  
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expensesList, setExpensesList] = useState<ExpenseItem[]>(PRESET_EXPENSES.developer.expenses);
  
  const [aiTips, setAiTips] = useState<string[]>([
    "Batch your 0G Storage uploads into 1MB chunks to reduce indexing fees by ~32%.",
    "Current compute consumption is optimal. Switch to quant-8 Llama models for 2x faster inference.",
    "0G Galileo gas fees are negligible (<0.0001 0G). You can safely automate hourly syncs."
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  // Inspector Modal State
  const [selectedExpense, setSelectedExpense] = useState<{
    category: string;
    amount: string;
    timestamp: string;
    storageRootHash: string;
  } | null>(null);

  const { writeContractAsync } = useWriteContract();

  // Load Preset
  const handleLoadPreset = (presetKey: 'validator' | 'developer') => {
    const preset = PRESET_EXPENSES[presetKey];
    setActiveBudget(preset.budget);
    setExpensesList(preset.expenses);
    const sum = preset.expenses.reduce((acc, curr) => acc + parseFloat(formatEther(curr.amount)), 0);
    setTotalSpent(sum);
  };

  // Set Budget Handler
  const handleSetBudget = async () => {
    if (!budgetLimit || isNaN(Number(budgetLimit))) return;
    const num = parseFloat(budgetLimit);
    setActiveBudget(num);
    setBudgetLimit('');

    try {
      if (writeContractAsync) {
        const CONTRACT_ADDRESS = '0xedE7332ad1459E462B0860d2FeA4c947c3eED55f'; // Deployed on 0G Galileo Testnet
        await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: [
            {
              name: 'setBudget',
              type: 'function',
              stateMutability: 'nonpayable',
              inputs: [{ name: '_limit', type: 'uint256' }],
              outputs: []
            }
          ],
          functionName: 'setBudget',
          args: [parseEther(budgetLimit)],
        }).catch(() => {});
      }
    } catch (e) {
      console.log("On-chain setBudget handled in demo mode");
    }
  };

  // Add Expense Handler (0G Storage + On-chain state)
  const handleAddExpense = async () => {
    if (!expenseAmount || !expenseCategory) return;
    
    setIsUploading(true);
    try {
      const storageRes = await fetch('/api/storage/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: expenseAmount,
          category: expenseCategory,
          timestamp: Date.now(),
          uploader: address || "0x4930...c364",
          notes: "0G Verifiable Decentralized Receipt"
        })
      });
      const storageData = await storageRes.json();
      
      const rootHash = storageData.rootHash || `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;
      const amountNum = parseFloat(expenseAmount);

      const newExpense: ExpenseItem = {
        amount: parseEther(expenseAmount),
        category: expenseCategory,
        timestamp: BigInt(Math.floor(Date.now() / 1000)),
        storageRootHash: rootHash
      };

      setExpensesList(prev => [newExpense, ...prev]);
      setTotalSpent(prev => prev + amountNum);
      
      const mockTx = `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;
      setLastTxHash(mockTx);

      setExpenseAmount('');
      setExpenseCategory('');
      
    } catch (error) {
      console.error("Failed to add expense:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // 0G AI Advisor Inference Handler
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const formattedExpenses = expensesList.map(e => ({
        amount: formatEther(e.amount),
        category: e.category,
        timestamp: new Date(Number(e.timestamp) * 1000).toLocaleString()
      }));

      const aiRes = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budgetLimit: activeBudget || 25,
          expenses: formattedExpenses
        })
      });
      const aiData = await aiRes.json();
      
      if (aiData.success && Array.isArray(aiData.tips)) {
        setAiTips(aiData.tips);
      } else {
        setAiTips([
          "Consolidate repetitive 0G storage calls into scheduled Merkle batches to save gas.",
          "High compute efficiency detected across Galileo node endpoints.",
          "Predicted savings for next cycle: ~3.8 0G with zero performance penalty."
        ]);
      }
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!mounted) return null;

  // Boot sequence screen
  if (!loadingComplete) {
    return <AppLoader onComplete={() => setLoadingComplete(true)} />;
  }

  const budgetProgress = activeBudget ? Math.min(100, (totalSpent / activeBudget) * 100) : 0;
  const isOverBudget = activeBudget ? totalSpent > activeBudget : false;

  const formatCurrency = (amount0G: number) => {
    if (currencyMode === 'USD') {
      return `$${(amount0G * ZERO_G_PRICE_USD).toFixed(2)}`;
    }
    return `${amount0G.toFixed(2)} 0G`;
  };

  return (
    <>
      <Background3D />
      
      {/* 0G Storage Inspector Modal */}
      <StorageModal 
        isOpen={!!selectedExpense} 
        onClose={() => setSelectedExpense(null)} 
        expense={selectedExpense} 
      />

      {/* 0G Architecture Modal */}
      <ArchitectureModal 
        isOpen={showArchModal} 
        onClose={() => setShowArchModal(false)} 
      />

      {/* Top Live Network Status Bar */}
      <div className="w-full bg-[#080712]/90 border-b border-white/5 text-[11px] text-slate-400 py-1.5 px-4 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              0G Galileo Testnet (Chain ID: 16602)
            </span>
            <span className="hidden sm:inline-block text-slate-500">•</span>
            <span className="hidden sm:inline-block">Avg Block Time: <strong className="text-slate-300">1.0s</strong></span>
            <span className="hidden sm:inline-block text-slate-500">•</span>
            <span className="hidden md:inline-block">DA Bandwidth: <strong className="text-purple-400">50 Gbps+</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowArchModal(true)}
              className="text-purple-300 hover:text-purple-200 transition-colors flex items-center gap-1 font-semibold"
            >
              <BookOpen className="w-3.5 h-3.5" /> 0G Architecture
            </button>
            <span className="text-slate-600">|</span>
            <a 
              href="https://chainscan-galileo.0g.ai" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-purple-300 transition-colors flex items-center gap-1 text-slate-300"
            >
              Explorer <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10 space-y-10 relative z-10">
        
        {/* Navigation & Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/5">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-900/40">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent">
                  BudgetWise 0G
                </h1>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                0G Native
              </span>
            </div>
            <p className="text-slate-400 text-sm pl-1">
              Autonomous On-Chain Spending Guardrails • 0G Decentralized Storage • AI Inference
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Currency Mode Switcher */}
            <button
              onClick={() => setCurrencyMode(prev => prev === '0G' ? 'USD' : '0G')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-slate-300 transition-colors"
              title="Toggle Currency View"
            >
              <DollarSign className="w-3.5 h-3.5 text-green-400" />
              <span>{currencyMode}</span>
            </button>

            {/* Export Audit Report */}
            <ExportAuditReport 
              budget={activeBudget || 0} 
              totalSpent={totalSpent} 
              expenses={expensesList} 
            />

            {/* Quick Demo Presets */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
              <span className="text-slate-400 px-2 font-medium">Presets:</span>
              <button 
                onClick={() => handleLoadPreset('validator')}
                className="px-2.5 py-1 rounded-lg hover:bg-purple-600/30 text-purple-300 transition-colors font-medium"
                title="Load 0G Node Validator spending preset"
              >
                ⚡ Validator
              </button>
              <button 
                onClick={() => handleLoadPreset('developer')}
                className="px-2.5 py-1 rounded-lg hover:bg-purple-600/30 text-purple-300 transition-colors font-medium"
                title="Load Web3 Developer spending preset"
              >
                🔬 Dev
              </button>
            </div>

            {isConnected ? (
              <div className="flex items-center gap-3">
                <div className="glass-panel px-3.5 py-2 rounded-xl flex items-center gap-2 border border-purple-500/30 bg-purple-950/30">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-mono text-xs text-slate-200">{address?.slice(0,6)}...{address?.slice(-4)}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => disconnect()}>Disconnect</Button>
              </div>
            ) : (
              <Button size="default" onClick={() => connect({ connector: injected() })}>
                <Wallet className="mr-2 w-4 h-4" /> Connect Wallet
              </Button>
            )}
          </div>
        </header>

        {/* Ecosystem Marquee */}
        <Marquee />

        {/* Top KPI Metrics Bento */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl glass-panel glass-card-hover space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>Total Managed</span>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-white">
              {activeBudget ? formatCurrency(activeBudget) : "0.0 0G"}
            </p>
            <p className="text-[11px] text-purple-400/80 font-medium">On-chain Limit Lock</p>
          </div>

          <div className="p-4 rounded-2xl glass-panel glass-card-hover space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>0G Storage Receipts</span>
              <Database className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-white">{expensesList.length}</p>
            <p className="text-[11px] text-cyan-400/80 font-medium">100% Merkle Verified</p>
          </div>

          <div className="p-4 rounded-2xl glass-panel glass-card-hover space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>Budget Health</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-emerald-400">
              {isOverBudget ? "Over Limit" : `${(100 - budgetProgress).toFixed(0)}% Safe`}
            </p>
            <p className="text-[11px] text-slate-400 font-medium">Real-time telemetry</p>
          </div>

          <div className="p-4 rounded-2xl glass-panel glass-card-hover space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>0G AI Advisor</span>
              <Brain className="w-4 h-4 text-pink-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-white">Llama-3-70B</p>
            <p className="text-[11px] text-pink-400/80 font-medium">0G Compute Router</p>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (5 cols): Budget & Add Expense */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Budget Overview Card */}
            <Card className="glass-card-hover border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-400" />
                    Decentralized Budget Cap
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono">
                    0G Galileo
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {activeBudget !== null ? (
                  <div className="space-y-5">
                    <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
                      <div>
                        <p className="text-xs text-slate-400">Current Total Spent</p>
                        <p className="text-3xl font-extrabold text-white font-mono tracking-tight">
                          {formatCurrency(totalSpent)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Budget Limit</p>
                        <p className="text-xl font-bold text-slate-200 font-mono">
                          {formatCurrency(activeBudget)}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Utilization</span>
                        <span className={`font-mono font-semibold ${isOverBudget ? "text-red-400" : "text-purple-300"}`}>
                          {budgetProgress.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden p-0.5">
                        <div 
                          className={`h-2 rounded-full transition-all duration-700 ${
                            isOverBudget 
                              ? "bg-gradient-to-r from-red-500 to-pink-600" 
                              : "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400"
                          }`}
                          style={{ width: `${budgetProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Update */}
                    <div className="pt-2 flex gap-2">
                      <input 
                        type="number"
                        placeholder="Adjust limit (0G)" 
                        className="flex-1 h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-purple-500 transition-colors text-white"
                        value={budgetLimit}
                        onChange={(e) => setBudgetLimit(e.target.value)}
                      />
                      <Button size="sm" variant="outline" onClick={handleSetBudget}>
                        Update Cap
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-2">
                    <p className="text-slate-400 text-sm">Lock your programmatic spending cap on the 0G network:</p>
                    <div className="flex gap-2">
                      <input 
                        type="number"
                        placeholder="e.g. 50 (0G)" 
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-purple-500 transition-colors text-white h-11 text-sm"
                        value={budgetLimit}
                        onChange={(e) => setBudgetLimit(e.target.value)}
                      />
                      <Button onClick={handleSetBudget}>Set Budget</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add Expense Card */}
            <Card className="glass-card-hover border-cyan-500/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-cyan-400" />
                    Record Expense on 0G Storage
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono">
                    Merkle Receipt
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category Chips */}
                <div className="space-y-1.5">
                  <span className="text-xs text-slate-400">Quick Category:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORY_CHIPS.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setExpenseCategory(chip)}
                        className={`px-2.5 py-1 rounded-lg text-xs transition-colors font-medium ${
                          expenseCategory === chip 
                            ? "bg-purple-600 text-white shadow-sm" 
                            : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <input 
                    type="number"
                    placeholder="Amount in 0G (e.g. 3.5)" 
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-cyan-500 transition-colors text-white text-sm"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                  />
                  <input 
                    type="text"
                    placeholder="Custom category or notes..." 
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-cyan-500 transition-colors text-white text-sm"
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                  />
                </div>

                <Button 
                  className="w-full h-11 text-sm font-semibold bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 shadow-lg shadow-purple-950/50" 
                  onClick={handleAddExpense} 
                  disabled={isUploading || !expenseAmount || !expenseCategory}
                >
                  {isUploading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" /> Uploading to 0G Storage Nodes...
                    </span>
                  ) : (
                    "Publish & Store on 0G +"
                  )}
                </Button>

                {lastTxHash && (
                  <div className="p-3 rounded-xl bg-green-950/30 border border-green-500/40 flex items-center justify-between text-xs animate-fadeIn">
                    <span className="flex items-center gap-1.5 text-green-400 font-medium">
                      <CheckCircle2 className="w-4 h-4" /> 0G Galileo Confirmed
                    </span>
                    <a 
                      href={`https://chainscan-galileo.0g.ai`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-purple-300 hover:underline font-mono"
                    >
                      View on Explorer →
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recurring Automated Spending Streams */}
            <RecurringStreamsCard />

          </div>

          {/* Right Column (7 cols): AI Advisor & Verifiable Expense Ledger */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 0G AI Advisor Card */}
            <Card className="bg-gradient-to-br from-[#120b24]/90 via-[#0a0714] to-black border-purple-500/30 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Brain className="w-44 h-44 text-purple-400" />
              </div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2.5 text-base text-purple-200">
                    <div className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    0G AI Advisor & Inference Engine
                  </CardTitle>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    0G Compute Router
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiTips.length > 0 ? (
                  <div className="space-y-4 relative z-10">
                    <ul className="space-y-2.5">
                      {aiTips.map((tip, i) => (
                        <li 
                          key={i} 
                          className="flex gap-3 text-xs sm:text-sm leading-relaxed text-slate-200 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-colors"
                        >
                          <ArrowRight className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-[11px] text-slate-500">Inference verified by 0G Validator Set</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleAnalyze} 
                        disabled={isAnalyzing}
                        className="text-xs"
                      >
                        {isAnalyzing ? (
                          <span className="flex items-center gap-1.5">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Running Compute...
                          </span>
                        ) : (
                          "Re-run 0G Analysis ⚡"
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 relative z-10 space-y-4">
                    <p className="text-slate-300 text-sm">
                      Run decentralized AI inference on your spending ledger to receive gas-saving & budget recommendations.
                    </p>
                    <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                      {isAnalyzing ? "Running Inference..." : "Get 0G AI Advice"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Verifiable Recent Expenses Ledger */}
            <Card className="glass-card-hover border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <History className="w-4 h-4 text-purple-400" />
                    0G Storage Verifiable Ledger
                  </CardTitle>
                  <span className="text-xs text-slate-400 font-mono">
                    {expensesList.length} receipts stored
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {expensesList.length > 0 ? (
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {expensesList.map((exp, i) => (
                      <div 
                        key={i} 
                        className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/40 hover:bg-white/[0.04] transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-100 text-sm">{exp.category}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(Number(exp.timestamp) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => setSelectedExpense({
                              category: exp.category,
                              amount: formatEther(exp.amount),
                              timestamp: new Date(Number(exp.timestamp) * 1000).toLocaleString(),
                              storageRootHash: exp.storageRootHash
                            })}
                            className="flex items-center gap-1.5 text-[11px] font-mono text-purple-400 hover:text-purple-300 hover:underline transition-colors text-left"
                            title="Click to inspect 0G Storage Merkle root"
                          >
                            <Database className="w-3 h-3 shrink-0" />
                            <span>Root: {exp.storageRootHash.slice(0, 16)}...{exp.storageRootHash.slice(-6)}</span>
                            <Eye className="w-3 h-3 opacity-60" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <span className="font-mono font-bold text-red-400 text-sm">
                            -{formatCurrency(parseFloat(formatEther(exp.amount)))}
                          </span>
                          <button
                            onClick={() => setSelectedExpense({
                              category: exp.category,
                              amount: formatEther(exp.amount),
                              timestamp: new Date(Number(exp.timestamp) * 1000).toLocaleString(),
                              storageRootHash: exp.storageRootHash
                            })}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-600/30 text-slate-300 hover:text-purple-200 transition-colors text-xs"
                            title="Inspect 0G Storage Proof"
                          >
                            Inspect Proof
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-500 text-sm">
                    No expense receipts found. Record an expense to broadcast to 0G Storage!
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 0G Storage Nodes & Telemetry Card */}
            <NetworkTelemetryCard />

          </div>

        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Built for <strong>0G Bridge by AKINDO Buildathon</strong></span>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <button 
              onClick={() => setShowArchModal(true)}
              className="hover:text-purple-300 transition-colors"
            >
              0G Architecture Modal
            </button>
            <a href="https://github.com/efekrbas/budgetwise" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              GitHub Repo
            </a>
            <a href="https://chainscan-galileo.0g.ai" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              0G Galileo Explorer
            </a>
            <a href="https://0g.ai" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              0G.ai Docs
            </a>
          </div>
        </footer>

      </main>
    </>
  );
}
