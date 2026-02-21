import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

type SectionTone = 'default' | 'subtle' | 'highlight';

@Component({
  selector: 'app-section-shell',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './section-shell.component.html',
  styleUrl: './section-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionShellComponent {
  @Input({ required: true }) id!: string;
  @Input() eyebrow = '';
  @Input() title = '';
  @Input() description = '';
  @Input() tone: SectionTone = 'default';
}

