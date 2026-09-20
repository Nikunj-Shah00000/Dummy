export type EvidenceSourceType = 
  | 'disk_image'          // RAW, E01, AFF
  | 'mobile_extraction'   // Cellebrite UFED, TAR
  | 'network_pcap'        // PCAP, CSV, Syslog
  | 'system_logs'         // Windows EVTX, IIS, Auditd
  | 'memory_dump'         // Volatility RAW, VAD
  | 'unstructured_text';  // Emails, Chat Logs

export type IngestionFormat = 
  | 'RAW' | 'E01' | 'AFF' 
  | 'UFED' | 'TAR' 
  | 'PCAP' | 'CSV' | 'Syslog'
  | 'EVTX' | 'MEM_RAW';

export type TriageCategory = 'Critical' | 'Suspicious' | 'Normal' | 'Telemetry Void';

export type RBACRole = 'INVESTIGATOR' | 'AUDITOR';

export type NSRLStatus = 
  | 'NSRL_BENIGN_MATCH'         // Known legitimate OS / software binary (e.g., ntdll.dll, calc.exe)
  | 'KNOWN_MALICIOUS_IOC'       // Matched against known C2/exploit signature database
  | 'UNKNOWN_FORENSIC_ARTIFACT'; // Unique or proprietary file requiring specialized examination

export interface IndicatorOfCompromise {
  type: 'IP' | 'Domain' | 'Hash' | 'Process' | 'Registry' | 'CVE' | 'File' | 'Account';
  value: string;
  threatLevel: 'High' | 'Medium' | 'Low';
  context: string;
}

export interface ExplainableFeatureAttribution {
  feature: string;
  weight: number; // e.g., -1.0 to 1.0 or percentage
  direction: 'supports_critical' | 'supports_suspicious' | 'supports_normal';
  technicalWhy: string;
}

export interface EvidenceProvenance {
  extractedArtifact: string;
  parentContainer: string;
  diskSectorOffset: string;
  originalImageHash: string;
  backwardLinkValid: boolean;
  extractionTechnique: string;
}

export interface CustodyLedgerEvent {
  eventId: string;          // e.g. CUST-001, CUST-002, CUST-003
  actorId: string;          // e.g. INV-001, ANALYST-02, AUDITOR-01
  actorRole: RBACRole | 'FORENSIC_ANALYST';
  actionPerformed: string;  // e.g. Acquisition & Initial Hashing, Export Artifacts for AI Parsing, Integrity Audit & Verification
  timestamp: string;
  targetArtifact: string;
  hashSha256: string;
  hashSha3: string;
  verificationStatus: 'VERIFIED' | 'TAMPER_ALERT' | 'PENDING';
  notes?: string;
}

export interface MinIOVaultObject {
  objectKey: string;
  bucket: string;
  versionId: string;
  encryptionStandard: 'AES-256-GCM';
  sizeBytes: number;
  uploadedAt: string;
  uploadedBy: string;
  sha256: string;
  sha3: string;
  immutabilityLock: boolean; // WORM policy
  auditLogCount: number;
}

export interface TrustScoreMetrics {
  sha256Integrity: string; // e.g., "VERIFIED 100%"
  metadataConsistency: number; // percentage e.g. 98%
  timestampConsistency: number; // percentage e.g. 95%
  tamperingRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  overallTrustScore: number; // e.g. 94 / 100
  deterministicFacts: string[];
  probabilisticIndicators: string[];
}

export interface ImageManipulationReport {
  elaAnomalyScore: number; // 0 to 100
  elaLocalizedRegions: string[];
  cloneDetectionKeypoints: number;
  cloneDuplicatedBlocks: boolean;
  aiArtifactFingerprint: 'GAN_ARTIFACTS_DETECTED' | 'DIFFUSION_CHECKERBOARD' | 'NONE_DETECTED';
  spectralAnomalyDetected: boolean;
  verdict: string;
}

export interface DocumentForgeryReport {
  pdfIncrementalUpdatesCount: number;
  orphanTrailerObjects: number;
  fontSubstitutionAnomalies: string[];
  boundingBoxOverlaps: number;
  revisionHistory: { revision: number; timestamp: string; modifier: string; changeSummary: string }[];
  metadataConsistencyLayers: {
    exifVsOsCreation: { exifDate: string; osDate: string; match: boolean; discrepancy: string };
    authorVsUserAccount: { declaredAuthor: string; systemUser: string; match: boolean; notes: string };
    fileSizeVsByteStream: { declaredBytes: number; actualBytes: number; match: boolean; discrepancy: string };
  };
}

