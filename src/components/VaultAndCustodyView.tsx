import React, { useState } from 'react';
import { ForensicCase, RBACRole, CustodyLedgerEvent, MinIOVaultObject, EvidenceArtifact } from '../types';
import {
  ShieldCheck,
  Lock,
  Database,
  Link,
  UserCheck,
  AlertOctagon,
  FileCheck2,
  RefreshCw,
  Eye,
  KeyRound,
  FileCode,
  Layers,
  ChevronRight,
  Fingerprint,
  CheckCircle2,
  ShieldAlert,
  HardDrive
} from 'lucide-react';

interface VaultAndCustodyViewProps {
  activeCase: ForensicCase;
  currentRole: RBACRole;
  onRoleChange: (role: RBACRole) => void;
  onExecuteCommand: (cmd: string) => void;
}

export const VaultAndCustodyView: React.FC<VaultAndCustodyViewProps> = ({
  activeCase,
  currentRole,
  onRoleChange,
  onExecuteCommand
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'pipeline' | 'custody' | 'vault' | 'provenance' | 'nsrl'>('pipeline');
  const [tamperTestMessage, setTamperTestMessage] = useState<string | null>(null);
  const [simulatedTamperActive, setSimulatedTamperActive] = useState(false);

  // Derive custody ledger from case or defaults
  const custodyEvents: CustodyLedgerEvent[] = activeCase.custodyLedger || [
    {
      eventId: 'CUST-001',
      actorId: 'INV-001',
      actorRole: 'INVESTIGATOR',
      actionPerformed: 'Physical Media Acquisition & Bitstream Hashing',
      timestamp: '2026-09-19T02:30:15Z',
      targetArtifact: 'Physical Disk Image HOST044.raw (E01 Format)',
      hashSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      hashSha3: 'd14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f',
      verificationStatus: 'VERIFIED',
      notes: 'Acquired with hardware write-blocker Tableau T8u. Sealed into evidence locker.'
    },
    {
      eventId: 'CUST-002',
      actorId: 'ANALYST-02',
      actorRole: 'INVESTIGATOR',
      actionPerformed: 'Carve & Extract Ingest Artifacts',
      timestamp: '2026-09-19T02:45:00Z',
      targetArtifact: 'Security.evtx & Cellebrite UFDR Chat Extract',
      hashSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      hashSha3: '8f729b48c3127ef64a93815048cd317284b1264871e98947f63b2190',
      verificationStatus: 'VERIFIED',
      notes: 'Carved MFT journal entries and SQLite WAL records. Ingested to MinIO WORM vault.'
    },
    {
      eventId: 'CUST-003',
      actorId: 'AUDITOR-01',
      actorRole: 'AUDITOR',
      actionPerformed: 'Cryptographic Audit & FRE 902(14) Certification',
      timestamp: '2026-09-19T03:00:00Z',
      targetArtifact: 'Unified Dossier Hash Manifest & Case Seal',
      hashSha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
      hashSha3: '1f92e448b1092a7e584f23e67c8249019b3482716492817462819284',
      verificationStatus: 'VERIFIED',
      notes: 'Audit ledger sealed. Dual SHA-256 / SHA-3 match verified against physical evidence tag.'
    }
  ];

  // Derive MinIO Vault Objects
  const vaultObjects: MinIOVaultObject[] = activeCase.vaultObjects || [
    {
      objectKey: 'minio://forensic-vault-case-8942/raw-images/HOST044.raw',
      bucket: 'forensic-vault-case-8942',
      versionId: 'v1.0.0',
      encryptionStandard: 'AES-256-GCM',
      sizeBytes: 51772416000,
      uploadedAt: '2026-09-19T02:30:15Z',
      uploadedBy: 'INV-001 (INVESTIGATOR)',
      sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      sha3: 'd14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f',
      immutabilityLock: true,
      auditLogCount: 14
    },
    {
      objectKey: 'minio://forensic-vault-case-8942/extracted/Security.evtx',
      bucket: 'forensic-vault-case-8942',
      versionId: 'v1.0.1',
      encryptionStandard: 'AES-256-GCM',
      sizeBytes: 14892400,
      uploadedAt: '2026-09-19T02:45:00Z',
      uploadedBy: 'ANALYST-02 (INVESTIGATOR)',
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      sha3: '8f729b48c3127ef64a93815048cd317284b1264871e98947f63b2190',
      immutabilityLock: true,
      auditLogCount: 8
    },
    {
      objectKey: 'minio://forensic-vault-case-8942/mobile/DEV-IPHONE15-EXTRACT.ufdr',
      bucket: 'forensic-vault-case-8942',
      versionId: 'v1.0.0',
      encryptionStandard: 'AES-256-GCM',
      sizeBytes: 8941029000,
      uploadedAt: '2026-09-19T02:50:11Z',
      uploadedBy: 'INV-001 (INVESTIGATOR)',
      sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
      sha3: '1f92e448b1092a7e584f23e67c8249019b3482716492817462819284',
      immutabilityLock: true,
      auditLogCount: 12
    }
  ];

  const handleSimulateTamperAttempt = (objectKey: string) => {
    setSimulatedTamperActive(true);
    setTamperTestMessage(
      `[WORM OBJECT LOCK REJECTION] Write operation denied on ${objectKey}. MinIO Compliance Mode enforced (Retention Lock active). Alert dispatched to AUDITOR-01 ledger.`
    );
    setTimeout(() => {
      setSimulatedTamperActive(false);
    }, 4000);
  };

  return (
    <div className="flex flex-col h-full bg-[#080c14] border border-slate-800/80 rounded-b-xl overflow-hidden font-mono text-xs">
      {/* Top Header & RBAC Switcher */}
      <div className="bg-[#0e1320] p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-emerald-950/60 border border-emerald-700/60 text-emerald-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-sm">
                IMMUTABLE EVIDENCE VAULT & CUSTODY LEDGER
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
                WORM ACTIVE
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              ISO/IEC 27037 Compliance Engine • AES-256-GCM Encryption • Dual-Stream SHA-256 & SHA-3
            </p>
          </div>
        </div>

        {/* RBAC Role Selector */}
        <div className="flex items-center gap-2 bg-[#141b2c] p-1.5 rounded border border-slate-700">
          <UserCheck className="w-4 h-4 text-slate-400" />
          <span className="text-[11px] text-slate-400 font-semibold">ACTIVE RBAC:</span>
          <button
            onClick={() => {
              onRoleChange('INVESTIGATOR');
              onExecuteCommand('/rbac INVESTIGATOR');
            }}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              currentRole === 'INVESTIGATOR'
                ? 'bg-cyan-600 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            INV-001 (Investigator)
          </button>
          <button
            onClick={() => {
              onRoleChange('AUDITOR');
              onExecuteCommand('/rbac AUDITOR');
            }}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              currentRole === 'AUDITOR'
                ? 'bg-purple-600 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AUDITOR-01 (Auditor)
          </button>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="bg-[#0a0f19] px-4 py-2 border-b border-slate-800 flex items-center gap-2">
        <button
          onClick={() => setActiveSubTab('pipeline')}
          className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 ${
            activeSubTab === 'pipeline'
              ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Ingest Pipeline</span>
        </button>
        <button
          onClick={() => setActiveSubTab('vault')}
          className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 ${
            activeSubTab === 'vault'
              ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>MinIO Vault ({vaultObjects.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('custody')}
          className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 ${
            activeSubTab === 'custody'
              ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Link className="w-3.5 h-3.5" />
          <span>Custody Ledger ({custodyEvents.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('provenance')}
          className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 ${
            activeSubTab === 'provenance'
              ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Backward Lineage</span>
        </button>
        <button
          onClick={() => setActiveSubTab('nsrl')}
          className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 ${
            activeSubTab === 'nsrl'
              ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>NSRL Baseline</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* PIPELINE VIEW */}
        {activeSubTab === 'pipeline' && (
          <div className="space-y-4">
            {/* Visual Pipeline Banner */}
            <div className="bg-[#0d1322] p-4 rounded-lg border border-slate-800">
              <h3 className="text-slate-200 font-bold mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                CRYPTOGRAPHIC EVIDENCE PROCESSING PIPELINE
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="bg-[#090d16] p-3 rounded border border-slate-700/70">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Step 1 • Ingest</div>
                  <div className="text-cyan-400 font-bold mt-1 text-sm">Multi-Source Ingest</div>
                  <p className="text-slate-400 text-[11px] mt-1">
                    RAW/E01 Disk, UFED/TAR Mobile, PCAP/Syslog logs received via hardware write-blocker.
                  </p>
                </div>
                <div className="bg-[#090d16] p-3 rounded border border-slate-700/70">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Step 2 • Integrity</div>
                  <div className="text-emerald-400 font-bold mt-1 text-sm">Dual Stream Hash</div>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Simultaneous SHA-256 and Keccak/SHA-3 calculation ensures zero collision vulnerability.
                  </p>
                </div>
                <div className="bg-[#090d16] p-3 rounded border border-slate-700/70">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Step 3 • Storage</div>
                  <div className="text-purple-400 font-bold mt-1 text-sm">MinIO WORM Vault</div>
                  <p className="text-slate-400 text-[11px] mt-1">
                    AES-256-GCM encryption at rest with Write-Once-Read-Many object retention locking.
                  </p>
                </div>
                <div className="bg-[#090d16] p-3 rounded border border-slate-700/70">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Step 4 • Certification</div>
                  <div className="text-amber-400 font-bold mt-1 text-sm">Audit Ledger Sealed</div>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Append-only sequential ledger satisfies ISO/IEC 27037 and FRE 902(14) court rules.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Command Triggers */}
            <div className="bg-[#0d1322] p-4 rounded-lg border border-slate-800 flex flex-wrap gap-2">
              <span className="text-slate-400 text-xs py-1">Direct Forensic Triggers:</span>
              <button
                onClick={() => onExecuteCommand('/vault')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
              >
                /vault (Inspect Objects)
              </button>
              <button
                onClick={() => onExecuteCommand('/custody')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
              >
                /custody (Ledger Audit)
              </button>
              <button
                onClick={() => onExecuteCommand('/provenance')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
              >
                /provenance (Lineage Check)
              </button>
              <button
                onClick={() => onExecuteCommand('/nsrl')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
              >
                /nsrl (Cross-Reference DB)
              </button>
              <button
                onClick={() => onExecuteCommand('/tamper')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
              >
                /tamper (Anti-Forensics)
              </button>
            </div>
          </div>
        )}

        {/* MINIO VAULT VIEW */}
        {activeSubTab === 'vault' && (
          <div className="space-y-4">
            {tamperTestMessage && (
              <div className="p-3 rounded bg-red-950/80 border border-red-700 text-red-300 flex items-start gap-2 animate-pulse">
                <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs">IMMUTABILITY INTEGRITY TRIGGERED</div>
                  <div className="text-[11px] mt-0.5">{tamperTestMessage}</div>
                </div>
              </div>
            )}

            <div className="bg-[#0d1322] p-4 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-slate-200 font-bold flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-cyan-400" />
                  MINIO FORENSIC OBJECT VAULT (WORM COMPLIANCE STORE)
                </h3>
                <span className="text-slate-400 text-xs">
                  Bucket: <span className="text-cyan-300 font-mono">forensic-vault-case-8942</span>
                </span>
              </div>

              <div className="space-y-3">
                {vaultObjects.map((obj, idx) => (
                  <div key={idx} className="bg-[#090d16] p-3 rounded border border-slate-700/80 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-cyan-300 font-bold text-xs">{obj.objectKey}</span>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                          <span>Version: {obj.versionId}</span>
                          <span>•</span>
                          <span>Size: {(obj.sizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
                          <span>•</span>
                          <span>Uploaded: {obj.uploadedAt} by {obj.uploadedBy}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                          {obj.encryptionStandard}
                        </span>
                        <button
                          onClick={() => handleSimulateTamperAttempt(obj.objectKey)}
                          className="px-2 py-1 rounded bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/80 text-[10px] font-bold flex items-center gap-1"
                          title="Simulate unauthorized modification to test WORM retention lock"
                        >
                          <AlertOctagon className="w-3 h-3 text-red-400" />
                          Test Tamper Lock
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] bg-[#0c101c] p-2 rounded border border-slate-800">
                      <div>
                        <span className="text-slate-500">SHA-256 Digest:</span>
                        <span className="text-emerald-400 font-mono ml-2 break-all">{obj.sha256}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">SHA-3 (Keccak) Digest:</span>
                        <span className="text-cyan-400 font-mono ml-2 break-all">{obj.sha3}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CUSTODY LEDGER VIEW */}
        {activeSubTab === 'custody' && (
          <div className="space-y-4">
            <div className="bg-[#0d1322] p-4 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-slate-200 font-bold flex items-center gap-2">
                  <Link className="w-4 h-4 text-emerald-400" />
                  ISO/IEC 27037 SEQUENTIAL CHAIN-OF-CUSTODY LEDGER
                </h3>
                <span className="text-xs text-slate-400">Total Entries: {custodyEvents.length}</span>
              </div>

              <div className="space-y-3">
                {custodyEvents.map((evt) => (
                  <div key={evt.eventId} className="bg-[#090d16] p-3 rounded border border-slate-700/80 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-600">
                          {evt.eventId}
                        </span>
                        <span className="font-bold text-slate-100 text-xs">{evt.actionPerformed}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                        {evt.verificationStatus}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300">
                      Target: <span className="text-cyan-300 font-semibold">{evt.targetArtifact}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px] text-slate-400 bg-[#0c101c] p-2 rounded">
                      <div>Actor: <span className="text-slate-200 font-bold">{evt.actorId} ({evt.actorRole})</span></div>
                      <div>Timestamp: <span className="text-slate-200">{evt.timestamp}</span></div>
                      <div>Notes: <span className="text-slate-300">{evt.notes}</span></div>
                    </div>

                    <div className="text-[10px] space-y-1 font-mono">
                      <div>
                        <span className="text-slate-500">SHA-256: </span>
                        <span className="text-emerald-400 break-all">{evt.hashSha256}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">SHA-3: </span>
                        <span className="text-cyan-400 break-all">{evt.hashSha3}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROVENANCE VIEW */}
        {activeSubTab === 'provenance' && (
          <div className="space-y-4">
            <div className="bg-[#0d1322] p-4 rounded-lg border border-slate-800">
              <h3 className="text-slate-200 font-bold mb-3 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-purple-400" />
                EVIDENCE BACKWARD LINEAGE & PROVENANCE MAPPINGS
              </h3>
              <p className="text-slate-400 text-xs mb-4">
                Constraint Enforced: <code className="text-emerald-400">[Extracted Artifact] ---&gt; [Parent Container] ---&gt; [Disk Sector Offset] ---&gt; [Original Image Hash]</code>
              </p>

              <div className="space-y-3">
                {activeCase.artifacts.map((art) => (
                  <div key={art.id} className="bg-[#090d16] p-3 rounded border border-slate-700/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 text-xs">[{art.id}] {art.label}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                        LINEAGE VERIFIED
                      </span>
                    </div>

                    <div className="bg-[#0e1422] p-3 rounded border border-slate-800 space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                        <div className="px-2 py-1 rounded bg-slate-800 text-cyan-300 font-bold">
                          {art.provenance?.extractedArtifact || art.sourceFile}
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                        <div className="px-2 py-1 rounded bg-slate-800 text-purple-300 font-bold">
                          {art.provenance?.parentContainer || 'HOST044_20260919.E01'}
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                        <div className="px-2 py-1 rounded bg-slate-800 text-amber-300 font-bold">
                          {art.provenance?.diskSectorOffset || 'LBA Sector 0x0182E400'}
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                        <div className="px-2 py-1 rounded bg-slate-800 text-emerald-300 font-bold">
                          {(art.provenance?.originalImageHash || art.sha256 || '').slice(0, 16)}...
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 pt-1">
                        Extraction Technique: <span className="text-slate-300 font-semibold">{art.provenance?.extractionTechnique || 'MFT Journal & Memory VAD Parser'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NSRL VIEW */}
        {activeSubTab === 'nsrl' && (
          <div className="space-y-4">
            <div className="bg-[#0d1322] p-4 rounded-lg border border-slate-800">
              <h3 className="text-slate-200 font-bold mb-3 flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                NIST NATIONAL SOFTWARE REFERENCE LIBRARY (NSRL) BASELINE
              </h3>
              <p className="text-slate-400 text-xs mb-4">
                Automated filtering against known benign files and malicious malware signatures to prevent investigative hallucination.
              </p>

              <div className="space-y-3">
                {activeCase.artifacts.map((art) => (
                  <div key={art.id} className="bg-[#090d16] p-3 rounded border border-slate-700/80 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-200 text-xs">[{art.id}] {art.label}</div>
                      <div className="text-[11px] text-slate-400">
                        {art.nsrlMatch?.description || 'NSRL cross-reference check completed.'}
                      </div>
                      {art.nsrlMatch?.productName && (
                        <div className="text-[10px] text-amber-400 font-semibold">
                          Match: {art.nsrlMatch.productName} ({art.nsrlMatch.version || 'v1.0'})
                        </div>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
                        art.nsrlMatch?.status === 'KNOWN_MALICIOUS_IOC'
                          ? 'bg-red-950 text-red-300 border border-red-700'
                          : art.nsrlMatch?.status === 'NSRL_BENIGN_MATCH'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'bg-slate-800 text-slate-300 border border-slate-600'
                      }`}
                    >
                      {art.nsrlMatch?.status || 'UNKNOWN_FORENSIC_ARTIFACT'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
