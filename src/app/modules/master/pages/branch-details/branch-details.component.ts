import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';

@Component({
  selector: 'app-branch-details',
  templateUrl: './branch-details.component.html',
  styleUrls: []
})
export class BranchDetailsComponent implements OnInit {
  branchForm: FormGroup;
  branchModel;
  onSubmittingForm = false;
  id;
  isCreate = true;
  loading = true;

  //constructor
  constructor(
    private authService: AuthService,
    // private branchService: BranchService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    console.log("BranchDetailsComponent | constructor")
  }

  // branchName formControl getter
  get branchName() {
    return this.branchForm.get('branchName');
  }

  // branchCode formControl getter
  get branchCode() {
    return this.branchForm.get('branchCode');
  }

  // branchType formControl getter
  get branchType() {
    return this.branchForm.get('branchType');
  }

  // latitude formControl getter
  get latitude() {
    return this.branchForm.get('latitude');
  }

  // longitude formControl getter
  get longitude() {
    return this.branchForm.get('longitude');
  }

  // createdBy formControl getter
  get createdBy() {
    return this.branchForm.get('createdBy');
  }

  // updatedBy formControl getter
  get updatedBy() {
    return this.branchForm.get('updatedBy');
  }

  // region formControl getter
  get region() {
    return this.branchForm.get('region');
  }

  // province formControl getter
  get province() {
    return this.branchForm.get('province');
  }

  // city formControl getter
  get city() {
    return this.branchForm.get('city');
  }

  // subDistrict formControl getter
  get subDistrict() {
    return this.branchForm.get('subDistrict');
  }

  // village formControl getter
  get village() {
    return this.branchForm.get('village');
  }

  // address formControl getter
  get address() {
    return this.branchForm.get('address');
  }

  //component on init
  ngOnInit() {
    console.log("BranchDetailsComponent | OnInit")
    this.loading = true;
    let user = JSON.parse(this.authService.getUserLogin())
    let username = user.firstname + ' ' + user.lastname;
    // if (this.router.url.includes('update')) {
    //   this.isCreate = false;
    //   this.id = this.route.snapshot.params['id'];
    //   this.branchService.getBranchById(this.id).subscribe(
    //     data => {
    //       try {
    //         let editedBranch: Branch = data.data;
    //         this.branchForm = new FormGroup({
    //           branchName: new FormControl(editedBranch.branchName, [Validators.required]),
    //           branchType: new FormControl(editedBranch.branchType, [Validators.required]),
    //           branchCode: new FormControl(editedBranch.branchCode, [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern("^[0-9]*$")]),
    //           latitude: new FormControl(editedBranch.latitude, [Validators.required]),
    //           longitude: new FormControl(editedBranch.longitude, [Validators.required]),
    //           editedBy: new FormControl(username),
    //           region: new FormControl(editedBranch.region, [Validators.required]),
    //           province: new FormControl(editedBranch.province, [Validators.required]),
    //           city: new FormControl(editedBranch.city, [Validators.required]),
    //           subDistrict: new FormControl(editedBranch.subDistrict, [Validators.required]),
    //           village: new FormControl(editedBranch.village, [Validators.required]),
    //           address: new FormControl(editedBranch.address, [Validators.required])
    //         })
    //         this.updatedBy.disable();
    //       } catch (error) {
    //         console.log(error)
    //       }
    //     }, error => {
    //       try {
    //         console.table(error);
    //         let errorSnackbar = this.snackBar.openFromComponent(ErrorSnackbarComponent, {
    //           data: {
    //             title: 'branchDetailsScreen.getBranchFailed',
    //             content: {
    //               text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
    //               data: null
    //             }
    //           }
    //         })
    //         errorSnackbar.afterDismissed().subscribe(() => {
    //           this.goToListScreen()
    //         })
    //       } catch (error) {
    //         console.log(error)
    //       }
    //     }).add(() => {
    //       this.loading = false;
    //     })
    // } else {
      this.branchForm = new FormGroup({
        branchName: new FormControl('', [Validators.required]),
        branchType: new FormControl('', [Validators.required]),
        branchCode: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern("^[0-9]*$")]),
        latitude: new FormControl('', [Validators.required]),
        longitude: new FormControl('', [Validators.required]),
        createdBy: new FormControl(username),
        region: new FormControl('', [Validators.required]),
        province: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        subDistrict: new FormControl('', [Validators.required]),
        village: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required])
      })
      this.createdBy.disable();
      this.loading = false;
      // }
    }

    //save button click event handler
    save() {
      console.log('BranchDetailsComponent | save')
      // this.onSubmittingForm = true;
      // let form = this.branchForm.value;
      // this.branchModel = new Branch();
      // this.branchModel.branchName = form.branchName;
      // this.branchModel.branchCode = form.branchCode;
      // this.branchModel.branchType = form.branchType;
      // this.branchModel.latitude = form.latitude;
      // this.branchModel.longitude = form.longitude;
      // this.branchModel.region = form.region;
      // this.branchModel.province = form.province;
      // this.branchModel.city = form.city;
      // this.branchModel.subDistrict = form.subDistrict;
      // this.branchModel.village = form.village;
      // this.branchModel.address = form.address;
      // if (this.isCreate) {
      //   this.branchService.createBranch(this.branchModel)
      //     .subscribe(
      //       (data: any) => {
      //         try {            
      //           console.table(data);
      //           this.onSubmittingForm = false;
      //           let snackbarSucess = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
      //             data: {
      //               title: 'success',
      //               content: {
      //                 text: 'branchDetailsScreen.succesCreated',
      //                 data: null
      //               }
      //             }
      //           })
      //           snackbarSucess.afterDismissed().subscribe(() => {
      //             this.goToListScreen();
      //           })
      //         } catch (error) {
      //           console.log(error)
      //         }
      //       },
      //       error => {
      //         try {            
      //           console.table(error);
      //           this.onSubmittingForm = false;
      //           this.snackBar.openFromComponent(ErrorSnackbarComponent, {
      //             data: {
      //               title: 'branchDetailsScreen.createFailed',
      //               content: {
      //                 text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
      //                 data: null
      //               }
      //             }
      //           })
      //         } catch (error) {
      //           console.log(error)
      //         }
      //       }
      //     )
      // } else {
      //   this.branchModel.id = this.id;
      //   this.onSubmittingForm = true;
      //   this.branchModel.updateBranch(this.branchModel).subscribe(
      //     (data: any) => {
      //       try {            
      //         console.table(data);
      //         this.onSubmittingForm = false;
      //         let snackbarSucess = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
      //           data: {
      //             title: 'success',
      //             content: {
      //               text: 'branchDetailsScreen.succesUpdated',
      //               data: null
      //             }
      //           }
      //         })
      //         snackbarSucess.afterDismissed().subscribe(() => {
      //           this.goToListScreen();
      //         })
      //       } catch (error) {
      //         console.log(error)
      //       }
      //     },
      //     error => {
      //       try {            
      //         console.table(error);
      //         this.onSubmittingForm = false;
      //         this.snackBar.openFromComponent(ErrorSnackbarComponent, {
      //           data: {
      //             title: 'branchDetailsScreen.updateFailed',
      //             content: {
      //               text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
      //               data: null
      //             }
      //           }
      //         })
      //       } catch (error) {
      //         console.log(error)
      //       }
      //     }
      //   )
      // }

    }

    //redirect to branch list screen
    goToListScreen = () => {
      console.log('BranchDetailsComponent | gotoListScreen')
      this.router.navigate(['/master/branches'])
    }

  }