import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'monapt-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.css']
})
export class PiechartComponent implements OnInit {

  @Input()
  values: number[];

  @Input()
  valueSuffix: string = '';

  @Input()
  labels: string[];

  @Input()
  colors = ['#edf8b1', '#7fcdbb', '#2c7fb8'];

  options = {};
  chartType='doughnut';
  legend=false;

  constructor() { }

  ngOnInit() {
  }

  chartColors() {
    return [{
      backgroundColor: this.colors, 
      hoverBackgroundColor: this.colors
    }];
  }

  caption() {

    const caption = [];
    for (let i=0; i<this.values.length; i++) {

      caption.push({
        label: this.labels[i],
        color: this.colors[i],
        value: '' + this.values[i] + ' ' + this.valueSuffix,
      });
    }

    return caption;
  }


}
