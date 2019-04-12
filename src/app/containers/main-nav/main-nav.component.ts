import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {
  userName = "Name";
  role = "Admin";
  dateLocale = 'id';
  versionNo = environment.version;
  versionDate = environment.versionDate;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  navList = [];

  //constructor
  constructor(
    private breakpointObserver: BreakpointObserver, 
    private authService: AuthService, 
    private router: Router,
    private translateService: TranslateService) {
      console.log('MainNavComponent | constructor')
  }

  //ngOnInit get logged in user name and date locale
  ngOnInit(){
    console.log('MainNavComponent | ngOnInit')
    this.translateService.get('dateLocale').subscribe(res => {
      this.dateLocale = res;
    });
    if(this.authService.isUserLoggedIn()) {
      this.userName = JSON.parse(this.authService.getUserLogin()).firstname
    }

    setTimeout(() => {
      const creditSimulationProducts = [
        { 
          id: 'prod0001',
          name: 'New Car'
        },
        { 
          id: 'prod0002',
          name: 'Used Car'
        },
        { 
          id: 'prod0003',
          name: 'New Motorcycle'
        },
        { 
          id: 'prod0004',
          name: 'Used Motorcycle'
        },
        { 
          id: 'prod0005',
          name: 'MPL (Car)'
        },
        { 
          id: 'prod0006',
          name: 'MPL (Motorcycle)'
        },
        { 
          id: 'prod0007',
          name: 'Gadgets'
        },
        { 
          id: 'prod0008',
          name: 'Electronic'
        },
        { 
          id: 'prod0009',
          name: 'Furniture'
        }
      ]
      const prodNavList = creditSimulationProducts.map(el => {
        return {
          title: el.name,
          link: '/product/' + el.id
        }
      })
      this.navList = [
        {
          title: 'navMenus.master.title',
          link: '/master',
          children: [
            {
              title: 'navMenus.master.children.users',
              link: '/users'
            },
            {
              title: 'navMenus.master.children.banners',
              link: '/banners'
            },
            {
              title: 'navMenus.master.children.articles',
              link: '/articles'
            },
            {
              title: 'navMenus.master.children.faqs',
              link: '/faqs'
            },
            {
              title: 'navMenus.master.children.branches',
              link: '/branches'
            },
            {
              title: 'navMenus.master.children.changePhonenumberRequests',
              link: '/change-phonenumber-requests'
            }
          ]
        },
        {
          title: 'navMenus.creditSimulation.title',
          link: '/credit-simulation',
          children: prodNavList
        }
      ]
    },3000)
  }

  //logout
  logout(){
    console.log('MainNavComponent | logout')
    this.authService.logout()
    this.router.navigate(['/login'])
  }

  //close navbar when clicking on nav menu
  clickNav(drawer){
    console.log('MainNavComponent | clickNav')
    this.isHandset$.subscribe(res => {
      if(res === true){
        drawer.close()
      }
    })
  }

}
