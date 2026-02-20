import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { MetricCardComponent } from '../../../shared/ui/metric-card/metric-card.component';

interface ChartColumn {
  label: string;
  value: number;
}

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [NgFor, PageHeaderComponent, MetricCardComponent],
  templateUrl: './analytics-page.component.html',
  styleUrl: './analytics-page.component.scss'
})
export class AnalyticsPageComponent {
  protected readonly metrics = [
    { label: 'Adoption Rate', value: '86%', trend: '+4% QoQ', icon: 'insights' },
    { label: 'Completion Rate', value: '72%', trend: '+6% QoQ', icon: 'school' },
    { label: 'Learner NPS', value: '58', trend: '+3 pts', icon: 'favorite' }
  ];

  protected readonly throughput: ChartColumn[] = [
    { label: 'Mon', value: 54 },
    { label: 'Tue', value: 67 },
    { label: 'Wed', value: 61 },
    { label: 'Thu', value: 83 },
    { label: 'Fri', value: 75 }
  ];
}
