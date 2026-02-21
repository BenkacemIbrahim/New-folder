import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NAV_ITEMS } from '../../core/config/navigation.config';
import { NavItem } from '../../core/models/nav-item.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Input() mobile = false;
  @Output() readonly navigate = new EventEmitter<void>();

  protected readonly navItems = NAV_ITEMS;
  private readonly authService = inject(AuthService);

  protected trackByRoute(_index: number, item: NavItem): string {
    return item.route;
  }

  protected logout(): void {
    this.authService.logout();
    this.navigate.emit();
  }
}
