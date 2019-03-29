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
import { BannerService } from './services/banner.service';
import { ArticleListComponent } from './pages/article-list/article-list.component';
import { ArticleService } from './services/article.service';
import { ArticleDetailsComponent } from './pages/article-details/article-details.component';

@NgModule({
  declarations: [
    UserListComponent,
    BannerListComponent,
    UserDetailsComponent,
    BannerDetailsComponent,
    ArticleListComponent,
    ArticleDetailsComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    SharedModule,
    EditorModule
  ],
  providers: [
    BannerDetailsService,
    BannerService,
    ArticleService
  ]
})
export class MasterModule { }
