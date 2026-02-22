import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './cta-section.component.html',
  styleUrl: './cta-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CtaSectionComponent {
}
