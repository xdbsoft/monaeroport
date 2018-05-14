import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { AirportInfo } from '../model/airport-info';

@Injectable()
export class AirportInfoService {

  constructor(private http: HttpClient) { }

  getInfo(icao: string): Observable<AirportInfo> {

    return this.http.get<AirportInfo[]>('assets/airportInfo.json').pipe(
      map(infos => infos.find(info => info.icao === icao)));

  }
  
  getAllInfo(): Observable<AirportInfo[]> {
    return this.http.get<AirportInfo[]>('assets/airportInfo.json');
  }

  search(term: string): Observable<AirportInfo[]> {

    term = term.toLowerCase().trim();
    if (term.indexOf("-") >= 0) {
      term = term.substr(0, term.indexOf("-"))
    }

    if (term.length == 0) {
      return of([]);
    }

    return this.http.get<AirportInfo[]>('assets/airportInfo.json').pipe(
      map(infos => {
        return infos.filter(info => {
          const icaoMatch = info.icao.toLowerCase().startsWith(term)
          const nameMatch = info.name.toLowerCase().indexOf(term) >= 0;
          return icaoMatch || nameMatch;
        } ).slice(0, 10)
      })
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
