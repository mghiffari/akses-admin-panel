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
import { constants } from 'src/app/shared/common/constants';

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
  featureNames = constants.features;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  allNav = [
    {
      title: 'navMenus.master.title',
      link: '/master',
      children: [
        {
          title: 'navMenus.master.children.banners',
          link: '/banners',
          featureName: this.featureNames.banner
        },
        {
          title: 'navMenus.master.children.articles',
          link: '/articles',
          featureName: this.featureNames.article
        },
        {
          title: 'navMenus.master.children.specialOffers',
          link: '/special-offers',
          featureName: this.featureNames.specialOffer
        },
        {
          title: 'navMenus.master.children.faqs',
          link: '/faqs',
          featureName: this.featureNames.faq
        },
        {
          title: 'navMenus.master.children.branches',
          link: '/branches',
          featureName: this.featureNames.branchLocation
        },
        {
          title: 'navMenus.master.children.changePhonenumberRequests',
          link: '/change-phonenumber-requests',
          featureName: this.featureNames.changePhoneNumber
        }
      ]
    },
    {
      title: 'navMenus.creditSimulation.title',
      link: '/credit-simulation',
      featureName: this.featureNames.creditSimulation,
      children: []
    },
    {
      title: 'navMenus.paymentInstruction.title',
      link: '/payment-instructions',
      featureName: this.featureNames.paymentInstruction
    },
    {
      title: 'navMenus.notification.title',
      link: '/notifications',
      featureName: this.featureNames.notification
    },
    {
      title: 'navMenus.userManagement.title',
      link: '/user-management',
      children: [
        {
          title: 'navMenus.userManagement.children.users',
          link: '/users',
          featureName: this.featureNames.user
        },
        {
          title: 'navMenus.userManagement.children.roles',
          link: '/roles',
          featureName: this.featureNames.role
        }
      ]
    },
    {
      title: 'navMenus.report.title',
      link: '/report',
      children: [
        {
          title: 'navMenus.report.children.transReport',
          link: '/transaction-report',
          featureName: this.featureNames.transactionReport
        },
        {
          title: 'navMenus.report.children.balanceReport',
          link: '/balance-report',
          featureName: this.featureNames.balanceReport
        },
      ]
    },
  ]


  navList = []

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
    this.translateService.get('angularLocale').subscribe(res => {
      this.dateLocale = res;
    });
    if (this.authService.isUserLoggedIn()) {
      this.userName = JSON.parse(this.authService.getUserLogin()).firstname
      this.role = JSON.parse(this.authService.getUserLogin()).group_name
    }
    this.navList = []
    if(this.authService.getViewPrvg(this.featureNames.creditSimulation)){
      this.loading = true;
      let creditSimulationProducts: CSProduct[] = [];
      let prodNavList = []
      this.creditSimulationService.getProductList().subscribe(
        response => {
          try {
            console.table(response)
            creditSimulationProducts = response.data;
            prodNavList = creditSimulationProducts.map(el => {
              return {
                title: el.name,
                link: '/product/' + el.id
              }
            })
            
          } catch (error) {
            console.table(error)
          } 
        }, error => {
          try {
            console.table(error)
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
          } 
        }
      ).add(() => {
        this.loading = false;
        this.showAuthMenus(true, prodNavList)
      })
    } else {
      this.showAuthMenus()
    }
  }

  // show authorized menus only
  showAuthMenus(showCreditSimulation = false, csChildMenus = []){
    console.log('MainNavComponent | showAuthMenus')
    for(let nav of this.allNav){
      let children = []
      let addNav = {
        title: nav.title,
        link: nav.link,
        children: nav.children ? nav.children : null
      }
      if(nav.featureName){
        if(showCreditSimulation && nav.featureName === this.featureNames.creditSimulation){
          addNav.children = csChildMenus
          this.navList.push(addNav)
        } else {
          if(this.authService.getViewPrvg(nav.featureName)){
            this.navList.push(addNav)
          }
        }
      } else {
        if(addNav.children){
          for(let child of addNav.children){
            if(child.featureName && this.authService.getViewPrvg(child.featureName)) {
              let addChild = {
                title: child.title,
                link: child.link,
              }
              children.push(addChild)
            }
          }
          if(children.length > 0){
            addNav.children = children
            this.navList.push(addNav)
          }
        }
      }
    }
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
