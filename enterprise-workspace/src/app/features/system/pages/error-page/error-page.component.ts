import { Location, NgIf } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, NgIf],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss'
})
export class ErrorPageComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  protected readonly statusCode = signal<number | null>(null);
  protected readonly statusText = signal<string | null>(null);
  protected readonly hasStatus = computed(() => this.statusCode() !== null);

  constructor() {
    const state = (this.router.getCurrentNavigation()?.extras.state ??
      history.state) as Partial<{ statusCode: number; statusText: string }>;

    this.statusCode.set(typeof state.statusCode === 'number' ? state.statusCode : null);
    this.statusText.set(typeof state.statusText === 'string' ? state.statusText : null);
  }

  protected goBack(): void {
    this.location.back();
  }
}
