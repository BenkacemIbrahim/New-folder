import { NgIf } from '@angular/common';
import { computed, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { LanguageSwitcherComponent } from '../../shared/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgIf,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    TranslatePipe,
    LanguageSwitcherComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() title = 'COMMON.APP_NAME';
  @Input() isMobile = false;
  @Input() isCollapsed = false;
  @Input() isSidebarOpen = true;
  @Input() showLanguageSwitcher = true;
  @Output() readonly sidebarToggle = new EventEmitter<void>();

  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);

  protected readonly isDarkTheme = this.themeService.isDarkTheme;
  protected readonly statusKey = computed(() =>
    this.authService.isAuthenticated() ? 'COMMON.STATUS.ONLINE' : 'COMMON.STATUS.OFFLINE'
  );

  protected toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  protected logout(): void {
    this.authService.logout();
  }
}
