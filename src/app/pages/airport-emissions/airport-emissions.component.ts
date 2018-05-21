import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AirportInfo } from '../../model/airport-info';

import * as olap from 'olap-cube';
import { AirportEmissionsService } from '../../services/airport-emissions.service';
import { SelectedAirportService } from '../../services/selected-airport.service';
import { SelectedYearService } from '../../services/selected-year.service';

export interface IAlert {
  type: string;
  message: string;
}

@Component({
  selector: 'monapt-airport-emissions',
  templateUrl: './airport-emissions.component.html',
  styleUrls: ['./airport-emissions.component.css']
})
export class AirportEmissionsComponent implements OnInit {

  alert: IAlert;

  selectedYear$: Observable<number>;
  year: number = 2016;

  selectedAirport$: Observable<AirportInfo>;
  selectedAirport: AirportInfo;

  labels: string[] = ['Année','Mois','Zone','Faisceau','Catégorie','Nombre de mouvements','Nombre de passagers','Nombre de passagers équivalents','CO2 (kt)','NOX (t)','COVNM (t)', 'TSP (t)'];
  cube: olap.model.Table;

  evolutionLabels: string[] = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  evolCo2Datasets = [
    {data: [], label: this.year-2},
    {data: [], label: this.year-1},
    {data: [], label: this.year}
  ];
  evolNoxDatasets = [
    {data: [], label: this.year-2},
    {data: [], label: this.year-1},
    {data: [], label: this.year}
  ];
  evolCovnmDatasets = [
    {data: [], label: this.year-2},
    {data: [], label: this.year-1},
    {data: [], label: this.year}
  ];
  evolTspDatasets = [
    {data: [], label: this.year-2},
    {data: [], label: this.year-1},
    {data: [], label: this.year}
  ];

  constructor(private selectedAirportService: SelectedAirportService, private selectedYearService: SelectedYearService, 
    private airportEmissionsService: AirportEmissionsService) { 

  
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
      this.setupEvolution();

    });
  }

  ngOnInit() {
  }

  closeAlert() {
    this.alert = null;
  }

  setupCube(icao: string) {

    this.airportEmissionsService.getEmissions(icao).then(cube => {

      console.log("Emissions retrieved", icao, cube.points.length)
      this.cube = cube;
      this.alert = null;

      this.setupEvolution();

    })
    .catch(reason => {
      this.alert = {type: 'warning', message: 'Aucune information d\'émission n\'a pu être chargée.'}
      this.cube = null
      console.log("getEmissions failed", icao, reason)
    });
  }
  

  aggregate = (idxs: number[]) => (aggregation, value) => {


    var newCounts = [];

    for (let i=0; i<idxs.length; i++) {

      const count = aggregation[0]
      const newCount = count + value[idxs[i]]

      newCounts.push(newCount);
    }

    return newCounts;
  }
  
  setupEvolution() {
    if (!this.cube || !this.year) {
      return;
    }

    const years = [this.year-2, this.year-1, this.year];

    this.evolCo2Datasets = [];
    this.evolNoxDatasets = [];
    this.evolCovnmDatasets = [];
    this.evolTspDatasets = [];

    years.forEach(year => {

      const yearlyFigures = this.cube
        .slice('year', year)
        .rollup('month', ['co2_kt','nox_t','covnm_t','tsp_t'], this.aggregate([3,4,5,6]), [0,0,0,0])
      ;
      console.log('yearCube',year, yearlyFigures);
      this.evolCo2Datasets.push({
        label: year,
        data: yearlyFigures.data.map(v => Math.round(v[0]*100)/100),
      });
      this.evolNoxDatasets.push({
        label: year,
        data: yearlyFigures.data.map(v => Math.round(v[1]*100)/100),
      });
      this.evolCovnmDatasets.push({
        label: year,
        data: yearlyFigures.data.map(v => Math.round(v[2]*100)/100),
      });
      this.evolTspDatasets.push({
        label: year,
        data: yearlyFigures.data.map(v => Math.round(v[3]*100)/100),
      });

    });
  }

}
