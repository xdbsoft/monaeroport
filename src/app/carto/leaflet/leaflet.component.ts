import { Component, OnInit, Input, ElementRef, NgZone, SimpleChanges, OnChanges } from '@angular/core';

import * as L  from 'leaflet';
import { AirportInfo } from '../../model/airport-info';
import { Feature } from 'geojson';

@Component({
  selector: 'monapt-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.css']
})
export class LeafletComponent implements OnInit, OnChanges {

  @Input()
  center: AirportInfo;

  @Input()
  features: Feature[];

  map: L.Map;
  geojsonLayer: L.GeoJSON;

  constructor(private zone: NgZone, private e: ElementRef) {}

  ngOnInit() {

    console.log('Creating map', this.e.nativeElement.firstElementChild);

    this.zone.runOutsideAngular(() => {
      this.map = L.map(this.e.nativeElement.firstElementChild);
    });

    console.log('map', this.map);

    L.tileLayer('http://localhost:8085/tiles/{z}/{x}/{-y}.png', {
      maxZoom: 18,
      attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    console.log('Tile layer added');

    this.geojsonLayer = L.geoJSON(undefined, {
      style: function(feature) {
          let c = '#ffffff';
          let w = 1;
          if (feature.properties.color) {
            c = feature.properties.color;
          }
          if (feature.properties.weight) {
            w = feature.properties.weight;
          }
          return {color: c, weight: w};
      },
      pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 7, fillOpacity: 0.25});
      },
      onEachFeature: function (feature, layer) {

        layer.bindPopup((a: any) => {
          const f = a.feature;
          return `<h5>${f.properties.title}</h5>
                  <p>${f.properties.content}</p>`;

        });
        //TODO: see https://github.com/ng-bootstrap/ng-bootstrap/blob/master/src/popover/popover.ts
      }
    }).addTo(this.map);


    console.log('Center at init', this.center);
    if (this.center && this.center.pos) {
      setTimeout(() => {
        this.setCenter(5);
      },0);
    }

    console.log('Features at init', this.features);
    this.setFeatures();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (this.map) {

      if ('center' in changes) {
        console.log('changes',changes.center.currentValue, this.center);
        this.setCenter(5);
      }

      if ('features' in changes) {
        console.log('changes',changes.features.currentValue, this.features);
        this.setFeatures();
      }
    }
  }

  setFeatures() {
    if (this.map && this.geojsonLayer && this.features) {
      this.geojsonLayer.clearLayers();

      this.features.forEach(f => {
        this.geojsonLayer.addData(f);
      })
    }
  }

  setCenter(level) {
    if (this.map && this.center && this.center.pos)
    {
      this.map.setView(this.center.pos, level);
    }
  }
}
