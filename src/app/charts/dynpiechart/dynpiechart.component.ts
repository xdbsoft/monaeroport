import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';

import * as olap from 'olap-cube';

@Component({
  selector: 'monapt-dynpiechart',
  templateUrl: './dynpiechart.component.html',
  styleUrls: ['./dynpiechart.component.css']
})
export class DynpiechartComponent implements OnInit, OnChanges {

  @Input()
  cube: olap.model.Table;

  @Input()
  filters: any[] = [];// [[0, 2016]];
  @Input()
  dimForRollup: number = 4;
  @Input()
  fieldForRollup: number = 3;

  rawdata: olap.model.Table;

  data: number[] = [];
  labels: string[] = [];
  legend: any[] = [];
  
  config = {
    chartType: 'doughnut',
    legend: false,
    options: {
    }
  }

  constructor() { }

  ngOnInit() {
  }

  updateGraph() {

    if (this.cube) {

      let c = this.cube;
      this.filters.forEach(filter => {
        c = c.slice(this.cube.dimensions[filter[0]], filter[1]);
      });
      
      this.rawdata = c.rollup(this.cube.dimensions[this.dimForRollup], [this.cube.fields[this.fieldForRollup]], this.sum(this.fieldForRollup), [0] );

      console.log('data regenerated', this.rawdata);

      this.labels = this.rawdata.points.map(v => v[0]);
      this.data = this.rawdata.data.map(v => Math.round(v[0]*100)/100 );
      this.legend = [];
      for (let i=0; i<this.data.length; i++) {
  
        this.legend.push({
          label: this.labels[i],
          color: '#000000',//this.config.colors[0].backgroundColor[i],
          value: '' + this.data[i] + ' ' + this.rawdata.fields[0],
        });
      }

      console.log(this.labels, this.data);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('DynpiechartComponent onChanges', changes);

    if ('cube' in changes || 'dimForRollup' in changes || 'fieldForRollup' in changes) {
      this.updateGraph();
    }
  }
  
  sum = (idx: number) => (aggregation, value) => {

    const count = aggregation[0];
    const newCount = count + value[idx];

    return [newCount];
  }

}
