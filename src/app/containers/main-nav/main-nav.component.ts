import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { CreditSimulationService } from 'src/app/shared/services/credit-simulation.service';
import { CSProduct } from 'src/app/shared/models/cs-product';
import { MatSnackBar } from '@angular/material';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {
  userName = "Name";
  role = "Admin";
  dateLocale = 'id';
  loading = false;
  versionNo = environment.version;
  versionDate = environment.versionDate;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  navList = [
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
      children: []
    }
  ]

  //constructor
  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router,
    private translateService: TranslateService,
    private creditSimulationService: CreditSimulationService,
    private snackBar: MatSnackBar) {
    console.log('MainNavComponent | constructor')
  }

  //ngOnInit get logged in user name, date locale, and credit simulation products
  ngOnInit() {
    console.log('MainNavComponent | ngOnInit')
    this.translateService.get('dateLocale').subscribe(res => {
      this.dateLocale = res;
    });
    if (this.authService.isUserLoggedIn()) {
      this.userName = JSON.parse(this.authService.getUserLogin()).firstname
    }
    this.loading = true;
    let creditSimulationProducts: CSProduct[] = [];
    this.creditSimulationService.getProductList().subscribe(
      response => {
        try {
          creditSimulationProducts = response.data;
          const prodNavList = creditSimulationProducts.map(el => {
            return {
              title: el.name,
              link: '/product/' + el.id
            }
          })
          this.navList[1].children = prodNavList;
        } catch (error) {
          console.table(error)
        } finally {
          this.loading = false
        }
      }, error => {
        try {
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'navMenus.creditSimulation.failedGetProducts',
              content: {
                text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                data: null
              }
            }
          })          
        } catch (error) {
          console.table(error)
        } finally {
          this.loading = false
        }
      }
    )
  }

  //logout
  logout() {
    console.log('MainNavComponent | logout')
    this.authService.logout()
    this.router.navigate(['/login'])
  }

  //close navbar when clicking on nav menu
  clickNav(drawer) {
    console.log('MainNavComponent | clickNav')
    this.isHandset$.subscribe(res => {
      if (res === true) {
        drawer.close()
      }
    })
  }

}
