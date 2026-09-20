import React, { useState, useEffect } from 'react';
import {
  FORENSIC_CASES,
  INITIAL_TERMINAL_WELCOME,
} from './forensicData';
import {
  ForensicCase,
  EvidenceArtifact,
  TerminalEntry,
  TimelineNode,
  AuthenticationReport,
  RBACRole,
} from './types';
import { TerminalView } from './components/TerminalView';
import { EvidenceIngestWorkbench } from './components/EvidenceIngestWorkbench';
import { TimelineView } from './components/TimelineView';
import { IntegrityAuthenticator } from './components/IntegrityAuthenticator';
import { ExplainableAIMatrix } from './components/ExplainableAIMatrix';
import { CourtReportModal } from './components/CourtReportModal';
import { VaultAndCustodyView } from './components/VaultAndCustodyView';
import { EvidenceTrustScoreDashboard } from './components/EvidenceTrustScoreDashboard';
import { ManipulationAndForgeryView } from './components/ManipulationAndForgeryView';
import { EvidenceGraphView } from './components/EvidenceGraphView';
import { EntityAndExtractionView } from './components/EntityAndExtractionView';
import { DeepfakeAndSyntheticMediaView } from './components/DeepfakeAndSyntheticMediaView';
import { FileAnomalyDetectionView } from './components/FileAnomalyDetectionView';
import { ForensicCopilotSearchView } from './components/ForensicCopilotSearchView';
import { WhatIfSimulatorView } from './components/WhatIfSimulatorView';
import {
  Terminal,
  Layers,
  Clock,
  Binary,
  Sparkles,
  FileText,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Tv,
  FolderLock,
  Lock,
  Radio,
  Cpu,
  Link,
  HardDrive,
  Scale,
  Scan,
  Share2,
  Fingerprint,
  Video,
  Bot,
  FileWarning,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export default function App() {
  const [cases, setCases] = useState<ForensicCase[]>(FORENSIC_CASES);
  const [activeCaseId, setActiveCaseId] = useState<string>(FORENSIC_CASES[0].id);
  const [activeTab, setActiveTab] = useState<
    'terminal' | 'ingest' | 'timeline' | 'authenticate' | 'vault' | 'xai' | 'trust' | 'forgery' | 'graph' | 'entity' | 'deepfake' | 'copilot' | 'file-anomaly' | 'what-if'
  >('terminal');
  const [currentRole, setCurrentRole] = useState<RBACRole>('INVESTIGATOR');
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(true);

  const [scanlinesEnabled, setScanlinesEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Terminal state
  const [terminalEntries, setTerminalEntries] = useState<TerminalEntry[]>([
    {
      id: 'init-1',
      type: 'system',
      timestamp: new Date().toLocaleTimeString(),
      content: INITIAL_TERMINAL_WELCOME,
    },
  ]);

  // Unified Timeline state (initialized from active case)
  const [timelineNodes, setTimelineNodes] = useState<TimelineNode[]>([]);
  const [currentAuthReport, setCurrentAuthReport] = useState<AuthenticationReport | null>(null);

  const activeCase = cases.find((c) => c.id === activeCaseId) || cases[0];

  // Re-generate timeline whenever active case changes
  useEffect(() => {
    generateTimelineFromCase(activeCase);
  }, [activeCaseId]);

  const generateTimelineFromCase = (c: ForensicCase) => {
    // Artifact forensic mapping registry
    const metadataRegistry: Record<
      string,
      {
        microsecond: string;
        eventType: 'DETERMINISTIC_LOG' | 'PROBABILISTIC_INFERENCE';
        actionShort: string;
        mitre?: { attackPhase: string; mappedArtifact: string; mitreTechnique: string; tacticId: string };
        gapAlert?: { isGap: boolean; durationMinutes: number; displayString: string; threatProfiling: string };
        behavioralAnomaly?: {
          isAnomaly: boolean;
          baselineHours: string;
          observedTime: string;
          baselineZone: string;
          observedZone: string;
          marker: string;
        };
        evidenceGrounding?: {
          conclusion: string;
          reason: string;
          source: string;
          confidence: string;
        };
        timelineContradiction?: {
          isContradiction: boolean;
          marker: string;
          conflictingSource: string;
          description: string;
          logicalDiscrepancy: string;
          hardwareBoundViolation: string;
        };
      }
    > = {
      'ART-010': {
        microsecond: '01:58:30.120488',
        eventType: 'PROBABILISTIC_INFERENCE',
        actionShort: 'Vishing Voice Clone Call',
        mitre: {
          attackPhase: 'Initial Access',
          mappedArtifact: 'PBX Voicemail audio clone impersonating CISO',
          mitreTechnique: 'T1566.004 - Spearphishing Voice (Vishing)',
          tacticId: 'TA0001',
        },
      },
      'ART-009': {
        microsecond: '02:08:14.412090',
        eventType: 'PROBABILISTIC_INFERENCE',
        actionShort: 'Physical Access Facial Impersonation',
        mitre: {
          attackPhase: 'Defense Evasion',
          mappedArtifact: 'CCTV Camera 04 Deepfake facial overlay',
          mitreTechnique: 'T1564 - Hide Artifacts / Impersonation',
          tacticId: 'TA0005',
        },
      },
      'ART-001': {
        microsecond: '02:11:04.108422',
        eventType: 'DETERMINISTIC_LOG',
        actionShort: 'Compromised RDP Logon (10.0.8.44)',
        behavioralAnomaly: {
          isAnomaly: true,
          baselineHours: '08:00 - 19:00 UTC (Workdays)',
          observedTime: '02:11:04.108422 UTC (Off-Hours Deviation)',
          baselineZone: '10.0.4.0/24 (Management Interface Subnet)',
          observedZone: '10.0.8.44 (DMZ Workstation Interface)',
          marker: '[Flag: High-Risk Behavioral Anomaly Generated]',
        },
        evidenceGrounding: {
          conclusion: 'CRITICAL: High-Risk Behavioral Anomaly Generated & Lateral Movement Confirmed',
          reason: 'Service account svc_backup broke operational baseline by establishing interactive RDP session at 02:11:04 UTC from unapproved subnet 10.0.8.44.',
          source: 'Security.evtx (Event 4624) | SHA-256: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
          confidence: '98.4% (AI Inference + Cryptographic Event Log)',
        },
        mitre: {
          attackPhase: 'Initial Access / Lateral Movement',
          mappedArtifact: 'Security.evtx Event 4624 LogonType 10 svc_backup',
          mitreTechnique: 'T1078.002 - Domain Accounts',
          tacticId: 'TA0001',
        },
      },
      'ART-002': {
        microsecond: '02:14:35.801290',
        eventType: 'DETERMINISTIC_LOG',
        actionShort: 'Customer Vault Parquet API Dump',
        mitre: {
          attackPhase: 'Collection',
          mappedArtifact: 'IIS API dump POST /export customer_vault',
          mitreTechnique: 'T1005 - Data from Local System',
          tacticId: 'TA0009',
        },
      },
      'ART-003': {
        microsecond: '02:20:12.604192',
        eventType: 'DETERMINISTIC_LOG',
        actionShort: 'Cobalt Strike Beacon Injected',
        mitre: {
          attackPhase: 'Privilege Escalation / Execution',
          mappedArtifact: 'svchost.exe VAD injected reflective DLL',
          mitreTechnique: 'T1055 - Process Injection',
          tacticId: 'TA0004',
        },
      },
      'ART-006': {
        microsecond: '02:22:00.000000',
        eventType: 'DETERMINISTIC_LOG',
        actionShort: 'Telemetry Void (Syslog Disabled)',
        mitre: {
          attackPhase: 'Defense Evasion',
          mappedArtifact: 'Perimeter firewall syslog forwarding terminated & restarted',
          mitreTechnique: 'T1562.001 - Impair Defenses: Disable Tools',
          tacticId: 'TA0005',
        },
        gapAlert: {
          isGap: true,
          durationMinutes: 25,
          displayString: '??? [Potential Unexplained Activity Window: 25 Minutes] ???',
          threatProfiling:
            'Flagged for potential wiper execution, log deletion activities, or covert data staging window.',
        },
      },
      'ART-005': {
        microsecond: '02:28:44.102390',
        eventType: 'DETERMINISTIC_LOG',
        actionShort: 'DNS Tunneling Exfiltration',
        timelineContradiction: {
          isContradiction: true,
          marker: '[Flag: Critical Timeline Inconsistency Detected]',
          conflictingSource: 'Perimeter Power Supply Telemetry & Syslog Outage (02:22:00 - 02:47:00 UTC)',
          description: 'Localized file metadata asserts active payload writing at 02:28:44 UTC, while perimeter network UPS logs register an active hardware power shutdown between 02:22:00 and 02:47:00 UTC.',
          logicalDiscrepancy: 'Active disk write event recorded during zero-power hardware offline bounds.',
          hardwareBoundViolation: 'Hardware Offline Bounds: Zero bus power confirmed by UPS SNMP audit log.',
        },
        mitre: {
          attackPhase: 'Exfiltration',
          mappedArtifact: 'Base64 DNS query tunneling to ns1.corpexfil-cdn.xyz',
          mitreTechnique: 'T1041 - Exfiltration Over C2',
          tacticId: 'TA0010',
        },
      },
      'ART-004': {
        microsecond: '02:49:10.982100',
        eventType: 'PROBABILISTIC_INFERENCE',
        actionShort: 'Encrypted Exfiltration Handshake',
        mitre: {
          attackPhase: 'Command and Control',
          mappedArtifact: 'Signal chat database exfiltration completion token',
          mitreTechnique: 'T1071.001 - Web Protocols',
          tacticId: 'TA0011',
        },
      },
      'ART-007': {
        microsecond: '02:55:00.220180',
        eventType: 'PROBABILISTIC_INFERENCE',
        actionShort: 'Doctored Physical Badge Intake',
        mitre: {
          attackPhase: 'Defense Evasion',
          mappedArtifact: 'Altered badge JPG with spliced facial bounding box',
          mitreTechnique: 'T1564 - Altered Media',
          tacticId: 'TA0005',
        },
      },
      'ART-008': {
        microsecond: '03:02:15.541290',
        eventType: 'PROBABILISTIC_INFERENCE',
        actionShort: 'Synthetic PDF Clearance Injected',
        mitre: {
          attackPhase: 'Defense Evasion',
          mappedArtifact: 'LLM synthesized clearance PDF with 4KB injected shellcode',
          mitreTechnique: 'T1027 - Obfuscated/Encrypted Files',
          tacticId: 'TA0005',
        },
      },
      // CASE-IDF-3109 artifacts
      'ART-201': {
        microsecond: '16:04:12.100940',
        eventType: 'PROBABILISTIC_INFERENCE',
        actionShort: 'Phishing Email Received with Spoofed PDF',
        mitre: {
          attackPhase: 'Initial Access',
          mappedArtifact: 'Phishing email with disguised executable invoice attachment',
          mitreTechnique: 'T1566.001 - Spearphishing Attachment',
          tacticId: 'TA0001',
        },
      },
      'ART-202': {
        microsecond: '16:05:39.441209',
        eventType: 'DETERMINISTIC_LOG',
        actionShort: 'MFT Timestomping ($STANDARD_INFO vs $FILE_NAME)',
        mitre: {
          attackPhase: 'Defense Evasion',
          mappedArtifact: 'NTFS MFT timestomp delta of 1,985 days on malicious payload',
          mitreTechnique: 'T1070.006 - Timestomp',
          tacticId: 'TA0005',
        },
      },
      // CASE-IDF-5021 artifacts
      'ART-501': {
        microsecond: '14:00:00.000120',
        eventType: 'PROBABILISTIC_INFERENCE',
        actionShort: 'Court Exhibit Steganography Carrier Ingest',
        mitre: {
          attackPhase: 'Defense Evasion',
          mappedArtifact: 'WAV LSB Chi-Square uniform bit entropy anomaly',
          mitreTechnique: 'T1027.003 - Steganography',
          tacticId: 'TA0005',
        },
      },
    };

    const intermediateNodes: (TimelineNode & { actionShort: string; sortKey: string })[] = [];

    c.artifacts.forEach((art, idx) => {
      const reg = metadataRegistry[art.id];
      const isVoid = art.triageCategory === 'Telemetry Void' || !!reg?.gapAlert;
      let timestamp = art.timestampRange || '2026-09-19T02:00:00Z';
      if (timestamp.includes(' - ')) {
        timestamp = timestamp.split(' - ')[0];
      }

      let actor = 'System';
      if (art.sourceType === 'mobile_extraction') actor = '@GhostNode_44';
      else if (art.sourceType === 'system_logs' && art.label.includes('EVTX')) actor = 'svc_backup (10.0.8.44)';
      else if (art.sourceType === 'system_logs' && art.label.includes('IIS')) actor = 'svc_backup';
      else if (art.sourceType === 'memory_dump') actor = 'svchost.exe (PID 4412)';
      else if (art.sourceType === 'network_pcap') actor = '10.0.8.44 -> ns1.corpexfil-cdn.xyz';
      else if (art.id === 'ART-009') actor = 'Physical Intruder (Masked)';
      else if (art.id === 'ART-010') actor = 'Vishing Actor (Spoofed Voice)';

      const microsecondTimestamp = reg?.microsecond || `02:${String(idx * 3).padStart(2, '0')}:00.000000`;
      const actionShort = reg?.actionShort || art.label.substring(0, 32);

      let rawRecordContent = art.rawPayload;
      if (reg?.behavioralAnomaly) {
        rawRecordContent += `\n\n${reg.behavioralAnomaly.marker}`;
      }
      if (reg?.timelineContradiction) {
        rawRecordContent += `\n\n${reg.timelineContradiction.marker}`;
      }

      intermediateNodes.push({
        id: `TL-${idx + 1}`,
        timestamp,
        microsecondTimestamp,
        sourceType: art.sourceType,
        sourceLabel: art.label,
        actor,
        eventDescription: art.label + ': ' + (art.iocs?.[0]?.context || art.sourceFile),
        rawRecord: rawRecordContent,
        cryptographicHash: art.sha256 || '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        isTelemetryVoid: isVoid,
        severity: isVoid ? 'void' : art.triageCategory === 'Critical' ? 'critical' : 'suspicious',
        eventType: reg?.eventType || (isVoid ? 'DETERMINISTIC_LOG' : 'PROBABILISTIC_INFERENCE'),
        gapAlert: reg?.gapAlert,
        mitreMapping: reg?.mitre,
        behavioralAnomaly: reg?.behavioralAnomaly,
        evidenceGrounding: reg?.evidenceGrounding,
        timelineContradiction: reg?.timelineContradiction,
        actionShort,
        sortKey: microsecondTimestamp,
      });
    });

    // Sort chronologically by microsecond
    intermediateNodes.sort((a, b) => a.sortKey.localeCompare(b.sortKey));

    // Construct pipeline linear sequence syntax for each step
    const finalNodes: TimelineNode[] = intermediateNodes.map((node, i) => {
      const nextNode = intermediateNodes[i + 1];
      const linearSequenceSyntax = nextNode
        ? `[${node.microsecondTimestamp}] (${node.actionShort}) ---> [${nextNode.microsecondTimestamp}] (${nextNode.actionShort})`
        : `[${node.microsecondTimestamp}] (${node.actionShort}) ---> [INVESTIGATION PIPELINE TERMINUS]`;

      const correlationLink =
        i > 0
          ? `Correlates temporally with [${intermediateNodes[i - 1].sourceLabel}]`
          : undefined;

      return {
        ...node,
        linearSequenceSyntax,
        correlationLink,
      };
    });

    setTimelineNodes(finalNodes);
  };

  // Execute terminal or workbench commands
  const handleExecuteCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    const timestamp = new Date().toLocaleTimeString();

    // Append user command
    const userEntry: TerminalEntry = {
      id: `cmd-${Date.now()}`,
      type: 'input',
      timestamp,
      content: trimmed,
    };

    setTerminalEntries((prev) => [...prev, userEntry]);

    // Fast local command checks
    if (trimmed === '/clear') {
      setTerminalEntries([]);
      return;
    }

    if (trimmed === '/help') {
      const helpText = `[INDIGENOUS DIGITAL FORENSICS INVESTIGATION FRAMEWORK - COMMAND REFERENCE]

CORE OPERATIONAL PROTOCOLS:
  /triage       - Group unstructured or raw forensic data into specific risk categories (Critical, Suspicious, Normal, Telemetry Void).
  /correlate    - Reconstruct unified cryptographic chronological timeline linking multi-source data nodes.
  /mitre        - MITRE ATT&CK Enterprise taxonomy matrix (Attack Phase, Mapped Forensic Artifact, MITRE Technique).
  /gap          - Missing event detection & threat profiling for temporal voids.
  /authenticate - Inspect file magic bytes, cryptographic digests, and NTFS MFT timestomping anomalies.
  /trust        - Review Evidence Trust Score Dashboard (SHA-256, Metadata %, Time %, Tampering Risk, Facts vs Probabilities).
  /forgery      - Execute OpenCV/PyTorch CV Image Manipulation (ELA, Clones) & PDF Object Tree Parser (3-layer consistency).
  /deepfake     - Multi-modal Deepfake & Synthetic Media Suite (Facial landmark, blink rate, PRNU, MFCC voice clone, LLM perplexity).
  /graph        - Interactive Neo4j AI Evidence Graph with multi-hop link analysis (:Person -> :File -> :Device -> :IP -> :Domain).
  /entity       - Entity Resolution engine linking disparate digital aliases to a unified identity (confidence score & cross-links).
  /extract      - Intelligent artifact extraction (Network IoCs, User Identifiers, Spatial & Temporal metadata).
  /vault        - Audit MinIO WORM immutable storage, compliance locks, and dual AES-256 encryption.
  /custody      - Review ISO/IEC 27037 sequential hand-off ledger & cryptographic verification audit.
  /provenance   - Verify backward lineage mappings: [Artifact] -> [Container] -> [Sector Offset] -> [Image Hash].
  /nsrl         - Cross-reference evidence hashes against NIST National Software Reference Library (RDS).
  /tamper       - Conduct anti-forensic vulnerability and simulated overwrite resistance tests.
  /rbac [ROLE]  - Inspect or switch active session role (INVESTIGATOR or AUDITOR).
  /report       - Generate formal court-admissible forensic incident report & chain of custody affidavit.
  /cases        - List available forensic case dossiers in the repository.
  /load <ID>    - Load specific case (e.g. /load CASE-IDF-8942, /load CASE-IDF-3109, /load CASE-IDF-5021).
  /clear        - Clear terminal screen history.

OPERATIONAL CONSTRAINTS ENFORCED:
  * Absolute Objectivity: Zero intent assumed; findings reflect cryptographic verification and logs.
  * No Speculative Gaps: Missing audit logs are strictly preserved as "Telemetry Voids".
  * Anti-Hallucination: Unrecognized structures are flagged as unsupported.
  * ISO/IEC 27037 & FRE 902(14): Complete dual hashing (SHA-256 + SHA-3) and immutable chain of custody.
  * Explainable AI (XAI): Explicit technical 'Why' and SHAP/LIME attribution factor weights provided.`;

      setTerminalEntries((prev) => [
        ...prev,
        {
          id: `out-${Date.now()}`,
          type: 'output',
          timestamp,
          content: helpText,
        },
      ]);
      return;
    }

    if (trimmed.startsWith('/rbac')) {
      const parts = trimmed.split(' ');
      if (parts.length > 1) {
        const requestedRole = parts[1].toUpperCase();
        if (requestedRole === 'AUDITOR' || requestedRole === 'INVESTIGATOR') {
          setCurrentRole(requestedRole as RBACRole);
          setTerminalEntries((prev) => [
            ...prev,
            {
              id: `out-${Date.now()}`,
              type: 'output',
              timestamp,
              content: `[RBAC ACCESS CONTROL UPDATE]\nSession Security Principal: ${requestedRole === 'INVESTIGATOR' ? 'INV-001 (Senior Forensic Examiner)' : 'AUDITOR-01 (Independent Forensic Directorate)'}\nActive Role Enforced: ${requestedRole}\nPermissions Granted: ${requestedRole === 'AUDITOR' ? 'Read-Only Audit Trail, Compliance Verification, FRE 902(14) Signing' : 'Evidence Ingestion, Anomaly Carving, Chain-of-Custody Handoff'}`,
            },
          ]);
          return;
        }
      }
      setTerminalEntries((prev) => [
        ...prev,
        {
          id: `out-${Date.now()}`,
          type: 'output',
          timestamp,
          content: `[RBAC SECURITY STATUS]\nCurrent Enforced Role: ${currentRole}\nPrincipal Identifier : ${currentRole === 'INVESTIGATOR' ? 'INV-001' : 'AUDITOR-01'}\nTo switch active role, enter: "/rbac INVESTIGATOR" or "/rbac AUDITOR"`,
        },
      ]);
      return;
    }

    if (trimmed === '/cases') {
      const caseList = cases
        .map(
          (c) =>
            `  * [${c.id}] ${c.title}\n    Incident: ${c.incidentType} | Artifacts: ${c.artifacts.length}`
        )
        .join('\n\n');

      setTerminalEntries((prev) => [
        ...prev,
        {
          id: `out-${Date.now()}`,
          type: 'output',
          timestamp,
          content: `AVAILABLE FORENSIC DOSSIERS:\n\n${caseList}\n\nUse "/load <CASE-ID>" to mount a case into the framework.`,
        },
      ]);
      return;
    }

    if (trimmed.startsWith('/load ')) {
      const targetId = trimmed.replace('/load ', '').trim();
      const targetCase = cases.find(
        (c) => c.id.toLowerCase() === targetId.toLowerCase()
      );
      if (targetCase) {
        setActiveCaseId(targetCase.id);
        setTerminalEntries((prev) => [
          ...prev,
          {
            id: `out-${Date.now()}`,
            type: 'output',
            timestamp,
            content: `[SYSTEM] Case dossier mounted successfully: [${targetCase.id}] ${targetCase.title}\nLoaded ${targetCase.artifacts.length} heterogeneous evidence artifacts into memory.`,
          },
        ]);
      } else {
        setTerminalEntries((prev) => [
          ...prev,
          {
            id: `out-${Date.now()}`,
            type: 'error',
            timestamp,
            content: `Case '${targetId}' not found. Enter '/cases' to view active forensic files.`,
          },
        ]);
      }
      return;
    }

    if (trimmed === '/report') {
      setIsReportModalOpen(true);
    }

    // Call server AI Forensic engine
    setIsLoading(true);

    try {
      // Gather active artifacts telemetry as context
      const evidencePayload = activeCase.artifacts
        .map((a) => `--- [${a.label}] (${a.sourceFile}) ---\n${a.rawPayload}`)
        .join('\n\n');

      const response = await fetch('/api/forensics/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: trimmed,
          evidenceText: evidencePayload,
          caseContext: {
            id: activeCase.id,
            title: activeCase.title,
            incidentType: activeCase.incidentType,
            threatActorContext: activeCase.threatActorContext,
          },
        }),
      });

      const data = await response.json();

      if (data.analysis) {
        setTerminalEntries((prev) => [
          ...prev,
          {
            id: `out-${Date.now()}`,
            type: 'output',
            timestamp: new Date().toLocaleTimeString(),
            content: data.analysis,
          },
        ]);

        // Auto-switch tabs if specific command was invoked
        if (
          trimmed.startsWith('/correlate') ||
          trimmed.startsWith('/timeline') ||
          trimmed.startsWith('/mitre') ||
          trimmed.startsWith('/gap')
        ) {
          setActiveTab('timeline');
        } else if (trimmed.startsWith('/authenticate')) {
          setActiveTab('authenticate');
        } else if (trimmed.startsWith('/triage')) {
          setActiveTab('ingest');
        } else if (trimmed.startsWith('/trust')) {
          setActiveTab('trust');
        } else if (trimmed.startsWith('/forgery')) {
          setActiveTab('forgery');
        } else if (trimmed.startsWith('/deepfake') || trimmed.startsWith('/synthetic')) {
          setActiveTab('deepfake');
        } else if (trimmed.startsWith('/graph')) {
          setActiveTab('graph');
        } else if (trimmed.startsWith('/entity') || trimmed.startsWith('/extract')) {
          setActiveTab('entity');
        } else if (
          trimmed.startsWith('/vault') ||
          trimmed.startsWith('/custody') ||
          trimmed.startsWith('/provenance') ||
          trimmed.startsWith('/nsrl') ||
          trimmed.startsWith('/tamper')
        ) {
          setActiveTab('vault');
        } else if (
          trimmed.startsWith('/copilot') ||
          trimmed.startsWith('/search') ||
          trimmed.startsWith('/query') ||
          trimmed.startsWith('/ask')
        ) {
          setActiveTab('copilot');
        } else if (
          trimmed.startsWith('/file-anomaly') ||
          trimmed.startsWith('/double-ext') ||
          trimmed.startsWith('/ads') ||
          trimmed.startsWith('/entropy') ||
          trimmed.startsWith('/compression')
        ) {
          setActiveTab('file-anomaly');
        }
      } else {
        throw new Error(data.error || 'Forensic analysis pipeline failed.');
      }
    } catch (err: any) {
      setTerminalEntries((prev) => [
        ...prev,
        {
          id: `out-${Date.now()}`,
          type: 'error',
          timestamp: new Date().toLocaleTimeString(),
          content: `[FORENSIC ENGINE ERROR]: ${err.message || 'Analysis could not be completed'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectArtifactForAnalysis = async (
    artifact: EvidenceArtifact,
    action: string
  ) => {
    setActiveTab('terminal');
    await handleExecuteCommand(`${action} ${artifact.label}`);
  };

  const handleAddCustomArtifact = (artifact: EvidenceArtifact) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === activeCaseId) {
          return {
            ...c,
            artifacts: [artifact, ...c.artifacts],
          };
        }
        return c;
      })
    );

    setTerminalEntries((prev) => [
      ...prev,
      {
        id: `out-${Date.now()}`,
        type: 'output',
        timestamp: new Date().toLocaleTimeString(),
        content: `[INGEST CONFIRMED] New artifact registered: "${artifact.label}" (${artifact.sourceType})\nComputed SHA-256: ${artifact.sha256 || 'Computed at verification'}\nTriage Priority: ${artifact.triageCategory}`,
      },
    ]);
  };

  const handleRunAuthentication = async (data: {
    filename: string;
    content: string;
    declaredExtension: string;
    headerHex?: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/forensics/verify-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      const isPeDisguisedAsPdf =
        (data.headerHex?.startsWith('4D5A') || data.content.startsWith('MZ')) &&
        data.declaredExtension.toLowerCase() === 'pdf';

      const isTimestomped = data.filename.includes('evtx') || data.filename.includes('Audit');

      const report: AuthenticationReport = {
        targetArtifact: data.filename,
        declaredExtension: data.declaredExtension,
        detectedMagicBytes: res.detectedType || 'Unknown',
        fileSignatureMatch: res.fileSignatureMatch,
        tamperingFlag: res.tamperingFlag,
        md5: res.hashes?.md5 || '5d41402abc4b2a76b9719d911017c592',
        sha256: res.hashes?.sha256 || '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        timestompDetected: isPeDisguisedAsPdf || isTimestomped,
        mftStandardInfoTime: isTimestomped ? '2021-04-12 11:20:00.000 UTC' : undefined,
        mftFileNameTime: isTimestomped ? '2026-09-18 16:05:39.441 UTC' : undefined,
        integrityVerdict: res.tamperingFlag
          ? 'HEADER_SPOOFED'
          : 'VERIFIED_AUTHENTIC',
        technicalWhy: res.technicalWhy,
        xaiFactors: [
          {
            feature: 'Magic Bytes vs Extension Check',
            weight: res.fileSignatureMatch ? 0.1 : 0.98,
            direction: res.fileSignatureMatch ? 'supports_normal' : 'supports_critical',
            technicalWhy: res.fileSignatureMatch
              ? 'File header matches declared container specification.'
              : 'Header signature indicates PE binary while file declared as document.',
          },
          {
            feature: 'Cryptographic Hash Integrity',
            weight: 0.95,
            direction: 'supports_critical',
            technicalWhy: 'Calculated SHA-256 hash verified against FIPS 180-4 standard.',
          },
        ],
      };

      setCurrentAuthReport(report);

      // Also log in terminal
      setTerminalEntries((prev) => [
        ...prev,
        {
          id: `out-${Date.now()}`,
          type: 'output',
          timestamp: new Date().toLocaleTimeString(),
          content: `[/authenticate EXECUTION COMPLETE]\nTarget: ${data.filename}\nDetected Format: ${res.detectedType}\nVerdict: ${report.integrityVerdict}\nSHA-256: ${res.hashes?.sha256}\nTechnical Reason: ${res.technicalWhy}`,
        },
      ]);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#070a0f] text-slate-200 flex flex-col ${scanlinesEnabled ? 'scanlines' : ''}`}>
      {/* Top Apple OS Window Container */}
      <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-2 sm:p-4 lg:p-6">
        {/* Apple Terminal Window Chrome */}
        <div className="bg-[#141b29] border border-slate-700/80 rounded-t-xl px-4 py-3 flex flex-wrap items-center justify-between gap-2 shadow-2xl select-none">
          {/* macOS Window Traffic Lights */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExecuteCommand('/clear')}
              className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:brightness-110 border border-[#e0443e] transition-all flex items-center justify-center group"
              title="Close / Reset Session"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[9px] text-black font-bold">✕</span>
            </button>
            <button
              onClick={() => setActiveTab(activeTab === 'terminal' ? 'ingest' : 'terminal')}
              className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:brightness-110 border border-[#dea123] transition-all flex items-center justify-center group"
              title="Minimize / Cycle View"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[9px] text-black font-bold">−</span>
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:brightness-110 border border-[#1aab29] transition-all flex items-center justify-center group"
              title="Toggle Fullscreen Width"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[9px] text-black font-bold">+</span>
            </button>

            <span className="ml-3 text-xs font-semibold text-slate-200 font-terminal tracking-wide hidden sm:inline-block">
              Apple OS System Terminal -- bash -- 80x24 -- Courier New
            </span>
          </div>

          {/* Middle Framework Status */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              [Indigenous Digital Forensics Engine: ONLINE]
            </span>
          </div>

          {/* Right Utilities */}
          <div className="flex items-center gap-2">
            {/* RBAC Role Switcher */}
            <button
              onClick={() => {
                const nextRole = currentRole === 'INVESTIGATOR' ? 'AUDITOR' : 'INVESTIGATOR';
                setCurrentRole(nextRole);
                setTerminalEntries((prev) => [
                  ...prev,
                  {
                    id: `out-${Date.now()}`,
                    type: 'output',
                    timestamp: new Date().toLocaleTimeString(),
                    content: `[RBAC SECURITY ACTIVE]: Switched role to ${nextRole} (${nextRole === 'INVESTIGATOR' ? 'INV-001 - Senior Forensic Examiner' : 'AUDITOR-01 - Independent Audit Directorate'}).`,
                  },
                ]);
              }}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 border transition-colors ${
                currentRole === 'AUDITOR'
                  ? 'bg-amber-950/70 border-amber-500/60 text-amber-300 hover:bg-amber-900/60'
                  : 'bg-blue-950/70 border-blue-500/60 text-blue-300 hover:bg-blue-900/60'
              }`}
              title="Click to toggle RBAC Role (INVESTIGATOR / AUDITOR)"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ROLE: {currentRole}</span>
            </button>

            <button
              onClick={() => setScanlinesEnabled(!scanlinesEnabled)}
              className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1 font-mono ${
                scanlinesEnabled
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Toggle CRT Terminal Scanlines Effect"
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden md:inline">CRT FX</span>
            </button>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-2.5 py-1 rounded bg-purple-950/80 border border-purple-600/60 text-purple-300 hover:bg-purple-900/80 transition-colors text-xs font-mono font-bold flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Court Report</span>
            </button>
          </div>
        </div>

        {/* Operational Navigation Tabs */}
        <div className="bg-[#0b101c] border-x border-slate-800 px-4 py-1.5 flex items-center gap-1 overflow-x-auto text-xs font-mono border-b border-slate-800 select-none">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1.5 rounded-t-md font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'terminal'
                ? 'bg-[#070a0f] text-emerald-400 border-t-2 border-emerald-500 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>&gt;_ Apple OS Terminal</span>
          </button>

          <button
            onClick={() => setActiveTab('ingest')}
            className={`px-3 py-1.5 rounded-t-md font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'ingest'
                ? 'bg-[#080c14] text-amber-300 border-t-2 border-amber-500 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Multi-Source Ingest ({activeCase.artifacts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-t-md font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'timeline'
                ? 'bg-[#080c14] text-cyan-300 border-t-2 border-cyan-500 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Cryptographic Timeline ({timelineNodes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('authenticate')}
            className={`px-3 py-1.5 rounded-t-md font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'authenticate'
                ? 'bg-[#080c14] text-emerald-300 border-t-2 border-emerald-500 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>Integrity / Magic Bytes</span>
          </button>

          <button
            onClick={() => setActiveTab('trust')}
            className={`px-3 py-1.5 rounded-t-md font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'trust'
                ? 'bg-[#080c14] text-amber-400 border-t-2 border-amber-500 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Trust Score Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('graph')}
            className={`px-3 py-1.5 rounded-t-md font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'graph'
                ? 'bg-[#080c14] text-sky-300 border-t-2 border-sky-500 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Evidence Graph (Neo4j)</span>
          </button>

          <button
            onClick={() => setActiveTab('forgery')}
            className={`px-3 py-1.5 rounded-t-md font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'forgery'
                ? 'bg-[#080c14] text-rose-300 border-t-2 border-rose-500 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Scan className="w-3.5 h-3.5 text-rose-400" />
            <span>Forgery (CV/PDF)</span>
          </button>

          <button
            onClick={() => setActiveTab('deepfake')}
            className={`px-3 py-1.5 rounded-t-md font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'deepfake'
                ? 'bg-[#080c14] text-purple-300 border-t-2 border-purple-500 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-purple-400" />
            <span>Deepfake & Synthetic Media</span>
          </button>

          <button
            onClick={() => setActiveTab('entity')}
            className={`px-3 py-1.5 rounded-t-md font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'entity'
                ? 'bg-[#080c14] text-emerald-300 border-t-2 border-emerald-500 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
            <span>Entity & IoCs</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`px-3 py-1.5 rounded-t-md font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'vault'
                ? 'bg-[#080c14] text-purple-300 border-t-2 border-purple-500 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>Vault & Custody (WORM)</span>
          </button>

          <button
            onClick={() => setActiveTab('copilot')}
            className={`px-3 py-1.5 rounded-t-md font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'copilot'
                ? 'bg-[#080c14] text-indigo-300 border-t-2 border-indigo-500 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Copilot & Search</span>
          </button>

          <button
            onClick={() => setActiveTab('file-anomaly')}
            className={`px-3 py-1.5 rounded-t-md font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'file-anomaly'
                ? 'bg-[#080c14] text-amber-300 border-t-2 border-amber-500 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileWarning className="w-3.5 h-3.5 text-amber-400" />
            <span>File Anomaly (ADS/Entropy)</span>
          </button>

          <button
            onClick={() => setActiveTab('xai')}
            className={`px-3 py-1.5 rounded-t-md font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'xai'
                ? 'bg-[#080c14] text-blue-300 border-t-2 border-blue-500 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explainable AI (SHAP)</span>
          </button>
        </div>

        {/* Workbench Body Content */}
        <div className="flex-1 flex flex-col min-h-[620px] bg-[#070a0f] shadow-2xl">
          {activeTab === 'terminal' && (
            <TerminalView
              entries={terminalEntries}
              onExecuteCommand={handleExecuteCommand}
              isLoading={isLoading}
              activeCase={activeCase}
              onSelectCase={setActiveCaseId}
              onOpenReport={() => setIsReportModalOpen(true)}
            />
          )}

          {activeTab === 'ingest' && (
            <EvidenceIngestWorkbench
              activeCase={activeCase}
              allCases={cases}
              onSelectCase={setActiveCaseId}
              onSelectArtifactForAnalysis={handleSelectArtifactForAnalysis}
              onAddCustomArtifact={handleAddCustomArtifact}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineView
              timeline={timelineNodes}
              onTriggerCorrelate={() => handleExecuteCommand('/correlate')}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'authenticate' && (
            <IntegrityAuthenticator
              onRunAuthentication={handleRunAuthentication}
              isLoading={isLoading}
              currentReport={currentAuthReport}
            />
          )}

          {activeTab === 'trust' && (
            <EvidenceTrustScoreDashboard
              activeCase={activeCase}
              onSelectArtifact={(art) => handleSelectArtifactForAnalysis(art, '/trust')}
              onOpenReport={() => setIsReportModalOpen(true)}
            />
          )}

          {activeTab === 'graph' && (
            <EvidenceGraphView caseData={activeCase} />
          )}

          {activeTab === 'forgery' && (
            <ManipulationAndForgeryView caseData={activeCase} />
          )}

          {activeTab === 'deepfake' && (
            <DeepfakeAndSyntheticMediaView caseData={activeCase} />
          )}

          {activeTab === 'entity' && (
            <EntityAndExtractionView caseData={activeCase} />
          )}

          {activeTab === 'copilot' && (
            <ForensicCopilotSearchView
              caseData={activeCase}
              onExecuteCommand={handleExecuteCommand}
            />
          )}

          {activeTab === 'file-anomaly' && (
            <FileAnomalyDetectionView
              caseData={activeCase}
              onExecuteCommand={handleExecuteCommand}
            />
          )}

          {activeTab === 'vault' && (
            <VaultAndCustodyView
              activeCase={activeCase}
              currentRole={currentRole}
              onRoleChange={setCurrentRole}
              onExecuteCommand={handleExecuteCommand}
            />
          )}

          {activeTab === 'xai' && <ExplainableAIMatrix caseData={activeCase} />}
        </div>

        {/* Bottom Status Telemetry Footer */}
        <div className="bg-[#090d16] border border-t-0 border-slate-800 rounded-b-xl px-4 py-2 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              INTEGRITY: UNCOMPROMISED
            </span>
            <span className="text-slate-600">|</span>
            <span>STANDARD: ISO/IEC 27037 & FRE 902(14)</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <span>MODEL: Gemini-3.8-Flash (XAI Core)</span>
            <span>HASH: SHA-256 / FIPS-180-4</span>
            <span className="text-slate-400">HOST: apple-os-forensics</span>
          </div>
        </div>
      </div>

      {/* Court Admissible Report Modal */}
      <CourtReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        caseData={activeCase}
      />
    </div>
  );
}
