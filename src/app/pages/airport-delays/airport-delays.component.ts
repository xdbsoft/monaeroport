import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AirportInfo } from '../../model/airport-info';
import { SelectedAirportService } from '../../services/selected-airport.service';

import * as olap from 'olap-cube';

import { AirportDelayService } from '../../services/airport-delay.service';
import { AirportInfoService } from '../../services/airport-info.service';

@Component({
  selector: 'monapt-airport-delays',
  templateUrl: './airport-delays.component.html',
  styleUrls: ['./airport-delays.component.css']
})
export class AirportDelaysComponent implements OnInit {

  year: number = 2016;

  selectedAirport$: Observable<AirportInfo>;
  selectedAirport: AirportInfo;

  labels: string[] = ['Année','Mois','Direction','Escale','Pays','Zone','Faisceau','Nombre de vols','Nombre de passagers','% 15min au départ','% 15min à l\'arrivée','Retard moyen au départ','Retard moyen à l\'arrivée'];
  cube: olap.model.Table;

  evolutionLabels: string[] = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
  evolutionDatasets = [
    {data: [], label: this.year-2},
    {data: [], label: this.year-1},
    {data: [], label: this.year}
  ];
  evolutionDatasetsArr = [
    {data: [], label: this.year-2},
    {data: [], label: this.year-1},
    {data: [], label: this.year}
  ];

  constructor(private selectedAirportService: SelectedAirportService, 
    private airportDelayService: AirportDelayService,
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

    this.airportDelayService.getDelays(icao).then(cube => {

      console.log("Delays retrieved", icao, year, cube.points.length)
      this.cube = cube;

      this.setupEvolution();

    })
    .catch(reason => {
      console.log("getDelays failed", icao, reason)
    });
  }

  aggregate = (idx) => (aggregation, value) => {

    const count = aggregation[0] * aggregation[1]
    const newCount = count + (value[0]*value[idx])
    const newSum = aggregation[0] + value[0]

    let newRate = 0
    if (newSum !== 0) {
      newRate = newCount / newSum
    }

    //console.log('aggregation', aggregation, value, count, newCount, newSum, newRate);

    return [newSum, newRate];
  }

  setupEvolution() {

    const years = [this.year, this.year-1, this.year-2];

    this.evolutionDatasets = [];
    this.evolutionDatasetsArr = [];
    years.forEach(year => {

      const yearlyFiguresDeparture = this.cube
        .slice('year', year)
        .slice('direction', "D")
        .rollup('month', ['flights','delay_mean_dep'], this.aggregate(4), [0,0])
      ;
      console.log('yearCube',year, yearlyFiguresDeparture);
      this.evolutionDatasets.push({
        label: year,
        data: yearlyFiguresDeparture.data.map(v => Math.round(v[1]*100)/100),
      });

      const yearlyFiguresArrival = this.cube
        .slice('year', year)
        .slice('direction', "A")
        .rollup('month', ['flights','delay_mean_arr'], this.aggregate(5), [0,0])
      ;
      console.log('yearCube arr',year, yearlyFiguresArrival);
      this.evolutionDatasetsArr.push({
        label: year,
        data: yearlyFiguresArrival.data.map(v => Math.round(v[1]*100)/100),
      });


    });
  }

  ngOnInit() {
  }

}
