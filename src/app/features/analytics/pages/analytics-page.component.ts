import { DOCUMENT, NgFor } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip
} from 'chart.js';
import { TranslatePipe } from '@ngx-translate/core';

import { ThemeService } from '../../../core/services/theme.service';
import { TranslationService } from '../../../core/services/translation.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { MetricCardComponent } from '../../../shared/ui/metric-card/metric-card.component';

interface ChartColumn {
  labelKey: string;
  value: number;
}

interface AnalyticsMetric {
  labelKey: string;
  value: string;
  trendKey: string;
  icon: string;
}

interface AnalyticsChartTokens {
  barColor: string;
  barHoverColor: string;
  tooltipBackground: string;
  tooltipText: string;
  tooltipBorder: string;
  grid: string;
  textMuted: string;
}

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [NgFor, PageHeaderComponent, MetricCardComponent, TranslatePipe],
  templateUrl: './analytics-page.component.html',
  styleUrl: './analytics-page.component.scss'
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('throughputChart') private throughputChartRef?: ElementRef<HTMLCanvasElement>;

  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly themeService = inject(ThemeService);
  private readonly translationService = inject(TranslationService);

  protected readonly metrics: AnalyticsMetric[] = [
    { labelKey: 'ANALYTICS.METRICS.ADOPTION.LABEL', value: '86%', trendKey: 'ANALYTICS.METRICS.ADOPTION.TREND', icon: 'insights' },
    { labelKey: 'ANALYTICS.METRICS.COMPLETION.LABEL', value: '72%', trendKey: 'ANALYTICS.METRICS.COMPLETION.TREND', icon: 'school' },
    { labelKey: 'ANALYTICS.METRICS.NPS.LABEL', value: '58', trendKey: 'ANALYTICS.METRICS.NPS.TREND', icon: 'favorite' }
  ];

  protected readonly throughput: ChartColumn[] = [
    { labelKey: 'ANALYTICS.CHART.DAYS.MON', value: 54 },
    { labelKey: 'ANALYTICS.CHART.DAYS.TUE', value: 67 },
    { labelKey: 'ANALYTICS.CHART.DAYS.WED', value: 61 },
    { labelKey: 'ANALYTICS.CHART.DAYS.THU', value: 83 },
    { labelKey: 'ANALYTICS.CHART.DAYS.FRI', value: 75 }
  ];

  private throughputChart: Chart<'bar'> | null = null;

  constructor() {
    this.themeService.themeChanges$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.rebuildChart());

    this.translationService.languageChanges$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.rebuildChart());
  }

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  ngOnDestroy(): void {
    this.throughputChart?.destroy();
  }

  private initializeChart(): void {
    if (!this.throughputChartRef) {
      return;
    }

    const tokens = this.getChartTokens();

    this.throughputChart = new Chart(this.throughputChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.throughput.map((point) => this.translationService.translate(point.labelKey)),
        datasets: [
          {
            label: this.translationService.translate('ANALYTICS.CHART.DATASET'),
            data: this.throughput.map((point) => point.value),
            backgroundColor: tokens.barColor,
            hoverBackgroundColor: tokens.barHoverColor,
            borderRadius: 0,
            borderSkipped: false,
            borderWidth: 0,
            maxBarThickness: 40
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: tokens.tooltipBackground,
            titleColor: tokens.tooltipText,
            bodyColor: tokens.tooltipText,
            borderColor: tokens.tooltipBorder,
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: tokens.textMuted
            }
          },
          y: {
            beginAtZero: true,
            suggestedMax: 100,
            grid: {
              color: tokens.grid
            },
            ticks: {
              color: tokens.textMuted
            }
          }
        }
      }
    });
  }

  private rebuildChart(): void {
    this.throughputChart?.destroy();
    this.throughputChart = null;
    this.initializeChart();
  }

  private getChartTokens(): AnalyticsChartTokens {
    const styles = getComputedStyle(this.document.documentElement);
    const readToken = (token: string, fallback: string): string =>
      styles.getPropertyValue(token).trim() || fallback;

    return {
      barColor: readToken('--chart-bar', 'rgba(51, 92, 255, 0.78)'),
      barHoverColor: readToken('--chart-bar-hover', 'rgba(29, 78, 216, 0.92)'),
      tooltipBackground: readToken('--chart-tooltip-background', 'rgba(15, 23, 42, 0.92)'),
      tooltipText: readToken('--chart-tooltip-text', '#e2e8f0'),
      tooltipBorder: readToken('--chart-tooltip-border', 'rgba(148, 163, 184, 0.4)'),
      grid: readToken('--chart-grid', 'rgba(148, 163, 184, 0.26)'),
      textMuted: readToken('--chart-text-muted', '#475569')
    };
  }
}
