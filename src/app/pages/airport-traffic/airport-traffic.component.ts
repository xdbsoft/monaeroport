import { Component, OnInit, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { AirportInfo } from '../../model/airport-info';
import { SelectedAirportService } from '../../services/selected-airport.service';

import * as olap from 'olap-cube';
import { AirportTrafficService } from '../../services/airport-traffic.service';
import { AirportInfoService } from '../../services/airport-info.service';
import { SelectedYearService } from '../../services/selected-year.service';

@Component({
  selector: 'monapt-airport-traffic',
  templateUrl: './airport-traffic.component.html',
  styleUrls: ['./airport-traffic.component.css']
})
export class AirportTrafficComponent implements OnInit {

  selectedYear$: Observable<number>;
  year: number = 2016;

  zoneM: boolean = true;
  zoneO: boolean = true;
  zoneI: boolean = true;
  
  selectedAirport$: Observable<AirportInfo>;
  selectedAirport: AirportInfo;

  labels: string[] = ['Année','Mois','Direction','Escale','Pays','Zone','Faisceau','Nombre de vols','Nombre de passagers'];
  
  cube: olap.model.Table;
  slicedCube: olap.model.Table;
  
  keyFiguresLabels: string[] = ['Court courriers','Moyen courriers','Long courriers'];
  keyFiguresValues: number[] = [];

  evolutionLabels: string[] = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
  evolutionDatasets = [
    {data: [], label: this.year-2},
    {data: [], label: this.year-1},
    {data: [], label: this.year}
  ];

  mapFeatures: any[] = [];

  constructor(private selectedAirportService: SelectedAirportService, 
              private selectedYearService: SelectedYearService, 
              private airportTrafficService: AirportTrafficService,
              private airportInfoService: AirportInfoService) {
    this.selectedAirport$ = this.selectedAirportService.getInfos();
    this.selectedYear$ = this.selectedYearService.getYear();

    this.selectedAirport$.subscribe( v => {

      console.log("Selected airport updated", v)
      
      this.selectedAirport = v;
      this.setupCube(this.selectedAirport.icao);

    });

    this.selectedYear$.subscribe( v => {

      console.log("Selected year updated", v)
      
      this.year = v;

      this.setupSlicedCube();
    });

    this.cube = new olap.model.Table({
      dimensions: [],
      fields: [],
    });
    this.slicedCube = new olap.model.Table({
      dimensions: [],
      fields: [],
    });
  }

  getYearCube(year: number): olap.model.Table {
    let c = this.cube.slice('year', year);
    if (!this.zoneM || !this.zoneO || !this.zoneI) {
      c = c.dice( (pt) => {
        if(pt[5] == "M") {
          return this.zoneM;
        }
        if(pt[5] == "O") {
          return this.zoneO;
        }
        if(pt[5] == "I") {
          return this.zoneI;
        }
      });
    }
    return c;
  }

  setupSlicedCube() {
    if (this.cube) {
        
      this.slicedCube = this.getYearCube(this.year);
      
      this.setupMap();
      console.log('setupMap done');
      this.setupKeyFigures();
      console.log('setupKeyFigures done');
      this.setupEvolution();
      console.log('setupEvolution done');

    }
  }

  setupCube(icao: string) {

    this.airportTrafficService.getTraffic(icao).then(cube => {

      console.log("Traffic retrieved", icao, this.year, cube.points.length)
      this.cube = cube;
      console.log(this.cube);

      this.setupSlicedCube();
    })
    .catch(reason => {
      console.log("getTraffic failed", icao, reason)
    });
  }

  setupKeyFigures() {
    if (!this.cube) {
      return;
    }

    const keyFigures = this.slicedCube
      .rollup('dest_range', ['flights'], (sum, value) => [sum[0]+value[0]], [0])
    ;

    this.keyFiguresValues = [0,0,0];
    keyFigures.rows.forEach(element => {
      if (element[0] == "CC") {
        this.keyFiguresValues[0] += element[1];
      } else if (element[0] == "MC") {
        this.keyFiguresValues[1] += element[1];
      } else {
        this.keyFiguresValues[2] += element[1];

      }
    });

    console.log('keyFigures', this.year, keyFigures);
  }

  setupEvolution() {
    if (!this.cube) {
      return;
    }

    const years = [this.year-2, this.year-1, this.year];

    this.evolutionDatasets = [];

    years.forEach(year => {
  
      let cube = this.slicedCube;
      if (year !== this.year) {
        cube = this.getYearCube(year);
      }

      const yearlyFigures = cube.rollup('month', ['flights'], (sum, value) => [sum[0]+value[0]], [0]);

      console.log('yearCube',year, yearlyFigures);

      this.evolutionDatasets.push({
        label: year,
        data: yearlyFigures.data.map(v => v[0]),
      });
      
    });
  }

  color(a: AirportInfo): string {
    if (a) {
      if (a.range == 'CC') {
        return '#38ada9';
      } else if (a.range == 'MC') {
        return '#1e3799';
      } else if (a.range == 'LC') {
        return '#fa983a';
      }
    }
    return '#000000';
  }

  getGeoJSONFeature(a: AirportInfo, color: string): any {

    if (!a) {
      return undefined;
    }

    if (!color) {
      color = this.color(a);
    }

    return {
      type: 'Feature',
      properties: {
          title: a.icao,
          content: a.name,
          color: color,
      },
      geometry: {
          type: "Point",
          coordinates: [a.pos.lon, a.pos.lat]
      }
    };
  }

  setupMap() {
    if (!this.cube) {
      return;
    }

    const destinations = this.slicedCube.rollup('dest_icao', ['flights'], (sum, value) => [sum[0]+value[0]], [0]).rows;
    const total = destinations.reduce((s, v) => s + v[1], 0);
    console.log('destinations', this.year, total, destinations);

    const icaos = destinations.map(v => v[0]);
    

    this.airportInfoService.getInfos(icaos).then( dest => {

      this.mapFeatures = [];
      const selectedAirport = this.getGeoJSONFeature(this.selectedAirport, '#0000ff');
      if (selectedAirport) {
        
        this.mapFeatures.push(selectedAirport);

        destinations.forEach(element => {
          const destAirportInfo = dest.get(element[0]);
          //console.log('Dest: ', element[0], destAirportInfo);
          const destAirport = this.getGeoJSONFeature(destAirportInfo, undefined);
          if (destAirport) {
            this.mapFeatures.push(destAirport);

            let line = {
                type: "Feature",
                properties: {
                    title: selectedAirport.properties.title + ' - ' + destAirport.properties.title,
                    content: '' + element[1] + ' vols en ' + this.year,
                    color: destAirport.properties.color,
                    weight: Math.floor(15*element[1]/(total+1))
                },
                geometry: {
                type: "LineString",
                coordinates: [selectedAirport.geometry.coordinates, destAirport.geometry.coordinates]
              }
            };
            this.mapFeatures.push(line);
          }

        });
      }
    });
  }

  ngOnInit() {
  }

  getChartSuffix() {
    return 'vols en ' + this.year;
  }

  decrementYear() {
    this.year = this.year - 1;
    this.selectedYearService.setSelected(this.year);
  }

  incrementYear() {
    this.year = this.year + 1;
    this.selectedYearService.setSelected(this.year);
  }

  selectedZoneChange() {
    console.log('Zone selection updated', this.zoneM, this.zoneI, this.zoneO);

    this.setupSlicedCube();
  }

}
