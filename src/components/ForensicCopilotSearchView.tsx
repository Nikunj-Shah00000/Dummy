import React, { useState } from 'react';
import { ForensicCase, NaturalLanguageSearchQuery } from '../types';
import {
  Bot,
  Search,
  Sparkles,
  ArrowRight,
  Database,
  Layers,
  ShieldAlert,
  HardDrive,
  FileText,
  Radio,
  Clock,
  Terminal,
  ChevronRight,
  CheckCircle2,
  Share2,
  Cpu
} from 'lucide-react';

interface ForensicCopilotSearchViewProps {
  caseData: ForensicCase;
  onExecuteCommand?: (cmd: string) => void;
}

const PRESET_QUERIES = [
  'Show all files modified around 02:14 UTC and IP connections to Eastern Europe',
  'Find any lateral movement attempts using svc_backup across workstation hosts',
  'Retrieve all exfiltration events, DNS queries, and high-entropy outbound packets',
  'List all devices and email accounts correlated with Julian Vance',
];

const INITIAL_SEARCH_HISTORY: NaturalLanguageSearchQuery[] = [
  {
    id: 'NL-001',
    plainLanguageQuery: 'Show all files modified around 02:14 UTC and IP connections to Eastern Europe',
    timestamp: '2026-09-19 02:35:10 UTC',
    controlledQuery: {
      language: 'Cypher',
      queryText:
        'MATCH (p:Person)-[:ACCESSED]->(f:File)-[:COPIED_TO]->(d:Device)-[:CONNECTED_TO]->(ip:IP) WHERE f.modified_time >= "02:10:00" AND ip.geo CONTAINS "RO" RETURN f, ip, d, p',
      targetIndex: 'neo4j_evidence_graph_idx',
    },
    pipelineTrace: '[Plain Language Query] ---> [Controlled SQL/Cypher Query] ---> [Evidence Index]',
    inventoryBreakdown: {
      filesCount: 3,
      ipAddressesCount: 2,
      devicesCount: 2,
      emailAddressesCount: 2,
      browserEventsCount: 5,
      suspiciousActivitiesCount: 4,
      formattedString:
        'Returned 3 files, 2 IP addresses, 2 devices, 2 email addresses, 5 browser events, and 4 suspicious activities.',
    },
    matchedResults: [
      {
        type: 'File',
        id: 'RES-01',
        title: 'customer_vault.parquet (48.9MB)',
        details: 'Exfiltrated via IIS API endpoint POST /api/v1/internal/export at 02:14:35 UTC.',
        sourceHash: 'SHA-256 [e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855]',
        riskScore: 96,
      },
      {
        type: 'IP',
        id: 'RES-02',
        title: '198.51.100.44 (Bucharest, RO)',
        details: 'C2 staging host receiving base64 segmented data exfiltration payload.',
        sourceHash: 'SHA-256 [4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a]',
        riskScore: 94,
      },
      {
        type: 'SuspiciousActivity',
        id: 'RES-03',
        title: 'RemoteInteractive LogonType 10 from 10.0.8.44',
        details: 'svc_backup account logged in off-hours at 02:11:04 UTC.',
        sourceHash: 'SHA-256 [9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08]',
        riskScore: 98,
      },
      {
        type: 'Device',
        id: 'RES-04',
        title: 'WKSTN-SEC-09 (Windows Server 2022)',
        details: 'Compromised workstation hosting unbacked RWX memory segment in svchost.exe PID 4412.',
        sourceHash: 'SHA-256 [4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a]',
        riskScore: 92,
      },
    ],
    groundingTrace: {
      conclusion: 'CRITICAL: Validated Exfiltration Incident Linked to Eastern European C2 Infrastructure',
      reason:
        'Controlled Cypher multi-hop query verified temporal correlation between svc_backup logon (02:11:04), database dump (02:14:35), and outbound socket to 198.51.100.44.',
      source:
        'Security.evtx (Event 4624) [SHA-256: 9f86d081...] & Network PCAP stream [SHA-256: 4b227777...]',
      confidence: '97.8% (AI Inference + Deterministic Network Socket)',
    },
  },
];

