import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'monapt-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  iconClasses: string = "fas fa-plane";

  @Input()
  bodyStyle: any;
  
  constructor() { }

  ngOnInit() {
  }

}
