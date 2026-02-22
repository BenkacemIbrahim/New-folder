import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { ThemeService } from '../../../../core/services/theme.service';
import { LanguageSwitcherComponent } from '../../../../shared/components/language-switcher/language-switcher.component';

interface NavLink {
  id: string;
  labelKey: string;
}

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, RouterLink, TranslatePipe, MatIconModule, LanguageSwitcherComponent],
  templateUrl: './public-navbar.component.html',
  styleUrl: './public-navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicNavbarComponent {
  @Input() activeSection = 'hero';
  @Input() scrolled = false;
  @Output() readonly sectionNavigate = new EventEmitter<string>();

  private readonly themeService = inject(ThemeService);

  protected readonly mobileMenuOpen = signal(false);
  protected readonly isDarkTheme = this.themeService.isDarkTheme;

  protected readonly links: NavLink[] = [
    { id: 'hero', labelKey: 'NAVBAR.PUBLIC_LINKS.OVERVIEW' },
    { id: 'features', labelKey: 'NAVBAR.PUBLIC_LINKS.PRODUCT' },
    { id: 'showcase', labelKey: 'NAVBAR.PUBLIC_LINKS.WORKFLOW' },
    { id: 'stats', labelKey: 'NAVBAR.PUBLIC_LINKS.RESULTS' },
    { id: 'testimonials', labelKey: 'NAVBAR.PUBLIC_LINKS.CUSTOMERS' }
  ];

  protected navigateTo(sectionId: string): void {
    this.sectionNavigate.emit(sectionId);
    this.mobileMenuOpen.set(false);
  }

  protected toggleMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
