import { Component, OnInit, Input } from '@angular/core';
import { AirportInfo } from '../../model/airport-info';

@Component({
  selector: 'monapt-airport-navbar',
  templateUrl: './airport-navbar.component.html',
  styleUrls: ['./airport-navbar.component.css']
})
export class AirportNavbarComponent implements OnInit {

  @Input()
  selectedAirport: AirportInfo;

  constructor() { }

  ngOnInit() {
  }

}
