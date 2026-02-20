import { Component } from '@angular/core';

import { staggerTextAnimation } from '../../animations/auth-animations';

@Component({
  selector: 'app-auth-hero-panel',
  standalone: true,
  imports: [],
  templateUrl: './auth-hero-panel.component.html',
  styleUrl: './auth-hero-panel.component.scss',
  animations: [staggerTextAnimation]
})
export class AuthHeroPanelComponent {
}
