import { Component, OnInit, Input } from '@angular/core';
import { AirportInfo } from '../../model/airport-info';
import { AirportInfoService } from '../../services/airport-info.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'monapt-airport-navbar',
  templateUrl: './airport-navbar.component.html',
  styleUrls: ['./airport-navbar.component.css']
})
export class AirportNavbarComponent implements OnInit {

  @Input()
  selectedAirport: AirportInfo;

  constructor(private airportInfoService: AirportInfoService,
              private router: Router, 
              private route: ActivatedRoute) {

  }

  ngOnInit() {
  }

  format(o: any) {
    if ('icao' in o) {
      return o.icao + ' - ' + o.name;
    }
    return '';
  }

  
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term =>
        this.airportInfoService.search(term).pipe(
          catchError(() => {
            return of([]);
          }))
      )
    );

  navigateTo(item) {
    console.log('navigating to: ', item);

    const subpages = ['trafic', 'retards', 'emissions'];
    let activatedSubPage = subpages[0];
    subpages.forEach(element => {
      const r =   this.router.createUrlTree([element], {relativeTo: this.route});
      if (this.router.isActive(r, true)) {
        activatedSubPage = element;
      }
    });    

    this.router.navigate(['/detail', item.icao, activatedSubPage])
  }
}
