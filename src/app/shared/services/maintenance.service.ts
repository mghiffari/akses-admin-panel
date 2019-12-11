import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class MaintenanceService {
  pageApiUrl = environment.apiurl + "maintenance";
  getMaintenanceStatusApiUrl = this.pageApiUrl + "/show-page";
  editMaintenanceStatusApiUrl = this.pageApiUrl + "/edit-page";

  // constructor
  constructor(private authService: AuthService) {
    console.log("PageService | constructor");
  }

  updateMaintenancePage(data: any) {
    console.log("PageService | updateMaintenancePage");
    return this.authService.wrapTokenPutApi(
      this.editMaintenanceStatusApiUrl,
      data
    );
  }

  // get roles list
  getMaintenanceStatus() {
    console.log("PageService | getMaintenanceStatus");
    return this.authService.wrapTokenGetApi(this.getMaintenanceStatusApiUrl);
  }
}
