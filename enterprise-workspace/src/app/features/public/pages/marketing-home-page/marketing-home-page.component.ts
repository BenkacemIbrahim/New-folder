import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  signal
} from '@angular/core';
import { gsap } from 'gsap';

import {
  MOTION_DISTANCE,
  MOTION_DURATION,
  MOTION_EASE_GSAP
} from '../../../../shared/animations/motion.config';
import { CtaSectionComponent } from '../../components/cta-section/cta-section.component';
import { FeaturesSectionComponent } from '../../components/features-section/features-section.component';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { PublicFooterComponent } from '../../components/public-footer/public-footer.component';
import { PublicNavbarComponent } from '../../components/public-navbar/public-navbar.component';
import { ShowcaseSectionComponent } from '../../components/showcase-section/showcase-section.component';
import { SignupPreviewModalComponent } from '../../components/signup-preview-modal/signup-preview-modal.component';
import { StatisticsSectionComponent } from '../../components/statistics-section/statistics-section.component';
import { TestimonialsSectionComponent } from '../../components/testimonials-section/testimonials-section.component';
import { SectionShellComponent } from '../../ui/section-shell/section-shell.component';

@Component({
  selector: 'app-marketing-home-page',
  standalone: true,
  imports: [
    PublicNavbarComponent,
    HeroSectionComponent,
    SectionShellComponent,
    FeaturesSectionComponent,
    ShowcaseSectionComponent,
    StatisticsSectionComponent,
    TestimonialsSectionComponent,
    CtaSectionComponent,
    PublicFooterComponent,
    SignupPreviewModalComponent
  ],
  templateUrl: './marketing-home-page.component.html',
  styleUrl: './marketing-home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketingHomePageComponent implements AfterViewInit, OnDestroy {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  protected readonly activeSection = signal('hero');
  protected readonly navScrolled = signal(false);
  protected readonly previewOpen = signal(false);

  private revealObserver: IntersectionObserver | null = null;
  private sectionObserver: IntersectionObserver | null = null;
  private scrollHandler: (() => void) | null = null;

  ngAfterViewInit(): void {
    this.initializeHeroAnimation();
    this.initializeRevealObserver();
    this.initializeSectionObserver();
    this.initializeScrollEffects();
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
    this.sectionObserver?.disconnect();

    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = null;
    }
  }

  protected scrollToSection(sectionId: string): void {
    const section = this.document.getElementById(sectionId);
    if (!section) {
      return;
    }

    if (this.prefersReducedMotion) {
      section.scrollIntoView({ behavior: 'auto', block: 'start' });
      return;
    }

    const navOffset = 82;
    const startY = window.scrollY;
    const targetY = section.getBoundingClientRect().top + startY - navOffset;
    const distance = targetY - startY;
    const duration = Math.max(
      MOTION_DURATION.modal,
      Math.min(MOTION_DURATION.slow, Math.abs(distance) * 0.15)
    );
    let startTime: number | null = null;

    const easeInOut = (progress: number): number =>
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const animate = (timestamp: number): void => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo({ top: startY + distance * easeInOut(progress) });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  protected openPreviewModal(): void {
    this.previewOpen.set(true);
  }

  protected closePreviewModal(): void {
    this.previewOpen.set(false);
  }

  private initializeHeroAnimation(): void {
    if (this.prefersReducedMotion) {
      return;
    }

    const host = this.hostRef.nativeElement;
    const words = host.querySelectorAll<HTMLElement>('.hero-word');
    const support = host.querySelector<HTMLElement>('.hero-support');
    const cta = host.querySelector<HTMLElement>('.hero-cta');
    const trust = host.querySelector<HTMLElement>('.hero-trust');
    const mockup = host.querySelector<HTMLElement>('.hero-mockup');
    const revealTargets = [support, cta, trust].filter(
      (target): target is HTMLElement => target instanceof HTMLElement
    );

    gsap.from(words, {
      y: MOTION_DISTANCE.reveal,
      autoAlpha: 0,
      duration: MOTION_DURATION.slow / 1000,
      stagger: 0.04,
      ease: MOTION_EASE_GSAP
    });

    if (revealTargets.length > 0) {
      gsap.from(revealTargets, {
        y: MOTION_DISTANCE.reveal,
        autoAlpha: 0,
        duration: MOTION_DURATION.base / 1000,
        stagger: 0.04,
        delay: 0.06,
        ease: MOTION_EASE_GSAP
      });
    }

    gsap.from(mockup, {
      y: MOTION_DISTANCE.reveal,
      autoAlpha: 0,
      duration: MOTION_DURATION.slow / 1000,
      delay: 0.08,
      ease: MOTION_EASE_GSAP
    });
  }

  private initializeRevealObserver(): void {
    const elements = this.hostRef.nativeElement.querySelectorAll<HTMLElement>('[data-reveal]');

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.revealObserver?.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px'
      }
    );

    elements.forEach((element) => this.revealObserver?.observe(element));
  }

  private initializeSectionObserver(): void {
    const sections = this.hostRef.nativeElement.querySelectorAll<HTMLElement>('[data-spy]');

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio);

        const topEntry = visibleSections[0];
        if (!topEntry) {
          return;
        }

        const sectionId =
          (topEntry.target as HTMLElement).dataset['sectionId'] ??
          (topEntry.target as HTMLElement).id ??
          'hero';
        this.activeSection.set(sectionId);
      },
      {
        threshold: [0.28, 0.46, 0.64]
      }
    );

    sections.forEach((section) => this.sectionObserver?.observe(section));
  }

  private initializeScrollEffects(): void {
    this.scrollHandler = () => {
      this.navScrolled.set(window.scrollY > 10);
    };

    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    this.scrollHandler();
  }
}