export interface IntelligentExtractionData {
  networkIndicators: { type: 'IP' | 'URL' | 'Domain' | 'Port'; value: string; context: string }[];
  userIdentifiers: { type: 'Username' | 'Email' | 'Phone' | 'Handle'; value: string; context: string }[];
  spatialTemporal: { type: 'GPS' | 'Timestamp' | 'DeviceID'; value: string; context: string }[];
}

export interface AIArtifactClassification {
  category: 'Browser Artifacts' | 'System Logs' | 'Chat Messages' | 'Executables' | 'Unstructured';
  parserEngine: string; // e.g., "SQLite DB Parser + Regex", "spaCy NLP + EVTX Parser", "YARA Engine + libmagic"
  tags: string[];
  summary: string;
}

export interface UnifiedEntity {
  id: string; // e.g., "Entity E01"
  primaryIdentity: string;
  confidence: number; // e.g., 96.4
  browserProfiles: string[];
  emailHeaders: string[];
  networkIPs: string[];
  deviceHostnames: string[];
  linkedEvidenceIds: string[];
  summary: string;
}

export interface EvidenceGraphNode {
  id: string;
  label: string;
  category: 'Person' | 'File' | 'Device' | 'IP' | 'Domain';
  subLabel?: string;
  metadata: Record<string, string | number | boolean | undefined>;
  x?: number;
  y?: number;
}

export interface EvidenceGraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: 'ACCESSED' | 'COPIED_TO' | 'CONNECTED_TO' | 'VISITED';
  label: string;
  details: string;
}

export interface MitreAttackMapping {
  attackPhase: string; // e.g. "Initial Access", "Execution", "Privilege Escalation", "Defense Evasion", "Collection", "Exfiltration"
  mappedArtifact: string; // e.g. "Phishing email attachment", "Registry run-key modification", "Archive creation & outbound HTTPS"
  mitreTechnique: string; // e.g. "T1566 - Phishing", "T1547 - Boot Autostart", "T1041 - Exfiltration Over C2"
  tacticId: string;
}

export interface DeepfakeDetectionReport {
  targetArtifactId: string;
  mediaType: 'video' | 'image' | 'audio';
  overallDeepfakeProbability: number; // e.g. 96.4%
  verdict: 'AUTHENTIC' | 'SUSPICIOUS' | 'SYNTHETIC_GENERATED' | 'DEEPFAKE_MANIPULATED';
  videoImageAnalysis?: {
    facialLandmarkTrackingScore: number; // 0-100 jitter / deformation index
    blinkingFrequencyAnalysis: {
      observedBlinkRatePerMin: number; // normal 12-20
      blinkDurationDiscrepancy: boolean;
      details: string;
    };
    pixelNoiseConsistency: {
      varianceRatio: number;
      sensorPRNUDiscrepancy: boolean;
      details: string;
    };
  };
  audioSpectrumAnalysis?: {
    mfccCepstralVariance: number;
    activePhaseInconsistency: boolean;
    voiceCloningMarkers: string[];
    details: string;
  };
}

export interface SyntheticMediaDetectionReport {
  targetArtifactId: string;
  documentOrAssetTitle: string;
  overallSyntheticConfidence: number; // e.g. 89.2%
  confidenceIndicatorGrade: 'LOW' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  textPerplexityScoring: {
    perplexityScore: number; // e.g. 12.8 (extremely low burstiness = LLM)
    burstinessVariance: number;
    verdict: string;
  };
  fontRenderingVectorAnalysis: {
    subPixelKerningVariance: number;
    vectorBezierDiscrepancies: boolean;
    pdfFontDescriptorMismatch: boolean;
    details: string;
  };
  metadataTagInspection: {
    detectedGenerativeSignatures: string[];
    cleanSoftwareSignature: boolean;
    hiddenPromptInXMP?: string;
  };
}

