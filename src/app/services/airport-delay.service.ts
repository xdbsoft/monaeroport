import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AirportDelay } from '../model/airport-delay';

import * as olap from 'olap-cube';

@Injectable()
export class AirportDelayService {

  constructor(private http: HttpClient) { }

  getDelays(icao: string): Promise<olap.model.Table> {

    if (icao.length != 4) {
      return new Promise<olap.model.Table>( (resolve, reject) => {
        reject("Invalid ICAO code");
      });
    }

    return this.http.get<any>('assets/'+icao+'_cube_links_delays.json').toPromise().then(v => new olap.model.Table(v));;
  }

}
