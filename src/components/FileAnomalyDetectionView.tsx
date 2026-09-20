import React, { useState } from 'react';
import { FileAnomalyItem, ForensicCase } from '../types';
import {
  FileWarning,
  Layers,
  Search,
  Sliders,
  ShieldAlert,
  Binary,
  FolderTree,
  Zap,
  CheckCircle,
  FileCode,
  AlertTriangle,
  HardDrive,
  Eye,
  Terminal,
  Activity,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface FileAnomalyDetectionViewProps {
  caseData: ForensicCase;
  onExecuteCommand?: (cmd: string) => void;
}

const INITIAL_FILE_ANOMALIES: FileAnomalyItem[] = [
  {
    id: 'FA-001',
    filename: 'Q3_Financial_Audit_2026.pdf.exe',
    containerOrImagePath: 'HOST044.raw -> Partition 2 (NTFS) -> \\Users\\j_vance\\Downloads\\',
    declaredType: 'Adobe Acrobat Document (.pdf)',
    actualMagicBytes: '4D 5A 90 00 03 00 00 00 (PE32+ Executable)',
    fileSizeBytes: 2457600,
    sectorOffsetLba: 'Sector LBA 0x009F42A0 (Offset: 10,437,280 bytes)',
    anomalyCategory: 'DOUBLE_EXTENSION',
    doubleExtensionDetails: {
      apparentExt: '.pdf',
      hiddenExecExt: '.exe',
      isDisguisedPayload: true,
      riskLevel: 'CRITICAL',
      disguisedMime: 'application/x-dosexec disguised as application/pdf',
    },
    verdict: 'CRITICAL: Weaponized Executable Disguised via Space-Padded Double Extension',
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
  },
  {
    id: 'FA-002',
    filename: 'corporate_policy_update.pdf:hidden_stager.dll',
    containerOrImagePath: 'HOST044.raw -> Partition 2 (NTFS) -> \\ProgramData\\Corporate\\',
    declaredType: 'Standard PDF Document Stream',
    actualMagicBytes: '4D 5A 50 45 (Portable Executable DLL in ADS)',
    fileSizeBytes: 489472,
    sectorOffsetLba: 'Sector LBA 0x011A8B20 (Offset: 18,516,768 bytes)',
    anomalyCategory: 'HIDDEN_ADS_STREAM',
    hiddenFilesAdsDetails: {
      streamName: 'corporate_policy_update.pdf:hidden_stager.dll',
      parentFsType: 'NTFS_ADS',
      hiddenSectorOffset: 'Physical Cluster 0x044210, Sector 0x011A8B20',
      hiddenPayloadSize: 489472,
    },
    verdict: 'HIGH: Alternate Data Stream (ADS) Obfuscated DLL Payload',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  },
  {
    id: 'FA-003',
    filename: 'system_vault_backup.tar.enc',
    containerOrImagePath: 'DEV-INVESTIGATION-CONTAINER.aff -> /data/local/tmp/staging/',
    declaredType: 'Archived Gzip Stream (.tar)',
    actualMagicBytes: 'ED 7B 84 9F (Encrypted Custom Header / High Entropy Blob)',
    fileSizeBytes: 48912304,
    sectorOffsetLba: 'Sector LBA 0x028E4410 (Offset: 42,878,992 bytes)',
    anomalyCategory: 'ABNORMAL_COMPRESSION_ENTROPY',
    abnormalCompressionDetails: {
      entropyScore: 7.942,
      compressionRatio: 1.002,
      ransomwareOrPackerIndicator: true,
      packerFamily: 'ChaCha20-Poly1305 Custom Encrypted Stager (Pre-Ransomware Staging)',
      highEntropySections: [
        { sectionName: '.rdata_enc', entropy: 7.988, startOffset: '0x00001000', sizeBytes: 38400000 },
        { sectionName: '.payload_blob', entropy: 7.912, startOffset: '0x024A0000', sizeBytes: 10512304 },
      ],
    },
    verdict: 'CRITICAL: High-Entropy Encrypted Section (>7.9 bits/byte) Indicating Ransomware Staging',
    sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
  },
  {
    id: 'FA-004',
    filename: 'employee_payroll_2026.xlsx.vbs',
    containerOrImagePath: 'HOST044.raw -> Partition 2 (NTFS) -> \\Users\\j_vance\\Desktop\\',
    declaredType: 'Microsoft Excel Spreadsheet (.xlsx)',
    actualMagicBytes: '27 20 56 42 53 63 72 69 70 74 (Visual Basic Script Stream)',
    fileSizeBytes: 18432,
    sectorOffsetLba: 'Sector LBA 0x0078C100 (Offset: 7,913,472 bytes)',
    anomalyCategory: 'DOUBLE_EXTENSION',
    doubleExtensionDetails: {
      apparentExt: '.xlsx',
      hiddenExecExt: '.vbs',
      isDisguisedPayload: true,
      riskLevel: 'HIGH',
      disguisedMime: 'text/vbscript masquerading as application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    verdict: 'HIGH: Script Dropper Disguised via Office Spreadsheet Extension',
    sha256: 'c8a2ef86a42f63f58a364be1fa131f476901844b2fae9ffb59cb79e7019d08e1',
  },
  {
    id: 'FA-005',
    filename: '$Recycle.Bin\\S-1-5-21-3921094-4412\\$R4A91B.bin',
    containerOrImagePath: 'HOST044.raw -> Partition 2 (NTFS) -> \\$Recycle.Bin\\',
    declaredType: 'Recycle Bin Tombstone Record',
    actualMagicBytes: '4D 5A (Cobalt Strike Reflective DLL Stager)',
    fileSizeBytes: 286720,
    sectorOffsetLba: 'Sector LBA 0x031B0080 (Offset: 52,101,248 bytes)',
    anomalyCategory: 'HIDDEN_ADS_STREAM',
    hiddenFilesAdsDetails: {
      streamName: '$Recycle.Bin/S-1-5-21.../$R4A91B.bin',
      parentFsType: 'HIDDEN_OS_FOLDER',
      hiddenSectorOffset: 'Unallocated Directory Index Block 0x00F8A0',
      hiddenPayloadSize: 286720,
    },
    verdict: 'CRITICAL: Malicious Binary Staged in Protected OS Recycle Directory',
    sha256: '3a29fa03328e4e9c73336fe0cf1b702ec947df32f8373b5bf57b07db3bb92b49',
  },
];

export const FileAnomalyDetectionView: React.FC<FileAnomalyDetectionViewProps> = ({
  caseData,
  onExecuteCommand,
}) => {
  const [items, setItems] = useState<FileAnomalyItem[]>(INITIAL_FILE_ANOMALIES);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [selectedItemId, setSelectedItemId] = useState<string>(INITIAL_FILE_ANOMALIES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const selectedItem = items.find((i) => i.id === selectedItemId) || items[0];

  const filteredItems = items.filter((item) => {
    if (filterCategory !== 'ALL' && item.anomalyCategory !== filterCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.filename.toLowerCase().includes(q) ||
        item.verdict.toLowerCase().includes(q) ||
        item.sha256.toLowerCase().includes(q) ||
        item.containerOrImagePath.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleTriggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (onExecuteCommand) {
        onExecuteCommand('/file-anomaly HOST044.raw');
      }
    }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-[#080c14] border border-slate-800/80 rounded-b-xl overflow-hidden font-mono text-xs">
      {/* Top Header */}
      <div className="bg-[#0f1422] p-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileWarning className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-slate-200 text-sm">
            File Anomaly Detection Engine
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-300 text-[11px] font-mono">
            Hidden Threats, Obfuscated Payloads & Structural Inconsistencies
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerScan}
            disabled={isScanning}
            className="px-3 py-1.5 rounded bg-amber-950/80 hover:bg-amber-900 border border-amber-600/70 text-amber-300 font-bold transition-all flex items-center gap-1.5"
          >
            <Zap className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Auditing Disk Sectors...' : 'Run Sector Scan'}</span>
          </button>
        </div>
      </div>

      {/* 3 Core Structural Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 p-3 bg-[#0b0f1a] border-b border-slate-800">
        <div className="bg-[#0d1322] border border-slate-800/80 rounded p-2.5 flex items-start gap-2.5">
          <FileCode className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-200 block text-xs">1. Double Extensions</span>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Detects disguised executables cloaked behind document extensions (e.g., <code className="text-rose-300">.pdf.exe</code>, <code className="text-rose-300">.xlsx.vbs</code>).
            </p>
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800/80 rounded p-2.5 flex items-start gap-2.5">
          <FolderTree className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-200 block text-xs">2. Hidden Files & ADS Streams</span>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Audits NTFS Alternate Data Streams (<code className="text-sky-300">file.pdf:stager.dll</code>) and hidden OS folder staging paths.
            </p>
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800/80 rounded p-2.5 flex items-start gap-2.5">
          <Binary className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-200 block text-xs">3. Abnormal Compression & Entropy</span>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Flags high-entropy encrypted blobs (&gt;7.8 bits/byte) denoting packed malware implants or ransomware staging.
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-[#0a0e18] px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 text-[11px] mr-1">Filter Metric:</span>
          {[
            { key: 'ALL', label: 'All Anomalies' },
            { key: 'DOUBLE_EXTENSION', label: 'Double Extensions' },
            { key: 'HIDDEN_ADS_STREAM', label: 'Hidden Files / ADS' },
            { key: 'ABNORMAL_COMPRESSION_ENTROPY', label: 'Abnormal Entropy' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilterCategory(cat.key)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
                filterCategory === cat.key
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                  : 'bg-[#080c14] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search anomalies by filename, hash, sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#080c14] border border-slate-800 rounded pl-8 pr-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>
      </div>

      {/* Main Grid: Left List (5 cols), Right Detail Inspection (7 cols) */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Anomaly List */}
        <div className="lg:col-span-5 border-r border-slate-800 overflow-y-auto p-3 space-y-2.5 bg-[#080c14]">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between mb-1">
            <span>SECTOR ANOMALIES DETECTED ({filteredItems.length})</span>
            <span className="text-amber-400">NTFS MFT & Disk Sector Audited</span>
          </div>

          {filteredItems.map((item) => {
            const isSelected = item.id === selectedItemId;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-amber-950/40 border-amber-500/80 text-slate-100 shadow-lg'
                    : 'bg-[#0b101c] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs truncate max-w-[240px] text-slate-200">
                    {item.filename}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                      item.anomalyCategory === 'DOUBLE_EXTENSION'
                        ? 'bg-rose-950/80 text-rose-300 border-rose-700/60'
                        : item.anomalyCategory === 'HIDDEN_ADS_STREAM'
                        ? 'bg-sky-950/80 text-sky-300 border-sky-700/60'
                        : 'bg-purple-950/80 text-purple-300 border-purple-700/60'
                    }`}
                  >
                    {item.anomalyCategory === 'DOUBLE_EXTENSION'
                      ? 'DOUBLE EXT'
                      : item.anomalyCategory === 'HIDDEN_ADS_STREAM'
                      ? 'HIDDEN / ADS'
                      : 'ABNORMAL ENTROPY'}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 font-mono truncate mb-1">
                  Container: {item.containerOrImagePath}
                </div>

                <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                  <span>Size: {(item.fileSizeBytes / 1024).toFixed(1)} KB</span>
                  <span className="text-amber-400 flex items-center gap-1">
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Detailed Anomaly Inspector & Evidence Grounding */}
        <div className="lg:col-span-7 overflow-y-auto p-4 space-y-4 bg-[#0a0e18]">
          {selectedItem ? (
            <div className="space-y-4">
              {/* Header Box */}
              <div className="bg-[#0c1220] border border-slate-800 p-3.5 rounded-lg">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <FileWarning className="w-4 h-4 text-amber-400" />
                      <span>{selectedItem.filename}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {selectedItem.containerOrImagePath}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-700">
                    {selectedItem.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-500 block">Declared File Type:</span>
                    <span className="text-slate-300 font-bold">{selectedItem.declaredType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Detected Magic Bytes:</span>
                    <span className="text-amber-400 font-bold">{selectedItem.actualMagicBytes}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Disk Sector Offset:</span>
                    <span className="text-cyan-300 font-mono">{selectedItem.sectorOffsetLba}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">SHA-256 Digest:</span>
                    <span className="text-slate-400 font-mono text-[10px] truncate block">
                      {selectedItem.sha256}
                    </span>
                  </div>
                </div>
              </div>

              {/* Specific Metric Profiling Breakdown */}
              {selectedItem.anomalyCategory === 'DOUBLE_EXTENSION' && selectedItem.doubleExtensionDetails && (
                <div className="bg-[#120e17] border border-rose-900/60 p-3.5 rounded-lg space-y-2.5">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-xs border-b border-rose-900/40 pb-2">
                    <FileCode className="w-4 h-4 text-rose-400" />
                    <span>Double Extension Obfuscation Analysis</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Apparent Visual Extension:</span>
                      <span className="text-slate-200 font-bold">{selectedItem.doubleExtensionDetails.apparentExt}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Hidden Executable Extension:</span>
                      <span className="text-rose-400 font-bold">{selectedItem.doubleExtensionDetails.hiddenExecExt}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-300 bg-[#0c0910] p-2.5 rounded border border-rose-900/40">
                    <strong className="text-rose-300">Technical Exploit:</strong> {selectedItem.doubleExtensionDetails.disguisedMime}. In Windows Explorer default views (with "Hide extensions for known file types" enabled), this binary masquerades visually as a benign document while executing native PE code upon launch.
                  </div>
                </div>
              )}

              {selectedItem.anomalyCategory === 'HIDDEN_ADS_STREAM' && selectedItem.hiddenFilesAdsDetails && (
                <div className="bg-[#0b1424] border border-sky-900/60 p-3.5 rounded-lg space-y-2.5">
                  <div className="flex items-center gap-2 text-sky-300 font-bold text-xs border-b border-sky-900/40 pb-2">
                    <FolderTree className="w-4 h-4 text-sky-400" />
                    <span>Alternate Data Stream (ADS) & Hidden Folder Extraction</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Stream Name:</span>
                      <span className="text-sky-300 font-bold font-mono">{selectedItem.hiddenFilesAdsDetails.streamName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Filesystem Layer:</span>
                      <span className="text-slate-200 font-bold">{selectedItem.hiddenFilesAdsDetails.parentFsType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Hidden Sector Offset:</span>
                      <span className="text-cyan-300 font-mono">{selectedItem.hiddenFilesAdsDetails.hiddenSectorOffset}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Carved Payload Size:</span>
                      <span className="text-slate-200">{(selectedItem.hiddenFilesAdsDetails.hiddenPayloadSize / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-300 bg-[#070e1a] p-2.5 rounded border border-sky-900/40">
                    <strong className="text-sky-300">Forensic Implication:</strong> Standard directory listing commands (<code className="text-sky-200">dir</code> / <code className="text-sky-200">ls</code>) do not report byte sizes of Alternate Data Streams. Payload was carved directly via MFT $DATA non-resident attribute stream.
                  </div>
                </div>
              )}

              {selectedItem.anomalyCategory === 'ABNORMAL_COMPRESSION_ENTROPY' && selectedItem.abnormalCompressionDetails && (
                <div className="bg-[#140e22] border border-purple-900/60 p-3.5 rounded-lg space-y-2.5">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-xs border-b border-purple-900/40 pb-2">
                    <Binary className="w-4 h-4 text-purple-400" />
                    <span>Shannon Entropy & Abnormal Compression Profile</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300">Shannon Entropy Metric:</span>
                    <span className="text-purple-300 font-bold text-sm font-mono">
                      {selectedItem.abnormalCompressionDetails.entropyScore} / 8.000 bits/byte
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 h-full"
                      style={{ width: `${(selectedItem.abnormalCompressionDetails.entropyScore / 8) * 100}%` }}
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">
                      HIGH-ENTROPY SECTION MAPPING:
                    </span>
                    {selectedItem.abnormalCompressionDetails.highEntropySections.map((sec, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded bg-[#0b0814] border border-purple-900/30 text-[11px]"
                      >
                        <span className="font-mono text-slate-200 font-bold">{sec.sectionName}</span>
                        <span className="text-purple-300 font-mono">Entropy: {sec.entropy}</span>
                        <span className="text-slate-400 text-[10px]">Size: {(sec.sizeBytes / 1024).toFixed(0)} KB</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-300 bg-[#090610] p-2.5 rounded border border-purple-900/40">
                    <strong className="text-purple-300">Packer / Ransomware Threat Profile:</strong> {selectedItem.abnormalCompressionDetails.packerFamily}. Natural binary instructions average 5.8-6.4 bits/byte; entropy exceeding 7.8 indicates encrypted payload buffers or packed shellcode.
                  </div>
                </div>
              )}

              {/* MANDATORY EXPLAINABLE AI EVIDENCE GROUNDING BLOCK */}
              <div className="bg-[#0b101d] border-2 border-emerald-500/50 p-3.5 rounded-lg space-y-2 shadow-xl">
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Explainable AI (Evidence Grounding Trace)</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-mono">FRE 902(14) Certified</span>
                </div>

                <div className="space-y-2 text-[11px] font-mono">
                  <div className="flex items-start gap-2">
                    <strong className="text-slate-400 shrink-0 w-24">Conclusion:</strong>
                    <span className="text-slate-100 font-bold">{selectedItem.verdict}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <strong className="text-slate-400 shrink-0 w-24">Reason:</strong>
                    <span className="text-slate-300">
                      Discrepancy identified between file system metadata ({selectedItem.declaredType}) and stream contents ({selectedItem.actualMagicBytes}) at disk sector {selectedItem.sectorOffsetLba}.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <strong className="text-slate-400 shrink-0 w-24">Source:</strong>
                    <span className="text-cyan-300 truncate">
                      {selectedItem.containerOrImagePath} | SHA-256 [{selectedItem.sha256.substring(0, 16)}...]
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <strong className="text-slate-400 shrink-0 w-24">Confidence:</strong>
                    <span className="text-emerald-400 font-bold">98.6% (AI Inference + Deterministic Sector Proof)</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              Select a file anomaly to view deep sector analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
