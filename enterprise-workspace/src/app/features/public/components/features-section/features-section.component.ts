import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MarketingFeature } from '../../models/marketing-content.model';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [NgFor],
  templateUrl: './features-section.component.html',
  styleUrl: './features-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturesSectionComponent {
  protected readonly features: MarketingFeature[] = [
    {
      id: 'planning',
      title: 'Portfolio Planning That Stays Aligned',
      summary:
        'Build initiatives, priorities, and dependencies with shared context so strategy and execution stay synchronized.',
      iconPath:
        'M3 8.5L12 3l9 5.5v7L12 21l-9-5.5v-7Zm9 12.5V11.2m0 0L3 8.5m9 2.7L21 8.5'
    },
    {
      id: 'delivery',
      title: 'Execution Boards for Cross-Functional Teams',
      summary:
        'Run sprint workflows with premium Kanban controls, operational guardrails, and real-time delivery visibility.',
      iconPath:
        'M4 6h7v5H4V6Zm9 0h7v3h-7V6ZM4 13h7v5H4v-5Zm9-2h7v7h-7v-7Z'
    },
    {
      id: 'analytics',
      title: 'Decision-Grade Analytics',
      summary:
        'Track throughput, risk, and impact in one dashboard built for product leaders, PMOs, and executives.',
      iconPath:
        'M4 18V9m6 9V5m6 13v-7m6 7V3M2 21h22'
    },
    {
      id: 'governance',
      title: 'Security and Governance by Default',
      summary:
        'Role-aware access, auditable activity history, and policy-safe delivery workflows for enterprise confidence.',
      iconPath:
        'M12 3.5 20 7v5.5c0 4.9-3.4 7.9-8 9.5-4.6-1.6-8-4.6-8-9.5V7l8-3.5Zm-3.2 9.2 2.1 2.2 4.2-4.5'
    },
    {
      id: 'automation',
      title: 'Automation That Removes Busywork',
      summary:
        'Auto-route work, trigger lifecycle updates, and simplify handoffs so teams spend more time delivering value.',
      iconPath:
        'M7.5 7.5h3v3h-3v-3Zm6 0h3v3h-3v-3Zm-6 6h3v3h-3v-3Zm6 0h3v3h-3v-3M4 12h2.2m11.6 0H20M12 4v2.2M12 17.8V20'
    },
    {
      id: 'scale',
      title: 'Built to Scale Across Teams',
      summary:
        'From one squad to global programs, keep a consistent operating model without sacrificing team autonomy.',
      iconPath:
        'M4 18h16M7 18V9m5 9V6m5 12v-7M3 9h4m5-3h4m5 5h-4'
    }
  ];

  protected trackByFeature(_index: number, feature: MarketingFeature): string {
    return feature.id;
  }
}

