import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'monapt-card-raw-data',
  templateUrl: './card-raw-data.component.html',
  styleUrls: ['./card-raw-data.component.css']
})
export class CardRawDataComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  labels: string[];

  @Input()
  data: any[][];

  page: number = 1;
  pageSize: number = 10;

  constructor() { }

  ngOnInit() {
  }

}
