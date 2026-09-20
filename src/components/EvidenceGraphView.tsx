import React, { useState, useMemo } from 'react';
import { ForensicCase, EvidenceGraphNode, EvidenceGraphEdge } from '../types';
import {
  Share2,
  User,
  FileCode,
  HardDrive,
  Globe,
  Radio,
  Search,
  Filter,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  ChevronRight,
  ExternalLink,
  Code2
} from 'lucide-react';

interface EvidenceGraphViewProps {
  caseData: ForensicCase;
}

export const EvidenceGraphView: React.FC<EvidenceGraphViewProps> = ({ caseData }) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-person-1');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [highlightPathActive, setHighlightPathActive] = useState<boolean>(true);
  const [cypherQuery, setCypherQuery] = useState<string>(
    'MATCH p=(p:Person)-[:ACCESSED]->(f:File)-[:COPIED_TO]->(d:Device)-[:CONNECTED_TO]->(ip:IP)-[:VISITED]->(dom:Domain) RETURN p'
  );
  const [cypherOutput, setCypherOutput] = useState<string | null>(null);

  // Graph Nodes & Edges strictly adhering to specification:
  // Node categories: (:Person), (:File), (:Device), (:IP), (:Domain)
  // Edges: (:Person)-[:ACCESSED]->(:File)-[:COPIED_TO]->(:Device)-[:CONNECTED_TO]->(:IP)-[:VISITED]->(:Domain)
  const defaultNodes: EvidenceGraphNode[] = useMemo(
    () => [
      {
        id: 'node-person-1',
        label: 'Julian Vance',
        category: 'Person',
        subLabel: 'Suspect / DB Admin (GHOST_ECHO)',
        x: 80,
        y: 190,
        metadata: {
          role: 'Database Administrator',
          employeeId: 'EMP-8942-01',
          clearance: 'Level-4 (Restricted)',
          compromisedAccount: 'svc_backup'
        }
      },
      {
        id: 'node-person-2',
        label: 'Shadow Handler',
        category: 'Person',
        subLabel: 'External C2 Operator (@GhostNode_44)',
        x: 80,
        y: 350,
        metadata: {
          telegramHandle: '@GhostNode_44',
          threatGroup: 'ADV-OBSIDIAN-09',
          intent: 'IP Exfiltration & Corporate Extortion'
        }
      },
      {
        id: 'node-file-1',
        label: 'customer_vault.parquet',
        category: 'File',
        subLabel: '89.1 MB Exfiltrated DB Export',
        x: 270,
        y: 130,
        metadata: {
          sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          recordCount: '48,200 Customer Records',
          sourcePath: '/api/v1/internal/export'
        }
      },
      {
        id: 'node-file-2',
        label: 'executive_contracts.parquet',
        category: 'File',
        subLabel: '14.8 MB Confidential Legal Docs',
        x: 270,
        y: 250,
        metadata: {
          sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
          mftRecord: '#108422',
          timestompDetected: 'True (5-year roll-back)'
        }
      },
      {
        id: 'node-device-1',
        label: 'WKSTN-SEC-09',
        category: 'Device',
        subLabel: 'Jump Host (10.0.8.44)',
        x: 470,
        y: 190,
        metadata: {
          macAddress: '00:1A:2B:3C:4D:5E',
          os: 'Windows Server 2022 Datacenter',
          eventLogs: 'Security.evtx (Event 4624 & 4688)'
        }
      },
      {
        id: 'node-device-2',
        label: 'DEV-IPHONE15-PRO',
        category: 'Device',
        subLabel: 'Mobile Device (Cellebrite UFDR)',
        x: 470,
        y: 340,
        metadata: {
          imei: '356938035643809',
          extraction: 'Cellebrite UFED 8.4',
          targetApp: 'Telegram Secret Chat #44'
        }
      },
      {
        id: 'node-ip-1',
        label: '198.51.100.44',
        category: 'IP',
        subLabel: 'External C2 Exfil Receiver',
        x: 670,
        y: 190,
        metadata: {
          asn: 'AS44182 (Bulletproof Hosting)',
          geo: 'Bucharest, Romania',
          protocol: 'DNS Tunneling / UDP 53'
        }
      },
      {
        id: 'node-ip-2',
        label: '185.220.101.5',
        category: 'IP',
        subLabel: 'Tor Exit Node Gateway',
        x: 670,
        y: 340,
        metadata: {
          torRelay: 'TorExitNodeEU_09',
          port: '9001 (ORPort)',
          associatedTraffic: 'Telegram API TLS 1.3'
        }
      },
      {
        id: 'node-domain-1',
        label: 'ns1.corpexfil-cdn.xyz',
        category: 'Domain',
        subLabel: 'Authoritative DNS Tunneling Nameserver',
        x: 870,
        y: 190,
        metadata: {
          registrar: 'Njalla Anonymous Registrar',
          created: '2026-09-17 (48h prior)',
          recordType: 'NS / SOA Wildcard'
        }
      },
      {
        id: 'node-domain-2',
        label: 'c2-darknode.onion',
        category: 'Domain',
        subLabel: 'Tor Hidden Service v3',
        x: 870,
        y: 340,
        metadata: {
          onionService: 'v3 56-character base32 address',
          firstSeen: '2026-09-19 02:28 UTC'
        }
      }
    ],
    []
  );

  const defaultEdges: EvidenceGraphEdge[] = useMemo(
    () => [
      // (:Person) -[:ACCESSED]-> (:File)
      {
        id: 'e1',
        source: 'node-person-1',
        target: 'node-file-1',
        relationship: 'ACCESSED',
        label: 'ACCESSED',
        details: 'svc_backup executed POST /api/v1/internal/export at 02:14:35 UTC'
      },
      {
        id: 'e2',
        source: 'node-person-1',
        target: 'node-file-2',
        relationship: 'ACCESSED',
        label: 'ACCESSED',
        details: 'svc_backup extracted contract archives at 02:17:02 UTC'
      },
      // (:File) -[:COPIED_TO]-> (:Device)
      {
        id: 'e3',
        source: 'node-file-1',
        target: 'node-device-1',
        relationship: 'COPIED_TO',
        label: 'COPIED_TO',
        details: 'Parquet payloads staged in C:\\Users\\Public\\staging.tmp'
      },
      {
        id: 'e4',
        source: 'node-file-2',
        target: 'node-device-2',
        relationship: 'COPIED_TO',
        label: 'COPIED_TO',
        details: 'Snippet transferred via AirDrop / Bluetooth RF to suspect mobile'
      },
      // (:Device) -[:CONNECTED_TO]-> (:IP)
      {
        id: 'e5',
        source: 'node-device-1',
        target: 'node-ip-1',
        relationship: 'CONNECTED_TO',
        label: 'CONNECTED_TO',
        details: 'UDP port 59124 outbound connection transmitting DNS exfil chunks'
      },
      {
        id: 'e6',
        source: 'node-device-2',
        target: 'node-ip-2',
        relationship: 'CONNECTED_TO',
        label: 'CONNECTED_TO',
        details: 'Encrypted TLS 1.3 socket over cellular data to Tor exit node'
      },
      // (:IP) -[:VISITED]-> (:Domain)
      {
        id: 'e7',
        source: 'node-ip-1',
        target: 'node-domain-1',
        relationship: 'VISITED',
        label: 'VISITED',
        details: 'DNS query resolution routing to exfiltration nameserver'
      },
      {
        id: 'e8',
        source: 'node-ip-2',
        target: 'node-domain-2',
        relationship: 'VISITED',
        label: 'VISITED',
        details: 'SOCKS5 proxy rendezvous with Tor Hidden Service C2 endpoint'
      },
      // Handler tie
      {
        id: 'e9',
        source: 'node-person-2',
        target: 'node-device-2',
        relationship: 'ACCESSED',
        label: 'ACCESSED',
        details: 'Direct encrypted Telegram chat session with suspect'
      }
    ],
    []
  );

  const filteredNodes = useMemo(() => {
    if (selectedCategoryFilter === 'ALL') return defaultNodes;
    return defaultNodes.filter((n) => n.category === selectedCategoryFilter);
  }, [defaultNodes, selectedCategoryFilter]);

  const selectedNode = defaultNodes.find((n) => n.id === selectedNodeId);

  const connectedEdges = useMemo(() => {
    if (!selectedNodeId) return [];
    return defaultEdges.filter((e) => e.source === selectedNodeId || e.target === selectedNodeId);
  }, [defaultEdges, selectedNodeId]);

  const handleExecuteCypher = () => {
    setCypherOutput(
      `[CYPHER QUERY EXECUTED SUCCESSFULLY]\nQuery: ${cypherQuery}\nNodes matched: 10\nRelationships traversed: 9\nIdentified Primary Exfiltration Chain:\n  (:Person {name: "Julian Vance"})\n    -[:ACCESSED]-> (:File {name: "customer_vault.parquet"})\n    -[:COPIED_TO]-> (:Device {hostname: "WKSTN-SEC-09"})\n    -[:CONNECTED_TO]-> (:IP {addr: "198.51.100.44"})\n    -[:VISITED]-> (:Domain {fqdn: "ns1.corpexfil-cdn.xyz"})\nResult: Multi-hop adversarial path proven with 100% cryptographic audit trail.`
    );
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Person':
        return { bg: 'bg-amber-950', border: 'border-amber-500', text: 'text-amber-300', stroke: '#f59e0b' };
      case 'File':
        return { bg: 'bg-emerald-950', border: 'border-emerald-500', text: 'text-emerald-300', stroke: '#10b981' };
      case 'Device':
        return { bg: 'bg-blue-950', border: 'border-blue-500', text: 'text-blue-300', stroke: '#3b82f6' };
      case 'IP':
        return { bg: 'bg-purple-950', border: 'border-purple-500', text: 'text-purple-300', stroke: '#a855f7' };
      case 'Domain':
        return { bg: 'bg-red-950', border: 'border-red-500', text: 'text-red-300', stroke: '#ef4444' };
      default:
        return { bg: 'bg-slate-900', border: 'border-slate-700', text: 'text-slate-300', stroke: '#64748b' };
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Person':
        return <User className="w-3.5 h-3.5" />;
      case 'File':
        return <FileCode className="w-3.5 h-3.5" />;
      case 'Device':
        return <HardDrive className="w-3.5 h-3.5" />;
      case 'IP':
        return <Radio className="w-3.5 h-3.5" />;
      case 'Domain':
        return <Globe className="w-3.5 h-3.5" />;
      default:
        return <Share2 className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#080c14] text-slate-200 overflow-y-auto font-sans">
      {/* Top Banner */}
      <div className="bg-[#0e1626] border border-slate-700/70 rounded-xl p-4 mb-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-950/80 border border-cyan-500/40 rounded-lg text-cyan-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-mono tracking-tight flex items-center gap-2">
                AI EVIDENCE GRAPH &amp; MULTI-HOP LINK ANALYSIS (Neo4j)
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-mono font-bold">
                  GRAPH TOPOLOGY ACTIVE
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Structural Schema: (:Person) → (:File) → (:Device) → (:IP) → (:Domain)
              </p>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 bg-[#070a10] p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <span className="text-[10px] text-slate-500 px-1 font-bold">FILTER:</span>
          {(['ALL', 'Person', 'File', 'Device', 'IP', 'Domain'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-2 py-1 rounded font-bold transition-colors ${
                selectedCategoryFilter === cat
                  ? 'bg-cyan-900/80 text-cyan-200 border border-cyan-600/60 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Graph & Analysis Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left Interactive SVG Graph Canvas */}
        <div className="lg:col-span-8 flex flex-col bg-[#0b101c] border border-slate-800 rounded-xl p-4 shadow-md">
          {/* Canvas Controls Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-emerald-400 font-bold">Nodes: {filteredNodes.length}</span>
              <span>|</span>
              <span className="text-cyan-400 font-bold">Edges: {defaultEdges.length}</span>
              <span>|</span>
              <span className="text-slate-300">Click any node to inspect judicial provenance</span>
            </div>
            <button
              onClick={() => setHighlightPathActive(!highlightPathActive)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                highlightPathActive
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Highlight Critical Path
            </button>
          </div>

          {/* SVG Canvas Stage */}
          <div className="relative flex-1 min-h-[460px] bg-[#05070c] border border-slate-800/80 rounded-lg overflow-hidden flex items-center justify-center">
            {/* Background grid pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

            <svg className="w-full h-full min-h-[460px] select-none" viewBox="0 0 980 480">
              <defs>
                {/* Arrowhead marker */}
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="20"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#0ea5e9" />
                </marker>
                <marker
                  id="arrow-muted"
                  viewBox="0 0 10 10"
                  refX="20"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                </marker>
              </defs>

              {/* Render Edges */}
              {defaultEdges.map((edge) => {
                const sNode = defaultNodes.find((n) => n.id === edge.source);
                const tNode = defaultNodes.find((n) => n.id === edge.target);
                if (!sNode || !tNode) return null;

                const isConnectedToSelected =
                  selectedNodeId === edge.source || selectedNodeId === edge.target;
                const isCriticalPath =
                  highlightPathActive &&
                  (edge.id === 'e1' || edge.id === 'e3' || edge.id === 'e5' || edge.id === 'e7');

                const strokeColor = isCriticalPath
                  ? '#06b6d4'
                  : isConnectedToSelected
                  ? '#a855f7'
                  : '#334155';
                const strokeWidth = isCriticalPath || isConnectedToSelected ? 2.5 : 1.2;

                const midX = (sNode.x! + tNode.x!) / 2;
                const midY = (sNode.y! + tNode.y!) / 2;

                return (
                  <g key={edge.id} className="transition-all">
                    <line
                      x1={sNode.x}
                      y1={sNode.y}
                      x2={tNode.x}
                      y2={tNode.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={isCriticalPath ? '6,3' : 'none'}
                      markerEnd={isCriticalPath ? 'url(#arrow)' : 'url(#arrow-muted)'}
                    />
                    {/* Relationship Pill Label */}
                    <rect
                      x={midX - 35}
                      y={midY - 9}
                      width={70}
                      height={18}
                      rx={4}
                      fill="#090d16"
                      stroke={strokeColor}
                      strokeWidth={1}
                    />
                    <text
                      x={midX}
                      y={midY + 3.5}
                      textAnchor="middle"
                      fill={isCriticalPath ? '#38bdf8' : '#94a3b8'}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}

              {/* Render Nodes */}
              {defaultNodes.map((node) => {
                const colors = getCategoryColor(node.category);
                const isSelected = selectedNodeId === node.id;
                const isHovered = hoveredNodeId === node.id;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedNodeId(node.id)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    className="cursor-pointer"
                  >
                    {/* Pulsing ring for selected node */}
                    {isSelected && (
                      <circle r={28} fill="none" stroke="#38bdf8" strokeWidth={2} className="animate-pulse" />
                    )}

                    {/* Node circle */}
                    <circle
                      r={20}
                      fill={colors.stroke}
                      fillOpacity={0.2}
                      stroke={isSelected ? '#38bdf8' : colors.stroke}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      className="transition-all hover:scale-110"
                    />

                    {/* Category Label inside node */}
                    <text
                      textAnchor="middle"
                      y={4}
                      fill="#f8fafc"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {node.category.substring(0, 3).toUpperCase()}
                    </text>

                    {/* Node Text Label underneath */}
                    <text
                      textAnchor="middle"
                      y={34}
                      fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {node.label}
                    </text>

                    {/* Sub-label */}
                    {node.subLabel && (
                      <text
                        textAnchor="middle"
                        y={46}
                        fill="#64748b"
                        fontSize="8"
                        fontFamily="monospace"
                      >
                        {node.subLabel.substring(0, 24)}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Cypher Query Console */}
          <div className="mt-3 bg-[#070a10] border border-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                NEO4J CYPHER QUERY RUNNER
              </span>
              <button
                onClick={handleExecuteCypher}
                className="px-2.5 py-1 rounded bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-mono font-bold flex items-center gap-1 transition-colors"
              >
                <Play className="w-3 h-3" />
                <span>Run Cypher</span>
              </button>
            </div>
            <textarea
              rows={2}
              value={cypherQuery}
              onChange={(e) => setCypherQuery(e.target.value)}
              className="w-full bg-[#05070c] border border-slate-700 rounded p-2 text-xs font-terminal text-emerald-300 focus:outline-none"
            />
            {cypherOutput && (
              <pre className="mt-2 p-2 bg-[#05070c] border border-slate-800 rounded text-[11px] font-terminal text-cyan-200 whitespace-pre-wrap">
                {cypherOutput}
              </pre>
            )}
          </div>
        </div>

        {/* Right Node Inspector Drawer */}
        <div className="lg:col-span-4 flex flex-col space-y-3 bg-[#0b101c] border border-slate-800 rounded-xl p-4 shadow-md">
          <h3 className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Info className="w-4 h-4 text-cyan-400" />
            GRAPH NODE PROVENANCE INSPECTOR
          </h3>

          {selectedNode ? (
            <div className="space-y-3 text-xs font-mono">
              {/* Selected Node Card */}
              <div className="bg-[#070a10] border border-slate-800 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    {getCategoryIcon(selectedNode.category)}
                    {selectedNode.label}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      getCategoryColor(selectedNode.category).bg
                    } ${getCategoryColor(selectedNode.category).border} ${
                      getCategoryColor(selectedNode.category).text
                    }`}
                  >
                    (:{selectedNode.category})
                  </span>
                </div>
                {selectedNode.subLabel && (
                  <div className="text-[11px] text-slate-400 mt-1">{selectedNode.subLabel}</div>
                )}
              </div>

              {/* Node Metadata Properties */}
              <div className="bg-[#070a10] border border-slate-800 rounded-lg p-3 space-y-1.5">
                <div className="text-[11px] text-slate-400 font-bold uppercase border-b border-slate-800 pb-1">
                  Extracted Properties &amp; Forensic Attributes:
                </div>
                {Object.entries(selectedNode.metadata).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-start gap-2 text-[11px] py-0.5">
                    <span className="text-slate-500 font-mono">{key}:</span>
                    <span className="text-slate-200 font-bold text-right break-all">{String(val)}</span>
                  </div>
                ))}
              </div>

              {/* Connected Relationships Matrix */}
              <div className="bg-[#070a10] border border-slate-800 rounded-lg p-3">
                <div className="text-[11px] text-slate-400 font-bold uppercase border-b border-slate-800 pb-1 mb-2">
                  Connected Relationships ({connectedEdges.length}):
                </div>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {connectedEdges.map((e) => {
                    const isOutgoing = e.source === selectedNode.id;
                    const otherNodeId = isOutgoing ? e.target : e.source;
                    const otherNode = defaultNodes.find((n) => n.id === otherNodeId);

                    return (
                      <div
                        key={e.id}
                        onClick={() => setSelectedNodeId(otherNodeId)}
                        className="p-2 rounded bg-[#0d1424] border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-cyan-300 font-bold">
                            {isOutgoing ? '➔ OUTGOING' : '⬅ INCOMING'}
                          </span>
                          <span className="text-purple-300 font-bold text-[10px]">
                            [:{e.relationship}]
                          </span>
                        </div>
                        <div className="text-slate-200 mt-0.5">
                          Target: <span className="text-emerald-400 font-bold">{otherNode?.label}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                          {e.details}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 font-mono text-xs">
              Click any node in the canvas to inspect its multi-hop connections.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
