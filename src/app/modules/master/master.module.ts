import { NgModule } from '@angular/core';
import { MasterRoutingModule } from './master-routing.module';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './pages/user-list/user-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BannerListComponent } from './pages/banner-list/banner-list.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { BannerDetailsComponent } from './pages/banner-details/banner-details.component';
import { BannerDetailsService } from './pages/banner-details/services/banner-details.service';
import { BannerService } from './services/banner.service';
import { ArticleListComponent } from './pages/article-list/article-list.component';
import { ArticleDetailsComponent } from './pages/article-details/article-details.component';
import { FAQListComponent } from './pages/faq-list/faq-list.component';
import { FAQService } from './services/faq.service';
import { FAQDetailsComponent } from './pages/faq-details/faq-details.component';
import { BranchDetailsComponent } from './pages/branch-details/branch-details.component';
import { BranchListComponent } from './pages/branch-list/branch-list.component';
import { BranchService } from './services/branch.service';
import { BranchUploadModalComponent } from './components/branch-upload-modal/branch-upload-modal.component';
import { ChangePhoneListComponent } from './pages/change-phone-list/change-phone-list.component';
import { ChangePhoneService } from './services/change-phone.service';
import { RemarkInputModalComponent } from './components/remark-input-modal/remark-input-modal.component';
import { SpecialOfferListComponent } from './pages/special-offer-list/special-offer-list.component';
import { SpecialOfferDetailsComponent } from './pages/special-offer-details/special-offer-details.component';

@NgModule({
  declarations: [
    UserListComponent,
    BannerListComponent,
    UserDetailsComponent,
    BannerDetailsComponent,
    ArticleListComponent,
    FAQListComponent,
    FAQDetailsComponent,
    ArticleDetailsComponent,
    FAQListComponent,
    BranchDetailsComponent,
    BranchListComponent,
    BranchUploadModalComponent,
    ChangePhoneListComponent,
    RemarkInputModalComponent,
    SpecialOfferListComponent,
    SpecialOfferDetailsComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    SharedModule
  ],
  providers: [
    BannerDetailsService,
    BannerService,
    FAQService,
    BranchService,
    ChangePhoneService
  ],
  entryComponents: [
    BranchUploadModalComponent,
    RemarkInputModalComponent,
  ]
})
export class MasterModule { }
