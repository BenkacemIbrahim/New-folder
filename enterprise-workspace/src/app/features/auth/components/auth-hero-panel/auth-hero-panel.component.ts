import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';

import { staggerTextAnimation } from '../../animations/auth-animations';

interface HeroMetric {
  label: string;
  value: string;
}

@Component({
  selector: 'app-auth-hero-panel',
  standalone: true,
  imports: [NgFor],
  templateUrl: './auth-hero-panel.component.html',
  styleUrl: './auth-hero-panel.component.scss',
  animations: [staggerTextAnimation]
})
export class AuthHeroPanelComponent {
  @Input() title = 'Deliver enterprise learning, without friction.';
  @Input() subtitle =
    'Align teams, manage projects, and measure impact in a single operational workspace.';
  @Input() highlights: string[] = [
    'Role-based governance with audit-grade visibility',
    'Cross-team project orchestration and sprint health tracking',
    'Live analytics for completion, adoption, and delivery outcomes'
  ];
  @Input() metrics: HeroMetric[] = [
    { label: 'Active organizations', value: '4,200+' },
    { label: 'Average setup time', value: '2.3 days' }
  ];
}
