import { Component, OnInit } from '@angular/core';
import { AirportInfoService } from '../../services/airport-info.service';
import { AirportInfo } from '../../model/airport-info';

@Component({
  selector: 'monapt-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  center = {
    pos : {
      lat: 45.1,
      lon: 2.1,
    }
  };

  features = [];

  constructor(private airportInfoService : AirportInfoService) { }

  ngOnInit() {
    this.airportInfoService.getAllInfo().subscribe(infos => {

      this.features=[];
      infos.forEach(info => {

        if (info.pos && info.pos.lat && info.pos.lon)
        {
          const f = this.getGeoJSONFeature(info, '#0000ff');
          this.features.push(f);
        }

      });
    })
  }
  
  color(a: AirportInfo): string {
    if (a.range == 'CC') {
      return '#38ada9';
    } else if (a.range == 'MC') {
      return '#1e3799';
    } else if (a.range == 'LC') {
      return '#fa983a';
    }
    return '#000000';
  }

  getGeoJSONFeature(a: AirportInfo, color: string): any {

    if (!color) {
      color = this.color(a);
    }

    return {
      type: 'Feature',
      properties: {
          title: a.icao,
          content: a.name,
          link: 'detail/'+a.icao+'/trafic',
          color: color,
      },
      geometry: {
          type: "Point",
          coordinates: [a.pos.lon, a.pos.lat]
      }
    };
  }

}