export interface EvidenceArtifact {
  id: string;
  sourceType: EvidenceSourceType;
  ingestionFormat?: IngestionFormat;
  label: string;
  sourceFile: string;
  rawPayload: string;
  timestampRange?: string;
  sha256?: string;
  sha3?: string;
  md5?: string;
  nsrlMatch?: {
    status: NSRLStatus;
    productName?: string;
    version?: string;
    description: string;
  };
  provenance?: EvidenceProvenance;
  trustScore?: TrustScoreMetrics;
  imageAnalysis?: ImageManipulationReport;
  documentAnalysis?: DocumentForgeryReport;
  deepfakeReport?: DeepfakeDetectionReport;
  syntheticMediaReport?: SyntheticMediaDetectionReport;
  extractionData?: IntelligentExtractionData;
  classification?: AIArtifactClassification;
  triageCategory?: TriageCategory;
  confidenceScore?: number; // 0 to 100
  iocs?: IndicatorOfCompromise[];
  xaiAttributions?: ExplainableFeatureAttribution[];
}

export interface TimelineNode {
  id: string;
  timestamp: string;
  sourceType: EvidenceSourceType;
  sourceLabel: string;
  actor: string;
  eventDescription: string;
  rawRecord: string;
  cryptographicHash: string;
  isTelemetryVoid?: boolean;
  correlationLink?: string;
  severity: 'critical' | 'suspicious' | 'normal' | 'void';
  eventType?: 'DETERMINISTIC_LOG' | 'PROBABILISTIC_INFERENCE';
  microsecondTimestamp?: string;
  linearSequenceSyntax?: string; // [HH:MM:SS.mmmmmm] (Observed Action) ---> [HH:MM:SS.mmmmmm] (Next Action)
  gapAlert?: {
    isGap: boolean;
    durationMinutes: number;
    displayString: string; // ??? [Potential Unexplained Activity Window: X Minutes] ???
    threatProfiling: string; // "Flagged for potential wiper execution, log deletion activities, or covert data staging window."
  };
  mitreMapping?: MitreAttackMapping;
  behavioralAnomaly?: {
    isAnomaly: boolean;
    baselineHours: string;
    observedTime: string;
    baselineZone: string;
    observedZone: string;
    marker: string; // "[Flag: High-Risk Behavioral Anomaly Generated]"
  };
  evidenceGrounding?: {
    conclusion: string; // Target Verdict
    reason: string;     // Telemetry Justification Path
    source: string;     // Specific Data Logs & Cryptographic Hash Values
    confidence: string; // X% (AI Inference)
  };
  timelineContradiction?: {
    isContradiction: boolean;
    marker: string; // "[Flag: Critical Timeline Inconsistency Detected]"
    conflictingSource: string;
    description: string;
    logicalDiscrepancy: string;
    hardwareBoundViolation: string;
  };
}

export interface WhatIfVerificationLayer {
  layerName: string;
  evidenceSource: string;
  expectedArtifact: string;
  observedTelemetry: string;
  status: 'CORROBORATED' | 'ABSENT' | 'CONTRADICTED';
  forensicInterpretation: string;
}

export interface WhatIfHypothesis {
  id: string;
  title: string;
  scenarioQuestion: string; // e.g., "What evidence would we expect if this file was actually copied to a USB device?"
  category: 'EXFILTRATION_MEDIA' | 'PRIVILEGE_ESCALATION' | 'VSS_SHADOW_TAMPERING' | 'CREDENTIAL_HARVESTING';
  layers: {
    registrySetupApi: WhatIfVerificationLayer;
    volumeShadowCopies: WhatIfVerificationLayer;
    operatingSystemLogs: WhatIfVerificationLayer;
  };
  overallVerdict: 'SUPPORTED' | 'REFUTED' | 'INCONCLUSIVE';
  confidenceScore: number; // e.g. 96
  verdictSynthesis: string;
  suggestedAction: string;
}

export interface FileAnomalyItem {
  id: string;
  filename: string;
  containerOrImagePath: string;
  declaredType: string;
  actualMagicBytes: string;
  fileSizeBytes: number;
  sectorOffsetLba?: string;
  anomalyCategory: 'DOUBLE_EXTENSION' | 'HIDDEN_ADS_STREAM' | 'ABNORMAL_COMPRESSION_ENTROPY';
  doubleExtensionDetails?: {
    apparentExt: string;
    hiddenExecExt: string;
    isDisguisedPayload: boolean;
    riskLevel: 'CRITICAL' | 'HIGH';
    disguisedMime: string;
  };
  hiddenFilesAdsDetails?: {
    streamName: string; // e.g. "Q3_Report.pdf:malicious_stager.dll"
    parentFsType: 'NTFS_ADS' | 'HIDDEN_OS_FOLDER' | 'SYSTEM_VOLUME_INFORMATION';
    hiddenSectorOffset: string;
    hiddenPayloadSize: number;
  };
  abnormalCompressionDetails?: {
    entropyScore: number; // e.g. 7.94 (Max 8.0)
    compressionRatio: number;
    highEntropySections: { sectionName: string; entropy: number; startOffset: string; sizeBytes: number }[];
    ransomwareOrPackerIndicator: boolean;
    packerFamily?: string;
  };
  verdict: string;
  sha256: string;
}

