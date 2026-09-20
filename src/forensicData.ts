import { ForensicCase } from './types';

export const FORENSIC_CASES: ForensicCase[] = [
  {
    id: 'CASE-IDF-8942',
    title: 'Operation Obsidian Exfil - Insider Lateral Movement & C2 Exfiltration',
    codeName: 'OBSIDIAN_EXFIL',
    description: 'Anomalous privilege escalation, off-hours database access, memory-resident shellcode, and encrypted mobile coordination.',
    incidentType: 'Corporate Espionage / Insider Threat',
    threatActorContext: 'Suspected compromised privileged credentials associated with user backup service account, coupled with mobile messaging coordination.',
    custodyLedger: [
      {
        eventId: 'CUST-001',
        actorId: 'INV-001',
        actorRole: 'INVESTIGATOR',
        actionPerformed: 'Acquisition & Initial Hashing',
        timestamp: '2026-09-19T02:30:15Z',
        targetArtifact: 'Physical Disk Image HOST044.raw (E01 Format)',
        hashSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        hashSha3: 'd14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f',
        verificationStatus: 'VERIFIED',
        notes: 'Forensic bit-stream image acquired using hardware write-blocker Tableau T8u.'
      },
      {
        eventId: 'CUST-002',
        actorId: 'ANALYST-02',
        actorRole: 'INVESTIGATOR',
        actionPerformed: 'Export Artifacts for AI Parsing',
        timestamp: '2026-09-19T02:45:00Z',
        targetArtifact: 'Windows EVTX Event Logs & Mobile UFDR SQLite Extract',
        hashSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        hashSha3: '8f729b48c3127ef64a93815048cd317284b1264871e98947f63b2190',
        verificationStatus: 'VERIFIED',
        notes: 'Extracted MFT entries and Telegram databases passed to AI Triage engine.'
      },
      {
        eventId: 'CUST-003',
        actorId: 'AUDITOR-01',
        actorRole: 'AUDITOR',
        actionPerformed: 'Integrity Audit & Verification',
        timestamp: '2026-09-19T03:00:00Z',
        targetArtifact: 'Unified Case Dossier Manifest & Audit Ledger Seal',
        hashSha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
        hashSha3: '1f92e448b1092a7e584f23e67c8249019b3482716492817462819284',
        verificationStatus: 'VERIFIED',
        notes: 'FRE Rule 902(14) self-authenticating certification sealed with WORM lock.'
      }
    ],
    vaultObjects: [
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
    ],
    artifacts: [
      {
        id: 'ART-001',
        sourceType: 'system_logs',
        ingestionFormat: 'EVTX',
        label: 'Windows Security EVTX Event Log (Event 4624 & 4688)',
        sourceFile: 'C:\\Windows\\System32\\Winevt\\Logs\\Security.evtx',
        timestampRange: '2026-09-19T02:11:04Z - 2026-09-19T02:18:22Z',
        sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        sha3: '8f729b48c3127ef64a93815048cd317284b1264871e98947f63b2190',
        md5: '5d41402abc4b2a76b9719d911017c592',
        nsrlMatch: {
          status: 'KNOWN_MALICIOUS_IOC',
          productName: 'Adversary Pivot Artifact',
          version: 'Lateral Movement v2.1',
          description: 'Compromised service account interactive credential pivot token'
        },
        provenance: {
          extractedArtifact: 'Security.evtx (Event 4624)',
          parentContainer: 'HOST044_20260919.E01',
          diskSectorOffset: 'LBA Sector 0x0182E400 (Byte Offset: 25,354,240)',
          originalImageHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
          backwardLinkValid: true,
          extractionTechnique: 'MFT Entry Inode Extraction & EVTX Record Parser'
        },
        rawPayload: `[2026-09-19 02:11:04 UTC] EventID: 4624 | Provider: Microsoft-Windows-Security-Auditing
SubjectUserSid: S-1-0-0 | TargetUserName: svc_backup | TargetDomainName: CORP-FINANCE
LogonType: 10 (RemoteInteractive) | ProcessName: C:\\Windows\\System32\\winlogon.exe
SourceNetworkAddress: 10.0.8.44 | SourcePort: 54118 | AuthenticationPackage: NTLM V2

[2026-09-19 02:14:19 UTC] EventID: 4688 | Provider: Microsoft-Windows-Security-Auditing
SubjectUserName: svc_backup | ProcessId: 0x113c (4412)
NewProcessName: C:\\Windows\\System32\\cmd.exe
CommandLine: cmd.exe /c powershell.exe -enc JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAATgBlAHQALgBXAGUAYgBDAGwAaQBlAG4AdAA7...
ParentProcessName: C:\\Windows\\System32\\svchost.exe (PID: 0x480)`,
        triageCategory: 'Critical',
        confidenceScore: 98,
        iocs: [
          { type: 'Account', value: 'svc_backup', threatLevel: 'High', context: 'Off-hours RemoteInteractive logon from secondary jump host' },
          { type: 'IP', value: '10.0.8.44', threatLevel: 'Medium', context: 'Internal unauthorized VLAN segment' },
          { type: 'Process', value: 'cmd.exe spawning encoded PowerShell', threatLevel: 'High', context: 'Known lateral execution technique' }
        ],
        xaiAttributions: [
          { feature: 'LogonType: 10 (RemoteInteractive)', weight: 0.88, direction: 'supports_critical', technicalWhy: 'Service accounts should never authenticate via interactive GUI/RDP logon sessions.' },
          { feature: 'CommandLine: powershell -enc', weight: 0.94, direction: 'supports_critical', technicalWhy: 'Base64 encoded command arguments indicate deliberate evasion of command-line logging.' },
          { feature: 'Temporal Context: 02:11:04 UTC', weight: 0.65, direction: 'supports_suspicious', technicalWhy: 'Logon occurred 6 hours outside of scheduled backup maintenance window.' }
        ]
      },
      {
        id: 'ART-002',
        sourceType: 'system_logs',
        ingestionFormat: 'Syslog',
        label: 'Production IIS Web Server Access Log',
        sourceFile: '/var/log/iis/W3SVC1/u_ex260919.log',
        timestampRange: '2026-09-19T02:14:35Z - 2026-09-19T02:21:40Z',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        sha3: '5a92bc4481092a7e584f23e67c8249019b3482716492817462819284',
        md5: '098f6bcd4621d373cade4e832627b4f6',
        nsrlMatch: {
          status: 'UNKNOWN_FORENSIC_ARTIFACT',
          description: 'Web access transaction record. Unique investigatory trace.'
        },
        provenance: {
          extractedArtifact: 'u_ex260919.log',
          parentContainer: 'HOST044_20260919.E01',
          diskSectorOffset: 'LBA Sector 0x02194000 (Byte Offset: 35,213,312)',
          originalImageHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
          backwardLinkValid: true,
          extractionTechnique: 'Unallocated and Allocated Slack File Extractor'
        },
        rawPayload: `#Fields: date time s-ip cs-method cs-uri-stem cs-uri-query s-port cs-username c-ip cs(User-Agent) sc-status sc-bytes
2026-09-19 02:14:35 192.168.4.12 POST /api/v1/internal/export dataset=customer_vault&format=parquet 443 svc_backup 10.0.8.44 Mozilla/5.0+(Windows+NT+10.0;+Win64) 200 48910244
2026-09-19 02:17:02 192.168.4.12 POST /api/v1/internal/export dataset=executive_contracts&format=parquet 443 svc_backup 10.0.8.44 Mozilla/5.0+(Windows+NT+10.0;+Win64) 200 89124012
2026-09-19 02:21:40 192.168.4.12 GET /api/v1/status - 443 svc_backup 10.0.8.44 curl/7.88.1 200 412`,
        triageCategory: 'Critical',
        confidenceScore: 95,
        iocs: [
          { type: 'IP', value: '192.168.4.12', threatLevel: 'Low', context: 'Production internal web API gateway' },
          { type: 'Account', value: 'svc_backup', threatLevel: 'High', context: 'Unusual consumer of customer_vault data' }
        ],
        xaiAttributions: [
          { feature: 'sc-bytes: 89124012 (~89MB)', weight: 0.91, direction: 'supports_critical', technicalWhy: 'Extremely high outbound byte transfer on restricted database export endpoint.' },
          { feature: 'cs-uri-stem: /export', weight: 0.82, direction: 'supports_suspicious', technicalWhy: 'Repeated sequential calls targeting confidential customer and contract stores.' }
        ]
      },
      {
        id: 'ART-003',
        sourceType: 'memory_dump',
        ingestionFormat: 'MEM_RAW',
        label: 'Volatility 3 Memory Artifact (malfind / pslist)',
        sourceFile: '/evidence/mem/HOST044_20260919.raw',
        timestampRange: '2026-09-19T02:25:00Z',
        sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        sha3: 'd14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f',
        md5: '7b774effe4a349c6dd82ad4f4f21d34c',
        nsrlMatch: {
          status: 'KNOWN_MALICIOUS_IOC',
          productName: 'Cobalt Strike Framework',
          version: 'CS 4.8.1 Payload Stager',
          description: 'In-Memory Reflective Loader Shellcode matching APT29 / UNC2452 tradecraft'
        },
        provenance: {
          extractedArtifact: 'Injected_Cobalt_Beacon.bin',
          parentContainer: 'HOST044_20260919.raw',
          diskSectorOffset: 'Physical Memory Offset: 0x0000018a3e210000 (VAD Pool)',
          originalImageHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
          backwardLinkValid: true,
          extractionTechnique: 'Volatility 3 windows.malfind VAD Carver'
        },
        rawPayload: `Volatility 3 Framework 2.5.0
PID: 4412 | Process: svchost.exe | PPID: 480
VAD Start: 0x0000018a3e210000 | VAD End: 0x0000018a3e220000 | Protection: PAGE_EXECUTE_READWRITE
CommitCharge: 16 | PrivateMemory: 1 | Tag: Vad

Hex Dump:
0x0000018a3e210000: 4d 5a 41 52 55 48 89 e5 48 81 ec 20 00 00 00 48  MZARUH..H.. ...H
0x0000018a3e210010: 8d 05 e7 ff ff ff 48 89 45 10 48 8b 45 10 48 8b  ......H.E.H.E.H.
0x0000018a3e210020: 00 48 85 c0 74 15 48 8b 45 10 48 83 c0 08 48 89  .H..t.H.E.H...H.
Disassembly:
0x0000018a3e210000: dec ebp; pop edx; push rbp; mov rbp, rsp (Cobalt Strike reflective DLL loader header detected)`,
        triageCategory: 'Critical',
        confidenceScore: 99,
        iocs: [
          { type: 'Process', value: 'svchost.exe (PID 4412)', threatLevel: 'High', context: 'Process hollowing / reflective injection' },
          { type: 'Hash', value: 'CobaltStrike.Beacon.Stage.v4', threatLevel: 'High', context: 'Reflective PE loader signature matching CS 4.8' }
        ],
        xaiAttributions: [
          { feature: 'Protection: PAGE_EXECUTE_READWRITE', weight: 0.96, direction: 'supports_critical', technicalWhy: 'Legitimate svchost.exe threads strictly allocate PAGE_READONLY or PAGE_EXECUTE_READ. RWX memory segments in unbacked VADs correlate strongly with reflective DLL injection.' }
        ]
      },
      {
        id: 'ART-004',
        sourceType: 'mobile_extraction',
        ingestionFormat: 'UFED',
        label: 'Cellebrite UFED Extraction (Extracted Chat Transcript & Timestamps)',
        sourceFile: '/evidence/mobile/DEV-IPHONE15-EXTRACT.ufdr',
        timestampRange: '2026-09-19T01:58:12Z - 2026-09-19T02:29:40Z',
        sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
        sha3: '1f92e448b1092a7e584f23e67c8249019b3482716492817462819284',
        md5: 'b10a8db164e0754105b7a99be72e3fe5',
        nsrlMatch: {
          status: 'UNKNOWN_FORENSIC_ARTIFACT',
          description: 'Cellebrite UFDR mobile sandbox container. Direct evidence of communication.'
        },
        provenance: {
          extractedArtifact: 'Telegram_Chats.sqlite',
          parentContainer: 'DEV-IPHONE15-EXTRACT.ufdr',
          diskSectorOffset: 'Sector LBA 0x048F9200 (Byte Offset: 76,521,472)',
          originalImageHash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
          backwardLinkValid: true,
          extractionTechnique: 'UFED Physical Extraction & SQLite WAL Journal Parser'
        },
        rawPayload: `[Source: Telegram Desktop Session Extracted from UFDR Sandbox]
[Contact ID: @GhostNode_44] <-> [Device Owner: Marcus Vance (Principal DBA)]
[2026-09-19 01:58:12 UTC] @GhostNode_44: "Window opens in 15 mins. Use the backup service credential so alarms do not wake SecOps."
[2026-09-19 02:02:45 UTC] Marcus Vance: "Acknowledged. Connected through proxy 10.0.8.44. Vault parquet archives are staging now."
[2026-09-19 02:28:10 UTC] @GhostNode_44: "Route payload via dns tunnel chunk to ns1.corpexfil-cdn.xyz, do not use raw https outbound."
[2026-09-19 02:29:40 UTC] Marcus Vance: "Underway. Disconnecting backup token now."`,
        triageCategory: 'Critical',
        confidenceScore: 97,
        iocs: [
          { type: 'Account', value: '@GhostNode_44', threatLevel: 'High', context: 'External handler or conspirator handle' },
          { type: 'Domain', value: 'ns1.corpexfil-cdn.xyz', threatLevel: 'High', context: 'C2 DNS exfiltration nameserver' }
        ],
        xaiAttributions: [
          { feature: 'Direct Named Alignment: 10.0.8.44 & svc_backup', weight: 0.99, direction: 'supports_critical', technicalWhy: 'Direct temporal and nominal alignment between chat transcript instructions and Event Log 4624 telemetry confirms unauthorized insider conspiracy.' }
        ]
      },
      {
        id: 'ART-005',
        sourceType: 'network_pcap',
        ingestionFormat: 'PCAP',
        label: 'Wireshark/Zeek Network Traffic PCAP (DNS Tunneling Stream)',
        sourceFile: '/evidence/pcap/gw_dns_capture_20260919.pcap',
        timestampRange: '2026-09-19T02:28:44Z - 2026-09-19T02:49:10Z',
        sha256: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        sha3: '3b92ac4481092a7e584f23e67c8249019b3482716492817462819284',
        md5: '3858f62230ac3c915f300c664312c63f',
        nsrlMatch: {
          status: 'UNKNOWN_FORENSIC_ARTIFACT',
          description: 'Network packet stream capture. Contains DNS tunneling payload.'
        },
        provenance: {
          extractedArtifact: 'gw_dns_capture_20260919.pcap',
          parentContainer: 'TAP_GW01_INTERFACE.aff',
          diskSectorOffset: 'Packet Frame Stream Offsets: Frame 1402 to Frame 1489',
          originalImageHash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
          backwardLinkValid: true,
          extractionTechnique: 'Zeek Network Security Monitor Stream Dump'
        },
        rawPayload: `14:28:44.102 IP 10.0.8.44.59124 > 10.0.0.2.53: 1402+ A? cGFycXVldF9jaHVuazAxODkyMTk=.ns1.corpexfil-cdn.xyz. (78)
14:28:44.180 IP 10.0.0.2.53 > 10.0.8.44.59124: 1402 1/0/0 A 198.51.100.44 (94)
14:28:45.012 IP 10.0.8.44.59125 > 10.0.0.2.53: 1403+ A? VmF1bHRfQ3VzdG9tZXJfSGFzaGVz.ns1.corpexfil-cdn.xyz. (82)
14:28:46.220 IP 10.0.8.44.59126 > 10.0.0.2.53: 1404+ A? RU5EVE9LRU5fU1VDQ0VTUw==.ns1.corpexfil-cdn.xyz. (72)`,
        triageCategory: 'Critical',
        confidenceScore: 98,
        iocs: [
          { type: 'Domain', value: 'ns1.corpexfil-cdn.xyz', threatLevel: 'High', context: 'Authoritative nameserver for DNS data exfiltration' },
          { type: 'IP', value: '198.51.100.44', threatLevel: 'High', context: 'Exfiltration C2 receiver' }
        ],
        xaiAttributions: [
          { feature: 'DNS Query Subdomain Entropy: >4.8 bits', weight: 0.94, direction: 'supports_critical', technicalWhy: 'Base64 encoded payload embedded in sub-domain labels matches classic DNS Tunneling exfiltration profile.' }
        ]
      },
      {
        id: 'ART-006',
        sourceType: 'system_logs',
        ingestionFormat: 'Syslog',
        label: 'Perimeter Firewall Audit Log (Identified Telemetry Gap)',
        sourceFile: '/var/log/paloalto/traffic_audit.log',
        timestampRange: '2026-09-19T02:22:00Z - 2026-09-19T02:47:00Z',
        sha256: 'd41d8cd98f00b204e9800998ecf8427e',
        sha3: 'a69f73cca23a9ac5c8b567dc185a756e97a9fbfe',
        md5: 'd41d8cd98f00b204e9800998ecf8427e',
        nsrlMatch: {
          status: 'UNKNOWN_FORENSIC_ARTIFACT',
          description: 'Firewall syslog stream. Contains confirmed 25-minute Telemetry Void.'
        },
        provenance: {
          extractedArtifact: 'traffic_audit.log',
          parentContainer: 'PA-5250-AUDIT-VAULT.tar',
          diskSectorOffset: 'Syslog Inode #49120',
          originalImageHash: 'd41d8cd98f00b204e9800998ecf8427e',
          backwardLinkValid: true,
          extractionTechnique: 'Auditd Log Journal Parser'
        },
        rawPayload: `[2026-09-19 02:21:59 UTC] Syslog Daemon: Active forwarding on eth0
-- [TELEMETRY VOID IDENTIFIED: NO AUDIT RECORDS LOGGED BETWEEN 02:22:00 UTC AND 02:47:00 UTC] --
[2026-09-19 02:47:01 UTC] Syslog Daemon: Audit service restarted by local admin session. Missing 1,501 seconds of perimeter firewall logs.`,
        triageCategory: 'Telemetry Void',
        confidenceScore: 100,
        trustScore: {
          sha256Integrity: 'VERIFIED 100%',
          metadataConsistency: 85,
          timestampConsistency: 20,
          tamperingRisk: 'HIGH',
          overallTrustScore: 40,
          deterministicFacts: [
            'Bit-stream SHA-256 matches MinIO WORM sealed object',
            'Factual 25-minute gap confirmed across syslog journals'
          ],
          probabilisticIndicators: [
            'Telemetry Void probability: 100% based on timestamp sequence anomaly',
            'Absence of log records strictly flagged without assuming speculative packets'
          ]
        },
        iocs: [],
        xaiAttributions: [
          { feature: 'Telemetry Void Duration: 25 minutes (1,501s)', weight: 1.0, direction: 'supports_critical', technicalWhy: 'In accordance with forensic constraints, this log absence is recorded strictly as a factual Telemetry Void. No speculative packets are assumed.' }
        ]
      },
      {
        id: 'ART-007',
        sourceType: 'unstructured_text',
        ingestionFormat: 'TAR',
        label: 'Seized Security Badge Credential (CV Error Level & Clone Scan)',
        sourceFile: '/evidence/photos/EXHIBIT_IMG_SECURITY_BADGE.jpg',
        timestampRange: '2026-09-19T02:55:00Z',
        sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        sha3: 'd14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f',
        md5: '7c4a8d09ca3762af61e59520943dc264',
        nsrlMatch: {
          status: 'UNKNOWN_FORENSIC_ARTIFACT',
          description: 'Seized physical credential badge high-resolution digital image.'
        },
        provenance: {
          extractedArtifact: 'EXHIBIT_IMG_SECURITY_BADGE.jpg',
          parentContainer: 'SEIZED_DEVICES_TAR.tar',
          diskSectorOffset: 'Inode #90841',
          originalImageHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
          backwardLinkValid: true,
          extractionTechnique: 'OpenCV & PyTorch Computer Vision Pipeline'
        },
        rawPayload: `[EXHIBIT INSPECTION: EXHIBIT_IMG_SECURITY_BADGE.jpg]
Resolution: 2400x1600 24-bit sRGB JPEG | Camera: Nikon D850
Error Level Analysis (ELA): Score 88/100 (Discontinuity >4.2 std dev on Photo Rect)
Keypoint Clone Matcher (SIFT/ORB): 14 duplicate 8x8 block pairs detected
FFT Spectral Signature: Latent Diffusion Model Upsampling Checkerboard Detected
Verdict: TAMPERED - Facial Photo Spliced & Expiration Date Cloned`,
        triageCategory: 'Critical',
        confidenceScore: 99,
        trustScore: {
          sha256Integrity: 'VERIFIED 100%',
          metadataConsistency: 74,
          timestampConsistency: 82,
          tamperingRisk: 'HIGH',
          overallTrustScore: 36,
          deterministicFacts: [
            'Bit-stream SHA-256 matches sworn intake manifest (4b22...8f8a)',
            'JPEG SOI (0xFFD8) and EOI (0xFFD9) markers structurally valid'
          ],
          probabilisticIndicators: [
            'OpenCV ELA reveals photo splice with 88% anomaly score',
            'PyTorch classifier detects latent diffusion generator artifact and 14 clone keypoints'
          ]
        },
        imageAnalysis: {
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
        },
        iocs: [
          { type: 'Account', value: 'Julian Vance / EMP-8942-01', threatLevel: 'High', context: 'Doctored physical access credential badge' }
        ],
        xaiAttributions: [
          { feature: 'ELA Discontinuity: Photo Bounding Box', weight: 0.96, direction: 'supports_critical', technicalWhy: 'Compression quantization tables in facial quadrant do not match background gradient.' }
        ]
      },
      {
        id: 'ART-008',
        sourceType: 'unstructured_text',
        ingestionFormat: 'RAW',
        label: 'Tampered Security Clearance Memo (PDF Object Tree Parser)',
        sourceFile: '/evidence/docs/AUTHORIZED_ACCESS_CLEARANCE_REV2.pdf',
        timestampRange: '2026-09-18T16:05:39Z',
        sha256: '1f92e448b1092a7e584f23e67c8249019b34827164928174628192849b291402',
        sha3: '8f729b48c3127ef64a93815048cd317284b1264871e98947f63b21901402941b',
        md5: '3858f62230ac3c915f300c664312c63f',
        nsrlMatch: {
          status: 'UNKNOWN_FORENSIC_ARTIFACT',
          description: 'Modified executive clearance authorization PDF memo.'
        },
        provenance: {
          extractedArtifact: 'AUTHORIZED_ACCESS_CLEARANCE_REV2.pdf',
          parentContainer: 'HOST044_20260919.E01',
          diskSectorOffset: 'LBA Sector 0x03120000',
          originalImageHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
          backwardLinkValid: true,
          extractionTechnique: 'PDF Syntactic Disassembler & 3-Layer Metadata Engine'
        },
        rawPayload: `[DOCUMENT SYNTACTIC ANALYSIS: AUTHORIZED_ACCESS_CLEARANCE_REV2.pdf]
PDF Header: %PDF-1.7 | Total Incremental Updates: 3 (/Prev Pointer Chain)
Orphan Trailer Objects: 2 (Unreferenced in primary xref table)
Font Substitution: /ArialMT substituted for /Helvetica-Bold on clearance authorization
Bounding Box Collision: 3 overlapping text boxes on Page 2
Consistency Layer 1 (EXIF vs OS): 35-day discrepancy (2026-08-14 vs 2026-09-18)
Consistency Layer 2 (Author vs Account): Declared Dr. Adrian Sterling vs System User svc_backup
Consistency Layer 3 (Size vs Bytestream): 4,064 orphan bytes post %%EOF marker`,
        triageCategory: 'Critical',
        confidenceScore: 99,
        trustScore: {
          sha256Integrity: 'VERIFIED 100%',
          metadataConsistency: 38,
          timestampConsistency: 42,
          tamperingRisk: 'HIGH',
          overallTrustScore: 28,
          deterministicFacts: [
            '3 incremental updates identified in raw byte stream via /Prev chain',
            '4,064 orphan bytes confirmed after %%EOF trailer tag'
          ],
          probabilisticIndicators: [
            'Font kerning collision detected on signature authorization line',
            'Declared author metadata conflicts with active Windows user profile'
          ]
        },
        documentAnalysis: {
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
        },
        syntheticMediaReport: {
          targetArtifactId: 'ART-008',
          documentOrAssetTitle: 'AUTHORIZED_ACCESS_CLEARANCE_REV2.pdf',
          overallSyntheticConfidence: 89.2,
          confidenceIndicatorGrade: 'HIGH',
          textPerplexityScoring: {
            perplexityScore: 12.8,
            burstinessVariance: 3.4,
            verdict: 'Extremely low perplexity (12.8) and non-natural uniform sentence length distribution indicative of LLM prompt generation.'
          },
          fontRenderingVectorAnalysis: {
            subPixelKerningVariance: 7.2,
            vectorBezierDiscrepancies: true,
            pdfFontDescriptorMismatch: true,
            details: 'TrueType font CIDToGIDMap manipulated; glyph outlines rendered with synthetic vector cubic beziers not present in declared ArialMT font table.'
          },
          metadataTagInspection: {
            detectedGenerativeSignatures: ['LangChain-DocumentGen-Agent/v0.3.1', 'xmp:CreatorTool="Python reportlab + OpenAI Assistant"'],
            cleanSoftwareSignature: false,
            hiddenPromptInXMP: 'Generate formal corporate security access memo with high urgency and clearance for svc_backup.'
          }
        },
        iocs: [
          { type: 'Account', value: 'Dr. Adrian Sterling', threatLevel: 'Medium', context: 'Impersonated authorization signatory' }
        ],
        xaiAttributions: [
          { feature: 'Orphan Injected Bytes post-EOF: 4,064B', weight: 0.98, direction: 'supports_critical', technicalWhy: 'Appending data after the PDF %%EOF marker is a classic carrier injection technique.' },
          { feature: 'Synthetic Perplexity: 12.8 (LLM signature)', weight: 0.89, direction: 'supports_critical', technicalWhy: 'Uniform token perplexity establishes document body was synthesized by LLM rather than authored by human signatory.' }
        ]
      },
      {
        id: 'ART-009',
        sourceType: 'unstructured_text',
        ingestionFormat: 'RAW',
        label: 'CCTV Camera 04 Server Room Video (Facial Landmark & Blinking Deepfake Scan)',
        sourceFile: '/evidence/video/CCTV_SERVER_ROOM_CAM04_20260919.mp4',
        timestampRange: '2026-09-19T02:08:14Z - 2026-09-19T02:11:00Z',
        sha256: '7c86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        sha3: '8c92ac4481092a7e584f23e67c8249019b3482716492817462819284',
        md5: '9c58f62230ac3c915f300c664312c63f',
        nsrlMatch: {
          status: 'UNKNOWN_FORENSIC_ARTIFACT',
          description: 'H.264 video container from facility physical access recorder.'
        },
        provenance: {
          extractedArtifact: 'CCTV_SERVER_ROOM_CAM04_20260919.mp4',
          parentContainer: 'NVR_STORAGE_VOL01.E01',
          diskSectorOffset: 'LBA Sector 0x09F21000',
          originalImageHash: '7c86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
          backwardLinkValid: true,
          extractionTechnique: 'H.264 Stream Demuxer & Computer Vision Landmark Extractor'
        },
        rawPayload: `[CCTV SURVEILLANCE VIDEO DEEPFAKE ANALYSIS]
Target File: CCTV_SERVER_ROOM_CAM04_20260919.mp4 | Frames: 10,240 (60.0 FPS)
Resolution: 1920x1080 | Bitrate: 8,412 kbps | Codec: H.264 (High Profile)
Facial Mesh Landmark Jitter: Index 87/100 (Discontinuous boundary warping on chin/ear border)
Blink Frequency: 2.1 blinks/min (Expected baseline: 12-20 bpm; abnormal hypoblink state)
Pixel Noise Sensor PRNU: Correlation r = 0.081 (Failed camera silicon fingerprint match)
Synthetic Verdict: DEEPFAKE_MANIPULATED (Face Swap synthesized onto unidentified physical intruder)`,
        triageCategory: 'Critical',
        confidenceScore: 97,
        trustScore: {
          sha256Integrity: 'VERIFIED 100%',
          metadataConsistency: 62,
          timestampConsistency: 70,
          tamperingRisk: 'HIGH',
          overallTrustScore: 32,
          deterministicFacts: [
            'Bit-stream SHA-256 matches NVR intake custody manifest',
            'MP4 moov atom timestamp aligns with facility physical entry time (02:08:14 UTC)'
          ],
          probabilisticIndicators: [
            'Facial landmark temporal jitter indicates neural face-swap synthesis (96.4% confidence)',
            'PRNU sensor noise anomaly proves face pixels were rendered by external neural pipeline'
          ]
        },
        deepfakeReport: {
          targetArtifactId: 'ART-009',
          mediaType: 'video',
          overallDeepfakeProbability: 96.4,
          verdict: 'DEEPFAKE_MANIPULATED',
          videoImageAnalysis: {
            facialLandmarkTrackingScore: 87,
            blinkingFrequencyAnalysis: {
              observedBlinkRatePerMin: 2.1,
              blinkDurationDiscrepancy: true,
              details: 'Severe hypoblink anomaly (2.1 blinks/min vs natural human baseline of 12-20 bpm). Eye closure duration truncated to 33ms (sub-biological threshold).'
            },
            pixelNoiseConsistency: {
              varianceRatio: 4.8,
              sensorPRNUDiscrepancy: true,
              details: 'Camera sensor Photo-Response Non-Uniformity (PRNU) noise correlation drops to r = 0.081 within facial bounding polygon, proving facial swap overlay.'
            }
          }
        },
        iocs: [
          { type: 'Account', value: 'Physical Intruder (Masked as Dr. Adrian Sterling)', threatLevel: 'High', context: 'Deepfake facial overlay deployed on physical facility surveillance' }
        ],
        xaiAttributions: [
          { feature: 'Blink Rate: 2.1 bpm (Abnormal)', weight: 0.94, direction: 'supports_critical', technicalWhy: 'GAN face-swap generators struggle with physiological eye closure frequency.' },
          { feature: 'PRNU Spatial Noise Residue', weight: 0.97, direction: 'supports_critical', technicalWhy: 'Camera sensor noise pattern missing from facial quadrant; replaced with generator interpolation artifacts.' }
        ]
      },
      {
        id: 'ART-010',
        sourceType: 'unstructured_text',
        ingestionFormat: 'RAW',
        label: 'PBX Voicemail Dispatch Recording (MFCC Cepstral & AI Voice Clone Detection)',
        sourceFile: '/evidence/audio/VOICEMAIL_AUTH_REQUEST_URGENT.wav',
        timestampRange: '2026-09-19T01:58:30Z',
        sha256: '8b96c273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        sha3: '7b92ac4481092a7e584f23e67c8249019b3482716492817462819284',
        md5: '4858f62230ac3c915f300c664312c63f',
        nsrlMatch: {
          status: 'UNKNOWN_FORENSIC_ARTIFACT',
          description: '16-bit 44.1 kHz PCM audio recording from corporate PBX system.'
        },
        provenance: {
          extractedArtifact: 'VOICEMAIL_AUTH_REQUEST_URGENT.wav',
          parentContainer: 'ASTERISK_PBX_ARCHIVE.tar',
          diskSectorOffset: 'WAV RIFF Inode #10294',
          originalImageHash: '8b96c273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
          backwardLinkValid: true,
          extractionTechnique: 'PBX Spool Demux & Spectral Cepstrum Extractor'
        },
        rawPayload: `[FORENSIC AUDIO SPECTRUM & VOICE CLONING ANALYSIS]
Target File: VOICEMAIL_AUTH_REQUEST_URGENT.wav | Duration: 24.8 seconds
Format: WAV (16-bit PCM, 44,100 Hz, Mono) | Peak Amplitude: -1.2 dB
Caller ID: +1 (202) 555-0198 (Spoofed executive desk line)
Transcript: "This is Adrian Sterling. We have a database deadlock on the finance node. Grant emergency elevated bypass to svc_backup immediately."
MFCC Cepstral Variance: 92.4% abnormal deviation across frames 12-98
Active Phase Inconsistency: Inverted phase spectrum with 0.012% vocal fold jitter (biological human range: 0.5% - 1.2%)
Acoustic Damping: Absence of vocal tract resonance absorption; synthetic zero-phase impulse response
Verdict: SYNTHETIC_GENERATED (Diffusion/TTS Neural Voice Clone)`,
        triageCategory: 'Critical',
        confidenceScore: 98,
        trustScore: {
          sha256Integrity: 'VERIFIED 100%',
          metadataConsistency: 71,
          timestampConsistency: 85,
          tamperingRisk: 'HIGH',
          overallTrustScore: 28,
          deterministicFacts: [
            'Bit-stream SHA-256 verified against PBX spool ingest ledger',
            'RIFF WAV audio header structure valid with intact fmt subchunk'
          ],
          probabilisticIndicators: [
            'MFCC cepstral analysis indicates 98.1% probability of neural TTS synthesis',
            'Zero acoustic glottal damping confirms voice was algorithmically generated'
          ]
        },
        deepfakeReport: {
          targetArtifactId: 'ART-010',
          mediaType: 'audio',
          overallDeepfakeProbability: 98.1,
          verdict: 'SYNTHETIC_GENERATED',
          audioSpectrumAnalysis: {
            mfccCepstralVariance: 92.4,
            activePhaseInconsistency: true,
            voiceCloningMarkers: [
              'Unnatural fundamental frequency (F0) flat trajectory across sentence boundaries',
              'Absence of micro-tremor vocal fold jitter (0.012% vs expected 0.75%)',
              'Discontinuous phase spectral envelope at 3.4 kHz formant boundary'
            ],
            details: 'Acoustic waveform exhibits zero vocal tract glottal damping. Audio generated using multi-speaker neural acoustic synthesizer (ElevenLabs / XTTS v2 clone).'
          }
        },
        iocs: [
          { type: 'Account', value: 'Spoofed Voice: Dr. Adrian Sterling', threatLevel: 'High', context: 'Vishing voice clone used to authorize emergency service account elevation' },
          { type: 'IP', value: '198.51.100.44', threatLevel: 'High', context: 'PBX SIP trunk relay node' }
        ],
        xaiAttributions: [
          { feature: 'Vocal Fold Jitter: 0.012%', weight: 0.96, direction: 'supports_critical', technicalWhy: 'Biological human speech requires vocal cord micro-tremors. Sub-0.05% jitter proves algorithmic voice synthesis.' },
          { feature: 'MFCC Cepstral Anomaly Score: 92.4', weight: 0.93, direction: 'supports_critical', technicalWhy: 'Cepstral coefficients match trained diffusion voice cloning model weights.' }
        ]
      }
    ]
  },
  {
    id: 'CASE-IDF-3109',
    title: 'DarkHydra Pre-Ransomware Staging & Header Spoofing',
    codeName: 'DARK_HYDRA_STAGING',
    description: 'Header mismatch attack where malicious PE binary is cloaked as PDF invoice with timestomped NTFS attributes.',
    incidentType: 'Ransomware Preparation & Timestomping',
    threatActorContext: 'Financially motivated extortion group utilizing disguised attachments and timestomping to defeat chronological timeline filters.',
    artifacts: [
      {
        id: 'ART-201',
        sourceType: 'unstructured_text',
        label: 'Phishing Email Header & Attachment Analysis',
        sourceFile: '/evidence/email/Msg_Q3_Audit_Invoice.eml',
        timestampRange: '2026-09-18T16:04:12Z',
        sha256: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
        rawPayload: `From: "PwC Corporate Audit" <audits@pwc-secure-review[.]net>
To: "Sarah Jenkins, CFO" <sjenkins@enterprise.com>
Subject: Urgent: Q3 Financial Reconciliation Attachment
Date: Fri, 18 Sep 2026 16:04:12 +0000
Message-ID: <91823912.20260918@pwc-secure-review.net>
Attachment: Q3_Financial_Audit_2026.pdf (Actual Size: 1.84 MB)
Attachment Hash (SHA-256): e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`,
        triageCategory: 'Suspicious',
        confidenceScore: 92,
        iocs: [
          { type: 'Domain', value: 'pwc-secure-review[.]net', threatLevel: 'High', context: 'Typosquatted domain registered 48h prior' }
        ],
        xaiAttributions: [
          { feature: 'Domain Age: 48 hours', weight: 0.89, direction: 'supports_suspicious', technicalWhy: 'Newly observed external domain sending financial reconciliation files.' }
        ]
      },
      {
        id: 'ART-202',
        sourceType: 'system_logs',
        label: 'NTFS Master File Table ($MFT) Record Analysis',
        sourceFile: 'C:\\$MFT::RecordNumber_108422',
        timestampRange: '2021-04-12 vs 2026-09-18',
        sha256: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        rawPayload: `MFT Record #108422: Q3_Financial_Audit_2026.pdf
$STANDARD_INFORMATION Attribute:
  Creation Time        : 2021-04-12 11:20:00.0000000 UTC
  Alteration Time      : 2021-04-12 11:20:00.0000000 UTC
  MFT Changed Time     : 2026-09-18 16:05:42.1102910 UTC
  Read Time            : 2021-04-12 11:20:00.0000000 UTC
$FILE_NAME Attribute:
  Creation Time        : 2026-09-18 16:05:39.4412090 UTC
  Alteration Time      : 2026-09-18 16:05:39.4412090 UTC
  MFT Changed Time     : 2026-09-18 16:05:39.4412090 UTC
[FORENSIC ALERT]: Timestamp variance > 5 years detected between $STANDARD_INFO and $FILE_NAME attributes. Definitive timestomping.`,
        triageCategory: 'Critical',
        confidenceScore: 99,
        iocs: [],
        xaiAttributions: [
          { feature: 'Timestomp Delta: 1,985 days', weight: 0.98, direction: 'supports_critical', technicalWhy: 'User-mode APIs only update $STANDARD_INFORMATION. Discrepancy with kernel-managed $FILE_NAME proves deliberate anti-forensic timestomping.' }
        ]
      }
    ]
  },
  {
    id: 'CASE-IDF-5021',
    title: 'Evidence Spoofing & Metadata Steganography',
    codeName: 'SPOOFED_AUDIO_STEG',
    description: 'Tampered court exhibit: synthetic deepfake voice recording altered with hidden encrypted steganographic carrier block.',
    incidentType: 'Digital Evidence Tampering',
    threatActorContext: 'Litigation adversary attempting to submit doctored audio while concealing command steganography in least significant bits.',
    artifacts: [
      {
        id: 'ART-501',
        sourceType: 'unstructured_text',
        label: 'Court Exhibit Registry vs Target Audio File',
        sourceFile: '/evidence/exhibits/Gov_Exhibit_12_Audio.wav',
        timestampRange: '2026-09-15T14:00:00Z',
        sha256: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
        rawPayload: `[Court Evidentiary Registry - Seizure Record]
Original Evidence Tag: EXHIBIT-2026-09-15-A
Target File: Gov_Exhibit_12_Audio.wav
Registered Seizure Hash (SHA-256): 1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
Current Calculated Hash (SHA-256): a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2
[CRYPTOGRAPHIC HASH MISMATCH DETECTED: Chain of Custody Broken]
Header Audio Format: WAVE (fmt subchunk: 16-bit PCM, 44.1 kHz)
LSB Variance Test: Chi-Square P-value: 0.9998 (Abnormal uniform distribution indicative of Steghide payload)`,
        triageCategory: 'Critical',
        confidenceScore: 100,
        iocs: [],
        xaiAttributions: [
          { feature: 'Hash Collision / Non-match', weight: 1.0, direction: 'supports_critical', technicalWhy: 'Current file digest deviates from sworn intake seizure hash. Document is legally inadmissable without re-authentication.' },
          { feature: 'Chi-Square LSB Variance > 0.99', weight: 0.88, direction: 'supports_critical', technicalWhy: 'Audio PCM samples exhibit non-natural uniform bit entropy in least significant bits.' }
        ]
      }
    ]
  }
];

