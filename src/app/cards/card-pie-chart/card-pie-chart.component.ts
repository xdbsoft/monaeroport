import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'monapt-card-pie-chart',
  templateUrl: './card-pie-chart.component.html',
  styleUrls: ['./card-pie-chart.component.css']
})
export class CardPieChartComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  data: number[] = [];

  @Input()
  labels: string[] = [];

  @Input()
  suffix: string;

  constructor() { }

  ngOnInit() {
  }


  config = {
    colors: [{
      backgroundColor: ["#38ada9", "#1e3799", "#fa983a"], 
      hoverBackgroundColor: ["#38ada9", "#1e3799", "#fa983a"]
    }],
    chartType: 'doughnut',
    legend: false,
    options: {
    }
  }

  legend() {

    const caption = [];
    for (let i=0; i<this.data.length; i++) {

      caption.push({
        label: this.labels[i],
        color: this.config.colors[0].backgroundColor[i],
        value: '' + this.data[i] + ' ' + this.suffix,
      });
    }

    return caption;
  }

}
