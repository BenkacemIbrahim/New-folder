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
  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly document = inject(DOCUMENT);
  private readonly prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  protected readonly activeSection = signal('hero');
  protected readonly navScrolled = signal(false);
  protected readonly previewOpen = signal(false);

  private revealObserver: IntersectionObserver | null = null;
  private sectionObserver: IntersectionObserver | null = null;
  private scrollHandler: (() => void) | null = null;
  private rafId: number | null = null;
  private parallaxNodes: HTMLElement[] = [];
  private floatingTween: gsap.core.Tween | null = null;

  ngAfterViewInit(): void {
    this.initializeHeroAnimation();
    this.initializeRevealObserver();
    this.initializeSectionObserver();
    this.initializeScrollEffects();
    this.captureParallaxNodes();
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
    this.sectionObserver?.disconnect();
    this.floatingTween?.kill();

    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = null;
    }

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  protected scrollToSection(sectionId: string): void {
    const section = this.document.getElementById(sectionId);
    if (!section) {
      return;
    }

    section.scrollIntoView({
      behavior: this.prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start'
    });
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

    gsap.from(words, {
      y: 22,
      autoAlpha: 0,
      duration: 0.72,
      stagger: 0.1,
      ease: 'power3.out'
    });

    gsap.from([support, cta, trust], {
      y: 16,
      autoAlpha: 0,
      duration: 0.68,
      stagger: 0.09,
      delay: 0.18,
      ease: 'power2.out'
    });

    gsap.from(mockup, {
      y: 24,
      autoAlpha: 0,
      duration: 0.84,
      delay: 0.24,
      ease: 'power3.out'
    });

    if (mockup) {
      this.floatingTween = gsap.to(mockup, {
        y: -10,
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
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
      this.scheduleParallaxUpdate();
    };

    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    this.scrollHandler();
  }

  private captureParallaxNodes(): void {
    this.parallaxNodes = Array.from(
      this.hostRef.nativeElement.querySelectorAll<HTMLElement>('[data-parallax]')
    );
    this.scheduleParallaxUpdate();
  }

  private scheduleParallaxUpdate(): void {
    if (this.prefersReducedMotion || this.rafId !== null) {
      return;
    }

    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.updateParallax();
    });
  }

  private updateParallax(): void {
    const viewportMid = window.innerHeight / 2;

    this.parallaxNodes.forEach((node) => {
      const speed = Number(node.dataset['parallax'] ?? 0.05);
      const rect = node.getBoundingClientRect();
      const offset = rect.top + rect.height / 2 - viewportMid;
      const translateY = Math.max(-16, Math.min(16, -offset * speed));

      node.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
    });
  }
}

