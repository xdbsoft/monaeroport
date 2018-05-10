import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AirportTraffic } from '../model/airport-traffic';

import * as olap from 'olap-cube';

@Injectable()
export class AirportTrafficService {

  constructor(private http: HttpClient) { }

  getTraffic(icao: string): Promise<olap.model.Table> {

    if (icao.length != 4) {
      return new Promise<olap.model.Table>( (resolve, reject) => {
        reject("Invalid ICAO code");
      });
    }

    return this.http.get<any>('assets/'+icao+'_cube_links_traffic.json').toPromise().then(v => new olap.model.Table(v));
  }

}
