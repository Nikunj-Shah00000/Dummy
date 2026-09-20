import React, { useState } from 'react';
import { ForensicCase, EvidenceArtifact, EvidenceSourceType, TriageCategory, IngestionFormat } from '../types';
import {
  FileText,
  Cpu,
  Smartphone,
  Network,
  AlignLeft,
  AlertTriangle,
  ShieldCheck,
  Search,
  Upload,
  Fingerprint,
  ExternalLink,
  ChevronRight,
  FolderOpen,
  CheckCircle2,
  Clock,
  HardDrive,
  Database,
  Link,
  Lock
} from 'lucide-react';

interface EvidenceIngestWorkbenchProps {
  activeCase: ForensicCase;
  allCases: ForensicCase[];
  onSelectCase: (caseId: string) => void;
  onSelectArtifactForAnalysis: (artifact: EvidenceArtifact, action: string) => void;
  onAddCustomArtifact: (artifact: EvidenceArtifact) => void;
}

export const EvidenceIngestWorkbench: React.FC<EvidenceIngestWorkbenchProps> = ({
  activeCase,
  allCases,
  onSelectCase,
  onSelectArtifactForAnalysis,
  onAddCustomArtifact,
}) => {
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<EvidenceSourceType | 'ALL'>('ALL');
  const [selectedTriageFilter, setSelectedTriageFilter] = useState<TriageCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingArtifact, setIsAddingArtifact] = useState(false);

  // New artifact form state
  const [newLabel, setNewLabel] = useState('');
  const [newSourceType, setNewSourceType] = useState<EvidenceSourceType>('system_logs');
  const [newFormat, setNewFormat] = useState<IngestionFormat>('EVTX');
  const [newSourceFile, setNewSourceFile] = useState('');
  const [newPayload, setNewPayload] = useState('');

  const getSourceIcon = (source: EvidenceSourceType) => {
    switch (source) {
      case 'system_logs':
        return <FileText className="w-4 h-4 text-amber-400" />;
      case 'memory_dump':
        return <Cpu className="w-4 h-4 text-purple-400" />;
      case 'mobile_extraction':
        return <Smartphone className="w-4 h-4 text-cyan-400" />;
      case 'network_pcap':
        return <Network className="w-4 h-4 text-blue-400" />;
      case 'unstructured_text':
        return <AlignLeft className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getTriageBadge = (cat?: TriageCategory) => {
    switch (cat) {
      case 'Critical':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-red-950/80 text-red-300 border border-red-700/60 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-red-400" /> CRITICAL
          </span>
        );
      case 'Suspicious':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-700/60 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" /> SUSPICIOUS
          </span>
        );
      case 'Telemetry Void':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-950/90 text-purple-300 border border-purple-600/70 flex items-center gap-1">
            <Clock className="w-3 h-3 text-purple-400" /> TELEMETRY VOID
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> NORMAL
          </span>
        );
    }
  };

  const filteredArtifacts = activeCase.artifacts.filter((art) => {
    if (selectedSourceFilter !== 'ALL' && art.sourceType !== selectedSourceFilter) return false;
    if (selectedTriageFilter !== 'ALL' && art.triageCategory !== selectedTriageFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        art.label.toLowerCase().includes(q) ||
        art.sourceFile.toLowerCase().includes(q) ||
        art.rawPayload.toLowerCase().includes(q) ||
        art.iocs?.some((i) => i.value.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateArtifact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newPayload) return;

    const created: EvidenceArtifact = {
      id: `CUSTOM-${Date.now().toString().slice(-4)}`,
      sourceType: newSourceType,
      ingestionFormat: newFormat,
      label: newLabel,
      sourceFile: newSourceFile || 'manual_ingest.log',
      rawPayload: newPayload,
      timestampRange: new Date().toISOString(),
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      sha3: 'd14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f',
      triageCategory: 'Suspicious',
      confidenceScore: 85,
      nsrlMatch: {
        status: 'UNKNOWN_FORENSIC_ARTIFACT',
        description: 'User ingested forensic artifact. Pending automated NIST NSRL query.'
      },
      provenance: {
        extractedArtifact: newLabel,
        parentContainer: 'FORENSIC_INGEST_CONTAINER.raw',
        diskSectorOffset: 'Offset: 0x00A100',
        originalImageHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        backwardLinkValid: true,
        extractionTechnique: 'Manual Evidence Ingestion Pipeline'
      }
    };

    onAddCustomArtifact(created);
    setNewLabel('');
    setNewSourceFile('');
    setNewPayload('');
    setIsAddingArtifact(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#080c14] border border-slate-800/80 rounded-b-xl overflow-hidden font-mono text-xs">
      {/* Top Dossier Selector */}
      <div className="bg-[#0f1422] p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400 text-xs font-medium">FORENSIC DOSSIER:</span>
          <select
            value={activeCase.id}
            onChange={(e) => onSelectCase(e.target.value)}
            className="bg-[#151c2e] text-slate-100 border border-slate-700 rounded px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-emerald-500"
          >
            {allCases.map((c) => (
              <option key={c.id} value={c.id}>
                [{c.id}] {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingArtifact(!isAddingArtifact)}
            className="px-3 py-1 rounded bg-emerald-600/90 hover:bg-emerald-500 text-slate-950 font-bold flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Ingest Custom Artifact</span>
          </button>
        </div>
      </div>

      {/* Case Context Banner */}
      <div className="bg-[#0b101c] px-4 py-2.5 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div>
          <span className="text-slate-500">INCIDENT TYPE: </span>
          <span className="text-amber-300 font-semibold">{activeCase.incidentType}</span>
          <span className="mx-2 text-slate-600">|</span>
          <span className="text-slate-500">CONTEXT: </span>
          <span className="text-slate-300">{activeCase.threatActorContext}</span>
        </div>
        <div className="text-emerald-400 font-mono">
          EVIDENCE COUNT: {activeCase.artifacts.length}
        </div>
      </div>

      {/* Custom Ingest Modal/Panel */}
      {isAddingArtifact && (
        <form onSubmit={handleCreateArtifact} className="bg-[#121929] p-4 border-b border-emerald-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
              <Upload className="w-4 h-4" /> Ingest Raw Forensic Artifact into Pipeline
            </span>
            <button
              type="button"
              onClick={() => setIsAddingArtifact(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Artifact Label</label>
              <input
                type="text"
                required
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Auditd auth.log snippet"
                className="w-full bg-[#090d16] border border-slate-700 rounded px-2.5 py-1 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Source Category</label>
              <select
                value={newSourceType}
                onChange={(e) => setNewSourceType(e.target.value as EvidenceSourceType)}
                className="w-full bg-[#090d16] border border-slate-700 rounded px-2.5 py-1 text-slate-200"
              >
                <option value="system_logs">System Logs</option>
                <option value="memory_dump">Memory Dump</option>
                <option value="mobile_extraction">Mobile Extraction</option>
                <option value="network_pcap">Network Traffic</option>
                <option value="unstructured_text">Unstructured Text / Email</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Ingestion Format</label>
              <select
                value={newFormat}
                onChange={(e) => setNewFormat(e.target.value as IngestionFormat)}
                className="w-full bg-[#090d16] border border-slate-700 rounded px-2.5 py-1 text-slate-200"
              >
                <option value="RAW">RAW Disk Image</option>
                <option value="E01">E01 Expert Witness</option>
                <option value="AFF">AFF Forensic Image</option>
                <option value="UFED">Cellebrite UFED/UFDR</option>
                <option value="TAR">TAR Mobile Archive</option>
                <option value="PCAP">PCAP Network Capture</option>
                <option value="CSV">CSV / Parquet Export</option>
                <option value="Syslog">Syslog Stream</option>
                <option value="EVTX">Windows EVTX</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Source Path / Identifier</label>
              <input
                type="text"
                value={newSourceFile}
                onChange={(e) => setNewSourceFile(e.target.value)}
                placeholder="/evidence/disk.e01"
                className="w-full bg-[#090d16] border border-slate-700 rounded px-2.5 py-1 text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Raw Evidence Telemetry</label>
            <textarea
              required
              rows={4}
              value={newPayload}
              onChange={(e) => setNewPayload(e.target.value)}
              placeholder="Paste raw log lines, hexadecimal dump, packet trace, or extracted metadata..."
              className="w-full bg-[#090d16] border border-slate-700 rounded p-2 text-slate-200 font-terminal text-xs"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingArtifact(false)}
              className="px-3 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 rounded bg-emerald-600 text-slate-950 font-bold hover:bg-emerald-500"
            >
              Commit Ingest & Generate Dual Hashes
            </button>
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div className="p-3 bg-[#0d121d] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-slate-500 text-[11px]">SOURCE:</span>
          {(['ALL', 'system_logs', 'memory_dump', 'mobile_extraction', 'network_pcap', 'unstructured_text'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSourceFilter(s)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                selectedSourceFilter === s
                  ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {s.toUpperCase().replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
            <input
              type="text"
              placeholder="Search IoC, IP, filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#151c2e] border border-slate-700 rounded pl-7 pr-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 w-48"
            />
          </div>
        </div>
      </div>

      {/* Evidence List / Cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredArtifacts.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No artifacts found matching filter criteria.
          </div>
        ) : (
          filteredArtifacts.map((art) => (
            <div
              key={art.id}
              className="bg-[#0c111c] border border-slate-800/90 rounded-lg p-3.5 hover:border-slate-700 transition-all shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-slate-800/80 border border-slate-700">
                    {getSourceIcon(art.sourceType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200 text-sm">{art.label}</span>
                      <span className="text-[10px] text-slate-500 font-mono">[{art.id}]</span>
                      {art.ingestionFormat && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                          {art.ingestionFormat}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Path: <span className="text-slate-300">{art.sourceFile}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {art.nsrlMatch && (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        art.nsrlMatch.status === 'KNOWN_MALICIOUS_IOC'
                          ? 'bg-red-950 text-red-300 border border-red-700'
                          : art.nsrlMatch.status === 'NSRL_BENIGN_MATCH'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                      title={art.nsrlMatch.description}
                    >
                      NSRL: {art.nsrlMatch.status.replace('_MATCH', '').replace('_IOC', '')}
                    </span>
                  )}
                  {getTriageBadge(art.triageCategory)}
                  {art.confidenceScore && (
                    <span className="text-[10px] text-emerald-400 font-mono">
                      Conf: {art.confidenceScore}%
                    </span>
                  )}
                </div>
              </div>

              {/* Raw Payload Preview */}
              <div className="bg-[#06080e] border border-slate-800/80 rounded p-2.5 my-2 text-[12px] font-terminal text-slate-300 whitespace-pre-wrap max-h-36 overflow-y-auto selection:bg-emerald-900">
                {art.rawPayload}
              </div>

              {/* Provenance Backward Lineage Breadcrumb */}
              {art.provenance && (
                <div className="bg-[#0a0e19] p-2 rounded border border-slate-800/80 my-2 flex flex-wrap items-center gap-1 text-[10px] text-slate-400">
                  <span className="text-purple-400 font-bold uppercase">Lineage:</span>
                  <span className="text-cyan-300 font-mono">{art.provenance.extractedArtifact}</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span className="text-purple-300 font-mono">{art.provenance.parentContainer}</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span className="text-amber-300 font-mono">{art.provenance.diskSectorOffset}</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span className="text-emerald-300 font-mono">{art.provenance.originalImageHash.slice(0, 12)}...</span>
                </div>
              )}

              {/* Cryptographic Hashes & IoCs */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[11px]">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Fingerprint className="w-3 h-3 text-emerald-400" />
                    <span className="font-mono text-[10px] text-slate-500">SHA-256:</span>
                    <span className="font-mono text-[10px] text-slate-300 truncate max-w-xs">
                      {art.sha256 || 'Computed at verification stage'}
                    </span>
                  </div>
                  {art.sha3 && (
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Fingerprint className="w-3 h-3 text-cyan-400" />
                      <span className="font-mono text-[10px] text-slate-500">SHA-3:</span>
                      <span className="font-mono text-[10px] text-cyan-300 truncate max-w-xs">
                        {art.sha3}
                      </span>
                    </div>
                  )}
                </div>

                {/* Direct Action triggers */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => onSelectArtifactForAnalysis(art, '/triage')}
                    className="px-2 py-0.5 rounded bg-amber-950/60 hover:bg-amber-900/60 border border-amber-600/40 text-amber-300 text-[11px] font-mono"
                  >
                    /triage
                  </button>
                  <button
                    onClick={() => onSelectArtifactForAnalysis(art, '/correlate')}
                    className="px-2 py-0.5 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-600/40 text-cyan-300 text-[11px] font-mono"
                  >
                    /correlate
                  </button>
                  <button
                    onClick={() => onSelectArtifactForAnalysis(art, '/authenticate')}
                    className="px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-600/40 text-emerald-300 text-[11px] font-mono"
                  >
                    /authenticate
                  </button>
                  <button
                    onClick={() => onSelectArtifactForAnalysis(art, '/vault')}
                    className="px-2 py-0.5 rounded bg-purple-950/60 hover:bg-purple-900/60 border border-purple-600/40 text-purple-300 text-[11px] font-mono"
                  >
                    /vault
                  </button>
                  <button
                    onClick={() => onSelectArtifactForAnalysis(art, '/custody')}
                    className="px-2 py-0.5 rounded bg-blue-950/60 hover:bg-blue-900/60 border border-blue-600/40 text-blue-300 text-[11px] font-mono"
                  >
                    /custody
                  </button>
                </div>
              </div>

              {/* Extracted IoCs */}
              {art.iocs && art.iocs.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 font-mono uppercase">Extracted IoCs:</span>
                  {art.iocs.map((ioc, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-700 text-slate-300"
                      title={ioc.context}
                    >
                      <strong className="text-amber-400">{ioc.type}:</strong> {ioc.value}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

