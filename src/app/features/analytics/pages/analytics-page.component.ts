import { NgFor } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip
} from 'chart.js';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { MetricCardComponent } from '../../../shared/ui/metric-card/metric-card.component';

interface ChartColumn {
  label: string;
  value: number;
}

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [NgFor, PageHeaderComponent, MetricCardComponent],
  templateUrl: './analytics-page.component.html',
  styleUrl: './analytics-page.component.scss'
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('throughputChart') private throughputChartRef?: ElementRef<HTMLCanvasElement>;

  protected readonly metrics = [
    { label: 'Adoption Rate', value: '86%', trend: '+4% QoQ', icon: 'insights' },
    { label: 'Completion Rate', value: '72%', trend: '+6% QoQ', icon: 'school' },
    { label: 'Learner NPS', value: '58', trend: '+3 pts', icon: 'favorite' }
  ];

  protected readonly throughput: ChartColumn[] = [
    { label: 'Mon', value: 54 },
    { label: 'Tue', value: 67 },
    { label: 'Wed', value: 61 },
    { label: 'Thu', value: 83 },
    { label: 'Fri', value: 75 }
  ];

  private throughputChart: Chart<'bar'> | null = null;

  ngAfterViewInit(): void {
    if (!this.throughputChartRef) {
      return;
    }

    this.throughputChart = new Chart(this.throughputChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.throughput.map((point) => point.label),
        datasets: [
          {
            label: 'Completed items',
            data: this.throughput.map((point) => point.value),
            backgroundColor: 'rgba(51, 92, 255, 0.78)',
            hoverBackgroundColor: 'rgba(29, 78, 216, 0.92)',
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
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            titleColor: '#e2e8f0',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(148, 163, 184, 0.4)',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            suggestedMax: 100,
            grid: {
              color: 'rgba(148, 163, 184, 0.26)'
            }
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.throughputChart?.destroy();
  }
}