export interface NaturalLanguageSearchQuery {
  id: string;
  plainLanguageQuery: string;
  timestamp: string;
  controlledQuery: {
    language: 'SQL' | 'Cypher';
    queryText: string;
    targetIndex: string;
  };
  pipelineTrace: string; // "[Plain Language Query] ---> [Controlled SQL/Cypher Query] ---> [Evidence Index]"
  inventoryBreakdown: {
    filesCount: number;
    ipAddressesCount: number;
    devicesCount: number;
    emailAddressesCount: number;
    browserEventsCount: number;
    suspiciousActivitiesCount: number;
    formattedString: string; // "Returned X files, Y IP addresses, Z devices, A email addresses, B browser events, and C suspicious activities."
  };
  matchedResults: Array<{
    type: 'File' | 'IP' | 'Device' | 'Email' | 'Browser' | 'SuspiciousActivity';
    id: string;
    title: string;
    details: string;
    sourceHash: string;
    riskScore: number;
  }>;
  groundingTrace: {
    conclusion: string;
    reason: string;
    source: string;
    confidence: string;
  };
}

export interface BehavioralAnomalyProfile {
  principalAccount: string;
  baselineLoginHours: string;
  baselineInterfaceZones: string[];
  observedTimestamp: string;
  observedInterface: string;
  violationType: 'OFF_HOURS_AUTHENTICATION' | 'UNAUTHORIZED_INTERFACE_ZONE' | 'CONCURRENT_GEO_IMPOSSIBILITY';
  markerString: string; // "[Flag: High-Risk Behavioral Anomaly Generated]"
  isBreached: boolean;
  notes: string;
}

export interface AuthenticationReport {
  targetArtifact: string;
  declaredExtension: string;
  detectedMagicBytes: string;
  fileSignatureMatch: boolean;
  tamperingFlag: boolean;
  md5: string;
  sha256: string;
  sha3?: string;
  nsrlStatus?: NSRLStatus;
  mftStandardInfoTime?: string;
  mftFileNameTime?: string;
  timestompDetected?: boolean;
  steganographyIndicator?: string;
  integrityVerdict: 'VERIFIED_AUTHENTIC' | 'EVIDENCE_TAMPERED' | 'HEADER_SPOOFED' | 'UNSUPPORTED_TYPE';
  technicalWhy: string;
  xaiFactors: ExplainableFeatureAttribution[];
}

export interface CourtAdmissibleReport {
  caseId: string;
  investigationTitle: string;
  examinerId: string;
  agency: string;
  jurisdiction: string;
  classificationLevel: string;
  generationTimestamp: string;
  chainOfCustody: {
    itemNumber: string;
    sourceDevice: string;
    custodian: string;
    seizureHashSha256: string;
    currentHashSha256: string;
    integrityVerified: boolean;
  }[];
  executiveSummary: string;
  methodology: string;
  telemetryVoidsIdentified: string[];
  findingsChronology: string[];
  technicalAttributionsSHAP: {
    artifact: string;
    primaryFactor: string;
    attributionWeight: string;
    judicialRelevance: string;
  }[];
  legalAdmissibilityStatement: string;
}

export interface ForensicCase {
  id: string;
  title: string;
  codeName: string;
  description: string;
  incidentType: string;
  threatActorContext: string;
  artifacts: EvidenceArtifact[];
  custodyLedger?: CustodyLedgerEvent[];
  vaultObjects?: MinIOVaultObject[];
}

export interface TerminalEntry {
  id: string;
  type: 'input' | 'output' | 'system' | 'error';
  command?: string;
  timestamp: string;
  content: string;
  structuredOutput?: {
    triageResults?: EvidenceArtifact[];
    timeline?: TimelineNode[];
    authReport?: AuthenticationReport;
    courtReport?: CourtAdmissibleReport;
    xaiHighlights?: ExplainableFeatureAttribution[];
  };
}
