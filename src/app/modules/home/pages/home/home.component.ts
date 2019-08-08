import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  locale = 'id';
  userData = {};
  navigationButtons = [{
    title: 'bannerListScreen.createBanner',
    link: '/master/banners/create'
   }, {
    title: 'articleListScreen.createArticle',
    link: '/master/articles/create'
   }, {
    title:  'specialOfferListScreen.createOffer',
    link: '/master/special-offers/create'
  }, {
    title:  'faqListScreen.createFAQ',
    link: '/master/faqs/create'
  }, {
    title:  'branchListScreen.createBranch',
    link: '/master/branches/create'
  }, {
    title:  'paymentInstructionScreen.createInstruction',
    link: '/payment-instructions'
  }, {
    title:  'notificationListScreen.createNotification',
    link: '/notifications/create'
  }, {
    title: 'userListScreen.createUser',
    link: '/user-management/users'
   }, {
    title:  'roleListScreen.createRole',
    link: '/user-management/roles'
  }];

  //constructor
  constructor(
    private translateService: TranslateService,    
    private authService: AuthService,
  ) {
    console.log('HomeComponent | constructor');
  }

  //on init
  ngOnInit() {
    console.log('HomeComponent | ngOnInit');
    this.translateService.get('angularLocale').subscribe(res => {
      this.locale = res;
    });
    if (this.authService.isUserLoggedIn()) {
      this.userData = JSON.parse(this.authService.getUserLogin());
    }
  }

}
