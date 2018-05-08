import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { AirportInfo } from '../model/airport-info';

@Injectable()
export class AirportInfoService {

  constructor(private http: HttpClient) { }

  getInfo(icao: string): Observable<AirportInfo> {

    return this.http.get<AirportInfo[]>('assets/airportInfo.json').pipe(
      map(infos => infos.find(info => info.icao === icao)));

  }

  search(term: string): Observable<AirportInfo[]> {

    return this.http.get<AirportInfo[]>('assets/airportInfo.json').pipe(
      map(infos => infos.filter(info => info.icao === term))
    );
  }

  getInfos(icaos: string[]): Promise<Map<string, AirportInfo>> {

    return this.http.get<AirportInfo[]>('assets/allAirportInfo.json').pipe(
      map(infos => {
        let m = new Map<string, AirportInfo>();

        icaos.forEach(icao => {
          m.set(icao, infos.find(info => info.icao === icao));
        });

        return m;
      })
    ).toPromise();
  }

}
