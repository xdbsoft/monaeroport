import { Injectable } from '@angular/core';

import { Observable ,  BehaviorSubject } from 'rxjs';


@Injectable()
export class SelectedYearService {

  private selectedYear$: BehaviorSubject<number>;
  private selectedYear: number;

  constructor() { 
    this.selectedYear = 2015;
    this.selectedYear$ = new BehaviorSubject<number>(this.selectedYear);
  }

  getYear(): Observable<number> {
    return this.selectedYear$.asObservable();
  }

  setSelected(year: number) {
    
    this.selectedYear = year;
    
    console.log("Emitting year", year, this.selectedYear);
    this.selectedYear$.next(this.selectedYear);
  }

}
