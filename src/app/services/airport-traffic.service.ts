import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AirportTraffic } from '../model/airport-traffic';
import { OlapFile } from '../model/olap-file';

@Injectable()
export class AirportTrafficService {

  constructor(private http: HttpClient) { }

  getTraffic(icao: string, year: number): Promise<OlapFile> {

    if (icao.length != 4) {
      return new Promise<OlapFile>( (resolve, reject) => {
        reject("Invalid ICAO code");
      });
    }

    if (year < 1990) {
      return new Promise<OlapFile>( (resolve, reject) => {
        reject("Invalid year");
      });
    }
    return this.http.get<OlapFile>('assets/'+icao+'_'+year+'_traffic.json').toPromise();
  }

}
