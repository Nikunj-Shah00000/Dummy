import React, { useState } from 'react';
import {
  Video,
  Mic,
  FileText,
  Scan,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Eye,
  EyeOff,
  Volume2,
  Activity,
  Layers,
  Cpu,
  Fingerprint,
  Sparkles,
  Info,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { ForensicCase, EvidenceArtifact } from '../types';

interface Props {
  caseData: ForensicCase;
}

export const DeepfakeAndSyntheticMediaView: React.FC<Props> = ({ caseData }) => {
  const [activeSubTab, setActiveSubTab] = useState<'video' | 'audio' | 'synthetic_docs'>('video');
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>('ART-009');
  const [showMeshOverlay, setShowMeshOverlay] = useState<boolean>(true);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);

  // Find target artifacts
  const videoArtifact = caseData.artifacts.find((a) => a.id === 'ART-009') || caseData.artifacts[0];
  const audioArtifact = caseData.artifacts.find((a) => a.id === 'ART-010') || caseData.artifacts[0];
  const docArtifact = caseData.artifacts.find((a) => a.id === 'ART-008') || caseData.artifacts[0];

  const currentArtifact =
    activeSubTab === 'video'
      ? videoArtifact
      : activeSubTab === 'audio'
      ? audioArtifact
      : docArtifact;

  return (
    <div className="h-full flex flex-col bg-[#080c14] text-slate-200 overflow-hidden font-mono">
      {/* Top Header */}
      <div className="p-4 bg-[#0d1424] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-fuchsia-400" />
            <h2 className="text-sm font-bold text-slate-100 tracking-wide">
              DEEPFAKE & SYNTHETIC MEDIA INVESTIGATION SUITE
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-500/50">
              MULTI-MODAL NEURAL VERIFIER
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Facial landmark tracking, blinking frequency, PRNU sensor noise, MFCC cepstral spectral analysis, and LLM perplexity scoring.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 bg-[#060911] p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => {
              setActiveSubTab('video');
              setSelectedArtifactId('ART-009');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeSubTab === 'video'
                ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video & Image Deepfake</span>
          </button>
          <button
            onClick={() => {
              setActiveSubTab('audio');
              setSelectedArtifactId('ART-010');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeSubTab === 'audio'
                ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Audio & Voice Clone</span>
          </button>
          <button
            onClick={() => {
              setActiveSubTab('synthetic_docs');
              setSelectedArtifactId('ART-008');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeSubTab === 'synthetic_docs'
                ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Synthetic Documents & Assets</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Active Exhibit Context Bar */}
        <div className="bg-[#0b111e] border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-fuchsia-950/60 border border-fuchsia-500/40 flex items-center justify-center">
              {activeSubTab === 'video' ? (
                <Video className="w-5 h-5 text-fuchsia-400" />
              ) : activeSubTab === 'audio' ? (
                <Mic className="w-5 h-5 text-fuchsia-400" />
              ) : (
                <FileText className="w-5 h-5 text-fuchsia-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-white">{currentArtifact?.id}</span>
                <span className="text-slate-600">|</span>
                <span className="text-xs text-slate-300 font-medium">{currentArtifact?.label}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                <span>Source: {currentArtifact?.sourceFile}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Fingerprint className="w-3 h-3" /> SHA-256: {currentArtifact?.sha256?.substring(0, 16)}...
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Judicial Status:</span>
            <span className="px-2.5 py-1 rounded bg-rose-950/90 text-rose-300 border border-rose-500/60 text-xs font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              {activeSubTab === 'video'
                ? 'DEEPFAKE MANIPULATED (96.4%)'
                : activeSubTab === 'audio'
                ? 'SYNTHETIC VOICE CLONE (98.1%)'
                : 'SYNTHETIC ASSET (89.2%)'}
            </span>
          </div>
        </div>

        {/* 1. VIDEO & IMAGE DEEPFAKE VIEW */}
        {activeSubTab === 'video' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Video Frame & Landmark Overlay Viewport */}
            <div className="lg:col-span-7 bg-[#0b101d] border border-slate-800 rounded-lg p-4 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>FACIAL LANDMARK & BLINK FREQUENCY INSPECTION</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowMeshOverlay(!showMeshOverlay)}
                    className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 transition-all ${
                      showMeshOverlay
                        ? 'bg-fuchsia-950 border border-fuchsia-500 text-fuchsia-300'
                        : 'bg-slate-900 border border-slate-700 text-slate-400'
                    }`}
                  >
                    {showMeshOverlay ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{showMeshOverlay ? 'Landmark Mesh [ON]' : 'Landmark Mesh [OFF]'}</span>
                  </button>
                  <button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 transition-all ${
                      showHeatmap
                        ? 'bg-amber-950 border border-amber-500 text-amber-300'
                        : 'bg-slate-900 border border-slate-700 text-slate-400'
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>{showHeatmap ? 'PRNU Noise [ON]' : 'PRNU Noise [OFF]'}</span>
                  </button>
                </div>
              </div>

              {/* Simulated Forensic Video Canvas */}
              <div className="relative aspect-video w-full bg-[#05070d] rounded border border-slate-800/90 overflow-hidden flex items-center justify-center">
                {/* Surveillance background overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#18233c_0%,#050811_90%)] opacity-80" />
                
                {/* Timestamp watermark */}
                <div className="absolute top-2 left-3 text-[10px] text-emerald-400 font-mono flex items-center gap-2 bg-black/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>CAM-04 SERVER ROOM | 2026-09-19 02:08:14.412 UTC | FRAME #04128</span>
                </div>

                {/* Facial wireframe & Landmark box */}
                <div className="relative w-48 h-56 border-2 border-fuchsia-500/80 rounded-lg p-2 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.25)]">
                  {/* Subject icon / silhouette */}
                  <div className="w-32 h-36 border border-dashed border-cyan-400/60 rounded-full flex items-center justify-center relative">
                    {/* Landmark tracking dots */}
                    {showMeshOverlay && (
                      <div className="absolute inset-0 flex flex-col justify-around items-center p-3 pointer-events-none">
                        <div className="flex gap-8">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                        <div className="w-12 h-1 border-b-2 border-fuchsia-400" />
                        <div className="text-[9px] text-fuchsia-300 font-bold bg-black/80 px-1 rounded border border-fuchsia-500/40">
                          JITTER SCORE: 87/100
                        </div>
                      </div>
                    )}

                    {showHeatmap && (
                      <div className="absolute inset-0 bg-rose-600/20 rounded-full blur-sm flex items-center justify-center">
                        <span className="text-[10px] text-rose-300 font-bold bg-black/80 px-1 py-0.5 rounded">
                          PRNU CORR: r = 0.081
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Identification tag */}
                  <div className="mt-2 text-center">
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 border border-rose-600 px-2 py-0.5 rounded">
                      [DISCREPANCY] NEURAL FACE SWAP
                    </span>
                  </div>
                </div>

                {/* Stream Telemetry overlay */}
                <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-mono bg-black/70 px-2.5 py-1 rounded border border-slate-800">
                  <span>H.264 High 4:2:0 • 1920x1080 • 60.00 FPS • Quant: Q22</span>
                </div>
              </div>

              {/* Linear timeline scrub indicator */}
              <div className="flex items-center gap-3 bg-[#060810] p-2 rounded border border-slate-800 text-xs">
                <span className="text-slate-400 text-[11px]">Timeline:</span>
                <div className="flex-1 bg-slate-900 h-2 rounded-full overflow-hidden relative">
                  <div className="absolute top-0 bottom-0 left-0 w-2/5 bg-cyan-500" />
                  <div className="absolute top-0 bottom-0 left-[38%] w-1.5 bg-rose-500 animate-pulse" />
                </div>
                <span className="text-slate-300 text-[11px] font-mono">00:08 / 02:46</span>
              </div>
            </div>

            {/* Right: Technical Diagnostics Panel */}
            <div className="lg:col-span-5 space-y-4">
              {/* Blinking Frequency Analysis */}
              <div className="bg-[#0b101d] border border-slate-800 rounded-lg p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-amber-400" />
                    BLINKING FREQUENCY ANOMALY ANALYSIS
                  </span>
                  <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-500 px-1.5 py-0.5 rounded font-bold">
                    HYPOBLINK STATE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-[#060912] p-2.5 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">OBSERVED RATE</span>
                    <span className="text-lg font-bold text-rose-400">2.1 bpm</span>
                    <span className="text-[9px] text-slate-500 block">Blinks per Minute</span>
                  </div>
                  <div className="bg-[#060912] p-2.5 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">EXPECTED HUMAN BASELINE</span>
                    <span className="text-lg font-bold text-emerald-400">12 - 20 bpm</span>
                    <span className="text-[9px] text-slate-500 block">Physiological Range</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 bg-[#070b14] p-2.5 rounded border border-slate-800/80 leading-relaxed">
                  <strong className="text-amber-300">Technical Diagnostic:</strong> Target subject blinks only twice in 166 seconds of continuous video footage. Eye closure duration is artificially short (33ms vs biological 100-150ms). Face synthesis models typically interpolate open eye states, failing biological blink distribution.
                </div>
              </div>

              {/* Pixel Noise Consistency & PRNU */}
              <div className="bg-[#0b101d] border border-slate-800 rounded-lg p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    PIXEL NOISE CONSISTENCY & PRNU SENSOR
                  </span>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500 px-1.5 py-0.5 rounded font-bold">
                    CORRELATION FAILED
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800 text-[11px]">
                    <span className="text-slate-400">Sensor PRNU Correlation (r):</span>
                    <span className="font-bold text-rose-400 font-mono">0.081 (Threshold: &gt;0.45)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800 text-[11px]">
                    <span className="text-slate-400">Facial Boundary Landmark Jitter:</span>
                    <span className="font-bold text-rose-400 font-mono">87 / 100 (Critical)</span>
                  </div>
                  <div className="flex justify-between py-1 text-[11px]">
                    <span className="text-slate-400">Noise Variance Discrepancy Ratio:</span>
                    <span className="font-bold text-rose-400 font-mono">4.8x higher than camera silicon</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 bg-[#070b14] p-2.5 rounded border border-slate-800/80 leading-relaxed">
                  <strong className="text-cyan-300">Photo-Response Non-Uniformity:</strong> The facial quadrant lacks the hardware sensor noise pattern characteristic of the Sony IMX335 sensor in CCTV Camera 04. This confirms the face was digitally overlaid from an external neural rendering source.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. AUDIO SPECTRUM & VOICE CLONE VIEW */}
        {activeSubTab === 'audio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: MFCC Spectrogram & Waveform */}
            <div className="lg:col-span-7 bg-[#0b101d] border border-slate-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>MEL-FREQUENCY CEPSTRAL COEFFICIENTS (MFCC) & SPECTRAL MESH</span>
                </div>
                <button
                  onClick={() => setAudioPlaying(!audioPlaying)}
                  className={`px-3 py-1 rounded text-xs flex items-center gap-1.5 transition-all font-bold ${
                    audioPlaying
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{audioPlaying ? 'Simulating Playback...' : 'Simulate Audio Playback'}</span>
                </button>
              </div>

              {/* Simulated Spectral Heatmap Canvas */}
              <div className="bg-[#05070d] p-4 rounded border border-slate-800 space-y-3">
                <div className="text-[11px] text-slate-400 flex justify-between">
                  <span>MFCC 13-Band Cepstral Filterbank (0 Hz - 8,000 Hz)</span>
                  <span className="text-fuchsia-400 font-bold">Inverted Spectral Phase Envelope</span>
                </div>

                {/* 13 simulated MFCC bars */}
                <div className="h-40 flex items-end gap-2 px-2 pb-2 bg-[#080d19] rounded border border-slate-800/70">
                  {[85, 92, 78, 64, 95, 88, 70, 96, 54, 82, 91, 74, 89].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <div
                        className="w-full rounded-t transition-all duration-300"
                        style={{
                          height: `${val}%`,
                          backgroundColor:
                            idx % 2 === 0
                              ? val > 80
                                ? '#f43f5e'
                                : '#e11d48'
                              : val > 80
                              ? '#d946ef'
                              : '#a855f7',
                        }}
                      />
                      <span className="text-[9px] text-slate-500 font-mono">C{idx + 1}</span>
                    </div>
                  ))}
                </div>

                {/* Spectral transcript box */}
                <div className="p-2.5 bg-[#0a0f1c] rounded border border-slate-800 text-xs">
                  <span className="text-slate-400 block text-[10px]">RECONSTRUCTED VOICEMAIL TRANSCRIPT:</span>
                  <p className="text-slate-200 mt-1 italic leading-relaxed">
                    &quot;This is Adrian Sterling. We have a database deadlock on the finance node. Grant emergency elevated bypass to svc_backup immediately.&quot;
                  </p>
                </div>
              </div>

              {/* Glottal Airflow Telemetry */}
              <div className="bg-[#060912] p-3 rounded border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Vocal Fold Micro-Tremor Jitter:</span>
                  <span className="font-bold text-rose-400 font-mono">0.012% (Biological Human Range: 0.50% - 1.20%)</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Vocal Tract Acoustic Damping:</span>
                  <span className="font-bold text-rose-400 font-mono">ABSENT (Zero-phase synthetic impulse response)</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Model Architecture Match:</span>
                  <span className="font-bold text-fuchsia-400 font-mono">ElevenLabs / XTTS v2 Diffusion Vocoder</span>
                </div>
              </div>
            </div>

            {/* Right: Audio Diagnostics & Explainable AI */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#0b101d] border border-slate-800 rounded-lg p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-fuchsia-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-fuchsia-400" />
                    AI VOICE CLONING MARKERS ISOLATED
                  </span>
                  <span className="text-[10px] bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-500 px-1.5 py-0.5 rounded font-bold">
                    PROBABILITY: 98.1%
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      marker: 'F0 Fundamental Frequency Flatness',
                      desc: 'Natural emotional inflections and vocal tract pitch micro-variances are completely suppressed.',
                    },
                    {
                      marker: 'Discontinuous Phase Spectral Envelope',
                      desc: 'Phase jumps at 3.4 kHz formant indicate synthetic speech segment stitching.',
                    },
                    {
                      marker: 'Unnatural Breath & Inhalation Gap Absence',
                      desc: 'Acoustic waveform maintains continuous energy without physiological breathing pauses.',
                    },
                  ].map((item, i) => (
                    <div key={i} className="p-2.5 bg-[#060912] rounded border border-slate-800 text-[11px]">
                      <span className="font-bold text-slate-200 block">{item.marker}</span>
                      <span className="text-slate-400 text-[10px] mt-0.5 block leading-relaxed">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explainable AI Technical Why */}
              <div className="bg-[#0b101d] border border-slate-800 rounded-lg p-3.5 space-y-2">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  SHAP / LIME EXPLAINABILITY (ISO/IEC 27037)
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed bg-[#070b14] p-2.5 rounded border border-slate-800">
                  <strong>Technical Why:</strong> Biological human vocal cords produce non-linear micro-tremors (jitter & shimmer). The target audio exhibits 0.012% jitter, which is mathematically impossible for living human physiology. Coupled with an MFCC cepstral anomaly score of 92.4, this evidence is classified as a synthesized neural clone.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. SYNTHETIC DOCUMENTS & ASSETS VIEW */}
        {activeSubTab === 'synthetic_docs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Text Perplexity & Document Structure */}
            <div className="lg:col-span-7 bg-[#0b101d] border border-slate-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>TEXT GENERATION PERPLEXITY & VECTOR KERNING ANALYSIS</span>
                </div>
                <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-500 px-2 py-0.5 rounded font-bold">
                  PERPLEXITY SCORE: 12.8 (LLM SYNTHESIS)
                </span>
              </div>

              {/* Document Overview & Excerpt */}
              <div className="bg-[#05070d] p-3 rounded border border-slate-800 space-y-2">
                <div className="text-[11px] text-slate-400 flex justify-between">
                  <span>Target File: AUTHORIZED_ACCESS_CLEARANCE_REV2.pdf</span>
                  <span className="text-emerald-400">PDF Object Tree Parser v2.4</span>
                </div>

                <div className="p-3 bg-[#0a0f1c] rounded border border-slate-800 font-serif text-slate-200 text-xs leading-relaxed">
                  <p className="font-bold mb-1 text-slate-100">CONFIDENTIAL MEMORANDUM: EMERGENCY CREDENTIAL CLEARANCE</p>
                  <p className="italic text-slate-300">
                    &quot;Pursuant to Corporate Security Directive 19-B, high-level administrative bypass authorization is hereby assigned to account svc_backup across all finance cluster database enclaves with immediate operational priority.&quot;
                  </p>
                </div>
              </div>

              {/* Perplexity & Burstiness Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#060912] p-3 rounded border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 block">PERPLEXITY SCORE</span>
                  <span className="text-xl font-bold text-rose-400">12.8</span>
                  <span className="text-[10px] text-slate-500 block">LLM Baseline: &lt;20 | Human Writing: 45 - 120</span>
                </div>

                <div className="bg-[#060912] p-3 rounded border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 block">BURSTINESS VARIANCE</span>
                  <span className="text-xl font-bold text-amber-400">3.4</span>
                  <span className="text-[10px] text-slate-500 block">Non-natural uniform sentence length distribution</span>
                </div>
              </div>

              {/* Font Vector Analysis */}
              <div className="bg-[#060912] p-3 rounded border border-slate-800 space-y-2 text-xs">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  PDF FONT RENDERING VECTOR ANALYSIS
                </span>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Sub-Pixel Kerning Variance:</span>
                    <span className="font-bold text-rose-400 font-mono">7.2 px (Mismatched ArialMT metrics)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Vector Bezier Discrepancies:</span>
                    <span className="font-bold text-rose-400 font-mono">DETECTED (Cubic Bezier curve injection)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Font Descriptor Inode Match:</span>
                    <span className="font-bold text-rose-400 font-mono">CIDToGIDMap Tampered</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Metadata Tag & Software Signature Inspection */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#0b101d] border border-slate-800 rounded-lg p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-fuchsia-300 flex items-center gap-1.5">
                    <Fingerprint className="w-4 h-4 text-fuchsia-400" />
                    METADATA TAG & AI GENERATOR SIGNATURES
                  </span>
                  <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-500 px-1.5 py-0.5 rounded font-bold">
                    SIGNATURES FOUND
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 bg-[#060912] rounded border border-slate-800 text-[11px] space-y-1">
                    <span className="text-slate-400 text-[10px] block">DETECTED GENERATIVE TOOLMARKS:</span>
                    <span className="font-mono text-fuchsia-300 font-bold block">
                      LangChain-DocumentGen-Agent/v0.3.1
                    </span>
                    <span className="font-mono text-fuchsia-300 font-bold block">
                      xmp:CreatorTool=&quot;Python reportlab + OpenAI Assistant&quot;
                    </span>
                  </div>

                  <div className="p-2.5 bg-[#060912] rounded border border-slate-800 text-[11px] space-y-1">
                    <span className="text-slate-400 text-[10px] block">EXTRACTED HIDDEN XMP PROMPT:</span>
                    <p className="font-mono text-amber-300 text-[10px] bg-black/60 p-2 rounded border border-amber-500/30 leading-relaxed">
                      &quot;Generate formal corporate security access memo with high urgency and clearance for svc_backup.&quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* Judicial Confidence Matrix */}
              <div className="bg-[#0b101d] border border-slate-800 rounded-lg p-3.5 space-y-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  FORENSIC ADMISSIBILITY VERDICT
                </span>
                <div className="bg-rose-950/40 border border-rose-500/50 p-2.5 rounded text-xs space-y-1 text-rose-200">
                  <div className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    STATUS: FABRICATED SYNTHETIC DOCUMENT
                  </div>
                  <p className="text-[11px] text-rose-300 leading-relaxed">
                    Document was not created by the declared author (Dr. Adrian Sterling). Text perplexity of 12.8, sub-pixel kerning vector discrepancies, and residual LangChain XMP metadata confirm artificial generative fabrication.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
