import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AirportInfo } from '../../model/airport-info';
import { SelectedAirportService } from '../../services/selected-airport.service';

import * as olap from 'olap-cube';
import { OlapFile } from '../../model/olap-file';
import { AirportTrafficService } from '../../services/airport-traffic.service';
import { AirportInfoService } from '../../services/airport-info.service';

@Component({
  selector: 'monapt-airport-traffic',
  templateUrl: './airport-traffic.component.html',
  styleUrls: ['./airport-traffic.component.css']
})
export class AirportTrafficComponent implements OnInit {

  year: number = 2016;

  selectedAirport$: Observable<AirportInfo>;
  selectedAirport: AirportInfo;
  airporTrafficCube: OlapFile;

  labels: string[] = ['Année','Mois','Direction','Escale','Pays','Zone','Faisceau','Nombre de vols','Nombre de passagers'];
  
  cube: olap.model.Table;
  
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
              private airportTrafficService: AirportTrafficService,
              private airportInfoService: AirportInfoService) {
    this.selectedAirport$ = this.selectedAirportService.getInfos();

    this.selectedAirport$.subscribe( v => {

      console.log("Selected airport updated", v)
      
      this.selectedAirport = v;
      this.setupCube(this.selectedAirport.icao, this.year);

    });

    this.cube = new olap.model.Table({
      dimensions: [],
      fields: [],
    });
  }

  setupCube(icao: string, year: number) {

    this.airportTrafficService.getTraffic(icao, year).then(olapFile => {

      console.log("Traffic retrieved", icao, year, olapFile.table.rows.length)

      this.cube = new olap.model.Table(olapFile.cube);
      
      this.cube = this.cube.addRows(olapFile.table);

      console.log(this.cube);

      this.setupMap();
      this.setupKeyFigures();
      this.setupEvolution();

    })
    .catch(reason => {
      console.log("getTraffic failed", icao, reason)
    });
  }

  setupKeyFigures() {
    const keyFigures = this.cube
      .slice('year', this.year)
      .rollup('range', ['flights'], (sum, value) => [sum[0]+value[0]], [0])
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

    const yearlyFigures = this.cube
      .slice('year', this.year)
      .rollup('month', ['flights'], (sum, value) => [sum[0]+value[0]], [0])
    ;
    console.log('yearCube',this.year, yearlyFigures);

    const copy = [...this.evolutionDatasets];
    this.evolutionDatasets = [];
    copy.forEach(c => {
      if (c.label === this.year) {
        this.evolutionDatasets.push({
          label: this.year,
          data: yearlyFigures.data.map(v => v[0]),
        });
      } else {
        this.evolutionDatasets.push(c);
      }
    });


    const years = [this.year-1, this.year-2];

    years.forEach(year => {

      this.airportTrafficService.getTraffic(this.selectedAirport.icao, year).then(olapFile => {

        console.log("Traffic retrieved", this.selectedAirport.icao, year, olapFile.table.rows.length)
  
        const cubeDef = new olap.model.Table(olapFile.cube);
        const yearCube = cubeDef.addRows(olapFile.table);
  
        const yearlyFigures = yearCube
          .slice('year', year)
          .rollup('month', ['flights'], (sum, value) => [sum[0]+value[0]], [0])
        ;

        console.log('yearCube',year, yearCube, yearlyFigures);


        const copy = [...this.evolutionDatasets];
        this.evolutionDatasets = [];
        copy.forEach(c => {
          if (c.label === year) {
            this.evolutionDatasets.push({
              label: year,
              data: yearlyFigures.data.map(v => v[0]),
            });
          } else {
            this.evolutionDatasets.push(c);
          }
        });  
      })
      .catch(reason => {
        console.log("getTraffic failed", this.selectedAirport.icao, reason)
      });

    });

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
          color: color,
      },
      geometry: {
          type: "Point",
          coordinates: [a.pos.lon, a.pos.lat]
      }
    };
  }

  setupMap() {

    const destinations = this.cube.slice('year', this.year).rollup('icao', ['flights'], (sum, value) => [sum[0]+value[0]], [0]).rows;
    const total = destinations.reduce((s, v) => s + v[1], 0);
    console.log('destinations', this.year, total, destinations);

    const icaos = destinations.map(v => v[0]);
    

    this.airportInfoService.getInfos(icaos).then( dest => {

      this.mapFeatures = [];
      const selectedAirport = this.getGeoJSONFeature(this.selectedAirport, '#0000ff');
      this.mapFeatures.push(selectedAirport);

      destinations.forEach(element => {
        const destAirportInfo = dest.get(element[0]);
        //console.log('Dest: ', element[0], destAirportInfo);
        const destAirport = this.getGeoJSONFeature(destAirportInfo, undefined);
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

      });
    });
    
  
    


  }

  ngOnInit() {
  }

}
