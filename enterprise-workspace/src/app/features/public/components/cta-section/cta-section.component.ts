import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

import { LandingButtonComponent } from '../../ui/landing-button/landing-button.component';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [LandingButtonComponent],
  templateUrl: './cta-section.component.html',
  styleUrl: './cta-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CtaSectionComponent {
  @Output() readonly openPreview = new EventEmitter<void>();

  protected launchPreview(): void {
    this.openPreview.emit();
  }
}

