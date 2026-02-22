import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
  signal
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { APP_LANGUAGES, AppLanguageCode } from '../../../core/config/i18n.config';
import { TranslationService } from '../../../core/services/translation.service';

type LanguageSwitcherPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
type LanguageSwitcherAppearance = 'default' | 'inverse' | 'minimal' | 'minimal-inverse';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, TranslatePipe],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSwitcherComponent {
  @Input() compact = false;
  @Input() flagOnly = false;
  @Input() placement: LanguageSwitcherPlacement = 'bottom-end';
  @Input() appearance: LanguageSwitcherAppearance = 'default';

  @ViewChild('triggerButton') private triggerButtonRef?: ElementRef<HTMLButtonElement>;
  @ViewChildren('optionButton') private optionButtonRefs?: QueryList<ElementRef<HTMLButtonElement>>;

  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translationService = inject(TranslationService);

  protected readonly isOpen = signal(false);
  protected readonly languages = APP_LANGUAGES;
  protected readonly currentLanguage = this.translationService.currentLanguage;
  protected readonly currentLanguageMeta = this.translationService.currentLanguageMeta;

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) {
      return;
    }

    if (!this.hostElement.nativeElement.contains(event.target as Node)) {
      this.closeMenu();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  protected onEscape(event: KeyboardEvent): void {
    if (!this.isOpen()) {
      return;
    }

    event.stopPropagation();
    this.closeMenu();
    this.focusTrigger();
  }

  protected toggleMenu(): void {
    if (this.isOpen()) {
      this.closeMenu();
      return;
    }

    this.openMenu();
  }

  protected selectLanguage(languageCode: AppLanguageCode): void {
    this.translationService.setLanguage(languageCode);
    this.closeMenu();
    this.focusTrigger();
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.openMenu(this.selectedLanguageIndex());
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.openMenu(this.selectedLanguageIndex());
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleMenu();
        break;
      default:
        break;
    }
  }

  protected onOptionKeydown(event: KeyboardEvent, currentIndex: number): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusOption((currentIndex + 1) % this.languages.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusOption((currentIndex - 1 + this.languages.length) % this.languages.length);
        break;
      case 'Home':
        event.preventDefault();
        this.focusOption(0);
        break;
      case 'End':
        event.preventDefault();
        this.focusOption(this.languages.length - 1);
        break;
      case 'Tab':
        this.closeMenu();
        break;
      case 'Escape':
        event.preventDefault();
        this.closeMenu();
        this.focusTrigger();
        break;
      default:
        break;
    }
  }

  private openMenu(focusIndex = this.selectedLanguageIndex()): void {
    this.isOpen.set(true);
    this.focusOption(focusIndex);
  }

  private closeMenu(): void {
    this.isOpen.set(false);
  }

  private focusOption(index: number): void {
    queueMicrotask(() => this.optionButtonRefs?.get(index)?.nativeElement.focus());
  }

  private focusTrigger(): void {
    queueMicrotask(() => this.triggerButtonRef?.nativeElement.focus());
  }

  private selectedLanguageIndex(): number {
    const current = this.currentLanguage();
    const index = this.languages.findIndex((language) => language.code === current);
    return index >= 0 ? index : 0;
  }
}
