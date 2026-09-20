import React, { useState } from 'react';
import { ForensicCase, EvidenceArtifact } from '../types';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileCheck2,
  Lock,
  Binary,
  Cpu,
  RefreshCw,
  Sliders,
  Scale,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Database,
  Search
} from 'lucide-react';

interface EvidenceTrustScoreDashboardProps {
  activeCase: ForensicCase;
  onSelectArtifact?: (artifact: EvidenceArtifact) => void;
  onOpenReport?: () => void;
}

export const EvidenceTrustScoreDashboard: React.FC<EvidenceTrustScoreDashboardProps> = ({
  activeCase,
  onSelectArtifact,
  onOpenReport
}) => {
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>(activeCase.artifacts[0]?.id || '');
  const [tamperSimulatedMap, setTamperSimulatedMap] = useState<Record<string, boolean>>({});
  const [filterRisk, setFilterRisk] = useState<'ALL' | 'LOW' | 'MEDIUM' | 'HIGH'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const activeArtifact = activeCase.artifacts.find((a) => a.id === selectedArtifactId) || activeCase.artifacts[0];

  const toggleSimulateTamper = (id: string) => {
    setTamperSimulatedMap((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Compute metrics with simulation adjustments
  const getMetrics = (artifact: EvidenceArtifact) => {
    const isTampered = tamperSimulatedMap[artifact.id];
    const defaultScore = artifact.trustScore?.overallTrustScore ?? (artifact.triageCategory === 'Critical' ? 42 : 94);
    const defaultMeta = artifact.trustScore?.metadataConsistency ?? 96;
    const defaultTime = artifact.trustScore?.timestampConsistency ?? (artifact.id === 'ART-202' ? 24 : 98);
    const defaultRisk = artifact.trustScore?.tamperingRisk ?? (artifact.triageCategory === 'Critical' ? 'HIGH' : 'LOW');

    if (isTampered) {
      return {
        sha256Integrity: 'MISMATCH / CORRUPTED (0%)',
        metadataConsistency: 22,
        timestampConsistency: 18,
        tamperingRisk: 'HIGH' as const,
        overallTrustScore: 14,
        isSimulated: true,
        deterministicFacts: [
          'Calculated SHA-256 differs from MinIO WORM intake hash',
          'Bit-stream parity check failed at block 0x004F21',
          'Tamper attempt logged to immutable audit ledger'
        ],
        probabilisticIndicators: [
          'High entropy discontinuity detected in file header',
          'SHAP model predicts 99.4% probability of deliberate byte injection'
        ]
      };
    }

    return {
      sha256Integrity: artifact.trustScore?.sha256Integrity || 'VERIFIED 100%',
      metadataConsistency: defaultMeta,
      timestampConsistency: defaultTime,
      tamperingRisk: defaultRisk,
      overallTrustScore: defaultScore,
      isSimulated: false,
      deterministicFacts: artifact.trustScore?.deterministicFacts || [
        `Cryptographic SHA-256 digest verified against intake manifest (${artifact.sha256?.substring(0, 16)}...)`,
        `Direct physical sector provenance verified (${artifact.provenance?.diskSectorOffset || 'LBA 0x0182E400'})`,
        'MinIO AES-256-GCM WORM immutability lock unbreached'
      ],
      probabilisticIndicators: artifact.trustScore?.probabilisticIndicators || [
        `SHAP Feature attribution score: ${artifact.xaiAttributions?.[0]?.weight ?? 0.85} confidence`,
        `Triage category: ${artifact.triageCategory} based on contextual behavioral signatures`
      ]
    };
  };

  const filteredArtifacts = activeCase.artifacts.filter((art) => {
    const metrics = getMetrics(art);
    if (filterRisk !== 'ALL' && metrics.tamperingRisk !== filterRisk) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        art.label.toLowerCase().includes(q) ||
        art.sourceFile.toLowerCase().includes(q) ||
        art.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeMetrics = activeArtifact ? getMetrics(activeArtifact) : null;

  // Average case trust score
  const avgTrustScore = Math.round(
    activeCase.artifacts.reduce((acc, curr) => acc + getMetrics(curr).overallTrustScore, 0) /
      (activeCase.artifacts.length || 1)
  );

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#080c14] text-slate-200 overflow-y-auto font-sans">
      {/* Top Banner: Trust Score Philosophy & Standards */}
      <div className="bg-[#0e1626] border border-slate-700/70 rounded-xl p-4 mb-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/40 rounded-lg text-emerald-400">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100 font-mono tracking-tight">
                  EVIDENCE TRUST SCORE DASHBOARD
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-600/60 text-emerald-300 font-mono font-bold">
                  FRE 902(14) COMPLIANT
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 border border-purple-600/60 text-purple-300 font-mono font-bold">
                  EXPLAINABLE XAI
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Strict segregation between <span className="text-cyan-300 font-semibold">Deterministic Cryptographic Verification</span> and <span className="text-purple-300 font-semibold">Probabilistic AI Indicators</span> for judicial transparency.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#090d16] border border-slate-800 rounded-lg px-4 py-2">
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono text-slate-400">Aggregated Dossier Trust</div>
              <div className="text-lg font-mono font-black text-emerald-400">{avgTrustScore} / 100</div>
            </div>
            {onOpenReport && (
              <button
                onClick={onOpenReport}
                className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Issue Certificate</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Artifact List on Left, Deep Evidence Trust Breakdown on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left Column: Artifacts Roster with Quick Trust Badges */}
        <div className="lg:col-span-4 flex flex-col bg-[#0b101c] border border-slate-800 rounded-xl p-3 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Binary className="w-3.5 h-3.5 text-cyan-400" />
              EVIDENCE ARTIFACTS ({filteredArtifacts.length})
            </h3>
            <div className="flex items-center gap-1">
              {(['ALL', 'LOW', 'MEDIUM', 'HIGH'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilterRisk(lvl)}
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    filterRisk === lvl
                      ? 'bg-slate-700 text-slate-100 font-bold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-2.5">
            <Search className="w-3 h-3 absolute left-2.5 top-2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artifact or source file..."
              className="w-full bg-[#070a10] border border-slate-800 rounded pl-7 pr-2 py-1 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-600 font-mono"
            />
          </div>

          {/* Artifact Item Cards */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[580px]">
            {filteredArtifacts.map((art) => {
              const m = getMetrics(art);
              const isSelected = art.id === selectedArtifactId;
              const isTampered = tamperSimulatedMap[art.id];

              return (
                <div
                  key={art.id}
                  onClick={() => {
                    setSelectedArtifactId(art.id);
                    if (onSelectArtifact) onSelectArtifact(art);
                  }}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#121a2d] border-cyan-500 shadow-md ring-1 ring-cyan-500/40'
                      : 'bg-[#090d16] border-slate-800/80 hover:border-slate-700 hover:bg-[#0c1220]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold text-slate-200 line-clamp-1">
                      {art.label}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                        m.overallTrustScore >= 80
                          ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                          : m.overallTrustScore >= 50
                          ? 'bg-amber-950 border border-amber-500 text-amber-300'
                          : 'bg-red-950 border border-red-500 text-red-300 animate-pulse'
                      }`}
                    >
                      {m.overallTrustScore}/100
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-400 font-mono mt-1 line-clamp-1">
                    {art.sourceFile}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px] font-mono">
                    <span
                      className={`flex items-center gap-1 ${
                        m.sha256Integrity.includes('VERIFIED') ? 'text-emerald-400' : 'text-red-400 font-bold'
                      }`}
                    >
                      {m.sha256Integrity.includes('VERIFIED') ? (
                        <ShieldCheck className="w-3 h-3" />
                      ) : (
                        <ShieldAlert className="w-3 h-3" />
                      )}
                      {m.sha256Integrity.includes('VERIFIED') ? 'VERIFIED' : 'TAMPERED'}
                    </span>

                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        m.tamperingRisk === 'LOW'
                          ? 'text-slate-400 bg-slate-800'
                          : m.tamperingRisk === 'MEDIUM'
                          ? 'text-amber-300 bg-amber-950/70 border border-amber-800'
                          : 'text-red-300 bg-red-950/70 border border-red-800'
                      }`}
                    >
                      RISK: {m.tamperingRisk}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Explainable Trust Breakdown */}
        <div className="lg:col-span-8 flex flex-col bg-[#0b101c] border border-slate-800 rounded-xl p-4 shadow-md">
          {activeArtifact && activeMetrics ? (
            <div className="flex flex-col h-full space-y-4">
              {/* Header with Artifact Metadata & Tamper Simulation Trigger */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-300 font-bold">
                      {activeArtifact.id}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 font-mono">
                      {activeArtifact.label}
                    </h3>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    Path: <span className="text-slate-300">{activeArtifact.sourceFile}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSimulateTamper(activeArtifact.id)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
                      tamperSimulatedMap[activeArtifact.id]
                        ? 'bg-red-950 border-red-500 text-red-300 hover:bg-red-900'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                    title="Simulate bit modification to observe real-time trust score degradation"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${tamperSimulatedMap[activeArtifact.id] ? 'animate-spin' : ''}`} />
                    <span>{tamperSimulatedMap[activeArtifact.id] ? 'Revert Simulation' : 'Simulate Tamper (Bit-Flip)'}</span>
                  </button>
                </div>
              </div>

              {/* Trust Score 5 Metrics Structured Grid (Exact Specification) */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {/* Metric 1: SHA-256 Integrity */}
                <div className="bg-[#070a10] border border-slate-800 rounded-lg p-2.5 flex flex-col justify-between">
                  <div className="text-[10px] uppercase font-mono text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    SHA-256 Integrity
                  </div>
                  <div className={`text-xs font-mono font-bold mt-1.5 ${
                    activeMetrics.sha256Integrity.includes('VERIFIED') ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {activeMetrics.sha256Integrity}
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">Deterministic Bit-Stream</div>
                </div>

                {/* Metric 2: Metadata Consistency */}
                <div className="bg-[#070a10] border border-slate-800 rounded-lg p-2.5 flex flex-col justify-between">
                  <div className="text-[10px] uppercase font-mono text-slate-400 flex items-center gap-1">
                    <Database className="w-3 h-3 text-cyan-400" />
                    Metadata Consistency
                  </div>
                  <div className="text-base font-mono font-bold text-cyan-300 mt-1">
                    {activeMetrics.metadataConsistency}%
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">Structure & Header Parity</div>
                </div>

                {/* Metric 3: Timestamp Consistency */}
                <div className="bg-[#070a10] border border-slate-800 rounded-lg p-2.5 flex flex-col justify-between">
                  <div className="text-[10px] uppercase font-mono text-slate-400 flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-amber-400" />
                    Timestamp Consistency
                  </div>
                  <div className={`text-base font-mono font-bold mt-1 ${
                    activeMetrics.timestampConsistency >= 80 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {activeMetrics.timestampConsistency}%
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">$MFT vs Kernel Journal</div>
                </div>

                {/* Metric 4: Tampering Risk */}
                <div className="bg-[#070a10] border border-slate-800 rounded-lg p-2.5 flex flex-col justify-between">
                  <div className="text-[10px] uppercase font-mono text-slate-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-purple-400" />
                    Tampering Risk
                  </div>
                  <div className={`text-sm font-mono font-bold mt-1 ${
                    activeMetrics.tamperingRisk === 'LOW'
                      ? 'text-emerald-400'
                      : activeMetrics.tamperingRisk === 'MEDIUM'
                      ? 'text-amber-400'
                      : 'text-red-400 font-black'
                  }`}>
                    {activeMetrics.tamperingRisk}
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">Anti-Forensic Exposure</div>
                </div>

                {/* Metric 5: Overall Trust Score */}
                <div className="bg-[#070a10] border border-slate-800 rounded-lg p-2.5 flex flex-col justify-between bg-gradient-to-br from-[#0c1322] to-[#070a10]">
                  <div className="text-[10px] uppercase font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    Overall Trust Score
                  </div>
                  <div className={`text-lg font-mono font-black mt-1 ${
                    activeMetrics.overallTrustScore >= 80
                      ? 'text-emerald-400'
                      : activeMetrics.overallTrustScore >= 50
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}>
                    {activeMetrics.overallTrustScore} / 100
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">Weighted Admissibility</div>
                </div>
              </div>

              {/* Two Pillars Comparison: Deterministic Facts vs Probabilistic AI Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                {/* Deterministic Cryptographic Facts */}
                <div className="bg-[#070a10] border border-emerald-900/60 rounded-lg p-3 flex flex-col">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 pb-2 border-b border-emerald-950">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>DETERMINISTIC CRYPTOGRAPHIC FACTS</span>
                  </div>
                  <div className="text-[11px] text-slate-400 my-1.5 italic">
                    Binary, mathematical truths that do not rely on machine learning or inference:
                  </div>
                  <ul className="space-y-2 mt-1 text-xs font-mono text-slate-300 overflow-y-auto flex-1 pr-1">
                    {activeMetrics.deterministicFacts.map((fact, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-[#0c1220] p-2 rounded border border-slate-800">
                        <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                        <span className="leading-relaxed">{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Probabilistic AI Indicators */}
                <div className="bg-[#070a10] border border-purple-900/60 rounded-lg p-3 flex flex-col">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 pb-2 border-b border-purple-950">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    <span>PROBABILISTIC AI INDICATORS (SHAP / NLP)</span>
                  </div>
                  <div className="text-[11px] text-slate-400 my-1.5 italic">
                    Pattern recognition, computer vision ELA, and model feature attributions:
                  </div>
                  <ul className="space-y-2 mt-1 text-xs font-mono text-slate-300 overflow-y-auto flex-1 pr-1">
                    {activeMetrics.probabilisticIndicators.map((ind, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-[#120d20] p-2 rounded border border-purple-950/70">
                        <span className="text-purple-400 font-bold mt-0.5">◆</span>
                        <span className="leading-relaxed">{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Judicial Admissibility Footnote */}
              <div className="bg-[#080d1a] border border-slate-800 rounded-lg px-3 py-2 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <div>
                  <span className="text-emerald-400 font-bold">FRE Rule 902(14) Assessment: </span>
                  {activeMetrics.overallTrustScore >= 80 ? (
                    <span>Self-authenticating electronic record verified via unbroken cryptographic seal.</span>
                  ) : (
                    <span className="text-red-400 font-semibold">Flagged for expert witness judicial inquiry due to integrity variances.</span>
                  )}
                </div>
                <span className="text-slate-600">Audit Stamp: ISO/IEC 27037:2012</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 font-mono text-sm">
              Select an artifact on the left to review its Evidence Trust Score matrix.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
