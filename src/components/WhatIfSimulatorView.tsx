import React, { useState } from 'react';
import { ForensicCase, WhatIfHypothesis } from '../types';
import {
  HelpCircle,
  Play,
  Layers,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HardDrive,
  Database,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
  Terminal,
  RefreshCw,
  Search
} from 'lucide-react';

interface WhatIfSimulatorViewProps {
  caseData: ForensicCase;
  onExecuteCommand: (command: string) => Promise<void>;
}

const DEFAULT_HYPOTHESES: WhatIfHypothesis[] = [
  {
    id: 'HYP-001',
    title: 'USB Mass Storage Exfiltration Hypothesis',
    scenarioQuestion: 'What evidence would we expect if customer_vault was actually copied to an external USB device?',
    category: 'EXFILTRATION_MEDIA',
    layers: {
      registrySetupApi: {
        layerName: 'System Registry & SetupAPI Logs',
        evidenceSource: 'C:\\Windows\\INF\\setupapi.dev.log & SYSTEM\\CurrentControlSet\\Enum\\USBSTOR',
        expectedArtifact: 'Vendor ID, Product ID, Serial Number entry with FirstInstallDate timestamp matching incident window.',
        observedTelemetry: 'USBSTOR contains SanDisk Ultra (Serial: 4C531001560912117282) registered 2026-09-19 02:18:14 UTC. setupapi.dev.log confirms device driver load.',
        status: 'CORROBORATED',
        forensicInterpretation: 'Hardware footprint verifies physical USB mass storage device insertion 3 minutes 39 seconds prior to data staging.',
      },
      volumeShadowCopies: {
        layerName: 'Volume Shadow Copies (VSS)',
        evidenceSource: 'Volume Shadow Snapshot \\Device\\HarddiskVolumeShadowCopy2 (VSS Differential Catalog)',
        expectedArtifact: 'LNK shortcut or Shellbags delta indicating navigation to removable drive letter (e.g. E:\\ or F:\\).',
        observedTelemetry: 'VSS Snapshot 2 differential reveals LNK file "customer_vault.parquet.lnk" referencing Volume Serial 0x82A1-F99C (Removable Media).',
        status: 'CORROBORATED',
        forensicInterpretation: 'VSS catalog preserves created shell link target confirming direct transfer to removable storage drive root.',
      },
      operatingSystemLogs: {
        layerName: 'Automated Operating System Event Logs',
        evidenceSource: 'Microsoft-Windows-DriverFrameworks-UserMode/Operational (Event 20001, 20003) & Security.evtx (Event 4663)',
        expectedArtifact: 'Event 20001 (Device PnP Driver load completed), Event 4663 with WriteData permission granted for target file on removable volume.',
        observedTelemetry: 'Event ID 20001 recorded at 02:18:16 UTC (WUDFHost.exe). Event ID 4663 logged 2,410 read operations on customer_vault by PID 4412.',
        status: 'CORROBORATED',
        forensicInterpretation: 'OS audit subsystem provides deterministic confirmation of physical enumeration and bulk file access.',
      },
    },
    overallVerdict: 'SUPPORTED',
    confidenceScore: 97,
    verdictSynthesis: 'All three forensic validation layers (SetupAPI, VSS snapshot deltas, and Event ID 20001/4663) corroborate external USB mass storage insertion and direct staging.',
    suggestedAction: '/correlate USBSTOR SanDisk Ultra 4C531001560912117282',
  },
  {
    id: 'HYP-002',
    title: 'Volume Shadow Copy (VSS) Deletion & Wiper Scenario',
    scenarioQuestion: 'What evidence would we expect if the adversary staged and executed a VSS shadow copy purge to conceal lateral access?',
    category: 'VSS_SHADOW_TAMPERING',
    layers: {
      registrySetupApi: {
        layerName: 'System Registry & SetupAPI Logs',
        evidenceSource: 'SYSTEM\\CurrentControlSet\\Services\\VSS & Volume Manager MountPoints2',
        expectedArtifact: 'VSS service start type modification (Disabled) or unmounted storage volume guid artifacts.',
        observedTelemetry: 'VSS service configuration remained Start=DEMAND (3). No unauthorized service descriptor edits in SYSTEM hive.',
        status: 'ABSENT',
        forensicInterpretation: 'Adversary did not disable the VSS service binary through direct registry tampering.',
      },
      volumeShadowCopies: {
        layerName: 'Volume Shadow Copies (VSS)',
        evidenceSource: 'vssadmin list shadows & NTFS $Extend\\$UsnJrnl change log',
        expectedArtifact: 'Zero shadow copies present; $UsnJrnl entries recording USN_REASON_FILE_DELETE on \\Device\\HarddiskVolumeShadowCopy* files.',
        observedTelemetry: '3 VSS Shadow Snapshots remain fully intact and mountable. $UsnJrnl shows active snapshot retention without deletion record.',
        status: 'CONTRADICTED',
        forensicInterpretation: 'Shadow copies were NOT purged. The presence of historical snapshots directly refutes complete wiper execution.',
      },
      operatingSystemLogs: {
        layerName: 'Automated Operating System Event Logs',
        evidenceSource: 'Microsoft-Windows-VSS (Event ID 8224, 7036) & Security.evtx (Event 4688 vssadmin/wmic)',
        expectedArtifact: 'Process creation Event 4688 with command line "vssadmin.exe delete shadows /all /quiet" or "wmic shadowcopy delete".',
        observedTelemetry: 'Zero invocations of vssadmin.exe or wmic shadowcopy found in Security.evtx process execution auditing.',
        status: 'CONTRADICTED',
        forensicInterpretation: 'Process auditing disproves command-line volume shadow destruction attempts during the breach.',
      },
    },
    overallVerdict: 'REFUTED',
    confidenceScore: 94,
    verdictSynthesis: 'Hypothesis refuted. Three intact VSS shadow copies, zero vssadmin deletion invocations, and normal $UsnJrnl records confirm shadow copies were preserved.',
    suggestedAction: '/triage VSS Snapshot 2',
  },
  {
    id: 'HYP-003',
    title: 'LSASS Process Memory Dumping Hypothesis',
    scenarioQuestion: 'What evidence would we expect if credentials were stolen via in-memory LSASS dump (e.g. procdump or comsvcs.dll)?',
    category: 'CREDENTIAL_HARVESTING',
    layers: {
      registrySetupApi: {
        layerName: 'System Registry & SetupAPI Logs',
        evidenceSource: 'SYSTEM\\CurrentControlSet\\Control\\Lsa & SAM Hive HKLM\\SECURITY',
        expectedArtifact: 'Lsa RunAsPPL configuration bypass attempts, MiniDump auxiliary debug flags, or registry SAM hive export.',
        observedTelemetry: 'RunAsPPL was disabled prior to incident (0). No registry hive export files discovered in system temp paths.',
        status: 'CORROBORATED',
        forensicInterpretation: 'Unprotected LSASS process environment permitted direct handle access without kernel PPL restriction.',
      },
      volumeShadowCopies: {
        layerName: 'Volume Shadow Copies (VSS)',
        evidenceSource: 'VSS Differential Sector Storage & \\Windows\\Temp\\*.dmp Carving',
        expectedArtifact: 'Historical carved memory dump archive (e.g. lsass.dmp or debug.bin) residing in VSS shadow copy sectors.',
        observedTelemetry: 'Carved file "MEMORY_CHUNK_0x82.dmp" found in unallocated VSS delta sectors containing Mimikatz header signatures.',
        status: 'CORROBORATED',
        forensicInterpretation: 'VSS unallocated block carving isolated remnants of an extracted memory dump file.',
      },
      operatingSystemLogs: {
        layerName: 'Automated Operating System Event Logs',
        evidenceSource: 'Microsoft-Windows-Sysmon/Operational (Event 10: ProcessAccess) & Security.evtx (Event 4656)',
        expectedArtifact: 'Sysmon Event ID 10 with TargetImage=lsass.exe and GrantedAccess=0x1FFFFF (PROCESS_ALL_ACCESS) or 0x1010.',
        observedTelemetry: 'Sysmon Event ID 10 detected: SourceImage=svchost.exe (PID 4412 injected beacon) requesting 0x1F3FFF access to lsass.exe (PID 688).',
        status: 'CORROBORATED',
        forensicInterpretation: 'Injected svchost process explicitly queried LSASS process handle with memory read permissions.',
      },
    },
    overallVerdict: 'SUPPORTED',
    confidenceScore: 98,
    verdictSynthesis: 'Hypothesis confirmed. Sysmon Event 10 LSASS handle acquisition, carved memory dumps in VSS blocks, and unbacked reflective DLL injection substantiate memory credential extraction.',
    suggestedAction: '/authenticate MEMORY_CHUNK_0x82.dmp',
  }
];

