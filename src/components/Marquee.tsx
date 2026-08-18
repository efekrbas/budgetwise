'use client';

import { Database, Cpu, Zap, Shield, Blocks, Binary, Server } from 'lucide-react';

const BADGES = [
  { icon: Database, label: "0G Distributed Storage", color: "text-purple-400" },
  { icon: Cpu, label: "0G Compute & AI Inference", color: "text-cyan-400" },
  { icon: Zap, label: "50 Gbps+ Data Availability", color: "text-pink-400" },
  { icon: Shield, label: "ZK Cryptographic Audit", color: "text-emerald-400" },
  { icon: Blocks, label: "0G Galileo EVM (ID: 16602)", color: "text-purple-300" },
  { icon: Binary, label: "Merkle Root Verification", color: "text-amber-400" },
  { icon: Server, label: "1,400+ Active Storage Nodes", color: "text-cyan-300" },
];

export default function Marquee() {
  return (
    <div className="w-full overflow-hidden border-y border-white/5 bg-black/40 backdrop-blur-md py-3 relative select-none">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050508] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050508] to-transparent z-10 pointer-events-none" />
      
      <div className="animate-marquee flex gap-8 items-center">
        {[...BADGES, ...BADGES, ...BADGES].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 text-xs text-slate-300 whitespace-nowrap hover:border-purple-500/30 transition-colors"
            >
              <Icon className={`w-3.5 h-3.5 ${item.color}`} />
              <span className="font-medium tracking-wide">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
