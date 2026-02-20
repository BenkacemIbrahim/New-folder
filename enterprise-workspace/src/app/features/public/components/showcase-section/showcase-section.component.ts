import { NgClass, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ShowcaseItem } from '../../models/marketing-content.model';

@Component({
  selector: 'app-showcase-section',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './showcase-section.component.html',
  styleUrl: './showcase-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowcaseSectionComponent {
  protected readonly items: ShowcaseItem[] = [
    {
      id: 'strategic',
      eyebrow: 'Strategic View',
      title: 'Align portfolio priorities.',
      description:
        'Visualize strategic initiatives, owners, and blockers in one workspace built for alignment meetings and execution reviews.',
      bullets: [
        'Unified roadmap + sprint context',
        'Dependency mapping across squads',
        'Leadership-ready narrative dashboards'
      ],
      metric: '27% faster planning cycles'
    },
    {
      id: 'execution',
      eyebrow: 'Execution',
      title: 'Keep teams moving with live status.',
      description:
        'From backlog grooming to release readiness, teams collaborate in a frictionless environment designed for momentum.',
      bullets: [
        'Drag-and-drop Kanban lifecycle',
        'Priority signals and activity timeline',
        'Context drawer for rapid decisions'
      ],
      metric: '34% fewer coordination delays'
    },
    {
      id: 'reporting',
      eyebrow: 'Reporting',
      title: 'Turn activity into clear outcomes.',
      description:
        'Automated insight panels surface risk, velocity, and performance trends so operations and executives stay informed.',
      bullets: [
        'Animated KPI and trend reporting',
        'Program-level health indicators',
        'Stakeholder-ready exports and summaries'
      ],
      metric: '2.3x faster stakeholder reporting'
    }
  ];

  protected trackByItem(_index: number, item: ShowcaseItem): string {
    return item.id;
  }
}