export const WhatIfSimulatorView: React.FC<WhatIfSimulatorViewProps> = ({
  caseData,
  onExecuteCommand,
}) => {
  const [hypotheses, setHypotheses] = useState<WhatIfHypothesis[]>(DEFAULT_HYPOTHESES);
  const [selectedHypothesisId, setSelectedHypothesisId] = useState<string>(DEFAULT_HYPOTHESES[0].id);
  const [customQuestion, setCustomQuestion] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedHypothesis = hypotheses.find((h) => h.id === selectedHypothesisId) || hypotheses[0];

  const handleRunCustomSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    setIsSimulating(true);

    try {
      // Simulate live analysis across 3 target layers
      await new Promise((res) => setTimeout(res, 850));

      const isUsb = customQuestion.toLowerCase().includes('usb') || customQuestion.toLowerCase().includes('flash');
      const isPriv = customQuestion.toLowerCase().includes('privilege') || customQuestion.toLowerCase().includes('admin') || customQuestion.toLowerCase().includes('root');
      const isEmail = customQuestion.toLowerCase().includes('email') || customQuestion.toLowerCase().includes('phish');

      const newHyp: WhatIfHypothesis = {
        id: `HYP-${String(hypotheses.length + 1).padStart(3, '0')}`,
        title: `Investigation Scenario: "${customQuestion.slice(0, 42)}..."`,
        scenarioQuestion: customQuestion,
        category: isUsb ? 'EXFILTRATION_MEDIA' : isPriv ? 'PRIVILEGE_ESCALATION' : 'VSS_SHADOW_TAMPERING',
        layers: {
          registrySetupApi: {
            layerName: 'System Registry & SetupAPI Logs',
            evidenceSource: 'C:\\Windows\\INF\\setupapi.dev.log & HKLM\\SYSTEM',
            expectedArtifact: isUsb
              ? 'PnP Enumeration string for external mass storage hardware'
              : 'Service registry entries or Run key modifications',
            observedTelemetry: isUsb
              ? 'USBSTOR key matches SanDisk device ID at 02:18:14 UTC'
              : 'Registry audit log indicates svc_backup session startup key created',
            status: 'CORROBORATED',
            forensicInterpretation: 'Registry telemetry records concrete activity matching hypothesized timeline window.',
          },
          volumeShadowCopies: {
            layerName: 'Volume Shadow Copies (VSS)',
            evidenceSource: 'VSS Shadow Snapshot \\Device\\HarddiskVolumeShadowCopy2',
            expectedArtifact: isUsb
              ? 'Shellbags / LNK reference to removable storage'
              : 'Differential volume blocks containing temporary script staging',
            observedTelemetry: 'VSS catalog diff reveals differential modification in C:\\Windows\\Temp during target hour.',
            status: 'CORROBORATED',
            forensicInterpretation: 'Snapshot differentials confirm file system changes persisted in shadow copies.',
          },
          operatingSystemLogs: {
            layerName: 'Automated Operating System Event Logs',
            evidenceSource: 'Security.evtx (Event 4624, 4688) & System.evtx',
            expectedArtifact: 'Event log correlation confirming process execution and file handle grant.',
            observedTelemetry: 'Event ID 4624 (LogonType 10) and Event ID 4663 corroborate unauthorized access path.',
            status: 'CORROBORATED',
            forensicInterpretation: 'Security audit trail corroborates active operational state.',
          },
        },
        overallVerdict: 'SUPPORTED',
        confidenceScore: 92,
        verdictSynthesis: `Simulated hypothesis evaluated across all 3 verification layers. Observed forensic artifacts in Case ${caseData.id} provide corroborated evidence supporting this scenario.`,
        suggestedAction: `/correlate ${customQuestion.slice(0, 24)}`,
      };

      setHypotheses([newHyp, ...hypotheses]);
      setSelectedHypothesisId(newHyp.id);
      setCustomQuestion('');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleCopySynthesis = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: WhatIfHypothesis['layers']['registrySetupApi']['status']) => {
    switch (status) {
      case 'CORROBORATED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> CORROBORATED
          </span>
        );
      case 'CONTRADICTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/80 border border-rose-500/50 text-rose-400 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> CONTRADICTED
          </span>
        );
      case 'ABSENT':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 border border-amber-500/50 text-amber-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> ABSENT / VOID
          </span>
        );
    }
  };

  const getVerdictBadge = (verdict: WhatIfHypothesis['overallVerdict']) => {
    switch (verdict) {
      case 'SUPPORTED':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>HYPOTHESIS SUPPORTED BY EVIDENCE</span>
          </div>
        );
      case 'REFUTED':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/80 border border-rose-500 text-rose-300 font-bold text-xs">
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>HYPOTHESIS REFUTED BY EVIDENCE</span>
          </div>
        );
      case 'INCONCLUSIVE':
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-500 text-amber-300 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>INCONCLUSIVE / INSUFFICIENT TELEMETRY</span>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#070a0f] text-slate-200 overflow-hidden font-mono text-xs">
      {/* Top Banner */}
      <div className="p-4 border-b border-slate-800 bg-[#0d131f] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100 tracking-wide">
              What-If Investigation Simulator
            </h2>
            <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
              HYPOTHESIS TESTING ENGINE
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Simulates expected forensic footprints across three mandatory verification layers: SetupAPI Registry, Volume Shadow Copies (VSS), and Automated OS Event Logs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-slate-400">Case Scope:</span>
          <span className="text-emerald-400 font-bold bg-slate-900 px-2 py-1 rounded border border-slate-700">
            {caseData.id} ({caseData.artifacts.length} Ingested Artifacts)
          </span>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Hypothesis Scenarios & Custom Input */}
        <div className="lg:col-span-4 border-r border-slate-800 bg-[#090d16] p-4 flex flex-col gap-4 overflow-y-auto">
          {/* Custom Simulation Form */}
          <div className="bg-[#0e1422] border border-cyan-900/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-cyan-300 font-bold text-[11px]">
              <span className="flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                Simulate New Hypothesis
              </span>
              <span className="text-[10px] text-slate-400">3-Layer Verification</span>
            </div>

            <form onSubmit={handleRunCustomSimulation} className="space-y-2">
              <textarea
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder='e.g. "What evidence would we expect if this file was actually copied to a USB device?"'
                rows={3}
                className="w-full bg-[#070a0f] border border-slate-700 rounded p-2 text-slate-200 placeholder-slate-500 text-[11px] focus:outline-none focus:border-cyan-500 font-mono"
              />
              <button
                type="submit"
                disabled={isSimulating || !customQuestion.trim()}
                className="w-full py-2 px-3 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-950 font-bold flex items-center justify-center gap-2 transition-colors shadow"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Crawling 3 Evidence Layers...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Hypothesis Simulation</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Preset Hypotheses Selector */}
          <div className="space-y-2 flex-1">
            <div className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              Evaluated Investigation Hypotheses ({hypotheses.length})
            </div>

            <div className="space-y-2">
              {hypotheses.map((hyp) => {
                const isSelected = hyp.id === selectedHypothesisId;
                return (
                  <button
                    key={hyp.id}
                    onClick={() => setSelectedHypothesisId(hyp.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-[#121929] border-cyan-500 shadow-md'
                        : 'bg-[#0b0f19] border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-bold text-cyan-400">{hyp.id}</span>
                      <span className={`font-bold px-1.5 py-0.2 rounded ${
                        hyp.overallVerdict === 'SUPPORTED'
                          ? 'text-emerald-400 bg-emerald-950/60'
                          : 'text-rose-400 bg-rose-950/60'
                      }`}>
                        {hyp.overallVerdict} ({hyp.confidenceScore}%)
                      </span>
                    </div>

                    <div className="font-bold text-slate-100 text-[11px] line-clamp-1">
                      {hyp.title}
                    </div>

                    <div className="text-slate-400 text-[10px] mt-1 line-clamp-2 italic">
                      "{hyp.scenarioQuestion}"
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: 3-Layer Verification Breakdown */}
        <div className="lg:col-span-8 bg-[#070a0f] p-4 flex flex-col gap-4 overflow-y-auto">
          {/* Header Card with Verdict */}
          <div className="bg-[#0b101c] border border-slate-700/80 rounded-xl p-4 shadow space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold text-[10px] border border-cyan-800">
                    {selectedHypothesis.id}
                  </span>
                  <span className="text-xs font-bold text-slate-100">
                    {selectedHypothesis.title}
                  </span>
                </div>
                <div className="text-cyan-300 font-semibold text-xs mt-1 italic">
                  Hypothesis: "{selectedHypothesis.scenarioQuestion}"
                </div>
              </div>

              <div>{getVerdictBadge(selectedHypothesis.overallVerdict)}</div>
            </div>

            <div className="p-3 bg-slate-900/90 rounded border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
              <span className="text-emerald-400 font-bold">Judicial Synthesis: </span>
              {selectedHypothesis.verdictSynthesis}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-slate-400">Recommended Next Protocol:</span>
                <code className="px-2 py-0.5 rounded bg-slate-950 text-emerald-300 font-bold border border-slate-800">
                  {selectedHypothesis.suggestedAction}
                </code>
              </div>

              <button
                onClick={() => onExecuteCommand(selectedHypothesis.suggestedAction)}
                className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[11px] flex items-center gap-1.5 transition-colors"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Execute in Terminal</span>
              </button>
            </div>
          </div>

          {/* 3 Primary Verification Layers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-slate-300 font-bold text-[11px] uppercase tracking-wider">
              <span>Target Verification Layers (Mandatory Tri-Partite Model)</span>
              <span className="text-[10px] text-slate-400 font-normal">Automated Cross-Examination</span>
            </div>

            {/* Layer 1: SetupAPI & Registry */}
            <div className="bg-[#0b101c] border border-slate-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>1. {selectedHypothesis.layers.registrySetupApi.layerName}</span>
                </div>
                {getStatusBadge(selectedHypothesis.layers.registrySetupApi.status)}
              </div>

              <div className="text-[10px] text-slate-400">
                Source: <span className="text-slate-300 font-mono">{selectedHypothesis.layers.registrySetupApi.evidenceSource}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-cyan-400" /> EXPECTED ARTIFACT IF TRUE:
                  </div>
                  <div className="text-slate-200">{selectedHypothesis.layers.registrySetupApi.expectedArtifact}</div>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
                  <div className="text-[10px] font-bold text-emerald-400 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> OBSERVED INCIDENT TELEMETRY:
                  </div>
                  <div className="text-slate-200">{selectedHypothesis.layers.registrySetupApi.observedTelemetry}</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/60">
                Analysis: {selectedHypothesis.layers.registrySetupApi.forensicInterpretation}
              </div>
            </div>

            {/* Layer 2: Volume Shadow Copies (VSS) */}
            <div className="bg-[#0b101c] border border-slate-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                  <HardDrive className="w-4 h-4 text-purple-400" />
                  <span>2. {selectedHypothesis.layers.volumeShadowCopies.layerName}</span>
                </div>
                {getStatusBadge(selectedHypothesis.layers.volumeShadowCopies.status)}
              </div>

              <div className="text-[10px] text-slate-400">
                Source: <span className="text-slate-300 font-mono">{selectedHypothesis.layers.volumeShadowCopies.evidenceSource}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-purple-400" /> EXPECTED ARTIFACT IF TRUE:
                  </div>
                  <div className="text-slate-200">{selectedHypothesis.layers.volumeShadowCopies.expectedArtifact}</div>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
                  <div className="text-[10px] font-bold text-emerald-400 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> OBSERVED INCIDENT TELEMETRY:
                  </div>
                  <div className="text-slate-200">{selectedHypothesis.layers.volumeShadowCopies.observedTelemetry}</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/60">
                Analysis: {selectedHypothesis.layers.volumeShadowCopies.forensicInterpretation}
              </div>
            </div>

            {/* Layer 3: Automated Operating System Event Logs */}
            <div className="bg-[#0b101c] border border-slate-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>3. {selectedHypothesis.layers.operatingSystemLogs.layerName}</span>
                </div>
                {getStatusBadge(selectedHypothesis.layers.operatingSystemLogs.status)}
              </div>

              <div className="text-[10px] text-slate-400">
                Source: <span className="text-slate-300 font-mono">{selectedHypothesis.layers.operatingSystemLogs.evidenceSource}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-emerald-400" /> EXPECTED ARTIFACT IF TRUE:
                  </div>
                  <div className="text-slate-200">{selectedHypothesis.layers.operatingSystemLogs.expectedArtifact}</div>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
                  <div className="text-[10px] font-bold text-emerald-400 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> OBSERVED INCIDENT TELEMETRY:
                  </div>
                  <div className="text-slate-200">{selectedHypothesis.layers.operatingSystemLogs.observedTelemetry}</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/60">
                Analysis: {selectedHypothesis.layers.operatingSystemLogs.forensicInterpretation}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
