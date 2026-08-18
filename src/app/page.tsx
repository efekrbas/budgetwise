'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { parseEther, formatEther } from 'viem';
import { Brain, Wallet, Plus, ArrowRight, History } from 'lucide-react';
import Background3D from '@/components/ui/Background3D';

const CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890'; // Placeholder
// Placeholder ABI for BudgetWise0G
const ABI = [
  "function setBudget(uint256 _limit) external",
  "function addExpense(uint256 _amount, string calldata _category, string calldata _storageRootHash) external",
  "function getBudgetStats(address _user) external view returns (uint256 limit, uint256 totalSpent)",
  "function getExpenses(address _user) external view returns (tuple(uint256 amount, string category, uint256 timestamp, string storageRootHash)[])"
];

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [budgetLimit, setBudgetLimit] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  
  const [aiTips, setAiTips] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { writeContract, data: txHash } = useWriteContract();
  const { isLoading: isTxConfirming, isSuccess: isTxConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  // Read stats
  const { data: stats, refetch: refetchStats } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getBudgetStats',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  // Read expenses
  const { data: expenses } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getExpenses',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const handleSetBudget = () => {
    if (!budgetLimit) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'setBudget',
      args: [parseEther(budgetLimit)],
    }, { onSuccess: () => refetchStats() });
  };

  const handleAddExpense = async () => {
    if (!expenseAmount || !expenseCategory) return;
    
    setIsUploading(true);
    try {
      // 1. Upload to 0G Storage
      const storageRes = await fetch('/api/storage/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: expenseAmount,
          category: expenseCategory,
          timestamp: Date.now(),
          notes: "Uploaded via BudgetWise 0G UI"
        })
      });
      const storageData = await storageRes.json();
      
      if (!storageData.success) throw new Error(storageData.error);
      
      const rootHash = storageData.rootHash;

      // 2. Add to 0G Chain via Smart Contract
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'addExpense',
        args: [parseEther(expenseAmount), expenseCategory, rootHash],
      }, { onSuccess: () => refetchStats() });
      
    } catch (error) {
      console.error("Failed to add expense:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!stats || !expenses) return;
    
    setIsAnalyzing(true);
    try {
      const formattedExpenses = (expenses as any[]).map(e => ({
        amount: formatEther(e.amount),
        category: e.category,
        timestamp: new Date(Number(e.timestamp) * 1000).toLocaleString()
      }));

      const aiRes = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budgetLimit: formatEther((stats as any)[0]),
          expenses: formattedExpenses
        })
      });
      const aiData = await aiRes.json();
      
      if (aiData.success) {
        setAiTips(aiData.tips);
      }
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <Background3D />
      <main className="max-w-5xl mx-auto p-6 lg:p-12 space-y-12 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            BudgetWise 0G
          </h1>
          <p className="text-slate-400 mt-2">Decentralized Budget Tracker on the 0G Network</p>
        </div>
        
        {isConnected ? (
          <div className="flex items-center gap-4">
            <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-mono text-sm">{address?.slice(0,6)}...{address?.slice(-4)}</span>
            </div>
            <Button variant="outline" onClick={() => disconnect()}>Disconnect</Button>
          </div>
        ) : (
          <Button size="lg" onClick={() => connect({ connector: injected() })}>
            <Wallet className="mr-2 w-5 h-5" /> Connect Wallet
          </Button>
        )}
      </header>

      {isConnected && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Stats & Budget */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Budget Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {stats ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-white/10 pb-4">
                      <span className="text-slate-400">Total Spent</span>
                      <span className="text-3xl font-bold">{formatEther((stats as any)[1])} 0G</span>
                    </div>
                    <div className="flex justify-between items-end pb-2">
                      <span className="text-slate-400">Budget Limit</span>
                      <span className="text-xl">{formatEther((stats as any)[0])} 0G</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-slate-400 mb-4">No budget set yet.</p>
                    <div className="flex gap-4">
                      <input 
                        type="number"
                        placeholder="Limit (0G)" 
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 outline-none focus:border-purple-500 transition-colors"
                        value={budgetLimit}
                        onChange={(e) => setBudgetLimit(e.target.value)}
                      />
                      <Button onClick={handleSetBudget}>Set Budget</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Expense</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input 
                  type="number"
                  placeholder="Amount (0G)" 
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-4 outline-none focus:border-purple-500 transition-colors"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                />
                <input 
                  type="text"
                  placeholder="Category (e.g. Food, Rent)" 
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-4 outline-none focus:border-purple-500 transition-colors"
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                />
                <Button 
                  className="w-full" 
                  onClick={handleAddExpense} 
                  disabled={isUploading || isTxConfirming}
                >
                  {isUploading ? "Uploading to 0G Storage..." : isTxConfirming ? "Confirming on 0G Chain..." : "Add Expense"}
                  {!isUploading && !isTxConfirming && <Plus className="ml-2 w-4 h-4" />}
                </Button>
                {txHash && (
                  <p className="text-xs text-center text-slate-400 mt-2">
                    Tx: <a href={`https://chainscan-galileo.0g.ai/tx/${txHash}`} target="_blank" className="text-purple-400 hover:underline">View on Explorer</a>
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Analysis & History */}
          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-purple-900/40 to-black border-purple-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                <Brain className="w-32 h-32 text-purple-400" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="text-purple-400 w-5 h-5" />
                  0G AI Advisor
                </CardTitle>
              </CardHeader>
              <CardContent>
                {aiTips.length > 0 ? (
                  <ul className="space-y-3 mt-4 relative z-10">
                    {aiTips.map((tip, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                        <ArrowRight className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        {tip}
                      </li>
                    ))}
                    <div className="pt-4">
                      <Button variant="outline" size="sm" onClick={handleAnalyze} disabled={isAnalyzing}>
                        {isAnalyzing ? "Analyzing..." : "Refresh Advice"}
                      </Button>
                    </div>
                  </ul>
                ) : (
                  <div className="text-center py-6 relative z-10">
                    <p className="text-slate-400 mb-4 text-sm">Analyze your on-chain spending habits securely using 0G Compute inference.</p>
                    <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                      {isAnalyzing ? "Running Inference..." : "Get AI Advice"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Recent Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {expenses && (expenses as any[]).length > 0 ? (
                  <div className="space-y-3">
                    {(expenses as any[]).map((exp, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                        <div>
                          <p className="font-medium">{exp.category}</p>
                          <p className="text-xs font-mono text-slate-500 mt-1" title={exp.storageRootHash}>
                            Storage Root: {exp.storageRootHash.slice(0, 10)}...
                          </p>
                        </div>
                        <span className="font-bold text-red-400">-{formatEther(exp.amount)} 0G</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm text-center py-4">No expenses recorded yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      </main>
    </>
  );
}
