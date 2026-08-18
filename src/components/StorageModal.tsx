'use client';

import { useState } from 'react';
import { X, Check, Copy, ShieldCheck, Database, Layers, Hash } from 'lucide-react';
import { Button } from './ui/Button';

interface StorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: {
    category: string;
    amount: string;
    timestamp: string;
    storageRootHash: string;
  } | null;
}

export default function StorageModal({ isOpen, onClose, expense }: StorageModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !expense) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(expense.storageRootHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulatedPayload = JSON.stringify({
    protocol: "0G-Storage-v1",
    merkleRoot: expense.storageRootHash,
    payload: {
      category: expense.category,
      amount: expense.amount,
      currency: "0G",
      timestamp: expense.timestamp,
      verifiedOnChain: true,
      encryption: "AES-GCM-256 (Decentralized Key Holder)"
    },
    replicationFactor: 8,
    validatorSignatures: 12
  }, null, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 rounded-2xl glass-panel border border-purple-500/30 bg-[#0c0b16]/95 shadow-2xl shadow-purple-950/60 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                0G Storage Proof Inspector
              </h3>
              <p className="text-xs text-slate-400 font-mono">Merkle Tree Layer-1 Verification</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <Layers className="w-4 h-4 text-cyan-400 mx-auto" />
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Replication</p>
            <p className="text-sm font-bold text-slate-200">8 Nodes</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto" />
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Integrity</p>
            <p className="text-sm font-bold text-emerald-400">100% ZK Valid</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <Hash className="w-4 h-4 text-purple-400 mx-auto" />
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Network</p>
            <p className="text-sm font-bold text-purple-300 font-mono">0G Galileo</p>
          </div>
        </div>

        {/* Root Hash */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">0G Merkle Root Hash:</span>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors font-medium text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy Hash"}
            </button>
          </div>
          <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-purple-300 break-all select-all">
            {expense.storageRootHash}
          </div>
        </div>

        {/* Raw Payload */}
        <div className="space-y-2">
          <span className="text-xs text-slate-400">Decentralized Metadata Payload:</span>
          <pre className="p-3 rounded-xl bg-black/80 border border-white/5 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-36">
            {simulatedPayload}
          </pre>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Inspector
          </Button>
          <a 
            href={`https://chainscan-galileo.0g.ai`} 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
          >
            Verify on 0G Explorer →
          </a>
        </div>
      </div>
    </div>
  );
}
