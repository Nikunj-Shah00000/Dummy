import React, { useState } from 'react';
import { ForensicCase, ImageManipulationReport, DocumentForgeryReport } from '../types';
import {
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  Layers,
  Search,
  Scan,
  CheckCircle2,
  AlertOctagon,
  Eye,
  Cpu,
  Code2,
  Calendar,
  User,
  HardDrive,
  Sliders,
  ShieldAlert,
  ShieldCheck,
  FileCode
} from 'lucide-react';

interface ManipulationAndForgeryViewProps {
  caseData: ForensicCase;
}

export const ManipulationAndForgeryView: React.FC<ManipulationAndForgeryViewProps> = ({ caseData }) => {
  const [activeModule, setActiveModule] = useState<'image' | 'pdf' | 'metadata'>('image');
  const [elaSensitivity, setElaSensitivity] = useState<number>(75);
  const [showKeypoints, setShowKeypoints] = useState<boolean>(true);
  const [showSpectralGrid, setShowSpectralGrid] = useState<boolean>(false);
  const [selectedPdfRevision, setSelectedPdfRevision] = useState<number>(3);

  // Sample Image Manipulation Data
  const imageSample: ImageManipulationReport = {
    elaAnomalyScore: 88,
    elaLocalizedRegions: [
      'Bounding box [X: 142, Y: 210, W: 110, H: 45] - Badge Photo Face ID Spliced',
      'Bounding box [X: 280, Y: 330, W: 95, H: 28] - Expiration Date Text Tampered'
    ],
    cloneDetectionKeypoints: 14,
    cloneDuplicatedBlocks: true,
    aiArtifactFingerprint: 'DIFFUSION_CHECKERBOARD',
    spectralAnomalyDetected: true,
    verdict: 'IMAGE_TAMPERED_SPLICING_AND_CLONE_DETECTED'
  };

  // Sample Document Forgery Data
  const pdfSample: DocumentForgeryReport = {
    pdfIncrementalUpdatesCount: 3,
    orphanTrailerObjects: 2,
    fontSubstitutionAnomalies: [
      'Substituted font /ArialMT for /Helvetica-Bold at stream object 18 0 R (Page 2, Paragraph 4)',
      'Kerning and matrix glyph width mismatch detected on signature line (Expected 12.0pt, Rendered 13.4pt)'
    ],
    boundingBoxOverlaps: 3,
    revisionHistory: [
      {
        revision: 1,
        timestamp: '2026-08-14 09:12:00 UTC',
        modifier: 'Adobe Acrobat Pro v24.0 (Windows)',
        changeSummary: 'Original document creation and author sign-off.'
      },
      {
        revision: 2,
        timestamp: '2026-09-18 14:22:18 UTC',
        modifier: 'PDFlib / Hex Editor Stream Inserter',
        changeSummary: 'Added incremental update dictionary with modified clearance level.'
      },
      {
        revision: 3,
        timestamp: '2026-09-18 16:05:39 UTC',
        modifier: 'Ghostscript / Custom PyPDF stream injector',
        changeSummary: 'Overwrote digital signature placeholder object 24 0 obj without invalidating trailer.'
      }
    ],
    metadataConsistencyLayers: {
      exifVsOsCreation: {
        exifDate: '2026-08-14 09:12:00 UTC',
        osDate: '2026-09-18 16:05:39 UTC',
        match: false,
        discrepancy: 'OS file creation date post-dates internal document creation by 35 days 6 hours.'
      },
      authorVsUserAccount: {
        declaredAuthor: 'Chief Legal Officer - Dr. Adrian Sterling',
        systemUser: 'svc_backup (Compromised Service Account)',
        match: false,
        notes: 'Document saved under service account profile with no human desktop session logged.'
      },
      fileSizeVsByteStream: {
        declaredBytes: 142880,
        actualBytes: 146944,
        match: false,
        discrepancy: '4,064 orphan bytes appended after EOF (%%EOF mark followed by raw executable shellcode stub).'
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#080c14] text-slate-200 overflow-y-auto font-sans">
      {/* Top Banner */}
      <div className="bg-[#0e1626] border border-slate-700/70 rounded-xl p-4 mb-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-950/80 border border-purple-500/40 rounded-lg text-purple-400">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-mono tracking-tight flex items-center gap-2">
                IMAGE & DOCUMENT FORGERY FORENSICS
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 border border-red-500/50 text-red-300 font-mono font-bold">
                  TAMPER DETECTOR ACTIVE
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Computer Vision (OpenCV / PyTorch ELA) &amp; Syntactic PDF Object Tree Parser
              </p>
            </div>
          </div>
        </div>

        {/* Module Sub-Tabs */}
        <div className="flex items-center gap-1.5 bg-[#070a10] p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveModule('image')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors font-bold ${
              activeModule === 'image'
                ? 'bg-purple-900/80 text-purple-200 border border-purple-600/60 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Image Vision (ELA & Clones)</span>
          </button>
          <button
            onClick={() => setActiveModule('pdf')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors font-bold ${
              activeModule === 'pdf'
                ? 'bg-cyan-900/80 text-cyan-200 border border-cyan-600/60 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Document Forgery (PDF Tree)</span>
          </button>
          <button
            onClick={() => setActiveModule('metadata')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors font-bold ${
              activeModule === 'metadata'
                ? 'bg-amber-900/80 text-amber-200 border border-amber-600/60 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3-Layer Consistency Engine</span>
          </button>
        </div>
      </div>

      {/* MODULE 1: Image Manipulation Detection */}
      {activeModule === 'image' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
          {/* Left Canvas Inspection Window */}
          <div className="lg:col-span-7 flex flex-col bg-[#0b101c] border border-slate-800 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-purple-400" />
                  Target: EXHIBIT_IMG_SECURITY_BADGE.jpg
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 border border-red-600 text-red-300 font-bold">
                  ELA SCORE: {imageSample.elaAnomalyScore}/100
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <label className="flex items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={showKeypoints}
                    onChange={(e) => setShowKeypoints(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700"
                  />
                  <span>Clone Keypoints</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={showSpectralGrid}
                    onChange={(e) => setShowSpectralGrid(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700"
                  />
                  <span>Spectral FFT</span>
                </label>
              </div>
            </div>

            {/* Visual Simulated ELA Stage */}
            <div className="relative flex-1 min-h-[360px] bg-[#05070c] border border-slate-800/80 rounded-lg overflow-hidden flex items-center justify-center p-4">
              {/* Simulated Badge Card Mockup with Heatmap */}
              <div className="w-[340px] h-[220px] bg-[#11192e] border-2 border-slate-600 rounded-xl p-3 shadow-2xl relative select-none">
                <div className="flex justify-between items-center border-b border-slate-700 pb-1.5 text-[10px] font-mono text-slate-400">
                  <span>ENTERPRISE FACILITY ACCESS</span>
                  <span className="text-emerald-400 font-bold">LEVEL-4 SECURE</span>
                </div>

                <div className="flex gap-3 mt-3">
                  {/* Photo area with ELA Spliced Warning Overlay */}
                  <div className="w-20 h-24 bg-[#0a0f1d] border border-purple-500/80 rounded flex flex-col items-center justify-center relative overflow-hidden">
                    <User className="w-10 h-10 text-slate-500" />
                    {/* ELA Heatmap simulation overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-tr from-purple-600/40 via-red-600/60 to-amber-500/40 mix-blend-screen pointer-events-none"
                      style={{ opacity: elaSensitivity / 100 }}
                    />
                    <span className="absolute bottom-0.5 text-[7px] font-mono font-bold bg-red-950/90 text-red-300 px-1 rounded">
                      ELA: SPLICED
                    </span>
                    {showKeypoints && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </div>

                  {/* ID Details */}
                  <div className="flex-1 text-[11px] font-mono space-y-1">
                    <div className="text-slate-400">NAME: <span className="text-white font-bold">JULIAN VANCE</span></div>
                    <div className="text-slate-400">ROLE: <span className="text-slate-200">DB SYSTEM ADMIN</span></div>
                    <div className="text-slate-400">ID: <span className="text-cyan-300 font-bold">#EMP-8942-01</span></div>
                    <div className="relative mt-2 p-1 bg-red-950/60 border border-red-600/80 rounded text-[9px] text-red-300">
                      <span>EXP: 2029-12-31 [MODIFIED]</span>
                      {showKeypoints && (
                        <span className="block text-[8px] text-cyan-300">Duplicated Block #7 ⟷ #14</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Barcode & Fingerprint footer */}
                <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center text-[9px] font-mono text-slate-500 pt-1 border-t border-slate-800">
                  <span>SHA: 4b22...8f8a</span>
                  <span className="text-red-400 font-bold">DIGITAL ARTIFACT: GAN/DIFFUSION</span>
                </div>
              </div>

              {/* Spectral overlay if toggled */}
              {showSpectralGrid && (
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(139,92,246,0.15)_80%)] flex items-center justify-center">
                  <div className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2 py-1 rounded border border-purple-700">
                    High-Frequency Checkerboard Anomaly Detected in Frequency Domain (2D-FFT)
                  </div>
                </div>
              )}
            </div>

            {/* Slider Control for ELA Sensitivity */}
            <div className="mt-3 flex items-center gap-3 bg-[#070a10] p-2.5 rounded-lg border border-slate-800 text-xs font-mono">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span className="text-slate-300">ELA Compression Sensitivity:</span>
              <input
                type="range"
                min="20"
                max="100"
                value={elaSensitivity}
                onChange={(e) => setElaSensitivity(Number(e.target.value))}
                className="flex-1 accent-purple-500 cursor-pointer"
              />
              <span className="text-purple-300 font-bold">{elaSensitivity}%</span>
            </div>
          </div>

          {/* Right Analytical Findings */}
          <div className="lg:col-span-5 flex flex-col space-y-3 bg-[#0b101c] border border-slate-800 rounded-xl p-4 shadow-md">
            <h3 className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              OPENCV & PYTORCH COMPUTER VISION AUDIT
            </h3>

            {/* Anomaly 1: Error Level Analysis */}
            <div className="bg-[#070a10] border border-purple-950 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-300">
                  1. Error Level Analysis (ELA)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 font-bold border border-red-800">
                  FAIL (Score 88/100)
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono mt-1.5 leading-relaxed">
                Re-saved JPEG error levels show profound variance (&gt;4.2 std deviations) in photo rectangular sub-region compared to uniform badge background. Indicates photo substitution post-capture.
              </p>
              <div className="mt-2 space-y-1">
                {imageSample.elaLocalizedRegions.map((reg, idx) => (
                  <div key={idx} className="text-[10px] font-mono text-slate-400 bg-[#0e1628] p-1 rounded border border-slate-800">
                    {reg}
                  </div>
                ))}
              </div>
            </div>

            {/* Anomaly 2: Clone & Copy-Paste Detection */}
            <div className="bg-[#070a10] border border-cyan-950 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300">
                  2. Clone / Copy-Paste Keypoints
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 font-bold border border-red-800">
                  14 DUPLICATE BLOCKS
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono mt-1.5 leading-relaxed">
                Keypoint feature matchers (SIFT/ORB) detected 14 identical 8x8 pixel blocks used to obscure original badge number and duplicate security hologram texture.
              </p>
            </div>

            {/* Anomaly 3: AI Artifact Scan (GAN / Diffusion) */}
            <div className="bg-[#070a10] border border-amber-950 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-300">
                  3. AI Artifact Fingerprint Scan
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-800">
                  {imageSample.aiArtifactFingerprint}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono mt-1.5 leading-relaxed">
                Fast Fourier Transform (FFT) exhibits characteristic cross-hatch frequency grid consistent with Latent Diffusion upsampling filters. Synthetic face generation confirmed.
              </p>
            </div>

            {/* Final Verdict */}
            <div className="bg-red-950/40 border border-red-600/80 rounded-lg p-3 text-xs font-mono">
              <span className="text-red-400 font-bold flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4" />
                JUDICIAL VERDICT: {imageSample.verdict}
              </span>
              <p className="text-slate-300 text-[11px] mt-1">
                Artifact cannot be admitted as an authentic identification credential under Federal Rules of Evidence 901 without disclosure of digital manipulation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: Document Forgery Detection (PDF Parser & Tree) */}
      {activeModule === 'pdf' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
          {/* Left Column: PDF Object Tree & Revision Timeline */}
          <div className="lg:col-span-6 flex flex-col bg-[#0b101c] border border-slate-800 rounded-xl p-4 shadow-md">
            <h3 className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
              <FileCode className="w-4 h-4 text-cyan-400" />
              PDF SYNTACTIC OBJECT TREE & INCREMENTAL UPDATES
            </h3>

            {/* Incremental Revisions Selector */}
            <div className="space-y-2 mb-4">
              <div className="text-[11px] font-mono text-slate-400">
                Identified Revisions (Linked via /Prev Trailer Pointer):
              </div>
              {pdfSample.revisionHistory.map((rev) => (
                <div
                  key={rev.revision}
                  onClick={() => setSelectedPdfRevision(rev.revision)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedPdfRevision === rev.revision
                      ? 'bg-[#121c32] border-cyan-500 shadow ring-1 ring-cyan-500/40'
                      : 'bg-[#070a10] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <span className="text-cyan-300">
                      Revision {rev.revision} of {pdfSample.pdfIncrementalUpdatesCount}
                    </span>
                    <span className="text-slate-400 font-normal">{rev.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono mt-1">
                    Modifier Tool: <span className="text-slate-400">{rev.modifier}</span>
                  </div>
                  <div className="text-[11px] text-amber-300/90 font-mono mt-0.5">
                    {rev.changeSummary}
                  </div>
                </div>
              ))}
            </div>

            {/* Raw PDF Object Tree Snippet */}
            <div className="flex-1 flex flex-col bg-[#05070c] border border-slate-800 rounded-lg p-3 font-terminal text-xs text-slate-300 overflow-y-auto max-h-[260px]">
              <div className="text-[10px] text-slate-500 mb-1">
                // Disassembled Trailer & Object Dictionary View:
              </div>
              <div className="text-cyan-300">xref</div>
              <div className="text-slate-400">0 26</div>
              <div className="text-slate-400">0000000000 65535 f</div>
              <div className="text-emerald-400">0000014820 00000 n [18 0 obj: Font Substitution Stream]</div>
              <div className="text-red-400 font-bold">0000018902 00000 n [24 0 obj: Spliced Digital Signature]</div>
              <div className="text-amber-400">trailer</div>
              <div className="text-slate-300">&lt;&lt; /Size 26 /Root 1 0 R /Prev 14200 /Info 2 0 R &gt;&gt;</div>
              <div className="text-cyan-300">startxref</div>
              <div className="text-slate-400">18990</div>
              <div className="text-red-400 font-bold">%%EOF</div>
              <div className="text-purple-300 mt-2">// [ORPHAN INJECTION DETECTED BEYOND %%EOF: 4,064 BYTES]</div>
            </div>
          </div>

          {/* Right Column: Inline Text Modifications & Font Substitution Checks */}
          <div className="lg:col-span-6 flex flex-col space-y-3 bg-[#0b101c] border border-slate-800 rounded-xl p-4 shadow-md">
            <h3 className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              INLINE TEXT MODIFICATIONS & BOUNDING BOX COLLISION
            </h3>

            {/* Font Substitution Check */}
            <div className="bg-[#070a10] border border-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-300">
                <span>Font Metrics & Substitution Check</span>
                <span className="text-red-400 font-bold">FLAGGED</span>
              </div>
              <ul className="mt-2 space-y-1.5 text-xs font-mono text-slate-300">
                {pdfSample.fontSubstitutionAnomalies.map((anom, i) => (
                  <li key={i} className="flex items-start gap-2 bg-[#0d1424] p-2 rounded border border-slate-800">
                    <span className="text-red-400 font-bold mt-0.5">!</span>
                    <span className="leading-relaxed">{anom}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bounding Box Overlap */}
            <div className="bg-[#070a10] border border-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-300">
                <span>Bounding Box Overlap Detection</span>
                <span className="text-amber-400 font-bold">{pdfSample.boundingBoxOverlaps} COLLISIONS</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono mt-1.5 leading-relaxed">
                Text stream parser identified overlapping character bounding boxes on Page 2. A transparent white background box was drawn over the original dollar authorization figure ($50,000) and replaced with forged text ($5,000,000).
              </p>
            </div>

            {/* Forged Digital Signature Analysis */}
            <div className="bg-[#070a10] border border-red-900/60 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-red-300">
                <span>Digital Signature Cryptographic Seal</span>
                <span className="text-red-400 font-bold">INVALID / BROKEN</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono mt-1.5 leading-relaxed">
                PKCS#7 signature container in object 24 0 obj has invalid ByteRange parameters. The hash digest was calculated prior to revision 2 and revision 3, rendering the signature legally void under FRE 902(14).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: 3-Layer Metadata Consistency Engine */}
      {activeModule === 'metadata' && (
        <div className="flex flex-col space-y-4 flex-1">
          <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-4 shadow-md">
            <h3 className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
              <Layers className="w-4 h-4 text-amber-400" />
              MANDATORY 3-LAYER METADATA CONSISTENCY VALIDATION
            </h3>
            <p className="text-xs text-slate-400 font-mono mb-4">
              Cross-references filesystem metadata with internal file structure properties to expose concealed structural contradictions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Layer 1: EXIF vs OS Creation */}
              <div className="bg-[#070a10] border border-red-900/70 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>LAYER 1: EXIF VS OS</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 border border-red-700 text-red-300 font-bold">
                      MISMATCH
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs font-mono">
                    <div className="bg-[#0e1628] p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-500">Embedded EXIF Creation:</div>
                      <div className="text-cyan-300 font-bold">
                        {pdfSample.metadataConsistencyLayers.exifVsOsCreation.exifDate}
                      </div>
                    </div>

                    <div className="bg-[#0e1628] p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-500">Operating System File Creation:</div>
                      <div className="text-red-300 font-bold">
                        {pdfSample.metadataConsistencyLayers.exifVsOsCreation.osDate}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 pt-1 leading-relaxed">
                      {pdfSample.metadataConsistencyLayers.exifVsOsCreation.discrepancy}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-red-400 mt-3 pt-2 border-t border-slate-800">
                  Exploitation: Timestomping or offline template backdating.
                </div>
              </div>

              {/* Layer 2: Author vs User Account */}
              <div className="bg-[#070a10] border border-red-900/70 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300">
                      <User className="w-4 h-4 text-amber-400" />
                      <span>LAYER 2: AUTHOR VS ACCOUNT</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 border border-red-700 text-red-300 font-bold">
                      MISMATCH
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs font-mono">
                    <div className="bg-[#0e1628] p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-500">Document Declared Author:</div>
                      <div className="text-cyan-300 font-bold">
                        {pdfSample.metadataConsistencyLayers.authorVsUserAccount.declaredAuthor}
                      </div>
                    </div>

                    <div className="bg-[#0e1628] p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-500">System User Profile Account:</div>
                      <div className="text-red-300 font-bold">
                        {pdfSample.metadataConsistencyLayers.authorVsUserAccount.systemUser}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 pt-1 leading-relaxed">
                      {pdfSample.metadataConsistencyLayers.authorVsUserAccount.notes}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-red-400 mt-3 pt-2 border-t border-slate-800">
                  Exploitation: Impersonation of officer using service daemon credentials.
                </div>
              </div>

              {/* Layer 3: Declared Size vs Actual Byte Stream */}
              <div className="bg-[#070a10] border border-red-900/70 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300">
                      <HardDrive className="w-4 h-4 text-amber-400" />
                      <span>LAYER 3: SIZE VS BYTESTREAM</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 border border-red-700 text-red-300 font-bold">
                      MISMATCH
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs font-mono">
                    <div className="bg-[#0e1628] p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-500">Declared Directory Size:</div>
                      <div className="text-cyan-300 font-bold">
                        {pdfSample.metadataConsistencyLayers.fileSizeVsByteStream.declaredBytes.toLocaleString()} bytes
                      </div>
                    </div>

                    <div className="bg-[#0e1628] p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-500">Actual Byte Stream Length:</div>
                      <div className="text-red-300 font-bold">
                        {pdfSample.metadataConsistencyLayers.fileSizeVsByteStream.actualBytes.toLocaleString()} bytes
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 pt-1 leading-relaxed">
                      {pdfSample.metadataConsistencyLayers.fileSizeVsByteStream.discrepancy}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-red-400 mt-3 pt-2 border-t border-slate-800">
                  Exploitation: Steganographic payload or polyglot executable concealment.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
