import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { AirportInfo } from '../../model/airport-info';

@Component({
  selector: 'monapt-card-map',
  templateUrl: './card-map.component.html',
  styleUrls: ['./card-map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardMapComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  selectedAirport: AirportInfo;

  @Input()
  features: any[] = [];

  constructor() { }

  ngOnInit() {
  }

}
