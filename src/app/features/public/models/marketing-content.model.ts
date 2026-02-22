export interface MarketingFeature {
  id: string;
  titleKey: string;
  summaryKey: string;
  iconPath: string;
}

export interface ShowcaseItem {
  id: string;
  eyebrowKey: string;
  titleKey: string;
  descriptionKey: string;
  bulletKeys: string[];
  metricKey: string;
}

export interface MarketingStat {
  id: string;
  value: number;
  labelKey: string;
  suffix?: string;
  decimals?: number;
}

export interface Testimonial {
  id: string;
  quoteKey: string;
  name: string;
  roleKey: string;
  companyKey: string;
  avatarSeed: string;
}
