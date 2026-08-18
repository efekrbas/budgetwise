'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Zap, Clock, Play, CheckCircle2, Shield, Plus } from 'lucide-react';

interface StreamItem {
  name: string;
  rate: string;
  interval: string;
  active: boolean;
  recipient: string;
}

const INITIAL_STREAMS: StreamItem[] = [
  { name: "0G Storage Node Rental (Cluster #14)", rate: "2.5 0G", interval: "Monthly", active: true, recipient: "0x0gStorage...89f2" },
  { name: "0G Compute Inference Pool", rate: "1.0 0G", interval: "Weekly", active: true, recipient: "0x0gCompute...11e0" },
  { name: "Galileo Automated Gas Relayer", rate: "0.2 0G", interval: "Daily", active: false, recipient: "0xRelayer...77a1" }
];

export default function RecurringStreamsCard() {
  const [streams, setStreams] = useState<StreamItem[]>(INITIAL_STREAMS);
  const [newStreamName, setNewStreamName] = useState('');
  const [newStreamRate, setNewStreamRate] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleStream = (index: number) => {
    setStreams(prev => prev.map((s, i) => i === index ? { ...s, active: !s.active } : s));
  };

  const handleAddStream = () => {
    if (!newStreamName || !newStreamRate) return;
    setStreams(prev => [
      {
        name: newStreamName,
        rate: `${newStreamRate} 0G`,
        interval: "Monthly",
        active: true,
        recipient: "0x0gProtocol...4b1a"
      },
      ...prev
    ]);
    setNewStreamName('');
    setNewStreamRate('');
    setShowAddForm(false);
  };

  return (
    <Card className="glass-card-hover border-purple-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="w-4 h-4 text-amber-400" />
            Automated 0G Spending Streams
          </CardTitle>
          <button
            onClick={() => setShowAddForm(prev => !prev)}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-600/30 text-purple-300 transition-colors font-medium border border-white/5"
          >
            <Plus className="w-3.5 h-3.5" /> New Stream
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2.5 animate-fadeIn">
            <p className="text-xs font-semibold text-purple-200">Create Automated Stream Protocol</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Stream title (e.g. Node Hosting)"
                className="h-9 px-3 bg-black/50 border border-white/10 rounded-lg text-xs outline-none focus:border-purple-500 text-white"
                value={newStreamName}
                onChange={e => setNewStreamName(e.target.value)}
              />
              <input
                type="number"
                placeholder="Rate in 0G (e.g. 1.5)"
                className="h-9 px-3 bg-black/50 border border-white/10 rounded-lg text-xs outline-none focus:border-purple-500 text-white"
                value={newStreamRate}
                onChange={e => setNewStreamRate(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)} className="text-xs h-7">
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddStream} className="text-xs h-7">
                Deploy Stream
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2.5">
          {streams.map((stream, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-100">{stream.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    stream.active ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-white/10 text-slate-400"
                  }`}>
                    {stream.active ? "Streaming" : "Paused"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                  <span>Rate: <strong className="text-purple-300 font-mono">{stream.rate}</strong> / {stream.interval}</span>
                  <span>•</span>
                  <span className="font-mono text-slate-500">{stream.recipient}</span>
                </div>
              </div>

              <button
                onClick={() => toggleStream(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  stream.active 
                    ? "bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30" 
                    : "bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/30"
                }`}
              >
                {stream.active ? "Pause" : "Resume"}
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