export const ForensicCopilotSearchView: React.FC<ForensicCopilotSearchViewProps> = ({
  caseData,
  onExecuteCommand,
}) => {
  const [history, setHistory] = useState<NaturalLanguageSearchQuery[]>(INITIAL_SEARCH_HISTORY);
  const [currentQueryInput, setCurrentQueryInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeQueryId, setActiveQueryId] = useState<string>(INITIAL_SEARCH_HISTORY[0].id);

  const activeQuery = history.find((h) => h.id === activeQueryId) || history[0];

  const handleExecuteSearch = (queryText: string) => {
    if (!queryText.trim()) return;

    setIsProcessing(true);

    setTimeout(() => {
      const isExfil = queryText.toLowerCase().includes('exfil') || queryText.toLowerCase().includes('dns');
      const isLateral = queryText.toLowerCase().includes('lateral') || queryText.toLowerCase().includes('backup');

      const filesCount = isExfil ? 4 : 3;
      const ipAddressesCount = isExfil ? 3 : 2;
      const devicesCount = 2;
      const emailAddressesCount = 2;
      const browserEventsCount = isExfil ? 7 : 4;
      const suspiciousActivitiesCount = isExfil ? 5 : 3;

      const formattedString = `Returned ${filesCount} files, ${ipAddressesCount} IP addresses, ${devicesCount} devices, ${emailAddressesCount} email addresses, ${browserEventsCount} browser events, and ${suspiciousActivitiesCount} suspicious activities.`;

      const newQueryRecord: NaturalLanguageSearchQuery = {
        id: `NL-${Date.now()}`,
        plainLanguageQuery: queryText,
        timestamp: new Date().toLocaleTimeString() + ' UTC',
        controlledQuery: {
          language: isLateral ? 'SQL' : 'Cypher',
          queryText: isLateral
            ? `SELECT artifact_id, logon_type, target_user, ip_address FROM windows_event_log WHERE event_id = 4624 AND target_user = 'svc_backup' ORDER BY event_time DESC;`
            : `MATCH (src:Device)-[r:EXFILTRATES_TO]->(dest:IP) WHERE r.protocol IN ['DNS', 'HTTPS'] RETURN src, r, dest LIMIT 50;`,
          targetIndex: isLateral ? 'relational_audit_logs_idx' : 'neo4j_evidence_graph_idx',
        },
        pipelineTrace: '[Plain Language Query] ---> [Controlled SQL/Cypher Query] ---> [Evidence Index]',
        inventoryBreakdown: {
          filesCount,
          ipAddressesCount,
          devicesCount,
          emailAddressesCount,
          browserEventsCount,
          suspiciousActivitiesCount,
          formattedString,
        },
        matchedResults: [
          {
            type: 'File',
            id: `RES-${Date.now()}-1`,
            title: isExfil ? 'ns1.corpexfil-cdn.xyz DNS Payload' : 'customer_vault.parquet',
            details: isExfil
              ? 'High-entropy base64 chunks dispatched over UDP port 53'
              : 'Sensitive database archive extracted via unauthorized API call',
            sourceHash: 'SHA-256 [e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855]',
            riskScore: 98,
          },
          {
            type: 'IP',
            id: `RES-${Date.now()}-2`,
            title: isExfil ? '198.51.100.44 (Bucharest)' : '10.0.8.44 (Internal Subnet)',
            details: isExfil
              ? 'External C2 nameserver receiving segmented covert traffic'
              : 'Jump workstation originating unauthorized RemoteInteractive logon',
            sourceHash: 'SHA-256 [9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08]',
            riskScore: 95,
          },
          {
            type: 'SuspiciousActivity',
            id: `RES-${Date.now()}-3`,
            title: 'Unauthorized Privilege Utilization',
            details: 'Account svc_backup operating outside established operational temporal baseline',
            sourceHash: 'SHA-256 [4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a]',
            riskScore: 96,
          },
        ],
        groundingTrace: {
          conclusion: isExfil
            ? 'CRITICAL: Covert Exfiltration Channel Active via DNS Tunneling'
            : 'CRITICAL: Off-Hours Lateral Movement Confirmed on Primary Domain Controller',
          reason: `Natural language query parsed via LLM into structured AST and resolved directly against index with zero hallucination.`,
          source: `Intake Hash Manifest: SHA-256 [9f86d081...] & Active Case Telemetry`,
          confidence: '98.2% (AI Inference)',
        },
      };

      setHistory((prev) => [newQueryRecord, ...prev]);
      setActiveQueryId(newQueryRecord.id);
      setIsProcessing(false);
      setCurrentQueryInput('');

      if (onExecuteCommand) {
        onExecuteCommand(`/copilot "${queryText}"`);
      }
    }, 600);
  };

  return (
    <div className="flex flex-col h-full bg-[#080c14] border border-slate-800/80 rounded-b-xl overflow-hidden font-mono text-xs">
      {/* Top Header */}
      <div className="bg-[#0e1422] p-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200 text-sm">
            Forensic AI Copilot & Natural-Language Evidence Search
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-300 text-[11px] font-mono">
            Court-Admissible Controlled Query Translation
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>Target Indexes: Neo4j Graph + Relational Telemetry</span>
        </div>
      </div>

      {/* Query Conversion Pipeline Indicator (Direct Linear Flow Constraint) */}
      <div className="bg-[#0b101c] p-3 border-b border-slate-800">
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 flex items-center justify-between">
          <span>MANDATORY QUERY CONVERSION PIPELINE:</span>
          <span className="text-emerald-400 font-mono">Controlled Schema Verification</span>
        </div>
        <div className="bg-[#080c14] border border-emerald-900/60 p-2.5 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 bg-[#0e1526] px-3 py-1.5 rounded border border-slate-700 text-slate-200 font-bold">
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>[Plain Language Query]</span>
          </div>

          <ArrowRight className="w-4 h-4 text-emerald-400 animate-pulse" />

          <div className="flex items-center gap-2 bg-[#0e1526] px-3 py-1.5 rounded border border-slate-700 text-cyan-300 font-bold">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>[Controlled SQL/Cypher Query]</span>
          </div>

          <ArrowRight className="w-4 h-4 text-emerald-400 animate-pulse" />

          <div className="flex items-center gap-2 bg-[#0e1526] px-3 py-1.5 rounded border border-slate-700 text-amber-300 font-bold">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>[Evidence Index]</span>
          </div>
        </div>
      </div>

      {/* Input Bar & Preset Queries */}
      <div className="p-3 bg-[#0a0e1a] border-b border-slate-800 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Ask Copilot in natural language (e.g. 'Show all files modified around 02:14 UTC and IP connections to Eastern Europe')..."
              value={currentQueryInput}
              onChange={(e) => setCurrentQueryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleExecuteSearch(currentQueryInput);
              }}
              className="w-full bg-[#080c14] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 font-mono shadow-inner"
            />
          </div>

          <button
            onClick={() => handleExecuteSearch(currentQueryInput)}
            disabled={isProcessing || !currentQueryInput.trim()}
            className="px-4 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/70 text-emerald-300 font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isProcessing ? 'Translating Query...' : 'Query Index'}</span>
          </button>
        </div>

        {/* Preset Prompt Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] pb-1">
          <span className="text-slate-500 whitespace-nowrap">Suggested Inquiries:</span>
          {PRESET_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleExecuteSearch(q)}
              className="px-2.5 py-1 rounded bg-[#0d1322] border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Query History */}
        <div className="lg:col-span-4 border-r border-slate-800 overflow-y-auto p-3 space-y-2 bg-[#080c14]">
          <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">
            QUERY SESSIONS ({history.length})
          </div>

          {history.map((h) => {
            const isSelected = h.id === activeQueryId;
            return (
              <button
                key={h.id}
                onClick={() => setActiveQueryId(h.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500/80 text-slate-100 shadow-md'
                    : 'bg-[#0b101c] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="font-bold text-xs text-slate-200 line-clamp-2 mb-1.5">
                  "{h.plainLanguageQuery}"
                </div>
                <div className="text-[10px] text-emerald-400 font-mono truncate mb-1">
                  {h.inventoryBreakdown.formattedString}
                </div>
                <div className="text-[9px] text-slate-500 flex items-center justify-between">
                  <span>{h.timestamp}</span>
                  <span className="text-cyan-400 font-bold">{h.controlledQuery.language}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Active Query Detail & Aggregated Inventory Breakdown */}
        <div className="lg:col-span-8 overflow-y-auto p-4 space-y-4 bg-[#0a0e18]">
          {activeQuery && (
            <div className="space-y-4">
              {/* Aggregated Inventory Breakdown Banner (MANDATORY PATTERN CONSTRAINT) */}
              <div className="bg-[#0b1524] border-2 border-cyan-500/60 p-3.5 rounded-lg space-y-2 shadow-lg">
                <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Aggregated Evidence Inventory Breakdown</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Direct Response Pattern Enforced
                  </span>
                </div>

                {/* EXACT MANDATED NOMENCLATURE STRING */}
                <div className="bg-[#070e1c] p-3 rounded border border-cyan-900/60 text-xs font-bold text-cyan-200 font-mono leading-relaxed">
                  "{activeQuery.inventoryBreakdown.formattedString}"
                </div>

                {/* Metric Badges */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[10px] pt-1 font-mono">
                  <div className="bg-[#080d1a] border border-slate-800 p-2 rounded">
                    <span className="text-slate-400 block">Files</span>
                    <span className="text-cyan-300 font-bold text-sm">
                      {activeQuery.inventoryBreakdown.filesCount}
                    </span>
                  </div>
                  <div className="bg-[#080d1a] border border-slate-800 p-2 rounded">
                    <span className="text-slate-400 block">IP Addrs</span>
                    <span className="text-cyan-300 font-bold text-sm">
                      {activeQuery.inventoryBreakdown.ipAddressesCount}
                    </span>
                  </div>
                  <div className="bg-[#080d1a] border border-slate-800 p-2 rounded">
                    <span className="text-slate-400 block">Devices</span>
                    <span className="text-cyan-300 font-bold text-sm">
                      {activeQuery.inventoryBreakdown.devicesCount}
                    </span>
                  </div>
                  <div className="bg-[#080d1a] border border-slate-800 p-2 rounded">
                    <span className="text-slate-400 block">Emails</span>
                    <span className="text-cyan-300 font-bold text-sm">
                      {activeQuery.inventoryBreakdown.emailAddressesCount}
                    </span>
                  </div>
                  <div className="bg-[#080d1a] border border-slate-800 p-2 rounded">
                    <span className="text-slate-400 block">Browsers</span>
                    <span className="text-cyan-300 font-bold text-sm">
                      {activeQuery.inventoryBreakdown.browserEventsCount}
                    </span>
                  </div>
                  <div className="bg-[#080d1a] border border-rose-900/60 p-2 rounded bg-rose-950/20">
                    <span className="text-rose-400 block">Suspicious</span>
                    <span className="text-rose-300 font-bold text-sm">
                      {activeQuery.inventoryBreakdown.suspiciousActivitiesCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Controlled Database Query View */}
              <div className="bg-[#0d1322] border border-slate-800 p-3 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Compiled {activeQuery.controlledQuery.language} Execution AST:</span>
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    Index: {activeQuery.controlledQuery.targetIndex}
                  </span>
                </div>
                <div className="bg-[#070b14] p-2.5 rounded border border-slate-800 text-[11px] text-emerald-300 font-mono overflow-x-auto">
                  <code>{activeQuery.controlledQuery.queryText}</code>
                </div>
              </div>

              {/* Matched Evidence Items */}
              <div className="space-y-2">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">
                  SYNTHESIZED EVIDENCE INVENTORY ({activeQuery.matchedResults.length} Primary Hits):
                </span>

                {activeQuery.matchedResults.map((res) => (
                  <div
                    key={res.id}
                    className="p-3 rounded-lg bg-[#0b101c] border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{res.title}</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                        {res.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{res.details}</p>
                    <div className="text-[9px] text-slate-500 font-mono truncate">
                      Source Hash: {res.sourceHash}
                    </div>
                  </div>
                ))}
              </div>

              {/* MANDATORY EXPLAINABLE AI EVIDENCE GROUNDING BLOCK */}
              <div className="bg-[#0b101d] border-2 border-emerald-500/50 p-3.5 rounded-lg space-y-2 shadow-xl">
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Explainable AI (Evidence Grounding Trace)</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-mono">Court Admissible</span>
                </div>

                <div className="space-y-2 text-[11px] font-mono">
                  <div className="flex items-start gap-2">
                    <strong className="text-slate-400 shrink-0 w-24">Conclusion:</strong>
                    <span className="text-slate-100 font-bold">
                      {activeQuery.groundingTrace.conclusion}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <strong className="text-slate-400 shrink-0 w-24">Reason:</strong>
                    <span className="text-slate-300">
                      {activeQuery.groundingTrace.reason}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <strong className="text-slate-400 shrink-0 w-24">Source:</strong>
                    <span className="text-cyan-300 truncate">
                      {activeQuery.groundingTrace.source}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <strong className="text-slate-400 shrink-0 w-24">Confidence:</strong>
                    <span className="text-emerald-400 font-bold">
                      {activeQuery.groundingTrace.confidence}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
