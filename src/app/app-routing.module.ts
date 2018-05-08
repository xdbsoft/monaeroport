import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AirportTrafficComponent } from './pages/airport-traffic/airport-traffic.component';
import { AirportDelaysComponent } from './pages/airport-delays/airport-delays.component';
import { AirportEmissionsComponent } from './pages/airport-emissions/airport-emissions.component';
import { AirportComponent } from './pages/airport/airport.component';
import { HomeComponent } from './pages/home/home.component';
import { InfoComponent } from './pages/info/info.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  { 
    path: 'detail/:icao',
    component: AirportComponent,
    children: [
      { path: 'trafic', component: AirportTrafficComponent },
      { path: 'retards', component: AirportDelaysComponent },
      { path: 'emissions', component: AirportEmissionsComponent },
    ]
  },
  { path: 'apercu', component: HomeComponent },
  { path: 'info', component: InfoComponent },
  { path: '', redirectTo: '/detail/LFMN/trafic', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
