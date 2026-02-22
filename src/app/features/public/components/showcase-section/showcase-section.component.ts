import { NgClass, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ShowcaseItem } from '../../models/marketing-content.model';

@Component({
  selector: 'app-showcase-section',
  standalone: true,
  imports: [NgFor, NgClass, TranslatePipe],
  templateUrl: './showcase-section.component.html',
  styleUrl: './showcase-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowcaseSectionComponent {
  protected readonly items: ShowcaseItem[] = [
    {
      id: 'strategic',
      eyebrowKey: 'MARKETING.SHOWCASE.STRATEGIC.EYEBROW',
      titleKey: 'MARKETING.SHOWCASE.STRATEGIC.TITLE',
      descriptionKey: 'MARKETING.SHOWCASE.STRATEGIC.DESCRIPTION',
      bulletKeys: [
        'MARKETING.SHOWCASE.STRATEGIC.BULLETS.ONE',
        'MARKETING.SHOWCASE.STRATEGIC.BULLETS.TWO',
        'MARKETING.SHOWCASE.STRATEGIC.BULLETS.THREE'
      ],
      metricKey: 'MARKETING.SHOWCASE.STRATEGIC.METRIC'
    },
    {
      id: 'execution',
      eyebrowKey: 'MARKETING.SHOWCASE.EXECUTION.EYEBROW',
      titleKey: 'MARKETING.SHOWCASE.EXECUTION.TITLE',
      descriptionKey: 'MARKETING.SHOWCASE.EXECUTION.DESCRIPTION',
      bulletKeys: [
        'MARKETING.SHOWCASE.EXECUTION.BULLETS.ONE',
        'MARKETING.SHOWCASE.EXECUTION.BULLETS.TWO',
        'MARKETING.SHOWCASE.EXECUTION.BULLETS.THREE'
      ],
      metricKey: 'MARKETING.SHOWCASE.EXECUTION.METRIC'
    },
    {
      id: 'reporting',
      eyebrowKey: 'MARKETING.SHOWCASE.REPORTING.EYEBROW',
      titleKey: 'MARKETING.SHOWCASE.REPORTING.TITLE',
      descriptionKey: 'MARKETING.SHOWCASE.REPORTING.DESCRIPTION',
      bulletKeys: [
        'MARKETING.SHOWCASE.REPORTING.BULLETS.ONE',
        'MARKETING.SHOWCASE.REPORTING.BULLETS.TWO',
        'MARKETING.SHOWCASE.REPORTING.BULLETS.THREE'
      ],
      metricKey: 'MARKETING.SHOWCASE.REPORTING.METRIC'
    }
  ];

  protected trackByItem(_index: number, item: ShowcaseItem): string {
    return item.id;
  }
}
