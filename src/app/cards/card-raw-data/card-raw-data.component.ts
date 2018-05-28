import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';

import * as olap from 'olap-cube';

@Component({
  selector: 'monapt-card-raw-data',
  templateUrl: './card-raw-data.component.html',
  styleUrls: ['./card-raw-data.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardRawDataComponent implements OnInit, OnChanges {

  @Input()
  title: string;

  @Input()
  labels: string[];

  @Input()
  data: olap.model.Table;
  rows: any[][] = [];

  page: number = 1;
  pageSize: number = 10;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("CardRawDataComponent change", changes, this.data);
    if (this.data) {
      this.rows = this.data.rows;
    }
  }

}
