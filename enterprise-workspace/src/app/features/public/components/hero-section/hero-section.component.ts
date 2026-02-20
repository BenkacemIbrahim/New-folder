import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

import { LandingButtonComponent } from '../../ui/landing-button/landing-button.component';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [LandingButtonComponent, NgFor, RouterLink],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroSectionComponent {
  @Output() readonly navigateTo = new EventEmitter<string>();

  protected readonly trustItems = [
    '14,000+ weekly active users',
    '34% fewer coordination delays',
    'SOC-ready access controls'
  ];

  protected goTo(sectionId: string): void {
    this.navigateTo.emit(sectionId);
  }
}
