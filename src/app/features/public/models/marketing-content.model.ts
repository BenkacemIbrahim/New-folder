export interface MarketingFeature {
  id: string;
  title: string;
  summary: string;
  iconPath: string;
}

export interface ShowcaseItem {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  metric: string;
}

export interface MarketingStat {
  id: string;
  value: number;
  label: string;
  suffix?: string;
  decimals?: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatarSeed: string;
}
