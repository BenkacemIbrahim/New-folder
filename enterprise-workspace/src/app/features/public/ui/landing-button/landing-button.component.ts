import { NgClass, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

type LandingButtonVariant = 'primary' | 'secondary' | 'ghost';
type LandingButtonSize = 'md' | 'lg';

@Component({
  selector: 'app-landing-button',
  standalone: true,
  imports: [NgClass, NgSwitch, NgSwitchCase, NgSwitchDefault, RouterLink],
  templateUrl: './landing-button.component.html',
  styleUrl: './landing-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingButtonComponent {
  @Input() variant: LandingButtonVariant = 'primary';
  @Input() size: LandingButtonSize = 'md';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() ariaLabel?: string;
  @Input() routerLink?: string;
  @Input() href?: string;
  @Input() target?: '_blank' | '_self';
  @Output() readonly pressed = new EventEmitter<MouseEvent>();

  protected get renderMode(): 'router' | 'href' | 'button' {
    if (this.routerLink) {
      return 'router';
    }

    if (this.href) {
      return 'href';
    }

    return 'button';
  }

  protected onPress(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.pressed.emit(event);
  }
}

