import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import * as olap from 'olap-cube';

@Component({
  selector: 'monapt-radarchart',
  templateUrl: './radarchart.component.html',
  styleUrls: ['./radarchart.component.css']
})
export class RadarchartComponent implements OnInit, OnChanges {

  @Input()
  cube: olap.model.Table;

  config = {
    chartType: 'radar',
    legend: false,
    options: {
    }
  }
  
  datasets: any[] = [];
  labels: string[] = [];

  constructor() { 

    this.labels = ['CO2 (kt)', 'NOX (t)', 'COVNM (t)', 'TSP (t)'];

    this.datasets = [
      {data: [65, 56, 55, 40], label: 'Series A'},
      {data: [28, 96, 27, 100], label: 'Series B'}
    ];
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('RadarchartComponent onChanges', changes);

    if ('cube' in changes || 'dimForRollup' in changes || 'fieldForRollup' in changes) {
      this.updateGraph();
    }
  }

  sum = (indexes) => (aggregation, value) => {

    var newCounts = [...aggregation];

    for (var i=0; i<indexes.length; i++) {
      newCounts[i] = newCounts[i] + value[indexes[i]];
    }

    return newCounts;
  }

  updateGraph() {
    console.log('a');
    if (this.cube) {
      console.log('b');

      this.datasets = [];
      [2015,2016,2017].forEach(year => {
        console.log('c', year, this.cube.fields);

        const d = this.cube.slice('year',year).rollup('year', ['CO2 (kt)', 'NOX (t)', 'COVNM (t)', 'TSP (t)'], this.sum([3,4,5,6]), [0,0,0,0]);

        console.log(year, d.data[0]);

        if (d.data && d.data.length>0) {
          this.datasets.push({
            data: d.data[0],
            label: year
          });
        }

      });

      console.log('datasets', this.datasets);
    }
  }

}
