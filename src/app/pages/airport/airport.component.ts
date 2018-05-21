import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { AirportInfo } from '../../model/airport-info';
import { SelectedAirportService } from '../../services/selected-airport.service';
import { SelectedYearService } from '../../services/selected-year.service';

@Component({
  selector: 'monapt-airport',
  templateUrl: './airport.component.html',
  styleUrls: ['./airport.component.css']
})
export class AirportComponent implements OnInit {

  selectedAirport$: Observable<AirportInfo>;
  selectedYear$: Observable<number>;

  constructor(private selectedAirportService: SelectedAirportService,
              private selectedYearService: SelectedYearService,
              private activatedRoute: ActivatedRoute) {
    this.selectedAirport$ = this.selectedAirportService.getInfos();
    this.selectedYear$ = this.selectedYearService.getYear();
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      console.log('activatedRoute', params);
      this.selectedAirportService.setSelected(params.get('icao'));
    });
  }

  onYearChange(newYear) {
    console.log("onYearChange", newYear)
    this.selectedYearService.setSelected(newYear);
  }

}
;