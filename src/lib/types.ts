export interface AgentSignals {
  fullName: string;
  firstName: string;
  brokerage: string;
  recentLocations: string[];
  priceRange: string;
  transactionVolume: string;
  bioDetails: string;
  email: string;
  phone: string;
  socialUrls: string[];
  otherDetails?: string;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
  followUp: string;
}

export interface GenerationResponse {
  signals: AgentSignals;
  email: GeneratedEmail;
}

export interface QualityCheckResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}
