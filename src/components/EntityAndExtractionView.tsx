import React, { useState } from 'react';
import { ForensicCase, UnifiedEntity, IntelligentExtractionData, AIArtifactClassification } from '../types';
import {
  Users,
  Fingerprint,
  Radio,
  Globe,
  Mail,
  Smartphone,
  MapPin,
  Clock,
  Terminal,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  ShieldCheck,
  Search,
  Hash,
  Database
} from 'lucide-react';

interface EntityAndExtractionViewProps {
  caseData: ForensicCase;
}

export const EntityAndExtractionView: React.FC<EntityAndExtractionViewProps> = ({ caseData }) => {
  const [activeTab, setActiveTab] = useState<'entity' | 'extraction' | 'classifier'>('entity');
  const [selectedEntityId, setSelectedEntityId] = useState<string>('Entity E01');
  const [classifierCategoryFilter, setClassifierCategoryFilter] = useState<string>('ALL');

  // Unified Entities data
  const unifiedEntities: UnifiedEntity[] = [
    {
      id: 'Entity E01',
      primaryIdentity: 'Julian Vance (Compromised DB Administrator / Insider Threat)',
      confidence: 97.4,
      browserProfiles: [
        'Chrome Profile Default (ID: c_usr_8921a) - Cookie: sec_tok_8f99a',
        'Brave Browser Portable (Tor Mode) - Seed ID: brv_anon_77b'
      ],
      emailHeaders: [
        'j.vance@obsidian-corp.internal (Primary Corp Identity)',
        'ghost_ops@proton.me (Adversary Staging Mail)'
      ],
      networkIPs: [
        '10.0.8.44 (Internal Jump Host)',
        '192.168.1.104 (Home Broadband SOMA)',
        '185.220.101.5 (Tor Exit Node EU)'
      ],
      deviceHostnames: [
        'WKSTN-SEC-09 (Windows Server 2022)',
        'DEV-IPHONE15-PRO-JV (IMEI: 356938035643809)'
      ],
      linkedEvidenceIds: ['ART-001', 'ART-002', 'ART-003', 'ART-004', 'ART-005'],
      summary:
        'Multi-vector telemetry convergence confirms Julian Vance as the sole operator executing off-hours database exfiltration commands via svc_backup credentials while simultaneously coordinating payload handoffs on Telegram.'
    },
    {
      id: 'Entity E02',
      primaryIdentity: 'Shadow Handler (@GhostNode_44 / C2 Broker)',
      confidence: 94.1,
      browserProfiles: ['Firefox ESR Hardened (Linux x86_64) - UA Spoofed'],
      emailHeaders: ['contracts@darkbroker-syndicate.cc'],
      networkIPs: ['198.51.100.44 (Bucharest C2 Gateway)', '193.32.160.12 (Offshore Proxy)'],
      deviceHostnames: ['srv-c2-gateway-01.local'],
      linkedEvidenceIds: ['ART-004', 'ART-005'],
      summary:
        'External threat actor directing DNS tunneling exfiltration parameters and supplying instructions for wiping perimeter firewall event streams.'
    }
  ];

  // Intelligent Extracted Indicators
  const extractedIndicators: IntelligentExtractionData = {
    networkIndicators: [
      { type: 'IP', value: '10.0.8.44', context: 'Internal unauthorized jump host used for RDP lateral logon' },
      { type: 'IP', value: '198.51.100.44', context: 'Authoritative C2 receiver endpoint for DNS tunneling' },
      { type: 'IP', value: '185.220.101.5', context: 'Tor Exit Node identified in encrypted Telegram session' },
      { type: 'Domain', value: 'ns1.corpexfil-cdn.xyz', context: 'Dynamic DNS tunnel receiver nameserver' },
      { type: 'Domain', value: 'c2-darknode.onion', context: 'Tor Hidden Service v3 exfiltration drop repository' },
      { type: 'Port', value: '443 (HTTPS)', context: 'Production database export REST endpoint' },
      { type: 'Port', value: '53 (DNS / UDP)', context: 'Port used for base64 DNS query exfiltration' }
    ],
    userIdentifiers: [
      { type: 'Username', value: 'svc_backup', context: 'Target compromised service account in Event 4624' },
      { type: 'Username', value: 'j_vance_admin', context: 'Legitimate domain admin account used for privilege grant' },
      { type: 'Email', value: 'j.vance@obsidian-corp.internal', context: 'Corporate email found in SQLite user store' },
      { type: 'Email', value: 'ghost_ops@proton.me', context: 'Encrypted communication channel address' },
      { type: 'Handle', value: '@GhostNode_44', context: 'Telegram conspirator handle in UFDR mobile extraction' },
      { type: 'Phone', value: '+1-555-019-4821', context: 'SMS recovery number bound to target iPhone 15' }
    ],
    spatialTemporal: [
      { type: 'GPS', value: '37.7749° N, 122.4194° W', context: 'San Francisco SOMA Data Center location' },
      { type: 'GPS', value: '37.7892° N, 122.4014° W', context: 'Suspect residential cellular tower triangulation' },
      { type: 'DeviceID', value: 'IMEI: 356938035643809', context: 'Target iPhone 15 Pro hardware identifier' },
      { type: 'DeviceID', value: 'MAC: 00:1A:2B:3C:4D:5E', context: 'Workstation NIC physical layer address' },
      { type: 'Timestamp', value: '2026-09-19 02:11:04 UTC', context: 'Initial unauthorized RDP logon timestamp' },
      { type: 'Timestamp', value: '2026-09-19 02:22:00 UTC', context: 'Start of 25-minute perimeter Telemetry Void' }
    ]
  };

  // AI Artifact Classifications
  const classifications: { id: string; name: string; classInfo: AIArtifactClassification }[] = [
    {
      id: 'ART-001',
      name: 'Windows Security EVTX Event Log',
      classInfo: {
        category: 'System Logs',
        parserEngine: 'spaCy NLP Layer + EVTX Binary XML Chunk Parser',
        tags: ['Logon 4624', 'Process 4688', 'Encoded CLI', 'Privilege Escalation'],
        summary: 'Identified lateral movement execution via remote interactive token.'
      }
    },
    {
      id: 'ART-002',
      name: 'Production IIS Web Server Access Log',
      classInfo: {
        category: 'System Logs',
        parserEngine: 'W3C Regex Parser + Anomaly Frequency Analyzer',
        tags: ['REST Exfil', 'High Outbound Bytes', 'POST /export'],
        summary: 'Classified massive outbound data transaction exceeding 89MB baseline.'
      }
    },
    {
      id: 'ART-003',
      name: 'Volatility 3 Process Memory Injection',
      classInfo: {
        category: 'Executables',
        parserEngine: 'Automated YARA Rule Engine + libmagic Binary Heuristic',
        tags: ['Memory Shellcode', 'PAGE_EXECUTE_READWRITE', 'Reflective DLL'],
        summary: 'YARA rule YARA_COBALT_BEACON matched unbacked VAD memory region.'
      }
    },
    {
      id: 'ART-004',
      name: 'Cellebrite UFED Mobile Telegram Database',
      classInfo: {
        category: 'Chat Messages',
        parserEngine: 'SQLite DB Parser + Transformer NLP Intent Tagging',
        tags: ['Secret Chat', 'Intent: Exfiltration', 'Credential Handover'],
        summary: 'NLP model flagged direct conspiracy dialogue correlating to logon timestamps.'
      }
    },
    {
      id: 'ART-005',
      name: 'Zeek Network PCAP DNS Tunneling Capture',
      classInfo: {
        category: 'Browser Artifacts',
        parserEngine: 'Deep Packet Inspection + Shannon Entropy Calculator',
        tags: ['DNS Tunneling', 'Entropy > 4.8', 'Base64 Subdomains'],
        summary: 'Categorized covert communication channel exfiltrating parquet chunks.'
      }
    }
  ];

  const activeEntity = unifiedEntities.find((e) => e.id === selectedEntityId) || unifiedEntities[0];

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#080c14] text-slate-200 overflow-y-auto font-sans">
      {/* Top Banner */}
      <div className="bg-[#0e1626] border border-slate-700/70 rounded-xl p-4 mb-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-950/80 border border-emerald-500/40 rounded-lg text-emerald-400">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-mono tracking-tight flex items-center gap-2">
                ENTITY RESOLUTION &amp; INTELLIGENT ARTIFACT EXTRACTION
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-mono font-bold">
                  IDENTITY RESOLVER ACTIVE
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Cross-correlates Browser Profiles, Email Headers, Network IPs &amp; Device Hostnames
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-[#070a10] p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('entity')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 font-bold transition-colors ${
              activeTab === 'entity'
                ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-600/60 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Entity Resolution</span>
          </button>
          <button
            onClick={() => setActiveTab('extraction')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 font-bold transition-colors ${
              activeTab === 'extraction'
                ? 'bg-cyan-900/80 text-cyan-200 border border-cyan-600/60 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Intelligent Extraction (IoCs)</span>
          </button>
          <button
            onClick={() => setActiveTab('classifier')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 font-bold transition-colors ${
              activeTab === 'classifier'
                ? 'bg-purple-900/80 text-purple-200 border border-purple-600/60 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Artifact Classifier</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Entity Resolution */}
      {activeTab === 'entity' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
          {/* Left Column: Entity Selector */}
          <div className="lg:col-span-4 flex flex-col space-y-2 bg-[#0b101c] border border-slate-800 rounded-xl p-4 shadow-md">
            <h3 className="text-xs font-mono font-bold text-slate-300 pb-2 border-b border-slate-800 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              IDENTIFIED DIGITAL ENTITIES ({unifiedEntities.length})
            </h3>

            {unifiedEntities.map((ent) => (
              <div
                key={ent.id}
                onClick={() => setSelectedEntityId(ent.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedEntityId === ent.id
                    ? 'bg-[#101c2a] border-emerald-500 shadow ring-1 ring-emerald-500/40'
                    : 'bg-[#070a10] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">{ent.id}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-600 text-emerald-300 font-bold">
                    CONFIDENCE: {ent.confidence}%
                  </span>
                </div>
                <div className="text-xs text-white font-bold font-mono mt-1 leading-snug">
                  {ent.primaryIdentity}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-2 flex items-center gap-2">
                  <span>Linked Sources: {ent.linkedEvidenceIds.length}</span>
                  <span>•</span>
                  <span>IPs: {ent.networkIPs.length}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Unified Entity Forensic Profile */}
          <div className="lg:col-span-8 flex flex-col space-y-4 bg-[#0b101c] border border-slate-800 rounded-xl p-4 shadow-md">
            {/* Prominent Banner as Requested: Probable Unified Entity [Entity EXX] */}
            <div className="bg-gradient-to-r from-emerald-950/80 via-[#0d1c2a] to-[#0b101c] border border-emerald-500/60 rounded-xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-emerald-900/50">
                <span className="text-base font-mono font-black text-emerald-300 tracking-wide flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Probable Unified Entity [{activeEntity.id}]
                </span>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-900/90 text-emerald-200 border border-emerald-400 shadow">
                  Resolved Identity Match: {activeEntity.confidence}%
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-100 font-mono mt-2">
                {activeEntity.primaryIdentity}
              </h4>
              <p className="text-xs text-slate-300 font-mono mt-1 leading-relaxed">
                {activeEntity.summary}
              </p>
            </div>

            {/* Cross-Correlation 4 Quadrants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
              {/* Quadrant 1: Browser Profiles / Cookies */}
              <div className="bg-[#070a10] border border-slate-800 rounded-lg p-3">
                <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 pb-1.5 border-b border-slate-800">
                  <Globe className="w-3.5 h-3.5" />
                  BROWSER PROFILE IDS &amp; COOKIES
                </div>
                <ul className="mt-2 space-y-1.5 text-[11px] font-mono text-slate-300">
                  {activeEntity.browserProfiles.map((p, idx) => (
                    <li key={idx} className="bg-[#0c1424] p-2 rounded border border-slate-800/80 break-all">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quadrant 2: Email Headers & Mail Identities */}
              <div className="bg-[#070a10] border border-slate-800 rounded-lg p-3">
                <div className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5 pb-1.5 border-b border-slate-800">
                  <Mail className="w-3.5 h-3.5" />
                  EMAIL HEADERS &amp; IDENTIFIERS
                </div>
                <ul className="mt-2 space-y-1.5 text-[11px] font-mono text-slate-300">
                  {activeEntity.emailHeaders.map((m, idx) => (
                    <li key={idx} className="bg-[#0c1424] p-2 rounded border border-slate-800/80 break-all">
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quadrant 3: Network Connection Profiles (IPs) */}
              <div className="bg-[#070a10] border border-slate-800 rounded-lg p-3">
                <div className="text-xs font-mono font-bold text-purple-300 flex items-center gap-1.5 pb-1.5 border-b border-slate-800">
                  <Radio className="w-3.5 h-3.5" />
                  NETWORK CONNECTION PROFILES (IPs)
                </div>
                <ul className="mt-2 space-y-1.5 text-[11px] font-mono text-slate-300">
                  {activeEntity.networkIPs.map((ip, idx) => (
                    <li key={idx} className="bg-[#0c1424] p-2 rounded border border-slate-800/80">
                      {ip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quadrant 4: Device Hostname Telemetry */}
              <div className="bg-[#070a10] border border-slate-800 rounded-lg p-3">
                <div className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5 pb-1.5 border-b border-slate-800">
                  <Smartphone className="w-3.5 h-3.5" />
                  DEVICE HOSTNAME &amp; HARDWARE TELEMETRY
                </div>
                <ul className="mt-2 space-y-1.5 text-[11px] font-mono text-slate-300">
                  {activeEntity.deviceHostnames.map((h, idx) => (
                    <li key={idx} className="bg-[#0c1424] p-2 rounded border border-slate-800/80">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Linked Forensic Evidence Bar */}
            <div className="bg-[#070a10] border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Sworn Evidentiary Cross-Links:</span>
              <div className="flex items-center gap-1.5">
                {activeEntity.linkedEvidenceIds.map((id) => (
                  <span key={id} className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">
                    {id}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Intelligent Extraction (IoCs & Spatial/Temporal) */}
      {activeTab === 'extraction' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          {/* Network Indicators */}
          <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-4 shadow-md flex flex-col">
            <h3 className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 pb-2 border-b border-slate-800 mb-3">
              <Globe className="w-4 h-4" />
              NETWORK INDICATORS (IP, URL, DOMAIN, PORT)
            </h3>
            <div className="space-y-2 overflow-y-auto flex-1 pr-1 max-h-[500px]">
              {extractedIndicators.networkIndicators.map((item, idx) => (
                <div key={idx} className="bg-[#070a10] p-2.5 rounded-lg border border-slate-800 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-bold">{item.value}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                      {item.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-snug">{item.context}</div>
                </div>
              ))}
            </div>
          </div>

          {/* User Identifiers */}
          <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-4 shadow-md flex flex-col">
            <h3 className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5 pb-2 border-b border-slate-800 mb-3">
              <Users className="w-4 h-4" />
              USER IDENTIFIERS (USER, EMAIL, PHONE, HANDLE)
            </h3>
            <div className="space-y-2 overflow-y-auto flex-1 pr-1 max-h-[500px]">
              {extractedIndicators.userIdentifiers.map((item, idx) => (
                <div key={idx} className="bg-[#070a10] p-2.5 rounded-lg border border-slate-800 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-bold">{item.value}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                      {item.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-snug">{item.context}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Spatial & Temporal */}
          <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-4 shadow-md flex flex-col">
            <h3 className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5 pb-2 border-b border-slate-800 mb-3">
              <MapPin className="w-4 h-4" />
              SPATIAL / TEMPORAL (GPS, TIME, MAC, IMEI)
            </h3>
            <div className="space-y-2 overflow-y-auto flex-1 pr-1 max-h-[500px]">
              {extractedIndicators.spatialTemporal.map((item, idx) => (
                <div key={idx} className="bg-[#070a10] p-2.5 rounded-lg border border-slate-800 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold">{item.value}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                      {item.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-snug">{item.context}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI Artifact Classifier */}
      {activeTab === 'classifier' && (
        <div className="flex flex-col space-y-3 flex-1 bg-[#0b101c] border border-slate-800 rounded-xl p-4 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-mono font-bold text-purple-300 flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                AI ARTIFACT CLASSIFIER &amp; EXTRACTION PARSERS
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Regex patterns, spaCy NLP layers, SQLite DB extractors, and YARA rule matching engines
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs font-mono">
              {(['ALL', 'System Logs', 'Chat Messages', 'Executables', 'Browser Artifacts'] as const).map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setClassifierCategoryFilter(cat)}
                    className={`px-2 py-1 rounded font-bold transition-colors ${
                      classifierCategoryFilter === cat
                        ? 'bg-purple-900/80 text-purple-200 border border-purple-600 shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            {classifications
              .filter(
                (c) =>
                  classifierCategoryFilter === 'ALL' ||
                  c.classInfo.category === classifierCategoryFilter
              )
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-[#070a10] border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs font-mono"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold">{item.id}</span>
                      <span className="text-white font-bold">{item.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-700 text-purple-300 font-bold text-[10px]">
                      {item.classInfo.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-[#0d1424] p-2 rounded border border-slate-800/80">
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Parser Engine: </span>
                    <span className="text-cyan-300 font-bold">{item.classInfo.parserEngine}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-500 font-bold">TAGS:</span>
                    {item.classInfo.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-[10px]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-300 pt-1 leading-relaxed">
                    {item.classInfo.summary}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
