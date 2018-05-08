import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { AirportInfoService } from './airport-info.service';
import { AirportInfo } from '../model/airport-info';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SelectedAirportService {

  private selectedAirportInfo$: BehaviorSubject<AirportInfo>;
  private selectedAirport: AirportInfo;

  constructor(private infoService: AirportInfoService) { 
    this.selectedAirport = new AirportInfo();
    this.selectedAirport.icao = 'Please wait';
    this.selectedAirport.name = 'Loading...';
    this.selectedAirportInfo$ = new BehaviorSubject<AirportInfo>(this.selectedAirport);
  }

  getInfos(): Observable<AirportInfo> {
    return this.selectedAirportInfo$.asObservable();
  }

  setSelected(icao: string) {
    this.infoService.getInfo(icao).subscribe(data => {

      console.log('data received from infoService', data);
      this.selectedAirport = data;
      this.selectedAirportInfo$.next(this.selectedAirport);

    }, error => console.log('Loading airport info failed', error));
  }

}
