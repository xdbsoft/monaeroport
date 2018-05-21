import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AirportInfo } from '../../model/airport-info';
import { AirportInfoService } from '../../services/airport-info.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'monapt-airport-navbar',
  templateUrl: './airport-navbar.component.html',
  styleUrls: ['./airport-navbar.component.css']
})
export class AirportNavbarComponent implements OnInit {

  @Input()
  selectedAirport: AirportInfo;

  @Input()
  selectedYear: number;

  @Output()
  yearChange: EventEmitter<number>;

  constructor() {
    this.yearChange = new EventEmitter<number>();
  }

  ngOnInit() {
  }

  decrementYear() {
    this.selectedYear = this.selectedYear - 1;
    this.yearChange.emit(this.selectedYear);
  }

  incrementYear() {
    this.selectedYear = this.selectedYear + 1;
    this.yearChange.emit(this.selectedYear);
  }

}
