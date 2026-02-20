import { NgFor } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  signal
} from '@angular/core';
import { gsap } from 'gsap';

import { MOTION_DURATION, MOTION_EASE_GSAP } from '../../../../shared/animations/motion.config';
import { MarketingStat } from '../../models/marketing-content.model';

@Component({
  selector: 'app-statistics-section',
  standalone: true,
  imports: [NgFor],
  templateUrl: './statistics-section.component.html',
  styleUrl: './statistics-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('statsRoot') private statsRoot?: ElementRef<HTMLElement>;

  protected readonly stats: MarketingStat[] = [
    { id: 'users', value: 14000, suffix: '+', label: 'Active weekly users' },
    { id: 'throughput', value: 38, suffix: '%', label: 'Higher team throughput' },
    { id: 'satisfaction', value: 96, suffix: '%', label: 'Operational satisfaction score' },
    { id: 'time', value: 6.4, suffix: 'h', decimals: 1, label: 'Saved per manager each week' }
  ];

  protected readonly currentValues = signal<Record<string, number>>({});

  private observer: IntersectionObserver | null = null;
  private animationStarted = false;

  ngAfterViewInit(): void {
    this.currentValues.set(
      this.stats.reduce<Record<string, number>>((state, stat) => ({ ...state, [stat.id]: 0 }), {})
    );

    const root = this.statsRoot?.nativeElement;
    if (!root) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || this.animationStarted) {
            continue;
          }

          this.animationStarted = true;
          this.startCounters();
          this.observer?.disconnect();
        }
      },
      {
        threshold: 0.4
      }
    );

    this.observer.observe(root);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  protected formattedValue(stat: MarketingStat): string {
    const value = this.currentValues()[stat.id] ?? 0;
    return value.toLocaleString('en-US', {
      minimumFractionDigits: stat.decimals ?? 0,
      maximumFractionDigits: stat.decimals ?? 0
    });
  }

  protected trackByStat(_index: number, stat: MarketingStat): string {
    return stat.id;
  }

  private startCounters(): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.currentValues.set(
        this.stats.reduce<Record<string, number>>(
          (state, stat) => ({ ...state, [stat.id]: stat.value }),
          {}
        )
      );
      return;
    }

    this.stats.forEach((stat, index) => {
      const state = { value: 0 };

      gsap.to(state, {
        value: stat.value,
        duration: MOTION_DURATION.slow / 1000,
        delay: index * 0.03,
        ease: MOTION_EASE_GSAP,
        onUpdate: () => {
          this.currentValues.update((snapshot) => ({
            ...snapshot,
            [stat.id]: state.value
          }));
        }
      });
    });
  }
}
