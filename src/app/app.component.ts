import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators'
import { TranslateService } from '@ngx-translate/core';
import * as numeral from 'numeral';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  title = 'Admin Panel Akses Adira';
  showNavbar = false;

  constructor(private router: Router,
    private titleService: Title,
    private route: ActivatedRoute,
    private translationService: TranslateService) {
    translationService.setDefaultLang('id');
    translationService.use('id');
  }

  ngOnInit() {
    numeral.register('locale', 'id', {
      delimiters: {
        thousands: '.',
        decimal: ','
      },
      abbreviations: {
        thousand: 'rb',
        million: 'jt',
        billion: 'm',
        trillion: 't'
      },
      ordinal: function (number) {
        return number === 1 ? '' : '';
      },
      currency: {
        symbol: 'Rp'
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        };

        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data),
    ).subscribe((event) => this.titleService.setTitle(event['title']));


  }
}
