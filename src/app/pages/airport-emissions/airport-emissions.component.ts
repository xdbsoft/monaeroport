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

  selectedAirport$: Observable<AirportInfo>;
  selectedAirport: AirportInfo;

  labels: string[] = ['Année','Mois','Zone','Faisceau','Catégorie','Nombre de mouvements','Nombre de passagers','Nombre de passagers équivalents','CO2 (kt)','NOX (t)','COVNM (t)', 'TSP (t)'];
  cube: olap.model.Table;
  
  evolutionLabels: number[] = []
  evolutionDatasets = [
    {data: [], label: "CO2 (kg/pax eq)", type: 'bar', yAxisID: 'y-axis-0'},
    {data: [], label: "NOX (g/pax eq)", type: 'bar', yAxisID: 'y-axis-0'},
    {data: [], label: "COVNM (g/pax eq)", type: 'bar', yAxisID: 'y-axis-0'},
    {data: [], label: "TSP (g/pax eq)", type: 'bar', yAxisID: 'y-axis-0'},
    {data: [], label: "Mouvements", type: 'line', fill: false, yAxisID: 'y-axis-1'}
  ];

  config = {
    chartType: 'bar',
    legend: true,
    options: {
      scales: {
        yAxes: [{
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-0',
        }, {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-1',

          // grid line settings
          gridLines: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        }],
      }
    }
  }

  constructor(private selectedAirportService: SelectedAirportService, 
    private airportEmissionsService: AirportEmissionsService) { 

    this.evolutionLabels = []
    for (let y = 2000; y < 2019; y++) {
      this.evolutionLabels.push(y);
    }
  
    this.selectedAirport$ = this.selectedAirportService.getInfos();
    
    this.selectedAirport$.subscribe( v => {

      console.log("Selected airport updated", v)

      this.selectedAirport = v;
      this.setupCube(this.selectedAirport.icao);

    });
  }

  ngOnInit() {
  }

  closeAlert() {
    this.alert = null;
  }

  setupCube(icao: string) {
    console.log('setupCube', icao);

    this.airportEmissionsService.getEmissions(icao).then(cube => {

      console.log("Emissions retrieved", icao, cube.points.length)
      this.cube = cube;
      this.alert = null;

      this.setupEvolution();

    })
    .catch(reason => {
      this.alert = {type: 'warning', message: 'Aucune information d\'émission n\'a pu être chargée.'}
      this.cube = null;
      console.log("getEmissions failed", icao, reason)
    });
  }
  

  aggregate = (idxs: number[]) => (aggregation, value) => {


    var newCounts = [];

    for (let i=0; i<idxs.length; i++) {

      const count = aggregation[i]
      const newCount = count + value[idxs[i]]

      newCounts.push(newCount);
    }

    return newCounts;
  }
  
  setupEvolution() {
    if (!this.cube) {
      return;
    }
    console.log('setupEvolution');

    this.evolutionDatasets.forEach(d => {
      d.data = [];
    });

    const yearlyFigures = this.cube
      .rollup('year', ['mov','pax','peq','co2_kt','nox_t','covnm_t','tsp_t'], this.aggregate([0,1,2,3,4,5,6]), [0,0,0,0,0,0,0])
    ;
    console.log('rolledupCube', yearlyFigures);
    
    this.evolutionDatasets[0].data = yearlyFigures.data.map(v => Math.round(v[3]*1000000*100/v[2])/100);
    this.evolutionDatasets[1].data = yearlyFigures.data.map(v => Math.round(v[4]*1000000*100/v[2])/100);
    this.evolutionDatasets[2].data = yearlyFigures.data.map(v => Math.round(v[5]*1000000*100/v[2])/100);
    this.evolutionDatasets[3].data = yearlyFigures.data.map(v => Math.round(v[6]*1000000*100/v[2])/100);
    
    this.evolutionDatasets[4].data = yearlyFigures.data.map(v => v[0]);

    console.log('co2', this.evolutionDatasets[0].data);
  }

}
