import { Component, OnInit, Input } from '@angular/core';
import { AirportInfo } from '../../model/airport-info';
import { AirportInfoService } from '../../services/airport-info.service';
import { Router } from '@angular/router';


@Component({
  selector: 'monapt-airport-navbar',
  templateUrl: './airport-navbar.component.html',
  styleUrls: ['./airport-navbar.component.css']
})
export class AirportNavbarComponent implements OnInit {

  searchItem: any;

  @Input()
  selectedAirport: AirportInfo;

  constructor(private airportInfoService: AirportInfoService,
              private router: Router) {

  }

  ngOnInit() {
  }

  navigate() {
    this.router.navigate(['/detail', this.searchItem, 'trafic'])
    this.searchItem = '';
  }
}
