import { NgClass, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, computed, signal } from '@angular/core';

import { Testimonial } from '../../models/marketing-content.model';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './testimonials-section.component.html',
  styleUrl: './testimonials-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestimonialsSectionComponent implements OnDestroy {
  protected readonly testimonials: Testimonial[] = [
    {
      id: 'c1',
      quote:
        'Enterprise Workspace gave us one operating rhythm across product, data, and operations. Delivery reviews are now focused on decisions, not status chasing.',
      name: 'Maya Brooks',
      role: 'VP of Delivery',
      company: 'Northpoint Learning Group',
      avatarSeed: 'MB'
    },
    {
      id: 'c2',
      quote:
        'The product feels premium and practical. Our PMO moved from fragmented spreadsheets to shared execution in less than two weeks.',
      name: 'Daniel Ortiz',
      role: 'Head of PMO',
      company: 'Coursetrail Enterprise',
      avatarSeed: 'DO'
    },
    {
      id: 'c3',
      quote:
        'From roadmap planning to sprint analytics, our leadership team gets the full story in minutes. It has changed how we run quarterly strategy.',
      name: 'Anika Sharma',
      role: 'Chief Product Officer',
      company: 'Atlas Skills Network',
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
