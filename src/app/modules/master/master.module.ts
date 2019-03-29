import { NgModule } from '@angular/core';
import { MasterRoutingModule } from './master-routing.module';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './pages/user-list/user-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BannerListComponent } from './pages/banner-list/banner-list.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { BannerDetailsComponent } from './pages/banner-details/banner-details.component';
import { BannerDetailsService } from './pages/banner-details/services/banner-details.service';
import { EditorModule } from '@tinymce/tinymce-angular';
import { Ng2ImgToolsModule } from 'ng2-img-tools';
import { BannerService } from './services/banner.service';
import { ArticleListComponent } from './pages/article-list/article-list.component';
import { ArticleService } from './services/article.service';
import { FAQListComponent } from './pages/faq-list/faq-list.component';
import { FAQService } from './services/faq.service';

@NgModule({
  declarations: [
    UserListComponent,
    BannerListComponent,
    UserDetailsComponent,
    BannerDetailsComponent,
    ArticleListComponent,
    FAQListComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    SharedModule,
    EditorModule,
    Ng2ImgToolsModule
  ],
  providers: [
    BannerDetailsService,
    BannerService,
    ArticleService,
    FAQService
  ]
})
export class MasterModule { }
