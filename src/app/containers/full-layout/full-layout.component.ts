import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: []
})
export class FullLayoutComponent implements OnInit {

  constructor() { 
    console.log('FullLayoutComponent | constructor')
  }

  ngOnInit() {
    console.log('FullLayoutComponent | ngOnInit')
  }

}
