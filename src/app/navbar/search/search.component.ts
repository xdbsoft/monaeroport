import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AirportInfoService } from '../../services/airport-info.service';

@Component({
  selector: 'monapt-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchItem: any;

  constructor(private airportInfoService: AirportInfoService,
              private router: Router, 
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(v => {
      this.searchItem = null
    })
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
