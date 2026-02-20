import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() title = 'Enterprise Workspace';
  @Input() isMobile = false;
  @Input() isCollapsed = false;
  @Output() readonly sidebarToggle = new EventEmitter<void>();

  private readonly authService = inject(AuthService);
  protected readonly statusLabel = this.authService.statusLabel;

  protected toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  protected logout(): void {
    this.authService.logout();
  }
}
