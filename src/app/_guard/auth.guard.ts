import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';

@Injectable()
export class AuthGuard implements CanActivateChild{

  //this will be called when routing to child to check login status based on session storage
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log('AuthGuard | canActivateChild')
    if(this.authService.isUserLoggedIn()){
      return true;
    }

    this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}})
    return false;
  }

  constructor(private router: Router, private authService: AuthService) { }
}
