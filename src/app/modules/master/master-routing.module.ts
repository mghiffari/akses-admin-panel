import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './pages/user-list/user-list.component';
import { BannerListComponent } from './pages/banner-list/banner-list.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { BannerDetailsComponent } from './pages/banner-details/banner-details.component';

const routes: Routes = [
  {
    path: 'users',
    component: UserListComponent,
    data: {
      title: 'Users'
    }
  },
  {
    path: 'users/create',
    component: UserDetailsComponent,
    data: {
      title: 'Create New User'
    }
  },
  {
    path: 'users/update/:id',
    component: UserDetailsComponent,
    data: {
      title: 'Update User'
    }
  },
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
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
