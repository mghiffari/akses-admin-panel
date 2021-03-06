import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Auth } from '../models/auth';
import { tap, map, catchError } from 'rxjs/operators';
import { throwError, ObservableInput, Observable, of } from 'rxjs';
import { ErrorModalComponent } from '../components/error-modal/error-modal.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authApiUrl = environment.apiurl + 'auth/';
  loginApiUrl = this.authApiUrl + 'login';
  resetPasswordApiUrl = this.authApiUrl + 'reset-pass/'

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
    private router: Router) { }

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
    return sessionStorage.getItem(this.storageKey.accesTokenKey)
  }

  //used to set access token on session storage
  setAccessToken(newToken) {
    console.log('AuthService | setAccessToken');
    sessionStorage.setItem(this.storageKey.accesTokenKey, newToken)
    this.syncSessionStorage()
  }

  //used to get user logged in from the session storage
  getUserLogin() {
    console.log('AuthService | getUserLogin');
    return sessionStorage.getItem(this.storageKey.userLoginKey)
  }

  //used to set user login key on session storage
  setUserLogin(userData) {
    console.log('AuthService | setUserLogin');
    sessionStorage.setItem(this.storageKey.userLoginKey, userData)
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
    localStorage.setItem(this.storageKey.logout, 'logout')
  }

  //used to sync local storage to session storage
  syncSessionStorage() {
    console.log('AuthService | syncSessionStorage');
    localStorage.setItem(this.storageKey.syncStorage, JSON.stringify(sessionStorage))
  }

  //append authorization access token to header
  appendAuthHeaders(headers: HttpHeaders, accessToken = null) {
    console.log('AuthService | appendAuthHeaders')
    accessToken = accessToken ? accessToken : this.getAccessToken()
    return headers.append('access-token', accessToken);
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
        headers: this.appendAuthHeaders(new HttpHeaders(), accessToken)
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
            let token = err.headers.get('access-token')
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
        headers: this.appendAuthHeaders(new HttpHeaders(), accessToken)
      })
      .pipe(
        tap((resp: any) => {
          let token = resp.headers.get('access-token')
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
            let token = err.headers.get('access-token')
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
  wrapTokenPutApi(url, data, accessToken = null) {
    console.log('AuthService | wrapTokenPutApi ', url);
    return this.http
      .put<HttpResponse<Object>>(url, data, {
        observe: 'response',
        headers: this.appendAuthHeaders(new HttpHeaders(), accessToken)
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
            let token = err.headers.get('access-token')
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
  wrapTokenDeleteApi(url, accessToken = null) {
    console.log('AuthService | wrapTokenDeleteApi ', url);
    return this.http
      .delete<HttpResponse<Object>>(url, {
        observe: 'response',
        headers: this.appendAuthHeaders(new HttpHeaders(), accessToken)
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
            let token = err.headers.get('access-token')
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
    let token = resp.headers.get('access-token')
    if (token) {
      if (this.getAccessToken()) {
        this.setAccessToken(token)
      } else {
        resp.body = Object.assign({ token: token }, resp.body)
      }
    }
  }
}