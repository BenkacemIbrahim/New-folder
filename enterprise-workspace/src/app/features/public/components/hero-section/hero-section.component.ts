import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

import { LandingButtonComponent } from '../../ui/landing-button/landing-button.component';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [LandingButtonComponent],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroSectionComponent {
  @Output() readonly openPreview = new EventEmitter<void>();
  @Output() readonly navigateTo = new EventEmitter<string>();

  protected readonly highlights = [
    'Trusted by digital academies and enterprise L&D teams',
    'End-to-end visibility from portfolio planning to delivery',
    'Built for cross-functional leaders who care about outcomes'
  ];

  protected launchPreview(): void {
    this.openPreview.emit();
  }

  protected goTo(sectionId: string): void {
    this.navigateTo.emit(sectionId);
  }
}

