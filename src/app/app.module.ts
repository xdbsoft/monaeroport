import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { CardMapComponent } from './cards/card-map/card-map.component';
import { RadarchartComponent } from './charts/radarchart/radarchart.component';
import { CardPieChartComponent } from './cards/card-pie-chart/card-pie-chart.component';
import { HomeComponent } from './pages/home/home.component';
import { InfoComponent } from './pages/info/info.component';
import { AirportTrafficComponent } from './pages/airport-traffic/airport-traffic.component';
import { AirportDelaysComponent } from './pages/airport-delays/airport-delays.component';
import { AirportEmissionsComponent } from './pages/airport-emissions/airport-emissions.component';
import { NavbarComponent } from './navbar/navbar/navbar.component';
import { AirportNavbarComponent } from './navbar/airport-navbar/airport-navbar.component';
import { LeafletComponent } from './carto/leaflet/leaflet.component';
import { AirportComponent } from './pages/airport/airport.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AirportInfoService } from './services/airport-info.service';
import { SelectedAirportService } from './services/selected-airport.service';
import { CardRawDataComponent } from './cards/card-raw-data/card-raw-data.component';
import { CardComponent } from './cards/card/card.component';
import { AirportTrafficService } from './services/airport-traffic.service';
import { CardLineChartComponent } from './cards/card-line-chart/card-line-chart.component';
import { AirportDelayService } from './services/airport-delay.service';
import { SearchComponent } from './navbar/search/search.component';
import { SelectedYearService } from './services/selected-year.service';
import { AirportEmissionsService } from './services/airport-emissions.service';
import { DynpiechartComponent } from './charts/dynpiechart/dynpiechart.component';


@NgModule({
  declarations: [
    AppComponent,
    CardMapComponent,
    RadarchartComponent,
    CardPieChartComponent,
    HomeComponent,
    InfoComponent,
    AirportTrafficComponent,
    AirportDelaysComponent,
    AirportEmissionsComponent,
    NavbarComponent,
    AirportNavbarComponent,
    LeafletComponent,
    AirportComponent,
    NotFoundComponent,
    CardRawDataComponent,
    CardComponent,
    CardLineChartComponent,
    SearchComponent,
    DynpiechartComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    ChartsModule
  ],
  providers: [
    AirportInfoService, 
    AirportTrafficService,
    AirportDelayService,
    AirportEmissionsService,
    SelectedAirportService,
    SelectedYearService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
