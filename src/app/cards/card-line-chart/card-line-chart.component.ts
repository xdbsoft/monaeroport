import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'monapt-card-line-chart',
  templateUrl: './card-line-chart.component.html',
  styleUrls: ['./card-line-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardLineChartComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  datasets: any[] = [];

  @Input()
  labels: string[] = [];

  config = {
    chartType: 'bar',
    legend: true,
    options: {
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
