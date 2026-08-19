'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Activity, ShieldCheck, Server, Radio, Zap, CheckCircle2 } from 'lucide-react';

export default function NetworkTelemetryCard() {
  const [blockHeight, setBlockHeight] = useState(1284920);
  const [latency, setLatency] = useState(38);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlockHeight(prev => prev + 1);
      setLatency(35 + Math.floor(Math.random() * 8));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-[#0c0817]/95 via-[#080512] to-black border-cyan-500/20 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <Server className="w-32 h-32 text-cyan-400" />
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2.5 text-base text-cyan-200">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300">
              <Activity className="w-4 h-4" />
            </div>
            0G Storage Nodes & DA Telemetry
          </CardTitle>
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Nodes Online
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Node Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-0.5">Active Nodes</div>
            <div className="text-sm font-bold text-white font-mono flex items-center justify-center gap-1">
              <Server className="w-3.5 h-3.5 text-cyan-400" /> 8 / 8
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-0.5">Latency</div>
            <div className="text-sm font-bold text-emerald-400 font-mono flex items-center justify-center gap-1">
              <Radio className="w-3.5 h-3.5" /> {latency}ms
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-0.5">Block Height</div>
            <div className="text-sm font-bold text-purple-300 font-mono">
              #{blockHeight.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Live Integrity Pipeline */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ZK Merkle Tree Sharding:
            </span>
            <span className="font-mono font-bold text-emerald-400">100% Synced</span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Galileo EVM Gas Relayer:
            </span>
            <span className="font-mono text-cyan-300">&lt;0.0001 0G / tx</span>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-white/5">
          <span>Target Settlement: <strong>0G Galileo EVM (16602)</strong></span>
          <span className="text-cyan-400 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Consensus Verified
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
