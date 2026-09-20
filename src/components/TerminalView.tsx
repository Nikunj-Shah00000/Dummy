import React, { useState, useRef, useEffect } from 'react';
import { TerminalEntry, ForensicCase } from '../types';
import { Terminal, Send, Trash2, HelpCircle, ShieldAlert, Cpu, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

interface TerminalViewProps {
  entries: TerminalEntry[];
  onExecuteCommand: (cmd: string) => Promise<void>;
  isLoading: boolean;
  activeCase: ForensicCase;
  onSelectCase: (caseId: string) => void;
  onOpenReport: () => void;
}

export const TerminalView: React.FC<TerminalViewProps> = ({
  entries,
  onExecuteCommand,
  isLoading,
  activeCase,
  onSelectCase,
  onOpenReport,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    setInputVal('');
    await onExecuteCommand(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInputVal('');
        } else {
          setHistoryIndex(nextIndex);
          setInputVal(commandHistory[nextIndex]);
        }
      }
    }
  };

  const quickCommands = [
    { cmd: '/triage', label: '/triage', desc: 'Risk Categorization & IoC Triage', color: 'border-amber-500/40 text-amber-300 hover:bg-amber-950/40' },
    { cmd: '/correlate', label: '/correlate', desc: 'Reconstruct Cryptographic Timeline', color: 'border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40' },
    { cmd: '/authenticate', label: '/authenticate', desc: 'Magic Bytes & Timestomp Check', color: 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40' },
    { cmd: '/vault', label: '/vault', desc: 'MinIO WORM Storage & AES-256 Check', color: 'border-purple-500/40 text-purple-300 hover:bg-purple-950/40' },
    { cmd: '/custody', label: '/custody', desc: 'ISO/IEC 27037 Custody Ledger Audit', color: 'border-blue-500/40 text-blue-300 hover:bg-blue-950/40' },
    { cmd: '/provenance', label: '/provenance', desc: 'Backward Lineage Mapping Verification', color: 'border-teal-500/40 text-teal-300 hover:bg-teal-950/40' },
    { cmd: '/nsrl', label: '/nsrl', desc: 'NIST NSRL Database Cross-Reference', color: 'border-indigo-500/40 text-indigo-300 hover:bg-indigo-950/40' },
    { cmd: '/tamper', label: '/tamper', desc: 'Anti-Forensics & Timestomp Analysis', color: 'border-rose-500/40 text-rose-300 hover:bg-rose-950/40' },
    { cmd: '/report', label: '/report', desc: 'Generate Court-Admissible Narrative', color: 'border-amber-400/40 text-amber-200 hover:bg-amber-950/40' },
    { cmd: '/cases', label: '/cases', desc: 'List Forensic Dossiers', color: 'border-slate-500 text-slate-300 hover:bg-slate-800' },
    { cmd: '/clear', label: '/clear', desc: 'Clear Screen', color: 'border-slate-600 text-slate-400 hover:bg-slate-800' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#070a0f] border border-slate-800/80 rounded-b-xl overflow-hidden font-terminal text-[13px] leading-relaxed shadow-2xl relative">
      {/* Terminal Header Bar */}
      <div className="bg-[#0e131d] px-4 py-2.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs select-none">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200">idf-investigator@apple-forensics: ~</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            ACTIVE: {activeCase.codeName}
          </span>
        </div>

        {/* Action pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onExecuteCommand('/report')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-950/60 border border-purple-600/40 text-purple-300 hover:bg-purple-900/60 transition-colors text-[11px]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Report</span>
          </button>
          <button
            onClick={() => onExecuteCommand('/clear')}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Clear Terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Command Toolbar */}
      <div className="bg-[#0b0f17] px-4 py-2 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap">
        <span className="text-slate-500 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Protocol:
        </span>
        {quickCommands.map((q) => (
          <button
            key={q.cmd}
            onClick={() => onExecuteCommand(q.cmd)}
            disabled={isLoading}
            className={`px-2.5 py-0.5 rounded border text-[11px] font-mono transition-all duration-150 disabled:opacity-50 ${q.color}`}
            title={q.desc}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Main Terminal Output Stream */}
      <div
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 text-slate-300 selection:bg-emerald-800 selection:text-white"
      >
        {entries.map((entry) => {
          if (entry.type === 'system') {
            return (
              <div key={entry.id} className="whitespace-pre-wrap text-emerald-400 font-terminal opacity-95">
                {entry.content}
              </div>
            );
          }

          if (entry.type === 'input') {
            return (
              <div key={entry.id} className="flex items-start gap-2 text-slate-100 font-terminal mt-2">
                <span className="text-emerald-400 font-bold shrink-0">idf-engine@apple-forensics:~$</span>
                <span className="text-white font-semibold">{entry.content}</span>
                <span className="text-[10px] text-slate-500 ml-auto self-center font-mono">
                  {entry.timestamp}
                </span>
              </div>
            );
          }

          if (entry.type === 'error') {
            return (
              <div key={entry.id} className="p-3 rounded bg-red-950/40 border border-red-800/60 text-red-300 font-terminal whitespace-pre-wrap flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>{entry.content}</div>
              </div>
            );
          }

          // Normal output
          return (
            <div
              key={entry.id}
              className="p-3.5 rounded bg-[#0b101b]/90 border border-slate-800/80 text-slate-200 font-terminal whitespace-pre-wrap shadow-inner"
            >
              {entry.content}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-emerald-400 font-mono py-2">
            <Cpu className="w-4 h-4 animate-spin text-emerald-400" />
            <span>[FORENSIC ENGINE REASONING] Executing multi-source correlation & SHAP attribution...</span>
            <span className="terminal-cursor"></span>
          </div>
        )}
      </div>

      {/* Terminal Input Line */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#0a0e17] border-t border-slate-800/80 p-3 flex items-center gap-2"
      >
        <span className="text-emerald-400 font-bold shrink-0 font-terminal text-sm">
          idf-engine@apple-forensics:~$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Type forensic command (/triage, /correlate, /authenticate, /report, /help) or log text..."
          className="flex-1 bg-transparent border-none outline-none text-slate-100 font-terminal text-sm placeholder-slate-600 focus:ring-0"
          autoFocus
        />
        <button
          type="submit"
          disabled={isLoading || !inputVal.trim()}
          className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-xs font-mono"
        >
          <span>EXEC</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
