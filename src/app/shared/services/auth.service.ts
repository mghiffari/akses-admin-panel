import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Auth } from '../models/auth';
import { tap, map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ErrorModalComponent } from '../components/error-modal/error-modal.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ProductService } from './product.service';
import { ErrorSnackbarComponent } from '../components/error-snackbar/error-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authApiUrl = environment.apiurl + 'auth';
  loginApiUrl = environment.apiurl + environment.endPoint.login;
  resetPasswordApiUrl = this.authApiUrl + '/reset-pass';
  userLoginData;

  //if this updated, also update value in index.html
  storageKey = {
    accesTokenKey: "AccessToken",
    userLoginKey: "UserLogin",
    syncStorage: "SyncStorage",
    logout: "Logout",
    initStorage: "InitSessionStorage"
  }

  constructor(private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private productService: ProductService,
    private snackBar: MatSnackBar) { }

  //used to hit login API
  login(auth: Auth) {
    console.log('Auth Service | login' + this.loginApiUrl)
    return this.http.post(this.loginApiUrl, auth);
  }

  //used to hit reset password API
  resetPassword(email: string) {
    console.log('Auth Service | resetPassword' + this.resetPasswordApiUrl)
    return this.http.post(this.resetPasswordApiUrl, { email: email });
  }

  //used to hit get access token API
  getAccessToken() {
    console.log('AuthService | getAccessToken');
    return this.productService.getProduct(sessionStorage.getItem(this.storageKey.accesTokenKey));
  }

  //used to set access token on session storage
  setAccessToken(newToken) {
    console.log('AuthService | setAccessToken');
    sessionStorage.setItem(this.storageKey.accesTokenKey, this.productService.setProduct(newToken));
    this.syncSessionStorage()
  }

  //used to get user logged in from the session storage
  getUserLogin() {
    console.log('AuthService | getUserLogin');
    return this.productService.getProduct(sessionStorage.getItem(this.storageKey.userLoginKey));
  }

  //used to set user login key on session storage
  setUserLogin(userData) {
    console.log('AuthService | setUserLogin');
    sessionStorage.setItem(this.storageKey.userLoginKey, this.productService.setProduct(userData));
    this.syncSessionStorage()
  }

  //used to check if user log in
  isUserLoggedIn() {
    console.log('AuthService | isUserLoggedIn');
    return this.getUserLogin() && this.getAccessToken()
  }

  //used when user click logout
  logout() {
    console.log('AuthService | logout');
    sessionStorage.clear();
    this.userLoginData = null;
    localStorage.setItem(this.storageKey.logout, this.productService.setProduct('logout'))
  }

  //used to sync local storage to session storage
  syncSessionStorage() {
    console.log('AuthService | syncSessionStorage');
    localStorage.setItem(this.storageKey.syncStorage, JSON.stringify(sessionStorage));
  }

  // go to landing page
  blockOpenPage(){
    console.log('AuthService | blockOpenPage');
    let errorSB = this.snackBar.openFromComponent(ErrorSnackbarComponent, {
      data: {
        title: 'pageBlockedError.title',
        content: {
          text: 'pageBlockedError.content',
          data: null
        }
      }
    })
    this.router.navigate(['/']);
  }

  // show error for unauthorized action
  blockPageAction(){
    console.log('AuthService | blockPageAction');
    this.snackBar.openFromComponent(ErrorSnackbarComponent, {
      data: {
        title: 'actionBlockedError.title',
        content: {
          text: 'actionBlockedError.content',
          data: null
        }
      }
    })
  }

  // get feature privilege
  getFeaturePrivilege(featureName){
    console.log('AuthService | getFeaturePrivilege');
    if(!this.userLoginData || !this.userLoginData.data || !this.userLoginData.data.akses){
      this.userLoginData = JSON.parse(this.getUserLogin())
    }
    let feature = this.userLoginData.akses.find(el => {
      return el.features.trim().toLowerCase() === featureName
    })
    return feature
  }

  // get a feature view flag privilege by feature name
  getViewPrvg(featureName){
    console.log('AuthService | getViewPrvg');
    if(!this.userLoginData || !this.userLoginData.data || !this.userLoginData.data.akses){
      this.userLoginData = JSON.parse(this.getUserLogin())
    }
    let feature = this.userLoginData.akses.find(el => {
      return el.features.trim().toLowerCase() === featureName
    })
    return feature && feature.view
  }

  // get a feature create flag privilege by feature name
  getCreatePrvg(featureName){
    console.log('AuthService | getViewPrvg');
    if(!this.userLoginData || !this.userLoginData.data || !this.userLoginData.data.akses){
      this.userLoginData = JSON.parse(this.getUserLogin())
    }
    let feature = this.userLoginData.akses.find(el => {
      return el.features.trim().toLowerCase() === featureName
    })
    return feature && feature.view && feature.create
  }

  // get feature create flag privilege
  getFeatureViewPrvg(feature){
    return feature && feature.view
  }

  // get feature create flag privilege
  getFeatureCreatePrvg(feature){
    return feature && feature.view && feature.create
  }

  // get feature edit flag privilege
  getFeatureEditPrvg(feature){
    return feature && feature.view && feature.edit
  }

  // get feature delete flag privilege
  getFeatureDeletePrvg(feature){
    return feature && feature.view && feature.delete
  }

  // get feature download flag privilege
  getFeatureDownloadPrvg(feature){
    return feature && feature.view && feature.download
  }

  // get feature download flag privilege
  getFeaturePublishPrvg(feature){
    return feature && feature.view && feature.publish
  }

  //append authorization access token to header
  appendAuthHeaders(headers: HttpHeaders, accessToken = null) {
    console.log('AuthService | appendAuthHeaders')
    accessToken = accessToken ? accessToken : this.getAccessToken()
    return headers.append('Authorization', accessToken);
  }

  initRequestHeaders(contentType= 'application/json; charset=utf-8'){
    return new HttpHeaders({
      'Content-Type':contentType
    });
  }

  //show dialog when user logged out
  showLoggedOutDialog(): void {
    console.log('AuthService | showLoggedOutDialog');
    const dialogRef = this.dialog.open(ErrorModalComponent, {
      width: '260px',
      height: '250px'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.logout();
      this.router.navigate(['/login'])
    });
  }

  //wraping the post API using access token or not inside header
  wrapTokenPostApi(url, data, accessToken = null) {
    console.log('AuthService | wrapTokenPostApi ', url);
    return this.http
      .post<HttpResponse<Object>>(url, data, {
        observe: 'response',
        headers: this.appendAuthHeaders(this.initRequestHeaders(), accessToken)
      })
      .pipe(
        tap((resp: any) => {
          this.getTokenInResponse(resp) 
        }),
        catchError(err => {
          if (err.status === 401) {
            this.logout();
            this.showLoggedOutDialog()
          } else {
            let token = err.headers.get('Authorization')
            if (this.getAccessToken() && token) {
              this.setAccessToken(token)
            }
            return throwError(err)
          }
        }),
        map((resp: any) => resp.body),
      )
  }

  //wraping the get API with access token or not inside header
  wrapTokenGetApi(url, accessToken = null) {
    console.log('AuthService | wrapTokenGetApi ', url);
    return this.http
      .get<HttpResponse<Object>>(url, {
        observe: 'response',
        headers: this.appendAuthHeaders(this.initRequestHeaders(), accessToken)
      })
      .pipe(
        tap((resp: any) => {
          let token = resp.headers.get('Authorization')
          if (token) {
            if (this.getAccessToken()) {
              this.setAccessToken(token)
            } else {
              resp.body = Object.assign({ token: token }, resp.body)
            }
          }
        }),
        catchError(err => {
          if (err.status === 401) {
            this.logout();
            this.showLoggedOutDialog()
          } else {
            let token = err.headers.get('Authorization')
            if (this.getAccessToken() && token) {
              this.setAccessToken(token)
            }
            return throwError(err)
          }
        }),
        map((resp: any) => resp.body),
      )
  }

  //wraping the put API with access token or not inside header
  wrapTokenPutApi(url, data, accessToken = null, headers = null) {
    console.log('AuthService | wrapTokenPutApi ', url);
    return this.http
      .put<HttpResponse<Object>>(url, data, {
        observe: 'response',
        headers: this.appendAuthHeaders(headers ? headers : this.initRequestHeaders(), accessToken)
      })
      .pipe(
        tap((resp: any) => {
          this.getTokenInResponse(resp) 
        }),
        catchError(err => {
          if (err.status === 401) {
            this.logout();
            this.showLoggedOutDialog()
          } else {
            let token = err.headers.get('Authorization')
            if (this.getAccessToken() && token) {
              this.setAccessToken(token)
            }
            return throwError(err)
          }
        }),
        map((resp: any) => resp.body),
      )
  }

  //wraping the patch API with access token or not inside header
  wrapTokenPatchApi(url, data, accessToken = null) {
    console.log('AuthService | wrapTokenPatchApi ', url);
    return this.http
      .patch<HttpResponse<Object>>(url, data, {
        observe: 'response',
        headers: this.appendAuthHeaders(this.initRequestHeaders(), accessToken)
      })
      .pipe(
        tap((resp: any) => {
          this.getTokenInResponse(resp) 
        }),
        catchError(err => {
          if (err.status === 401) {
            this.logout();
            this.showLoggedOutDialog()
          } else {
            let token = err.headers.get('Authorization')
            if (this.getAccessToken() && token) {
              this.setAccessToken(token)
            }
            return throwError(err)
          }
        }),
        map((resp: any) => resp.body),
      )
  }

  //wraping the delete API with access token or not inside header
  wrapTokenDeleteApi(url, accessToken = null, body=null, headers = null) {
    console.log('AuthService | wrapTokenDeleteApi ', url);
    if(body){
      return this.wrapTokenRequestApi('delete', url, body, accessToken)
    } else {
      return this.http
        .delete<HttpResponse<Object>>(url, {
          observe: 'response',
          headers: this.appendAuthHeaders(headers ? headers : this.initRequestHeaders(), accessToken)
        })
        .pipe(
          tap((resp: any) => {
            this.getTokenInResponse(resp) 
          }),
          catchError(err => {
            if (err.status === 401) {
              this.logout();
              this.showLoggedOutDialog()
            } else {
              let token = err.headers.get('Authorization')
              if (this.getAccessToken() && token) {
                this.setAccessToken(token)
              }
              return throwError(err)
            }
          }),
          map((resp: any) => resp.body),
        )
    }
  }

  //wraping the request API with access token or not inside header
  wrapTokenRequestApi(method, url, body = null, accessToken = null){
    let options = {}
    if(body){
      options = {
        observe: 'response',
        headers: this.appendAuthHeaders(new HttpHeaders(), accessToken),
        body: body
      }
    } else {
      options = {
        observe: 'response',
        headers: this.appendAuthHeaders(new HttpHeaders(), accessToken)
      }
    }
    return this.http.request<HttpResponse<Object>>(method, url, options)
    .pipe(
      tap((resp: any) => {
        this.getTokenInResponse(resp) 
      }),
      catchError(err => {
        if (err.status === 401) {
          this.logout();
          this.showLoggedOutDialog()
        } else {
          let token = err.headers.get('Authorization')
          if (this.getAccessToken() && token) {
            this.setAccessToken(token)
          }
          return throwError(err)
        }
      }),
      map((resp: any) => resp.body),
    )
  }

  //get token inside response when hit API
  getTokenInResponse(resp) {
    console.log('AuthService | getTokenInResponse');
    let token = resp.headers.get('Authorization')
    if (token) {
      if (this.getAccessToken()) {
        this.setAccessToken(token)
      } else {
        resp.body = Object.assign({ token: token }, resp.body)
      }
    }
  }
}