import { NgClass, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { Testimonial } from '../../models/marketing-content.model';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [NgFor, NgClass, TranslatePipe],
  templateUrl: './testimonials-section.component.html',
  styleUrl: './testimonials-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestimonialsSectionComponent implements OnDestroy {
  protected readonly testimonials: Testimonial[] = [
    {
      id: 'c1',
      quoteKey: 'MARKETING.TESTIMONIALS.ITEMS.C1.QUOTE',
      name: 'Maya Brooks',
      roleKey: 'MARKETING.TESTIMONIALS.ITEMS.C1.ROLE',
      companyKey: 'MARKETING.TESTIMONIALS.ITEMS.C1.COMPANY',
      avatarSeed: 'MB'
    },
    {
      id: 'c2',
      quoteKey: 'MARKETING.TESTIMONIALS.ITEMS.C2.QUOTE',
      name: 'Daniel Ortiz',
      roleKey: 'MARKETING.TESTIMONIALS.ITEMS.C2.ROLE',
      companyKey: 'MARKETING.TESTIMONIALS.ITEMS.C2.COMPANY',
      avatarSeed: 'DO'
    },
    {
      id: 'c3',
      quoteKey: 'MARKETING.TESTIMONIALS.ITEMS.C3.QUOTE',
      name: 'Anika Sharma',
      roleKey: 'MARKETING.TESTIMONIALS.ITEMS.C3.ROLE',
      companyKey: 'MARKETING.TESTIMONIALS.ITEMS.C3.COMPANY',
      avatarSeed: 'AS'
    }
  ];

  protected readonly currentIndex = signal(0);
  protected readonly trackTransform = computed(
    () => `translate3d(-${this.currentIndex() * 100}%, 0, 0)`
  );

  private autoplayHandle: ReturnType<typeof setInterval> | null = setInterval(() => {
    this.next();
  }, 5200);

  ngOnDestroy(): void {
    if (this.autoplayHandle) {
      clearInterval(this.autoplayHandle);
      this.autoplayHandle = null;
    }
  }

  protected setSlide(index: number): void {
    this.currentIndex.set(index);
    this.restartAutoplay();
  }

  protected next(): void {
    this.currentIndex.update((index) => (index + 1) % this.testimonials.length);
  }

  protected previous(): void {
    this.currentIndex.update((index) => (index - 1 + this.testimonials.length) % this.testimonials.length);
    this.restartAutoplay();
  }

  protected trackByTestimonial(_index: number, testimonial: Testimonial): string {
    return testimonial.id;
  }

  private restartAutoplay(): void {
    if (this.autoplayHandle) {
      clearInterval(this.autoplayHandle);
    }

    this.autoplayHandle = setInterval(() => {
      this.next();
    }, 5200);
  }
}
