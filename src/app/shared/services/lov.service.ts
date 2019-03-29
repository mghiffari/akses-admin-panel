import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LovService {
  getModulsApiUrl = environment.apiurl + 'lov/type?value=internal_navigation'
  
  constructor(private authService: AuthService) {
    console.log('LovService | constructor')
  }

  //get lov of internal link moduls
  getModuls() {
    let url = this.getModulsApiUrl;
    console.log("Banner Service | getModuls " + url);
    return this.authService.wrapTokenGetApi(url);
  }
}
