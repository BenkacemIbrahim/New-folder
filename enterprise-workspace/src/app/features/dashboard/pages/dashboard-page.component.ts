import { NgClass, NgFor } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
  signal
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
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
  label: string;
  icon: string;
  value: number;
  decimals?: number;
  suffix?: string;
  trend: string;
  trendDirection: TrendDirection;
}

interface ChartPoint {
  label: string;
  value: number;
}

interface TimelineEvent {
  id: string;
  title: string;
  summary: string;
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
  imports: [NgFor, NgClass, MatIconModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent implements AfterViewInit, OnDestroy {
  private readonly hostRef = inject(ElementRef<HTMLElement>);

  @ViewChild('taskChart') private taskChartRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('productivityChart') private productivityChartRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('timelineScroller') private timelineScrollerRef?: ElementRef<HTMLElement>;

  @ViewChildren('timelineItem') private timelineItemRefs?: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('kpiCard') private kpiCardRefs?: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('chartPanel') private chartPanelRefs?: QueryList<ElementRef<HTMLElement>>;

  protected readonly lastRefresh = '2 min ago';

  protected readonly kpis: KpiMetric[] = [
    {
      id: 'active-projects',
      label: 'Active Projects',
      icon: 'workspaces',
      value: 28,
      trend: '+8.4% vs last month',
      trendDirection: 'up'
    },
    {
      id: 'delivery-throughput',
      label: 'Delivery Throughput',
      icon: 'task_alt',
      value: 1432,
      trend: '+112 closed tasks this week',
      trendDirection: 'up'
    },
    {
      id: 'team-velocity',
      label: 'Team Velocity',
      icon: 'insights',
      value: 46.7,
      decimals: 1,
      suffix: ' pts',
      trend: '+3.1 sprint points',
      trendDirection: 'up'
    },
    {
      id: 'risk-index',
      label: 'Delivery Risk Index',
      icon: 'warning_amber',
      value: 18,
      suffix: '%',
      trend: '-4% risk reduction',
      trendDirection: 'down'
    }
  ];

  protected readonly taskDistribution: ChartPoint[] = [
    { label: 'In Progress', value: 42 },
    { label: 'Review', value: 18 },
    { label: 'Blocked', value: 9 },
    { label: 'Done', value: 31 }
  ];

  protected readonly productivityBySquad: ChartPoint[] = [
    { label: 'Platform', value: 84 },
    { label: 'Content', value: 73 },
    { label: 'Data', value: 91 },
    { label: 'Growth', value: 66 },
    { label: 'Ops', value: 79 }
  ];

  protected readonly timelineEvents: TimelineEvent[] = [
    {
      id: 'evt-1',
      title: 'Migration Wave 3 Completed',
      summary: 'Platform squad moved 12 services to the new orchestration layer.',
      owner: 'Owner: Mia Chen',
      time: '09:24 AM',
      type: 'completion'
    },
    {
      id: 'evt-2',
      title: 'Security Review Scheduled',
      summary: 'Identity federation workflow review created for Friday governance session.',
      owner: 'Owner: Marcus Lee',
      time: '10:08 AM',
      type: 'meeting'
    },
    {
      id: 'evt-3',
      title: 'Revenue Analytics Alert',
      summary: 'Weekly dashboard detected >12% anomaly in completion-driven upsell funnel.',
      owner: 'Owner: Ava Romero',
      time: '11:31 AM',
      type: 'alert'
    },
    {
      id: 'evt-4',
      title: 'Q2 Learning Program Milestone',
      summary: 'Leadership enablement track reached 80% rollout across enterprise cohorts.',
      owner: 'Owner: Priya Nair',
      time: '01:02 PM',
      type: 'milestone'
    },
    {
      id: 'evt-5',
      title: 'Dependency Resolved',
      summary: 'External SSO vendor issue closed and blocked integration work resumed.',
      owner: 'Owner: Noah Patel',
      time: '02:47 PM',
      type: 'completion'
    },
    {
      id: 'evt-6',
      title: 'Portfolio Steering Notes Published',
      summary: 'Decision summary and risk controls shared with directors and PM leads.',
      owner: 'Owner: Elena Kim',
      time: '03:35 PM',
      type: 'meeting'
    }
  ];

  private readonly counterValues = signal<Record<string, number>>({});

  private taskChart: Chart<'doughnut'> | null = null;
  private productivityChart: Chart<'bar'> | null = null;
  private timelineObserver: IntersectionObserver | null = null;
  private gsapContext: gsap.Context | null = null;

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

    const formattedValue = liveValue.toLocaleString('en-US', {
      minimumFractionDigits: metric.decimals ?? 0,
      maximumFractionDigits: metric.decimals ?? 0
    });

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
        labels: this.taskDistribution.map((point) => point.label),
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
        labels: this.productivityBySquad.map((point) => point.label),
        datasets: [
          {
            label: 'Productivity Score',
            data: this.productivityBySquad.map((point) => point.value),
            backgroundColor: themeTokens.barColor,
            hoverBackgroundColor: themeTokens.barHoverColor,
            borderRadius: 12,
            borderSkipped: false,
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

  private getThemeTokens(): DashboardThemeTokens {
    return {
      cardSurface: '#ffffff',
      textMuted: '#475569',
      grid: 'rgba(148, 163, 184, 0.26)',
      tooltipBackground: 'rgba(15, 23, 42, 0.92)',
      tooltipText: '#e2e8f0',
      tooltipBorder: 'rgba(148, 163, 184, 0.4)',
      pieColors: ['#335cff', '#0ea5e9', '#22c55e', '#f59e0b'],
      barColor: 'rgba(51, 92, 255, 0.78)',
      barHoverColor: 'rgba(29, 78, 216, 0.92)'
    };
  }
}
