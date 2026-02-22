import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { LandingButtonComponent } from '../../ui/landing-button/landing-button.component';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [LandingButtonComponent, NgFor, RouterLink, TranslatePipe],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroSectionComponent {
  @Output() readonly navigateTo = new EventEmitter<string>();

  protected readonly trustItems = [
    'MARKETING.HERO.TRUST.USERS',
    'MARKETING.HERO.TRUST.DELAYS',
    'MARKETING.HERO.TRUST.SECURITY'
  ];

  protected goTo(sectionId: string): void {
    this.navigateTo.emit(sectionId);
  }
}
