'use client';

import { X, Layers, Database, Cpu, Blocks, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';

export default function ArchitectureModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fadeIn">
      <div className="relative w-full max-w-2xl p-6 sm:p-8 rounded-3xl glass-panel border border-purple-500/30 bg-[#0a0816]/95 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">0G System Architecture & Deep Dive</h3>
              <p className="text-xs text-slate-400 font-mono">How BudgetWise Integrates the 0G Stack</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Architecture Flow Diagram */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider">End-to-End Data Pipeline</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Step 1: 0G Storage */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-purple-500/20 space-y-2 relative">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 w-fit">
                <Database className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-sm text-white">1. 0G Storage Layer</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Raw expense JSON is parsed via <code className="text-purple-300">zgFile</code> into Merkle tree chunks with decentralized replication across 8 storage nodes.
              </p>
              <span className="inline-block text-[10px] font-mono text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded">
                Merkle Root Generated
              </span>
            </div>

            {/* Step 2: 0G Galileo EVM */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-cyan-500/20 space-y-2 relative">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 w-fit">
                <Blocks className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-sm text-white">2. 0G Galileo EVM</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                <code className="text-cyan-300">BudgetWise0G.sol</code> records the spending cap and binds the 0G Merkle Root Hash directly on-chain with sub-second finality.
              </p>
              <span className="inline-block text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded">
                Chain ID: 16602
              </span>
            </div>

            {/* Step 3: 0G AI Compute */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-pink-500/20 space-y-2 relative">
              <div className="p-2 rounded-xl bg-pink-500/20 text-pink-300 w-fit">
                <Cpu className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-sm text-white">3. 0G AI Inference</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                0G Compute Router feeds on-chain receipts into hosted models (Llama-3 / DeepSeek) to generate verifiable spending optimizations.
              </p>
              <span className="inline-block text-[10px] font-mono text-pink-400 bg-pink-950/40 px-2 py-0.5 rounded">
                Decentralized Serving
              </span>
            </div>

          </div>
        </div>

        {/* Technical Highlights */}
        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3">
          <h4 className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Why 0G is Critical for BudgetWise
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />
              <span><strong>Cost Reduction:</strong> 0G Storage is ~90% cheaper than traditional EVM calldata.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />
              <span><strong>Privacy & Audit:</strong> Merkle receipts allow verifiable audits without exposing sensitive raw invoices.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />
              <span><strong>Real-time AI:</strong> Sub-second latency enabled by 0G High-Throughput DA Layer (50 Gbps+).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />
              <span><strong>Autonomous Finance:</strong> Programmable guardrails prevent over-spending on node operations.</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <a 
            href="https://0g.ai" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-colors"
          >
            Explore 0G Documentation →
          </a>
        </div>
      </div>
    </div>
  );
}