export const INITIAL_TERMINAL_WELCOME = `================================================================================
  Apple OS System Terminal -- Bash -- 80x24 -- Courier New
================================================================================

[System Initialization: Complete]
[Loading AI Studio Prompt Engineer Profile...]
[Target Framework: AI-Powered Indigenous Digital Forensics Framework v2.4]

--------------------------------------------------------------------------------
PROMPT DESIGN PARAMETERS
--------------------------------------------------------------------------------
* Context    : Multi-source ingest (RAW/E01/AFF Disk, UFED/TAR Mobile, PCAP/Syslog)
* Pipeline   : [Uploaded Evidence] ---> [SHA-256 Hashing] ---> [MinIO Vault] ---> [Audit Ledger]
* Storage    : MinIO Immutable Vault (AES-256-GCM at rest, WORM Object Locking)
* Access     : RBAC Separation (Investigator: INV-001 | Auditor: AUDITOR-01)
* Provenance : [Extracted Artifact] ---> [Parent Container] ---> [Disk Sector Offset] ---> [Original Image Hash]
* Core Engine: Anomaly detection, timeline correlation, validation, integrity checks
* Output     : Court-admissible forensic insights, explainable AI chains (SHAP/LIME)

--------------------------------------------------------------------------------
COMMANDS READY:
  /triage       - Group raw artifacts into Critical, Suspicious, Normal, Telemetry Void
  /correlate    - Link heterogeneous nodes into a cryptographic chronological timeline
  /authenticate - Inspect magic bytes, hashes, MFT timestomping & NSRL baseline
  /trust        - Review Evidence Trust Score Dashboard (SHA-256, Metadata %, Time %, Risk)
  /forgery      - OpenCV/PyTorch CV Image Manipulation (ELA, Clones) & PDF Object Tree Parser
  /graph        - Interactive Neo4j AI Evidence Graph (:Person -> :File -> :Device -> :IP -> :Domain)
  /entity       - Entity Resolution engine linking aliases across profiles, IPs, and telemetry
  /extract      - Intelligent artifact extraction (Network IoCs, User Identifiers, GPS/Spatial)
  /vault        - Audit MinIO object storage, AES-256 encryption & WORM lock status
  /custody      - Review ISO/IEC 27037 sequential chain-of-custody handoff ledger
  /provenance   - Verify backward lineage ([Artifact] -> [Container] -> [Sector] -> [Hash])
  /nsrl         - Cross-reference hashes against National Software Reference Library
  /tamper       - Detect anti-forensic timestomping & file header manipulation
  /rbac         - Switch or inspect Investigator (INV-001) vs Auditor (AUDITOR-01) roles
  /report       - Generate judicial incident narrative & chain of custody certificate
  /load <case>  - Load pre-packaged case (e.g. /load CASE-IDF-8942)
  /cases        - List available forensic investigation dossiers
  /clear        - Clear terminal viewport
  /help         - Display detailed command reference and operational constraints

[Ready for Input. Enter forensic command, artifact log snippet, or query.]
`;

