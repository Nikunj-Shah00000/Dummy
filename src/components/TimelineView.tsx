import React, { useState } from 'react';
import { TimelineNode, EvidenceSourceType } from '../types';
import {
  Clock,
  Link2,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Cpu,
  Smartphone,
  Network,
  AlignLeft,
  ChevronDown,
  ChevronUp,
  Fingerprint,
  Radio,
  CheckCircle2,
  ShieldX,
  Target,
  Sparkles,
  Lock,
  ArrowRight,
  HelpCircle,
  Layers,
  Activity,
  Zap,
  ShieldAlert
} from 'lucide-react';
import { maskPII } from '../utils/privacy';

interface TimelineViewProps {
  timeline: TimelineNode[];
  onTriggerCorrelate: () => void;
  isLoading: boolean;
  isPrivacyMode?: boolean;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  timeline,
  onTriggerCorrelate,
  isLoading,
  isPrivacyMode = false,
}) => {
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [eventTypeFilter, setEventTypeFilter] = useState<'ALL' | 'DETERMINISTIC' | 'PROBABILISTIC'>('ALL');
  const [viewMode, setViewMode] = useState<'stream' | 'behavior' | 'mitre' | 'gaps' | 'contradictions'>('stream');

  const getSourceBadge = (source: EvidenceSourceType) => {
    switch (source) {
      case 'system_logs':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/60 border border-amber-600/50 text-amber-300 flex items-center gap-1">
            <FileText className="w-3 h-3" /> System Logs (EVTX/IIS)
          </span>
        );
      case 'memory_dump':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/60 border border-purple-600/50 text-purple-300 flex items-center gap-1">
            <Cpu className="w-3 h-3" /> Memory Dump
          </span>
        );
      case 'mobile_extraction':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 border border-cyan-600/50 text-cyan-300 flex items-center gap-1">
            <Smartphone className="w-3 h-3" /> Mobile UFDR
          </span>
        );
      case 'network_pcap':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950/60 border border-blue-600/50 text-blue-300 flex items-center gap-1">
            <Network className="w-3 h-3" /> Network PCAP
          </span>
        );
      case 'unstructured_text':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 border border-emerald-600/50 text-emerald-300 flex items-center gap-1">
            <AlignLeft className="w-3 h-3" /> Seized Exhibit / Media
          </span>
        );
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedNodeId(expandedNodeId === id ? null : id);
  };

  const filteredNodes = timeline.filter((node) => {
    if (filterSeverity === 'VOID') return node.isTelemetryVoid || node.gapAlert;
    if (filterSeverity !== 'ALL' && node.severity !== filterSeverity) return false;
    if (eventTypeFilter === 'DETERMINISTIC' && node.eventType !== 'DETERMINISTIC_LOG') return false;
    if (eventTypeFilter === 'PROBABILISTIC' && node.eventType !== 'PROBABILISTIC_INFERENCE') return false;
    return true;
  });

  const mitreEvents = timeline.filter((n) => n.mitreMapping);
  const gapEvents = timeline.filter((n) => n.gapAlert || n.isTelemetryVoid);
  const contradictionEvents = timeline.filter(
    (n) => n.timelineContradiction || n.rawRecord?.includes('[Flag: Critical Timeline Inconsistency Detected]')
  );

  return (
    <div className="flex flex-col h-full bg-[#080c14] border border-slate-800/80 rounded-b-xl overflow-hidden font-mono text-xs">
      {/* Top Controls & View Switcher */}
      <div className="bg-[#0f1422] p-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-200 text-sm">
            AI Chronological Incident Reconstruction & Telemetry Pipeline
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 text-[11px]">
            {timeline.length} Sequenced Microsecond Events
          </span>
          {isPrivacyMode && (
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-[10px] font-bold">
              PII MASKED
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View Modes */}
          <div className="flex items-center gap-1 bg-[#060912] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('stream')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                viewMode === 'stream'
                  ? 'bg-cyan-600 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Chronological Stream
            </button>
            <button
              onClick={() => setViewMode('contradictions')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
                viewMode === 'contradictions'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3 h-3 text-rose-300" />
              <span>Contradictions ({contradictionEvents.length})</span>
            </button>
            <button
              onClick={() => setViewMode('behavior')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
                viewMode === 'behavior'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Behavioral Baselines</span>
            </button>
            <button
              onClick={() => setViewMode('mitre')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
                viewMode === 'mitre'
                  ? 'bg-amber-600 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Target className="w-3 h-3" />
              <span>MITRE ATT&CK Matrix ({mitreEvents.length})</span>
            </button>
            <button
              onClick={() => setViewMode('gaps')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
                viewMode === 'gaps'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldX className="w-3 h-3" />
              <span>Gap Threat Profiling ({gapEvents.length})</span>
            </button>
          </div>

          <button
            onClick={onTriggerCorrelate}
            disabled={isLoading}
            className="px-3 py-1 rounded bg-cyan-600/90 hover:bg-cyan-500 text-slate-950 font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Re-Correlate Telemetry (/correlate)</span>
          </button>
        </div>
      </div>

      {/* Protocol Banner & Filter Bar */}
      <div className="bg-[#0b101c] px-4 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> ISO/IEC 27037 Standard
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Microsecond Ordering with Deterministic vs Probabilistic Tagging</span>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          {/* Deterministic / Probabilistic Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500">EVENT TYPE:</span>
            {(['ALL', 'DETERMINISTIC', 'PROBABILISTIC'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setEventTypeFilter(t)}
                className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                  eventTypeFilter === t
                    ? 'bg-slate-700 text-cyan-300 font-bold border border-cyan-500/60'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <span className="text-slate-700">|</span>

          {/* Severity Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500">SEVERITY:</span>
            {['ALL', 'critical', 'suspicious', 'VOID'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterSeverity(s)}
                className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                  filterSeverity === s
                    ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: CHRONOLOGICAL STREAM */}
      {viewMode === 'stream' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredNodes.map((node, index) => {
            // Check if this node is an explicit Telemetry Void or gap window
            if (node.isTelemetryVoid || node.gapAlert) {
              return (
                <div
                  key={node.id}
                  className="relative pl-8 border-l-2 border-purple-500/80 my-4"
                >
                  {/* Node dot */}
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-purple-950 border-2 border-purple-500 flex items-center justify-center">
                    <ShieldX className="w-2.5 h-2.5 text-purple-300" />
                  </div>

                  <div className="bg-[#140b1e] border-2 border-purple-500/80 rounded-lg p-3.5 shadow-lg space-y-2">
                    {/* Gap analysis reporting structure */}
                    <div className="bg-purple-950/80 border border-purple-400/80 p-2 rounded text-center">
                      <span className="text-purple-200 font-mono text-xs font-bold tracking-wider animate-pulse">
                        {node.gapAlert?.displayString ||
                          `??? [Potential Unexplained Activity Window: ${node.gapAlert?.durationMinutes || 25} Minutes] ???`}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-purple-900/90 text-purple-200 font-bold text-[10px] uppercase tracking-wider border border-purple-500/60">
                          MISSING EVENT DETECTION
                        </span>
                        <span className="text-purple-300 font-mono text-xs font-semibold">
                          {node.microsecondTimestamp || node.timestamp}
                        </span>
                      </div>
                      <span className="text-[10px] text-purple-400 font-mono">
                        NON-SPECULATION PROTOCOL ACTIVE
                      </span>
                    </div>

                    <p className="text-purple-200 text-xs leading-relaxed">
                      {node.eventDescription}
                    </p>

                    {/* Threat Profiling Constraints */}
                    <div className="text-[11px] text-purple-300/90 bg-[#1e102d] p-2.5 rounded border border-purple-800/60 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-purple-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
                        <span>THREAT PROFILING FLAG:</span>
                      </div>
                      <p className="leading-relaxed">
                        {node.gapAlert?.threatProfiling ||
                          'Flagged for potential wiper execution, log deletion activities, or covert data staging window. Preserved strictly as a factual gap without assuming speculative packets.'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            const isExpanded = expandedNodeId === node.id;
            const isCritical = node.severity === 'critical';
            const isDeterministic = node.eventType === 'DETERMINISTIC_LOG';

            return (
              <div
                key={node.id}
                className={`relative pl-8 border-l-2 ${
                  isCritical ? 'border-amber-500/80' : 'border-slate-700'
                } hover:border-cyan-400 transition-colors`}
              >
                {/* Node dot */}
                <div
                  className={`absolute -left-[7px] top-2 w-3.5 h-3.5 rounded-full ${
                    isCritical ? 'bg-amber-500' : 'bg-cyan-500'
                  } border-2 border-[#080c14]`}
                />

                <div
                  className={`bg-[#0c111c] border ${
                    isCritical ? 'border-amber-500/40' : 'border-slate-800'
                  } rounded-lg p-3.5 shadow hover:border-slate-700 transition-all space-y-2`}
                >
                  {/* Event Differentiation Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold font-mono text-xs">
                        {node.microsecondTimestamp || node.timestamp}
                      </span>
                      <span className="text-slate-600">|</span>
                      {getSourceBadge(node.sourceType)}
                    </div>

                    {/* Deterministic vs Probabilistic Tag */}
                    <div className="flex items-center gap-2">
                      {isDeterministic ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 font-bold text-[10px] flex items-center gap-1">
                          <Lock className="w-3 h-3 text-emerald-400" />
                          DETERMINISTIC CRYPTOGRAPHIC LOG
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-500/60 font-bold text-[10px] flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-fuchsia-400" />
                          PROBABILISTIC AI-CORRELATED INFERENCE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Standard Linear Sequence Tracking Syntax */}
                  {node.linearSequenceSyntax && (
                    <div className="bg-[#060912] px-3 py-1.5 rounded border border-slate-800/80 text-[11px] text-cyan-300 font-mono flex items-center gap-2">
                      <span className="text-slate-500 text-[10px]">PIPELINE:</span>
                      <span className="font-semibold tracking-wide">{node.linearSequenceSyntax}</span>
                    </div>
                  )}

                  {/* Description & Actor */}
                  <div className="text-slate-200 text-xs font-medium leading-relaxed">
                    <span className="text-slate-400">Actor [{node.actor}]: </span>
                    {node.eventDescription}
                  </div>

                  {/* MITRE ATT&CK Matrix Parameter Badge */}
                  {node.mitreMapping && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] bg-[#101827] border border-amber-500/40 p-2 rounded">
                      <Target className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-amber-300 font-bold">ATTACK PHASE:</span>
                      <span className="text-slate-200">{node.mitreMapping.attackPhase}</span>
                      <span className="text-slate-600">|</span>
                      <span className="text-amber-300 font-bold">TECHNIQUE:</span>
                      <span className="text-cyan-300 font-mono">{node.mitreMapping.mitreTechnique}</span>
                      <span className="text-slate-600">|</span>
                      <span className="text-slate-400">ARTIFACT:</span>
                      <span className="text-slate-300 truncate max-w-xs">{node.mitreMapping.mappedArtifact}</span>
                    </div>
                  )}

                  {/* High-Risk Behavioral Anomaly Violation Notification */}
                  {(node.behavioralAnomaly || node.rawRecord?.includes('[Flag: High-Risk Behavioral Anomaly Generated]')) && (
                    <div className="bg-[#180a14] border border-rose-500/80 p-2.5 rounded-lg space-y-1.5 font-mono">
                      <div className="flex items-center justify-between text-rose-300 font-bold text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                          <span>HIGH-RISK BEHAVIORAL ANOMALY (THRESHOLD BREACH)</span>
                        </span>
                        <span className="bg-rose-950 text-rose-300 border border-rose-600 px-1.5 py-0.5 rounded text-[9px] font-bold">
                          VIOLATION
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-slate-300 bg-[#0d050a] p-2 rounded border border-rose-900/40">
                        <div>
                          <span className="text-slate-500 block">Baseline Login Hours:</span>
                          <span className="text-emerald-400 font-bold">{node.behavioralAnomaly?.baselineHours || '08:00 - 19:00 UTC'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Observed Authentication:</span>
                          <span className="text-rose-400 font-bold">{node.behavioralAnomaly?.observedTime || node.microsecondTimestamp}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Baseline Interface Zone:</span>
                          <span className="text-emerald-400 font-bold">{node.behavioralAnomaly?.baselineZone || '10.0.4.0/24 (Management Subnet)'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Observed Interface Zone:</span>
                          <span className="text-rose-400 font-bold">{node.behavioralAnomaly?.observedZone || '10.0.8.44 (DMZ / Lateral Workstation)'}</span>
                        </div>
                      </div>
                      {/* MANDATED ANOMALY VIOLATION NOTIFICATION SYNTAX SCHEMA */}
                      <div className="bg-[#0b0308] px-2.5 py-1.5 rounded border border-rose-600/80 text-rose-200 font-bold text-xs tracking-wider">
                        [Flag: High-Risk Behavioral Anomaly Generated]
                      </div>
                    </div>
                  )}

                  {/* MANDATORY EXPLAINABLE AI EVIDENCE GROUNDING BLOCK */}
                  {node.evidenceGrounding && (
                    <div className="bg-[#0b101d] border border-emerald-500/50 p-2.5 rounded text-[11px] font-mono space-y-1">
                      <div className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                        <Sparkles className="w-3 h-3" />
                        <span>EXPLAINABLE AI EVIDENCE GROUNDING:</span>
                      </div>
                      <div><strong className="text-slate-400">Conclusion:</strong> <span className="text-slate-200">[{node.evidenceGrounding.conclusion}]</span></div>
                      <div><strong className="text-slate-400">Reason:</strong> <span className="text-slate-300">[{node.evidenceGrounding.reason}]</span></div>
                      <div><strong className="text-slate-400">Source:</strong> <span className="text-cyan-300 truncate">[{node.evidenceGrounding.source}]</span></div>
                      <div><strong className="text-slate-400">Confidence:</strong> <span className="text-emerald-400 font-bold">[{node.evidenceGrounding.confidence}]</span></div>
                    </div>
                  )}

                  {/* MANDATORY CONTRADICTION DETECTOR NOTIFICATION BLOCK */}
                  {(node.timelineContradiction || node.rawRecord?.includes('[Flag: Critical Timeline Inconsistency Detected]')) && (
                    <div className="bg-[#1c080b] border-2 border-rose-500/90 p-3 rounded-lg space-y-2 font-mono shadow-md">
                      <div className="flex items-center justify-between text-rose-300 font-bold text-xs">
                        <span className="flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                          <span>CONTRADICTION DETECTOR: LOGICAL INCONSISTENCY</span>
                        </span>
                        <span className="bg-rose-950 text-rose-300 border border-rose-600 px-1.5 py-0.5 rounded text-[9px] font-bold">
                          RULE EXCEPTION
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-slate-300 bg-[#0c0305] p-2 rounded border border-rose-900/40">
                        <div>
                          <span className="text-slate-500 block">Conflict Source:</span>
                          <span className="text-amber-400 font-bold">{node.timelineContradiction?.conflictingSource || 'Perimeter Power Supply & Telemetry Gap'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Logical Discrepancy:</span>
                          <span className="text-rose-400 font-bold">{node.timelineContradiction?.logicalDiscrepancy || 'Active file modification during hardware offline state.'}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-slate-500 block">Hardware Bounds:</span>
                          <span className="text-slate-200">{node.timelineContradiction?.hardwareBoundViolation || 'Zero bus activity verified by perimeter telemetry log.'}</span>
                        </div>
                      </div>

                      {/* MANDATED EXCEPTION VIOLATION PROTOCOL SYNTAX */}
                      <div className="bg-[#0b0204] px-2.5 py-1.5 rounded border border-rose-500 text-rose-300 font-bold text-xs tracking-wider">
                        [Flag: Critical Timeline Inconsistency Detected]
                      </div>
                    </div>
                  )}

                  {/* Cross-Source Correlation Link */}
                  {node.correlationLink && (
                    <div className="flex items-center gap-1.5 text-[11px] text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded">
                      <Link2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span><strong>Cross-Source Correlation:</strong> {maskPII(node.correlationLink, isPrivacyMode)}</span>
                    </div>
                  )}

                  {/* Collapsible raw record & cryptographic signature */}
                  <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-[10px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-mono text-slate-500">DIGEST:</span>
                      <span className="font-mono text-slate-300 truncate max-w-xs">{node.cryptographicHash}</span>
                    </div>

                    <button
                      onClick={() => toggleExpand(node.id)}
                      className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide Raw Telemetry' : 'Inspect Raw Telemetry'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="p-2.5 bg-[#06080e] border border-slate-800 rounded font-terminal text-[11px] text-slate-300 whitespace-pre-wrap">
                      {maskPII(node.rawRecord, isPrivacyMode)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE: CONTRADICTION DETECTOR DEDICATED PANEL */}
      {viewMode === 'contradictions' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-[#170609] border border-rose-500/60 rounded-lg p-4 space-y-2">
            <span className="text-xs font-bold text-rose-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              TIMELINE CONTRADICTION & LOGICAL INCONSISTENCY DETECTOR
            </span>
            <p className="text-xs text-rose-200 leading-relaxed">
              Cross-examines timestamp variables to catch logical block errors — specifically detecting files showing active modification or creation markers during verified hardware offline bounds or power gaps. When an un-reconcilable conflict is detected, the exception violation protocol flags the record.
            </p>
          </div>

          <div className="space-y-3">
            {contradictionEvents.map((node) => (
              <div
                key={node.id}
                className="bg-[#0e0407] border-2 border-rose-500 rounded-xl p-4 space-y-3 shadow-xl"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-900/50 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-700 text-[10px]">
                      {node.id}
                    </span>
                    <span className="text-xs font-bold text-slate-100">{node.sourceLabel}</span>
                  </div>
                  <span className="text-cyan-400 font-mono text-xs">{node.microsecondTimestamp || node.timestamp}</span>
                </div>

                {/* Mandated Structural Flag */}
                <div className="bg-[#1a050a] border-2 border-rose-600 p-3 rounded-lg text-center">
                  <div className="text-rose-300 font-mono font-bold text-sm tracking-wider animate-pulse">
                    [Flag: Critical Timeline Inconsistency Detected]
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-[#080204] p-2.5 rounded border border-rose-900/60">
                    <span className="text-[10px] text-rose-400 block font-semibold uppercase">Conflicting Evidence Layer</span>
                    <span className="text-amber-300 font-mono text-[11px] block mt-1">
                      {node.timelineContradiction?.conflictingSource || 'Perimeter Power Telemetry / 25-Min Void'}
                    </span>
                  </div>
                  <div className="bg-[#080204] p-2.5 rounded border border-rose-900/60">
                    <span className="text-[10px] text-rose-400 block font-semibold uppercase">Logical Discrepancy</span>
                    <span className="text-rose-300 font-mono text-[11px] block mt-1 font-bold">
                      {node.timelineContradiction?.logicalDiscrepancy || 'Active file write during power-off window'}
                    </span>
                  </div>
                  <div className="bg-[#080204] p-2.5 rounded border border-rose-900/60">
                    <span className="text-[10px] text-rose-400 block font-semibold uppercase">Hardware Bound Status</span>
                    <span className="text-slate-200 font-mono text-[11px] block mt-1">
                      {node.timelineContradiction?.hardwareBoundViolation || 'Hardware Offline Bounds: Zero bus power'}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#130509] rounded border border-rose-900 text-xs space-y-1">
                  <span className="font-bold text-rose-300 block">JUDICIAL ADMISSIBILITY IMPACT:</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {node.timelineContradiction?.description ||
                      'File properties demonstrate active modification timestamp during known hardware offline bounds or power gaps. Proves timestamp manipulation, timestomping, or clock desynchronization prior to evidentiary submission.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW MODE: BEHAVIORAL BASELINE TIMELINE & ANOMALY EVALUATION */}
      {viewMode === 'behavior' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#090d16]">
          <div className="bg-[#180a14] border-2 border-rose-500/80 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-2 shadow-xl">
            <div>
              <span className="text-xs font-bold text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>BEHAVIORAL ANOMALY DETECTION ENGINE</span>
              </span>
              <p className="text-[11px] text-slate-300 mt-1">
                Evaluation Protocol: Cross-references learned user & device operational baselines against live observed tracking variables (login hour boundaries and source interface zones).
              </p>
            </div>
            <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-600 px-2.5 py-1 rounded font-bold">
              1 CRITICAL BASELINE BREACH DETECTED
            </span>
          </div>

          {/* Baseline Comparison Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#0b101c] border border-slate-800 p-3.5 rounded-lg space-y-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Standard Operational Baseline (svc_backup)</span>
              </span>
              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Authorized Login Hours:</span>
                  <span className="text-emerald-400 font-bold">08:00 - 19:00 UTC (Workdays)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Authorized Interface Zone:</span>
                  <span className="text-emerald-400 font-bold">10.0.4.0/24 (Management Interface)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Authentication Protocol:</span>
                  <span className="text-slate-300">Non-Interactive Batch Service (LogonType 4/5)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Average Historical Velocity:</span>
                  <span className="text-slate-300">1 authentication session / 24h</span>
                </div>
              </div>
            </div>

            <div className="bg-[#140b12] border border-rose-900/80 p-3.5 rounded-lg space-y-2">
              <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5 border-b border-rose-900/60 pb-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Live Observed Tracking Variables (Incident)</span>
              </span>
              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Observed Login Timestamp:</span>
                  <span className="text-rose-400 font-bold">02:11:04.108422 UTC (Off-Hours Breach)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Observed Interface Zone:</span>
                  <span className="text-rose-400 font-bold">10.0.8.44 (DMZ Workstation Breach)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Observed Logon Type:</span>
                  <span className="text-rose-300 font-bold">LogonType 10 (RemoteInteractive RDP GUI)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Threshold Deviation Score:</span>
                  <span className="text-rose-400 font-bold">0.96 (Extreme Statistical Anomaly)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Anomaly Violation Notification Box (Exact Syntax Schema) */}
          <div className="bg-[#12070f] border-2 border-rose-600 p-4 rounded-lg space-y-3">
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider block">
              AUTOMATED ANOMALY VIOLATION NOTIFICATION LOG ENTRY:
            </span>
            <div className="bg-[#080206] p-3 rounded border border-rose-800 text-rose-300 font-mono text-xs font-bold tracking-wide">
              [Flag: High-Risk Behavioral Anomaly Generated]
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
              Account <strong>svc_backup</strong> initiated interactive graphical session from unapproved subnet 10.0.8.44 at 02:11:04 UTC (normal window: 08:00-19:00 UTC from 10.0.4.10). Anomaly confidence scored at 98.4% without speculative interpolation.
            </p>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: MITRE ATT&CK MATRIX */}
      {viewMode === 'mitre' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-[#0b101c] border border-amber-500/40 rounded-lg p-3.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-400" />
                MITRE ATT&CK ENTERPRISE TAXONOMY MAPPING
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Activity patterns mapped across mandatory parameters: Attack Phase, Mapped Forensic Artifact, and MITRE Technique.
              </p>
            </div>
            <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-500 px-2 py-0.5 rounded font-bold">
              {mitreEvents.length} TECHNIQUES DETECTED
            </span>
          </div>

          <div className="bg-[#0c111d] border border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#070b14] border-b border-slate-800 text-[11px] text-slate-400">
                  <th className="p-3 font-semibold">ATTACK PHASE</th>
                  <th className="p-3 font-semibold">MAPPED FORENSIC ARTIFACT</th>
                  <th className="p-3 font-semibold">MITRE TECHNIQUE</th>
                  <th className="p-3 font-semibold">EVENT VERDICT</th>
                  <th className="p-3 font-semibold">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {mitreEvents.map((node) => (
                  <tr key={node.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 font-bold text-amber-400">
                      {node.mitreMapping?.attackPhase}
                    </td>
                    <td className="p-3 text-slate-200">
                      {node.mitreMapping?.mappedArtifact}
                    </td>
                    <td className="p-3 font-mono text-cyan-300">
                      {node.mitreMapping?.mitreTechnique}
                    </td>
                    <td className="p-3">
                      {node.eventType === 'DETERMINISTIC_LOG' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 text-[10px] font-bold">
                          DETERMINISTIC
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-500/50 text-[10px] font-bold">
                          PROBABILISTIC
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-slate-400 text-[11px]">
                      {node.microsecondTimestamp || node.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: GAP & THREAT PROFILING */}
      {viewMode === 'gaps' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-[#140b1e] border border-purple-500/60 rounded-lg p-4 space-y-2">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-2">
              <ShieldX className="w-4 h-4 text-purple-400" />
              MISSING EVENT DETECTION & TELEMETRY VOID PROFILING
            </span>
            <p className="text-xs text-purple-200 leading-relaxed">
              Chronological traces scanned for unexplained intervals between recorded timestamps. Rather than filling gaps with speculative data, silent intervals are isolated and flagged for potential wiper execution, log deletion activities, or covert data staging windows.
            </p>
          </div>

          <div className="space-y-3">
            {gapEvents.map((node) => (
              <div
                key={node.id}
                className="bg-[#0e0918] border-2 border-purple-500/70 rounded-lg p-4 space-y-3 shadow-lg"
              >
                <div className="bg-purple-950 border border-purple-400 p-2.5 rounded text-center">
                  <span className="text-purple-200 font-mono text-sm font-bold tracking-wider">
                    {node.gapAlert?.displayString ||
                      `??? [Potential Unexplained Activity Window: ${node.gapAlert?.durationMinutes || 25} Minutes] ???`}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-[#07050e] p-2.5 rounded border border-purple-900/60">
                    <span className="text-[10px] text-purple-400 block font-semibold">GAP BOUNDARIES</span>
                    <span className="text-slate-200 font-mono text-[11px] block mt-1">
                      02:22:00.000000 - 02:47:01.000000 UTC
                    </span>
                  </div>
                  <div className="bg-[#07050e] p-2.5 rounded border border-purple-900/60">
                    <span className="text-[10px] text-purple-400 block font-semibold">DURATION RECORDED</span>
                    <span className="text-purple-300 font-mono text-[11px] block mt-1 font-bold">
                      25 Minutes (1,501 seconds)
                    </span>
                  </div>
                  <div className="bg-[#07050e] p-2.5 rounded border border-purple-900/60">
                    <span className="text-[10px] text-purple-400 block font-semibold">LEGAL CLASSIFICATION</span>
                    <span className="text-emerald-400 font-mono text-[11px] block mt-1">
                      ISO/IEC 27037 Telemetry Void
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#130b21] rounded border border-purple-800/80 text-xs space-y-1">
                  <span className="font-bold text-purple-300 block">THREAT PROFILING ANALYSIS:</span>
                  <p className="text-purple-200 leading-relaxed text-[11px]">
                    {node.gapAlert?.threatProfiling ||
                      'During this 25-minute silence, perimeter firewall syslog forwarding daemon was killed and subsequently restarted. Highly consistent with deliberate log deletion activities or a covert data staging window prior to DNS tunnel transmission.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
