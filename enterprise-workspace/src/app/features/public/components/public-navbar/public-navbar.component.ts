import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';

import { LandingButtonComponent } from '../../ui/landing-button/landing-button.component';

interface NavLink {
  id: string;
  label: string;
}

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, LandingButtonComponent],
  templateUrl: './public-navbar.component.html',
  styleUrl: './public-navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicNavbarComponent {
  @Input() activeSection = 'hero';
  @Input() scrolled = false;
  @Output() readonly sectionNavigate = new EventEmitter<string>();
  @Output() readonly openPreview = new EventEmitter<void>();

  protected readonly mobileMenuOpen = signal(false);

  protected readonly links: NavLink[] = [
    { id: 'hero', label: 'Overview' },
    { id: 'features', label: 'Features' },
    { id: 'showcase', label: 'Showcase' },
    { id: 'stats', label: 'Results' },
    { id: 'testimonials', label: 'Customers' }
  ];

  protected navigateTo(sectionId: string): void {
    this.sectionNavigate.emit(sectionId);
    this.mobileMenuOpen.set(false);
  }

  protected toggleMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  protected triggerPreview(): void {
    this.openPreview.emit();
    this.mobileMenuOpen.set(false);
  }
}

