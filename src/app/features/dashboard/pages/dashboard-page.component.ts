import { DOCUMENT, NgClass, NgFor } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  DoughnutController,
  Legend,
  LinearScale,
  Tooltip
} from 'chart.js';
import { gsap } from 'gsap';

import { ThemeService } from '../../../core/services/theme.service';
import { TranslationService } from '../../../core/services/translation.service';
import {
  MOTION_DISTANCE,
  MOTION_DURATION,
  MOTION_EASE_GSAP
} from '../../../shared/animations/motion.config';

Chart.register(
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale
);

type TrendDirection = 'up' | 'down' | 'steady';
type TimelineEventType = 'completion' | 'alert' | 'milestone' | 'meeting';

interface KpiMetric {
  id: string;
  labelKey: string;
  icon: string;
  value: number;
  decimals?: number;
  suffix?: string;
  trendKey: string;
  trendDirection: TrendDirection;
}

interface ChartPoint {
  labelKey: string;
  value: number;
}

interface TimelineEvent {
  id: string;
  titleKey: string;
  summaryKey: string;
  owner: string;
  time: string;
  type: TimelineEventType;
}

interface DashboardThemeTokens {
  cardSurface: string;
  textMuted: string;
  grid: string;
  tooltipBackground: string;
  tooltipText: string;
  tooltipBorder: string;
  pieColors: string[];
  barColor: string;
  barHoverColor: string;
}

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [NgFor, NgClass, MatIconModule, TranslatePipe],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent implements AfterViewInit, OnDestroy {
  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translationService = inject(TranslationService);
  private readonly themeService = inject(ThemeService);

  @ViewChild('taskChart') private taskChartRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('productivityChart') private productivityChartRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('timelineScroller') private timelineScrollerRef?: ElementRef<HTMLElement>;

  @ViewChildren('timelineItem') private timelineItemRefs?: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('kpiCard') private kpiCardRefs?: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('chartPanel') private chartPanelRefs?: QueryList<ElementRef<HTMLElement>>;

  protected readonly refreshMinutes = 2;

  protected readonly kpis: KpiMetric[] = [
    {
      id: 'active-projects',
      labelKey: 'DASHBOARD.KPIS.ACTIVE_PROJECTS.LABEL',
      icon: 'workspaces',
      value: 28,
      trendKey: 'DASHBOARD.KPIS.ACTIVE_PROJECTS.TREND',
      trendDirection: 'up'
    },
    {
      id: 'delivery-throughput',
      labelKey: 'DASHBOARD.KPIS.DELIVERY_THROUGHPUT.LABEL',
      icon: 'task_alt',
      value: 1432,
      trendKey: 'DASHBOARD.KPIS.DELIVERY_THROUGHPUT.TREND',
      trendDirection: 'up'
    },
    {
      id: 'team-velocity',
      labelKey: 'DASHBOARD.KPIS.TEAM_VELOCITY.LABEL',
      icon: 'insights',
      value: 46.7,
      decimals: 1,
      suffix: ' pts',
      trendKey: 'DASHBOARD.KPIS.TEAM_VELOCITY.TREND',
      trendDirection: 'up'
    },
    {
      id: 'risk-index',
      labelKey: 'DASHBOARD.KPIS.DELIVERY_RISK.LABEL',
      icon: 'warning_amber',
      value: 18,
      suffix: '%',
      trendKey: 'DASHBOARD.KPIS.DELIVERY_RISK.TREND',
      trendDirection: 'down'
    }
  ];

  protected readonly taskDistribution: ChartPoint[] = [
    { labelKey: 'DASHBOARD.CHARTS.TASK_DISTRIBUTION.IN_PROGRESS', value: 42 },
    { labelKey: 'DASHBOARD.CHARTS.TASK_DISTRIBUTION.REVIEW', value: 18 },
    { labelKey: 'DASHBOARD.CHARTS.TASK_DISTRIBUTION.BLOCKED', value: 9 },
    { labelKey: 'DASHBOARD.CHARTS.TASK_DISTRIBUTION.DONE', value: 31 }
  ];

  protected readonly productivityBySquad: ChartPoint[] = [
    { labelKey: 'DASHBOARD.CHARTS.PRODUCTIVITY_BY_SQUAD.PLATFORM', value: 84 },
    { labelKey: 'DASHBOARD.CHARTS.PRODUCTIVITY_BY_SQUAD.CONTENT', value: 73 },
    { labelKey: 'DASHBOARD.CHARTS.PRODUCTIVITY_BY_SQUAD.DATA', value: 91 },
    { labelKey: 'DASHBOARD.CHARTS.PRODUCTIVITY_BY_SQUAD.GROWTH', value: 66 },
    { labelKey: 'DASHBOARD.CHARTS.PRODUCTIVITY_BY_SQUAD.OPS', value: 79 }
  ];

  protected readonly timelineEvents: TimelineEvent[] = [
    {
      id: 'evt-1',
      titleKey: 'DASHBOARD.TIMELINE.EVENTS.EVT_1.TITLE',
      summaryKey: 'DASHBOARD.TIMELINE.EVENTS.EVT_1.SUMMARY',
      owner: 'Mia Chen',
      time: '09:24 AM',
      type: 'completion'
    },
    {
      id: 'evt-2',
      titleKey: 'DASHBOARD.TIMELINE.EVENTS.EVT_2.TITLE',
      summaryKey: 'DASHBOARD.TIMELINE.EVENTS.EVT_2.SUMMARY',
      owner: 'Marcus Lee',
      time: '10:08 AM',
      type: 'meeting'
    },
    {
      id: 'evt-3',
      titleKey: 'DASHBOARD.TIMELINE.EVENTS.EVT_3.TITLE',
      summaryKey: 'DASHBOARD.TIMELINE.EVENTS.EVT_3.SUMMARY',
      owner: 'Ava Romero',
      time: '11:31 AM',
      type: 'alert'
    },
    {
      id: 'evt-4',
      titleKey: 'DASHBOARD.TIMELINE.EVENTS.EVT_4.TITLE',
      summaryKey: 'DASHBOARD.TIMELINE.EVENTS.EVT_4.SUMMARY',
      owner: 'Priya Nair',
      time: '01:02 PM',
      type: 'milestone'
    },
    {
      id: 'evt-5',
      titleKey: 'DASHBOARD.TIMELINE.EVENTS.EVT_5.TITLE',
      summaryKey: 'DASHBOARD.TIMELINE.EVENTS.EVT_5.SUMMARY',
      owner: 'Noah Patel',
      time: '02:47 PM',
      type: 'completion'
    },
    {
      id: 'evt-6',
      titleKey: 'DASHBOARD.TIMELINE.EVENTS.EVT_6.TITLE',
      summaryKey: 'DASHBOARD.TIMELINE.EVENTS.EVT_6.SUMMARY',
      owner: 'Elena Kim',
      time: '03:35 PM',
      type: 'meeting'
    }
  ];

  private readonly counterValues = signal<Record<string, number>>({});

  private taskChart: Chart<'doughnut'> | null = null;
  private productivityChart: Chart<'bar'> | null = null;
  private timelineObserver: IntersectionObserver | null = null;
  private gsapContext: gsap.Context | null = null;

  constructor() {
    this.themeService.themeChanges$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.rebuildCharts());

    this.translationService.languageChanges$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.rebuildCharts());
  }

  ngAfterViewInit(): void {
    this.initializeCounterAnimations();
    this.initializeCharts();
    this.initializeEntryAnimations();
    this.initializeTimelineReveal();
  }

  ngOnDestroy(): void {
    this.timelineObserver?.disconnect();
    this.taskChart?.destroy();
    this.productivityChart?.destroy();
    this.gsapContext?.revert();
  }

  protected kpiValueLabel(metric: KpiMetric): string {
    const liveValue = this.counterValues()[metric.id] ?? 0;

    const formattedValue = new Intl.NumberFormat(this.translationService.currentLocale(), {
      minimumFractionDigits: metric.decimals ?? 0,
      maximumFractionDigits: metric.decimals ?? 0
    }).format(liveValue);

    return `${formattedValue}${metric.suffix ?? ''}`;
  }

  protected trackByKpi(_index: number, metric: KpiMetric): string {
    return metric.id;
  }

  protected trackByTimeline(_index: number, event: TimelineEvent): string {
    return event.id;
  }

  private initializeCounterAnimations(): void {
    const initialState: Record<string, number> = {};

    for (const metric of this.kpis) {
      initialState[metric.id] = 0;
    }

    this.counterValues.set(initialState);

    this.kpis.forEach((metric, index) => {
      const animatedMetric = { current: 0 };

      gsap.to(animatedMetric, {
        current: metric.value,
        duration: MOTION_DURATION.slow / 1000,
        delay: index * 0.03,
        ease: MOTION_EASE_GSAP,
        onUpdate: () => {
          this.counterValues.update((snapshot) => ({
            ...snapshot,
            [metric.id]: animatedMetric.current
          }));
        }
      });
    });
  }

  private initializeCharts(): void {
    if (!this.taskChartRef || !this.productivityChartRef) {
      return;
    }

    const themeTokens = this.getThemeTokens();

    this.taskChart = new Chart(this.taskChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.taskDistribution.map((point) => this.translationService.translate(point.labelKey)),
        datasets: [
          {
            data: this.taskDistribution.map((point) => point.value),
            backgroundColor: themeTokens.pieColors,
            borderColor: themeTokens.cardSurface,
            borderWidth: 2,
            hoverOffset: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '64%',
        animation: {
          duration: MOTION_DURATION.slow,
          easing: 'easeInOutCubic'
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: themeTokens.textMuted,
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 10,
              boxHeight: 10,
              padding: 18
            }
          },
          tooltip: {
            backgroundColor: themeTokens.tooltipBackground,
            titleColor: themeTokens.tooltipText,
            bodyColor: themeTokens.tooltipText,
            borderColor: themeTokens.tooltipBorder,
            borderWidth: 1
          }
        }
      }
    });

    this.productivityChart = new Chart(this.productivityChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.productivityBySquad.map((point) => this.translationService.translate(point.labelKey)),
        datasets: [
          {
            label: this.translationService.translate('DASHBOARD.CHARTS.PRODUCTIVITY_DATASET_LABEL'),
            data: this.productivityBySquad.map((point) => point.value),
            backgroundColor: themeTokens.barColor,
            hoverBackgroundColor: themeTokens.barHoverColor,
            borderRadius: 0,
            borderSkipped: false,
            borderWidth: 0,
            maxBarThickness: 36
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: MOTION_DURATION.slow,
          easing: 'easeInOutCubic'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: themeTokens.tooltipBackground,
            titleColor: themeTokens.tooltipText,
            bodyColor: themeTokens.tooltipText,
            borderColor: themeTokens.tooltipBorder,
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: themeTokens.textMuted,
              font: {
                weight: 600
              }
            }
          },
          y: {
            beginAtZero: true,
            suggestedMax: 100,
            grid: {
              color: themeTokens.grid
            },
            ticks: {
              color: themeTokens.textMuted
            },
            border: {
              display: false
            }
          }
        }
      }
    });
  }

  private initializeEntryAnimations(): void {
    this.gsapContext = gsap.context(() => {
      const kpiCards = this.kpiCardRefs?.map((itemRef) => itemRef.nativeElement) ?? [];
      const chartPanels = this.chartPanelRefs?.map((itemRef) => itemRef.nativeElement) ?? [];

      gsap.from('.dashboard-hero .hero-reveal', {
        y: MOTION_DISTANCE.reveal,
        autoAlpha: 0,
        duration: MOTION_DURATION.base / 1000,
        stagger: 0.04,
        ease: MOTION_EASE_GSAP
      });

      gsap.from(kpiCards, {
        y: MOTION_DISTANCE.reveal,
        autoAlpha: 0,
        duration: MOTION_DURATION.slow / 1000,
        stagger: 0.04,
        ease: MOTION_EASE_GSAP,
        delay: 0.06
      });

      gsap.from(chartPanels, {
        y: MOTION_DISTANCE.reveal,
        autoAlpha: 0,
        duration: MOTION_DURATION.slow / 1000,
        stagger: 0.05,
        ease: MOTION_EASE_GSAP,
        delay: 0.1
      });
    }, this.hostRef.nativeElement);
  }

  private initializeTimelineReveal(): void {
    const rootElement = this.timelineScrollerRef?.nativeElement ?? null;
    const timelineElements = this.timelineItemRefs?.toArray() ?? [];

    if (!timelineElements.length) {
      return;
    }

    this.timelineObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          const timelineItem = entry.target as HTMLElement;
          timelineItem.classList.add('is-visible');

          gsap.fromTo(
            timelineItem,
            {
              y: MOTION_DISTANCE.reveal,
              autoAlpha: 0
            },
            {
              y: 0,
              autoAlpha: 1,
              duration: MOTION_DURATION.base / 1000,
              ease: MOTION_EASE_GSAP
            }
          );

          this.timelineObserver?.unobserve(timelineItem);
        }
      },
      {
        root: rootElement,
        threshold: 0.2,
        rootMargin: '0px 0px -8% 0px'
      }
    );

    timelineElements.forEach((itemRef) => this.timelineObserver?.observe(itemRef.nativeElement));
  }

  private rebuildCharts(): void {
    this.taskChart?.destroy();
    this.productivityChart?.destroy();
    this.taskChart = null;
    this.productivityChart = null;
    this.initializeCharts();
  }

  private getThemeTokens(): DashboardThemeTokens {
    const styles = getComputedStyle(this.document.documentElement);
    const readToken = (token: string, fallback: string): string =>
      styles.getPropertyValue(token).trim() || fallback;

    return {
      cardSurface: readToken('--chart-surface', '#ffffff'),
      textMuted: readToken('--chart-text-muted', '#475569'),
      grid: readToken('--chart-grid', 'rgba(148, 163, 184, 0.26)'),
      tooltipBackground: readToken('--chart-tooltip-background', 'rgba(15, 23, 42, 0.92)'),
      tooltipText: readToken('--chart-tooltip-text', '#e2e8f0'),
      tooltipBorder: readToken('--chart-tooltip-border', 'rgba(148, 163, 184, 0.4)'),
      pieColors: [
        readToken('--chart-pie-1', '#335cff'),
        readToken('--chart-pie-2', '#0ea5e9'),
        readToken('--chart-pie-3', '#22c55e'),
        readToken('--chart-pie-4', '#f59e0b')
      ],
      barColor: readToken('--chart-bar', 'rgba(51, 92, 255, 0.78)'),
      barHoverColor: readToken('--chart-bar-hover', 'rgba(29, 78, 216, 0.92)')
    };
  }
}
