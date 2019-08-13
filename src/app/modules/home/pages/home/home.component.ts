import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { constants } from 'src/app/shared/common/constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  locale = 'id';
  userData = {};
  featureNames = constants.features;
  allButtons = [{
    title: 'bannerListScreen.createBanner',
    link: '/master/banners/create',
    featureName: this.featureNames.banner
   }, {
    title: 'articleListScreen.createArticle',
    link: '/master/articles/create',
    featureName: this.featureNames.article
   }, {
    title:  'specialOfferListScreen.createOffer',
    link: '/master/special-offers/create',
    featureName: this.featureNames.specialOffer
  }, {
    title:  'faqListScreen.createFAQ',
    link: '/master/faqs/create',
    featureName: this.featureNames.faq
  }, {
    title:  'branchListScreen.createBranch',
    link: '/master/branches/create',
    featureName: this.featureNames.branchLocation
  }, {
    title:  'paymentInstructionScreen.createInstruction',
    link: '/payment-instructions',
    featureName: this.featureNames.paymentInstruction
  }, {
    title:  'notificationListScreen.createNotification',
    link: '/notifications/create',
    featureName: this.featureNames.notification
  }, {
    title: 'userListScreen.createUser',
    link: '/user-management/users',
    featureName: this.featureNames.user
   }, {
    title:  'roleListScreen.createRole',
    link: '/user-management/roles',
    featureName: this.featureNames.role
  }];

  navigationButtons = [];

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
    this.navigationButtons = []
    for(let btn of this.allButtons){
      if(this.authService.getCreatePrvg(btn.featureName)){
        this.navigationButtons.push(btn)
      }
    }
  }

}
