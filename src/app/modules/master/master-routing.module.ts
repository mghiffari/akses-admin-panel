import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BannerListComponent } from './pages/banner-list/banner-list.component';
import { BannerDetailsComponent } from './pages/banner-details/banner-details.component';
import { ArticleListComponent } from './pages/article-list/article-list.component';
import { ArticleDetailsComponent } from './pages/article-details/article-details.component';
import { FAQListComponent } from './pages/faq-list/faq-list.component';
import { FAQDetailsComponent } from './pages/faq-details/faq-details.component';
import { BranchDetailsComponent } from './pages/branch-details/branch-details.component';
import { BranchListComponent } from './pages/branch-list/branch-list.component';
import { ChangePhoneListComponent } from './pages/change-phone-list/change-phone-list.component';
import { SpecialOfferListComponent } from './pages/special-offer-list/special-offer-list.component';
import { SpecialOfferDetailsComponent } from './pages/special-offer-details/special-offer-details.component';
import { CanDeactivateGuard } from 'src/app/_guard/can-deactivate.guard';
import { FaqCategoryComponent } from "./pages/faq-category/faq-category.component";
import { FaqCategoryDetailsComponent } from "./pages/faq-category-details/faq-category-details.component";

const routes: Routes = [
  {
    path: 'banners',
    component: BannerListComponent,
    data: {
      title: 'Banners'
    }
  },
  {
    path: 'banners/create',
    component: BannerDetailsComponent,
    data: {
      title: 'Create Banner'
    }
  },
  {
    path: 'banners/update/:id',
    component: BannerDetailsComponent,
    data: {
      title: 'Update Banner'
    }
  },
  {
    path: 'articles',
    component: ArticleListComponent,
    data: {
      title: 'Articles'
    }
  },
  {
    path: 'articles/create',
    component: ArticleDetailsComponent,
    data: {
      title: 'Create Article'
    }
  },
  {
    path: 'articles/update/:id',
    component: ArticleDetailsComponent,
    data: {
      title: 'Update Article'
    }
  },
  {
    path: 'faqs',
    component: FAQListComponent,
    data: {
      title: 'FAQs'
    }
  },
  {
    path: 'faqs/create',
    component: FAQDetailsComponent,
    data: {
      title: 'Create FAQ'
    }
  },
  {
    path: 'faqs/update/:id',
    component: FAQDetailsComponent,
    data: {
      title: 'Update FAQ'
    }
  },
  {
    path: 'branches/create',
    component: BranchDetailsComponent,
    data: {
      title: 'Create Branch'
    }
  },
  {
    path: 'branches/update/:id',
    component: BranchDetailsComponent,
    data: {
      title: 'Update Branch'
    }
  },
  {
    path: 'branches',
    component: BranchListComponent,
    data: {
      title: 'Branch Locations'
    }
  },
  {
    path: 'change-phonenumber-requests',
    component: ChangePhoneListComponent,
    data: {
      title: 'Change Phonenumber Requests'
    }
  },
  {
    path: 'special-offers',
    component: SpecialOfferListComponent,
    data: {
      title: 'Special Offers'
    }
  },
  {
    path: 'special-offers/create',
    canDeactivate: [CanDeactivateGuard],
    component: SpecialOfferDetailsComponent,
    data: {
      title: 'Create Special Offer'
    }
  },
  {
    path: 'special-offers/update/:id',
    canDeactivate: [CanDeactivateGuard],
    component: SpecialOfferDetailsComponent,
    data: {
      title: 'Update Special Offer'
    }
  },
  {
    path: 'categoryfaq',
    component: FaqCategoryComponent,
    data: {
      title: 'FAQ Category'
    }
  },
  {
    path: 'categoryfaq/create',
    component: FaqCategoryDetailsComponent,
    data: {
      title: 'Create Category FAQ'
    }
  },
  {
    path: 'categoryfaq/edit/:id',
    component: FaqCategoryDetailsComponent,
    data: {
      title: 'Update Category FAQ',
    }
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
