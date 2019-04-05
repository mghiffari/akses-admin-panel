import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { BranchService } from '../../services/branch.service';
import { LovService } from 'src/app/shared/services/lov.service';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Branch } from '../../models/branch';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';

@Component({
  selector: 'app-branch-details',
  templateUrl: './branch-details.component.html',
  styleUrls: []
})
export class BranchDetailsComponent implements OnInit {
  branchForm: FormGroup;
  branchModel: Branch;
  onSubmittingForm = false;
  id;
  isCreate = true;
  loading = true;
  branchTypes = [];
  provinces = [];
  cities = [];
  subDistricts = [];
  districts = [];
  branchCodeLength = CustomValidation.branchCode;
  postalCodeLength = CustomValidation.postalCode;

  //constructor
  constructor(
    private authService: AuthService,
    private branchService: BranchService,
    private lovService: LovService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    console.log("BranchDetailsComponent | constructor")
  }

  // name formControl getter
  get name() {
    return this.branchForm.get('name');
  }

  // branch_code formControl getter
  get branchCode() {
    return this.branchForm.get('branchCode');
  }

  // type formControl getter
  get type() {
    return this.branchForm.get('type');
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

  // district formControl getter
  get district() {
    return this.branchForm.get('district');
  }

  // address formControl getter
  get address() {
    return this.branchForm.get('address');
  }

  // address formControl getter
  get postalCode() {
    return this.branchForm.get('postalCode');
  }

  //component on init
  ngOnInit() {
    console.log("BranchDetailsComponent | OnInit")
    this.loading = true;
    let user = JSON.parse(this.authService.getUserLogin())
    let username = user.firstname + ' ' + user.lastname;
    if (this.router.url.includes('update')) {
      this.isCreate = false;
      this.id = this.route.snapshot.params['id'];
      this.branchService.getBranchById(this.id).subscribe(
        response => {
          try {
            console.log(response)
            let editedBranch: Branch = response.data;
            this.branchForm = new FormGroup({
              name: new FormControl(editedBranch.name, [Validators.required]),
              type: new FormControl(editedBranch.type, [Validators.required]),
              branchCode: new FormControl(editedBranch.branch_code, [Validators.required,
              Validators.minLength(this.branchCodeLength.minLength),
              Validators.maxLength(this.branchCodeLength.maxLength), Validators.pattern("^[0-9]*$")]),
              latitude: new FormControl(editedBranch.latitude, [Validators.required]),
              longitude: new FormControl(editedBranch.longitude, [Validators.required]),
              updatedBy: new FormControl(username),
              region: new FormControl(editedBranch.region, [Validators.required]),
              province: new FormControl(editedBranch.province, [Validators.required]),
              city: new FormControl(editedBranch.city, [Validators.required]),
              subDistrict: new FormControl(editedBranch.sub_district, [Validators.required]),
              district: new FormControl(editedBranch.district, [Validators.required]),
              address: new FormControl(editedBranch.address, [Validators.required]),
              postalCode: new FormControl(editedBranch.postal_code, [Validators.pattern("^[0-9]*$"),
              Validators.minLength(this.postalCodeLength.minLength),
              Validators.maxLength(this.postalCodeLength.maxLength)])
            })
            this.updatedBy.disable();
            this.getLOVs()
          } catch (error) {
            console.log(error)
          }
        }, error => {
          try {
            console.table(error);
            let errorSnackbar = this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: 'branchDetailsScreen.getBranchFailed',
                content: {
                  text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                  data: null
                }
              }
            })
            errorSnackbar.afterDismissed().subscribe(() => {
              this.goToListScreen()
            })
          } catch (error) {
            this.loading = false;
            console.log(error)
          }
        })
    } else {
      this.branchForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        type: new FormControl('', [Validators.required]),
        branchCode: new FormControl('', [Validators.required,
        Validators.minLength(this.branchCodeLength.minLength),
        Validators.maxLength(this.branchCodeLength.maxLength), Validators.pattern("^[0-9]*$")]),
        latitude: new FormControl('', [Validators.required]),
        longitude: new FormControl('', [Validators.required]),
        createdBy: new FormControl(username),
        region: new FormControl('', [Validators.required]),
        province: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        subDistrict: new FormControl('', [Validators.required]),
        district: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        postalCode: new FormControl('', [Validators.pattern("^[0-9]*$"),
        Validators.minLength(this.postalCodeLength.minLength),
        Validators.maxLength(this.postalCodeLength.maxLength)])
      })
      this.createdBy.disable();
      this.getLOVs();
    }
  }

  //call service to get branch types lov and indonesia zone lov
  getLOVs() {
    console.log('BranchDetailsComponent | getLOVs')
    this.loading = true;
    this.lovService.getBranchType().subscribe(
      data => {
        console.table(data);
        this.branchTypes = data.data[0].aks_adm_lovs;
      }, error => {
        try {
          console.table(error);
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'branchDetailsScreen.getBranchTypeFailed',
              content: {
                text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                data: null
              }
            }
          })
        } catch (error) {
          console.table(error)
        }
      }).add(() => {
        // this.lovService.getIndonesiaZone().subscribe(
        //   data => {
        //     console.table(data);
        //     this.provinces = data.data;
        //     if (!this.isCreate) {
        //       let selectedProvince = this.provinces.find(el => {
        //         return el.value === this.province.value;
        //       })
        //       if (selectedProvince) {
        //         this.setCities(selectedProvince, false)
        //       } else {
        //         this.province.reset()
        //         this.setCities(null)
        //       }
        //     }
        //   }, error => {
        //     try {
        //       console.table(error);
        //       this.snackBar.openFromComponent(ErrorSnackbarComponent, {
        //         data: {
        //           title: 'branchDetailsScreen.getIndonesiaZonesFailed',
        //           content: {
        //             text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
        //             data: null
        //           }
        //         }
        //       })
        //     } catch (error) {
        //       console.table(error)
        //     }
        //   }).add(() => {
        this.loading = false;
        // })
      })
  }

  // set list of cities based on province
  setCities(province = null, reset = true) {
    console.log('BranchDetailsComponent | setCities')
    if (reset) {
      this.city.reset()
      this.city.setValue('')
    }
    if (!province) {
      this.cities = [];
      this.setDistricts(null)
    } else {
      this.cities = province.aks_adm_lovs;
      if (this.city.value && this.city.value !== '') {
        let selectedCity = this.cities.find(el => {
          return el.value === this.city.value;
        })
        if (selectedCity) {
          this.setDistricts(selectedCity, reset)
        } else {
          this.city.reset()
          this.city.setValue('')
          this.setDistricts(null)
        }
      } else {
        this.setDistricts(null)
      }
    }
  }

  // set list of disctricts based on city
  setDistricts(city = null, reset = true) {
    console.log('BranchDetailsComponent | setSubDistricts')
    if (reset) {
      this.district.reset()
      this.district.setValue('')
    }
    if (!city) {
      this.districts = [];
      this.setSubDisctricts(null)
    } else {
      this.districts = city.aks_adm_lovs;
      if (this.district.value && this.district.value !== '') {
        let selectedDiscrict = this.districts.find(el => {
          return el.value === this.district.value;
        })
        if (selectedDiscrict) {
          this.setSubDisctricts(selectedDiscrict, reset)
        } else {
          this.district.reset()
          this.district.setValue('')
          this.setSubDisctricts(null)
        }
      } else {
        this.setSubDisctricts(null)
      }
    }
  }

  // set list of sub districts based on disctrict
  setSubDisctricts(district = null, reset = true) {
    console.log('BranchDetailsComponent | setVillages')
    if (reset) {
      this.subDistrict.reset()
      this.subDistrict.setValue('')
    }
    if (!district) {
      this.subDistricts = [];
    } else {
      this.subDistricts = district.aks_adm_lovs;
      if (this.subDistrict.value && this.subDistrict.value !== '') {
        let selectedSubDistrict = this.subDistricts.find(el => {
          return el.value === this.subDistrict.value;
        })
        if (!selectedSubDistrict) {
          this.subDistrict.reset()
          this.subDistrict.setValue('')
        }
      }
    }
  }

  //save button click event handler
  save() {
    console.log('BranchDetailsComponent | save')
    this.onSubmittingForm = true;
    let form = this.branchForm.value;
    this.branchModel = new Branch();
    this.branchModel.name = form.name;
    this.branchModel.branch_code = form.branchCode;
    this.branchModel.type = form.branchType;
    this.branchModel.latitude = form.latitude;
    this.branchModel.longitude = form.longitude;
    this.branchModel.region = form.region;
    this.branchModel.province = form.province;
    this.branchModel.city = form.city;
    this.branchModel.sub_district = form.subDistrict;
    this.branchModel.district = form.disctrict;
    this.branchModel.address = form.address;
    this.branchModel.postal_code = form.postalCode;
    if (this.isCreate) {
      this.branchService.createBranch(this.branchModel)
        .subscribe(
          (data: any) => {
            try {
              console.table(data);
              this.onSubmittingForm = false;
              let snackbarSucess = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
                data: {
                  title: 'success',
                  content: {
                    text: 'branchDetailsScreen.succesCreated',
                    data: null
                  }
                }
              })
              snackbarSucess.afterDismissed().subscribe(() => {
                this.goToListScreen();
              })
            } catch (error) {
              console.log(error)
            }
          },
          error => {
            try {
              console.table(error);
              this.onSubmittingForm = false;
              this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                data: {
                  title: 'branchDetailsScreen.createFailed',
                  content: {
                    text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                    data: null
                  }
                }
              })
            } catch (error) {
              console.log(error)
            }
          }
        )
    } else {
      this.branchModel.id = this.id;
      this.onSubmittingForm = true;
      this.branchService.updateBranch(this.branchModel).subscribe(
        (data: any) => {
          try {
            console.table(data);
            this.onSubmittingForm = false;
            let snackbarSucess = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
              data: {
                title: 'success',
                content: {
                  text: 'branchDetailsScreen.succesUpdated',
                  data: null
                }
              }
            })
            snackbarSucess.afterDismissed().subscribe(() => {
              this.goToListScreen();
            })
          } catch (error) {
            console.log(error)
          }
        },
        error => {
          try {
            console.table(error);
            this.onSubmittingForm = false;
            this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: 'branchDetailsScreen.updateFailed',
                content: {
                  text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                  data: null
                }
              }
            })
          } catch (error) {
            console.log(error)
          }
        }
      )
    }

  }

  //redirect to branch list screen
  goToListScreen = () => {
    console.log('BranchDetailsComponent | gotoListScreen')
    this.router.navigate(['/master/branches'])
  }

}
