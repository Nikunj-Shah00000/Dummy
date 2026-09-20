import React, { useState } from 'react';
import { AuthenticationReport } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  Binary,
  Fingerprint,
  FileSearch,
  AlertTriangle,
  FileWarning,
  RefreshCw,
  Cpu,
  Clock
} from 'lucide-react';

interface IntegrityAuthenticatorProps {
  onRunAuthentication: (data: {
    filename: string;
    content: string;
    declaredExtension: string;
    headerHex?: string;
  }) => Promise<void>;
  isLoading: boolean;
  currentReport: AuthenticationReport | null;
}

export const IntegrityAuthenticator: React.FC<IntegrityAuthenticatorProps> = ({
  onRunAuthentication,
  isLoading,
  currentReport,
}) => {
  const [testFilename, setTestFilename] = useState('Q3_Financial_Audit_2026.pdf');
  const [testExtension, setTestExtension] = useState('pdf');
  const [headerHex, setHeaderHex] = useState('4D5A90000300000004000000FFFF0000B8000000');
  const [contentSample, setContentSample] = useState(
    'MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xff\xff\x00\x00 This program cannot be run in DOS mode.'
  );

  const presets = [
    {
      label: 'Disguised Executable (.pdf -> PE binary)',
      filename: 'Q3_Financial_Audit_2026.pdf',
      ext: 'pdf',
      hex: '4D5A90000300000004000000FFFF0000B8000000',
      sample: 'MZ\x90\x00... [Windows PE Executable Payload Cloaked as PDF]',
    },
    {
      label: 'Genuine PDF Document (%PDF-1.7)',
      filename: 'Subpoena_Notice_2026.pdf',
      ext: 'pdf',
      hex: '255044462D312E370D0A25E2E3CFD30D0A',
      sample: '%PDF-1.7\n%âãÏÓ\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
    },
    {
      label: 'Steganographic Audio Container (.wav)',
      filename: 'Board_Call_Recording.wav',
      ext: 'wav',
      hex: '5249464624E0020057415645666D7420',
      sample: 'RIFF$à..WAVEfmt .... [Carrier PCM Audio with high LSB variance]',
    },
    {
      label: 'Timestomped NTFS Evidence Record',
      filename: 'Host_Incident_Log.evtx',
      ext: 'evtx',
      hex: '456C6646696C6500',
      sample: 'ElfFile\x00 [Windows Event Log Binary File Format]',
    },
  ];

  const handleApplyPreset = (p: (typeof presets)[0]) => {
    setTestFilename(p.filename);
    setTestExtension(p.ext);
    setHeaderHex(p.hex);
    setContentSample(p.sample);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    await onRunAuthentication({
      filename: testFilename,
      declaredExtension: testExtension,
      headerHex: headerHex.trim(),
      content: contentSample,
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#080c14] border border-slate-800/80 rounded-b-xl overflow-hidden font-mono text-xs">
      {/* Top Header */}
      <div className="bg-[#0f1422] p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Binary className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200 text-sm">
            Digital Artifact Authentication & Integrity Checker
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 text-[11px]">Command: /authenticate</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
          <span>FIPS 180-4 Cryptographic Validation</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Interactive Input & Presets (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0c111c] border border-slate-800 p-3.5 rounded-lg">
            <span className="text-slate-400 font-bold block mb-2 text-xs">
              QUICK FORENSIC TEST PRESETS:
            </span>
            <div className="space-y-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="w-full text-left p-2 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition-colors flex items-center justify-between"
                >
                  <span className="truncate">{p.label}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">LOAD</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleVerify} className="bg-[#0c111c] border border-slate-800 p-4 rounded-lg space-y-3">
            <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
              <FileSearch className="w-4 h-4 text-emerald-400" /> Inspect Artifact Bytes & Headers
            </span>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Target Filename</label>
              <input
                type="text"
                value={testFilename}
                onChange={(e) => setTestFilename(e.target.value)}
                className="w-full bg-[#080c14] border border-slate-700 rounded px-2.5 py-1 text-slate-200"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Declared File Extension</label>
              <input
                type="text"
                value={testExtension}
                onChange={(e) => setTestExtension(e.target.value)}
                className="w-full bg-[#080c14] border border-slate-700 rounded px-2.5 py-1 text-slate-200"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Magic Bytes Header (Hex String)
              </label>
              <input
                type="text"
                value={headerHex}
                onChange={(e) => setHeaderHex(e.target.value)}
                className="w-full bg-[#080c14] border border-slate-700 rounded px-2.5 py-1 text-emerald-400 font-terminal tracking-wider"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Sample Byte Buffer / Payload</label>
              <textarea
                rows={3}
                value={contentSample}
                onChange={(e) => setContentSample(e.target.value)}
                className="w-full bg-[#080c14] border border-slate-700 rounded p-2 text-slate-300 font-terminal text-[11px]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing Hashes & Signatures...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Execute /authenticate Verification</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Results Display (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {currentReport ? (
            <div className="bg-[#0c111c] border border-slate-800 p-4 rounded-lg space-y-4 shadow-xl">
              {/* Verdict Banner */}
              <div
                className={`p-3.5 rounded-lg border flex items-start gap-3 ${
                  currentReport.tamperingFlag
                    ? 'bg-red-950/40 border-red-700/80 text-red-200'
                    : 'bg-emerald-950/40 border-emerald-700/80 text-emerald-200'
                }`}
              >
                {currentReport.tamperingFlag ? (
                  <FileWarning className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-sm tracking-wide">
                    VERDICT: {currentReport.integrityVerdict}
                  </div>
                  <div className="text-xs mt-1 leading-relaxed opacity-90">
                    {currentReport.technicalWhy}
                  </div>
                </div>
              </div>

              {/* Header Signatures Matrix */}
              <div className="bg-[#070a10] border border-slate-800 rounded p-3 space-y-2">
                <span className="font-bold text-slate-400 text-xs block">
                  MAGIC BYTE & SIGNATURE CROSS-CHECK:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block">Declared Format:</span>
                    <span className="font-bold text-slate-200">.{currentReport.declaredExtension.toUpperCase()}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block">Detected Binary Format:</span>
                    <span className={`font-bold ${currentReport.fileSignatureMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                      {currentReport.detectedMagicBytes}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cryptographic Digests */}
              <div className="bg-[#070a10] border border-slate-800 rounded p-3 space-y-2">
                <span className="font-bold text-slate-400 text-xs block flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5 text-cyan-400" /> CRYPTOGRAPHIC HASH DIGESTS:
                </span>
                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/60 font-terminal">
                    <span className="text-slate-500">SHA-256:</span>
                    <span className="text-cyan-300 select-all">{currentReport.sha256}</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/60 font-terminal">
                    <span className="text-slate-500">MD5:</span>
                    <span className="text-slate-300 select-all">{currentReport.md5}</span>
                  </div>
                </div>
              </div>

              {/* MFT Timestomping Analysis if present */}
              {currentReport.timestompDetected && (
                <div className="bg-[#190d11] border border-red-800/80 rounded p-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-red-300 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-400" /> NTFS MASTER FILE TABLE TIMESTOMP DETECTED
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-[#261016] rounded border border-red-900">
                      <span className="text-red-400 block">$STANDARD_INFORMATION:</span>
                      <span className="font-mono text-slate-200">{currentReport.mftStandardInfoTime || '2021-04-12 11:20:00 UTC'}</span>
                    </div>
                    <div className="p-2 bg-[#261016] rounded border border-red-900">
                      <span className="text-red-400 block">$FILE_NAME (Kernel-Bound):</span>
                      <span className="font-mono text-slate-200">{currentReport.mftFileNameTime || '2026-09-18 16:05:39 UTC'}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-red-300/90 leading-relaxed">
                    Discrepancy of over 5 years between user-mode modifiable $STANDARD_INFORMATION and kernel-controlled $FILE_NAME proves deliberate timestomping to deceive chronological filters.
                  </p>
                </div>
              )}

              {/* Explainable Factor Weights */}
              {currentReport.xaiFactors && currentReport.xaiFactors.length > 0 && (
                <div className="bg-[#070a10] border border-slate-800 rounded p-3 space-y-2">
                  <span className="font-bold text-slate-400 text-xs block">
                    SHAP/LIME EXPLAINABILITY WEIGHTS:
                  </span>
                  <div className="space-y-2">
                    {currentReport.xaiFactors.map((factor, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-300">{factor.feature}</span>
                          <span className="font-mono text-emerald-400 font-bold">
                            {(factor.weight * 100).toFixed(0)}% weight
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              factor.direction === 'supports_critical' ? 'bg-red-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.abs(factor.weight) * 100}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-500">{factor.technicalWhy}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#0c111c] border border-slate-800 rounded-lg p-8 text-center text-slate-500 space-y-3">
              <Binary className="w-12 h-12 text-slate-700 mx-auto" />
              <div className="text-sm font-semibold text-slate-400">
                Ready to Authenticate Artifact
              </div>
              <p className="text-xs max-w-md mx-auto">
                Select a preset or enter raw artifact bytes to inspect magic byte signatures, calculate cryptographic digests, and evaluate timestomping indicators.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
