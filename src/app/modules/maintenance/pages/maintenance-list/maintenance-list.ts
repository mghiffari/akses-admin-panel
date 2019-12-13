import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { MatSnackBar } from "@angular/material";
import { MaintenanceService } from "src/app/shared/services/maintenance.service";
import { MaintenancePages } from "src/app/modules/maintenance/models/maintenance-pages";
import { SuccessSnackbarComponent } from "src/app/shared/components/success-snackbar/success-snackbar.component";
import { AuthService } from "src/app/shared/services/auth.service";

@Component({
  selector: "app-maintenance-mode",
  templateUrl: "./maintenance-list.html",
  styleUrls: []
})
export class MaintenanceModeListComponent implements OnInit {
  locale = "id";
  maintenanceDatas = [];

  constructor(
    private translateService: TranslateService,
    private maintenanceService: MaintenanceService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    console.log("MaintenanceMode | ngOnInit");

    const maintenancePages = new MaintenancePages();

    this.maintenanceService.getMaintenanceStatus().subscribe(
      response => {
        this.maintenanceDatas = response.data
          .filter(respon => {
            if (maintenancePages[respon.name] == null) {
              return false;
            }
            return true;
          })
          .map(respon => {
            return { ...respon, page: maintenancePages[respon.name] };
          });
      },
      error => {
        this.authService.handleApiError(
          "maintenanceModeScreen.getDataFailed",
          error
        );
      }
    );

    this.translateService.get("angularLocale").subscribe(res => {
      this.locale = res;
    });
  }

  changeDataMaintenance(idx, e) {
    if (e.checked) {
      this.maintenanceDatas[idx].value = "true";
    } else {
      this.maintenanceDatas[idx].value = "false";
    }
  }

  updateDataMaintenance() {
    const payload = {
      data: this.maintenanceDatas
    };
    this.maintenanceService.updateMaintenancePage(payload).subscribe(
      response => {
        this.handleUpdateSuccess("maintenanceModeScreen.submitSuccess");
      },
      error => {
        this.authService.handleApiError(
          "maintenanceModeScreen.submitFailed",
          error
        );
      }
    );
  }

  handleUpdateSuccess(successText) {
    console.log("MaintenanceMode | handleUpdateSuccess");
    try {
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: {
          title: "success",
          content: {
            text: successText,
            data: null
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
}
