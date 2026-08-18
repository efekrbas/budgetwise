'use client';

import { useState, useEffect } from 'react';
import { Database, ShieldCheck, Cpu, CheckCircle2, Sparkles } from 'lucide-react';

const BOOT_STEPS = [
  { text: "Connecting to 0G Galileo Testnet (Chain ID: 16602)...", icon: Database },
  { text: "Indexing 0G Distributed Storage Merkle Nodes (8x Replication)...", icon: ShieldCheck },
  { text: "Initializing 0G Compute AI Router (Llama-3-70B)...", icon: Cpu },
  { text: "Verifying ZK Merkle Proofs & Cryptographic State...", icon: Sparkles },
];

export default function AppLoader({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        const next = prev + 25;
        setCurrentStep(Math.min(BOOT_STEPS.length - 1, Math.floor(next / 25)));
        return next;
      });
    }, 280);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050508] text-white select-none p-4">
      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute w-80 h-80 bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-8 text-center">
        {/* Animated 0G Logo Icon */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 animate-pulse blur-xl opacity-60" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 p-0.5 shadow-2xl">
            <div className="w-full h-full bg-[#080712] rounded-2xl flex items-center justify-center">
              <Database className="w-9 h-9 text-purple-300 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent">
            BudgetWise 0G
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Autonomous On-Chain Spending & 0G Storage Protocol
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden p-0.5 border border-white/10">
            <div 
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 h-1 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(168,85,247,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Telemetry Boot</span>
            <span className="text-purple-300">{progress}%</span>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
          {BOOT_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <div 
                key={idx} 
                className={`flex items-center gap-2.5 text-xs text-left transition-all duration-300 ${
                  isCurrent ? "text-purple-200 font-medium" : isDone ? "text-slate-400 opacity-60" : "text-slate-600 opacity-30"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                ) : (
                  <Icon className={`w-4 h-4 shrink-0 ${isCurrent ? "text-cyan-400 animate-spin" : ""}`} />
                )}
                <span className="truncate">{step.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
