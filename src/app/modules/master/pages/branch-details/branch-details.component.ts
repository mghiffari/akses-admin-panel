import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { BranchService } from '../../services/branch.service';
import { LovService } from 'src/app/shared/services/lov.service';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Branch } from '../../models/branch';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { HttpErrorResponse } from '@angular/common/http';
import { constants } from 'src/app/shared/common/constants';
import { CreditSimulationService } from 'src/app/shared/services/credit-simulation.service';
import { CSRegions } from 'src/app/shared/models/cs-regions';

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
  onCheckCode = false;
  duplicateBranchId = '';
  branchTypes = [];
  regions: CSRegions[] = []
  provinces = [];
  cities = [];
  subDistricts = [];
  districts = [];
  branchCodeLength = CustomValidation.branchCode;
  postalCodeLength = CustomValidation.postalCode;
  longitudeLength = CustomValidation.longitude;
  latitudeLength = CustomValidation.latitude;
  allowCreate = false;
  allowEdit = false;

  //constructor
  constructor(
    private authService: AuthService,
    private branchService: BranchService,
    private csService: CreditSimulationService,
    private lovService: LovService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
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

  // areaCode formControl getter
  get areaCode() {
    return this.branchForm.get('areaCode');
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
    let prvg = this.authService.getFeaturePrivilege(constants.features.branchLocation)
    this.allowCreate = this.authService.getFeatureCreatePrvg(prvg);
    this.allowEdit = this.authService.getFeatureEditPrvg(prvg);
    let user = JSON.parse(this.authService.getUserLogin())
    let username = user.firstname + ' ' + user.lastname;
    if (this.router.url.includes('update')) {
      if (this.allowEdit) {
        this.loading = true;
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
                branchCode: new FormControl({ value: editedBranch.branch_code, disabled: true }, [Validators.required,
                Validators.minLength(this.branchCodeLength.minLength),
                Validators.maxLength(this.branchCodeLength.maxLength), Validators.pattern("^[0-9]*$")]),
                latitude: new FormControl(editedBranch.latitude, [
                  Validators.required,
                  CustomValidation.maxDecimalLength(this.latitudeLength.integerDigitLength, this.latitudeLength.fractionDigitLength)
                ]),
                longitude: new FormControl(editedBranch.longitude, [Validators.required,
                CustomValidation.maxDecimalLength(this.longitudeLength.integerDigitLength, this.longitudeLength.fractionDigitLength)
                ]),
                updatedBy: new FormControl(username),
                region: new FormControl(editedBranch.region, [Validators.required]),
                // region for credit simulation
                areaCode: new FormControl(editedBranch.cr_sim_area_code, [Validators.required]),
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
              this.loading = false;
              let errorSnackbar = this.authService.handleApiError('branchDetailsScreen.getBranchFailed', error)
              if (errorSnackbar) {
                errorSnackbar.afterDismissed().subscribe(() => {
                  this.goToListScreen()
                })
              }
            } catch (error) {
              this.loading = false;
              console.log(error)
            }
          })
      } else {
        this.authService.blockOpenPage()
      }
    } else {
      if (this.allowCreate) {
        this.branchForm = new FormGroup({
          name: new FormControl('', [Validators.required]),
          type: new FormControl('', [Validators.required]),
          branchCode: new FormControl('', [Validators.required,
          Validators.minLength(this.branchCodeLength.minLength),
          Validators.maxLength(this.branchCodeLength.maxLength), Validators.pattern("^[0-9]*$")]),
          latitude: new FormControl('', [Validators.required,
          CustomValidation.maxDecimalLength(this.latitudeLength.integerDigitLength, this.latitudeLength.fractionDigitLength)
          ]),
          longitude: new FormControl('', [Validators.required,
          CustomValidation.maxDecimalLength(this.longitudeLength.integerDigitLength, this.longitudeLength.fractionDigitLength)
          ]),
          createdBy: new FormControl(username),
          region: new FormControl('', [Validators.required]),
          areaCode: new FormControl('', [Validators.required]),
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
        this.branchCode.valueChanges.subscribe(value => {
          if (this.branchCode.valid) {
            //validate branchcode not exist
            this.validateBranchCode(value)
          }
        })
      } else {
        this.authService.blockOpenPage()
      }
    }
  }

  //call service to get branch types lov and indonesia zone lov
  getLOVs() {
    console.log('BranchDetailsComponent | getLOVs')
    this.loading = true;
    let lovTasks = [
      this.lovService.getBranchType().pipe(map(res => res), catchError(e => of(e))),
      this.lovService.getIndonesiaProvince().pipe(map(res => res), catchError(e => of(e))),
      this.csService.getRegionList().pipe(map(res => res), catchError(e => of(e)))
    ]
    forkJoin(lovTasks).subscribe((response: any) => {
      this.loading = false;
      if (response[0] instanceof Error) {
        const error = response[0];
        console.table(error);
        this.authService.handleApiError('branchDetailsScreen.getBranchTypeFailed', error);
      } else {
        try {
          console.table(response[0]);
          this.branchTypes = response[0].data[0].aks_adm_lovs;
        } catch (error) {
          console.table(error)
        }
      }

      if (response[1] instanceof Error) {
        const error = response[1];
        console.table(error);
        this.authService.handleApiError('branchDetailsScreen.getProvincesFailed', error);
      } else {
        try {
          console.table(response[1]);
          this.provinces = response[1].data;
          if (!this.isCreate) {
            let selectedProvince = this.provinces.find(el => {
              return el.value === this.province.value;
            })
            if (selectedProvince) {
              this.setCities(selectedProvince, false)
            } else {
              this.province.reset()
              this.setCities(null)
            }
          }
        } catch (error) {
          console.table(error)
        }
      }

      if (response[2] instanceof Error) {
        const error = response[2];
        console.table(error);
        this.authService.handleApiError('branchDetailsScreen.getCSRegionFailed', error);
      } else {
        try {
          console.table(response[2]);
          this.regions = response[2].data
        } catch (error) {
          console.table(error)
        }
      }
    })
  }

  // set list of cities based on province
  setCities(province = null, reset = true) {
    console.log('BranchDetailsComponent | setCities')
    if (reset) {
      this.city.reset()
      this.city.setValue('')
    }
    if (!province || province === '') {
      this.cities = [];
      this.city.reset()
      this.city.setValue('')
      this.setDistricts(null)
    } else {
      this.lovService.getIndonesiaProvinceCities(province.id).subscribe(
        response => {
          try {
            this.cities = response.data;
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
          } catch (error) {
            console.table(error)
          }
        },
        error => {
          console.table(error);
          this.authService.handleApiError('branchDetailsScreen.getCitiesFailed', error);
        }
      )
    }
  }

  // set list of districts based on city
  setDistricts(city = null, reset = true) {
    console.log('BranchDetailsComponent | setDistricts')
    if (reset) {
      this.district.reset()
      this.district.setValue('')
    }
    if (!city || city === '') {
      this.districts = [];
      this.district.reset()
      this.district.setValue('')
      this.setSubDistricts(null)
    } else {
      this.lovService.getIndonesiaCityDistricts(city.id).subscribe(
        response => {
          try {
            this.districts = response.data;
            if (this.district.value && this.district.value !== '') {
              let selectedDistrict = this.districts.find(el => {
                return el.value === this.district.value;
              })
              if (selectedDistrict) {
                this.setSubDistricts(selectedDistrict, reset)
              } else {
                this.district.reset()
                this.district.setValue('')
                this.setSubDistricts(null)
              }
            } else {
              this.setSubDistricts(null)
            }
          } catch (error) {
            console.table(error)
          }
        },
        error => {
          console.table(error);
          this.authService.handleApiError('branchDetailsScreen.getDistrictsFailed', error);
        }
      )
    }
  }

  // set list of sub districts based on district
  setSubDistricts(district = null, reset = true) {
    console.log('BranchDetailsComponent | setSubDistricts')
    if (reset) {
      this.subDistrict.reset()
      this.subDistrict.setValue('')
    }
    if (!district || district === '') {
      this.subDistricts = [];
      this.subDistrict.reset()
      this.subDistrict.setValue('')
    } else {
      this.lovService.getIndonesiaDistrictSubDistricts(district.id).subscribe(
        response => {
          try {
            this.subDistricts = response.data;
            if (this.subDistrict.value && this.subDistrict.value !== '') {
              let selectedSubDistrict = this.subDistricts.find(el => {
                return el.value === this.subDistrict.value;
              })
              if (!selectedSubDistrict) {
                this.subDistrict.reset()
                this.subDistrict.setValue('')
              }
            }
          } catch (error) {
            console.table(error)
          }
        },
        error => {
          console.table(error);
          this.authService.handleApiError('branchDetailsScreen.getSubDistrictsFailed', error)
        }
      )
    }
  }

  //save button click event handler
  save() {
    console.log('BranchDetailsComponent | save')
    this.onSubmittingForm = true;
    if (this.isCreate) {
      this.validateBranchCode()
    } else {
      let form = this.branchForm.getRawValue();
      this.branchModel = new Branch();
      this.branchModel.name = form.name;
      this.branchModel.branch_code = form.branchCode;
      this.branchModel.type = form.type;
      this.branchModel.latitude = form.latitude;
      this.branchModel.longitude = form.longitude;
      this.branchModel.region = form.region;
      this.branchModel.province = form.province;
      this.branchModel.city = form.city;
      this.branchModel.sub_district = form.subDistrict;
      this.branchModel.district = form.district;
      this.branchModel.address = form.address;
      this.branchModel.postal_code = form.postalCode;
      this.branchModel.id = this.id;
      this.branchModel.cr_sim_area_code = form.areaCode;
      this.branchService.updateBranch(this.branchModel).subscribe(
        (data: any) => {
          this.handleUpdateCreateSuccess('branchDetailsScreen.succesUpdated', data)
        },
        error => {
          this.handleUpdateCreateError('branchDetailsScreen.updateFailed', error)
        }
      )
    }

  }

  //redirect to branch list screen
  goToListScreen = () => {
    console.log('BranchDetailsComponent | gotoListScreen')
    this.router.navigate(['/master/branches'])
  }

  validateBranchCode(code = this.branchCode.value) {
    this.onCheckCode = true;
    this.branchService.getBranchByCode(code).subscribe(
      response => {
        try {
          console.table(response)
          this.onCheckCode = false;
          this.duplicateBranchId = response.data.id;
          if (this.onSubmittingForm) {
            this.onSubmittingForm = false;
            this.authService.openSnackbarError('branchDetailsScreen.createFailed', 'branchDetailsScreen.duplicateBranchCode');
            this.branchCode.setErrors({ 'duplicatecode': true })
          } else {
            this.branchCode.setErrors({ 'duplicatecode': true })
          }
        } catch (error) {
          console.table(error)
        }
      }, error => {
        console.table(error)
        this.onCheckCode = false;
        this.branchCode.setErrors(null)
        this.duplicateBranchId = '';
        if (this.onSubmittingForm) {
          this.createBranch();
        }
      }
    )
  }

  createBranch() {
    let form = this.branchForm.value;
    this.branchModel = new Branch();
    this.branchModel.name = form.name;
    this.branchModel.branch_code = form.branchCode;
    this.branchModel.type = form.type;
    this.branchModel.latitude = form.latitude;
    this.branchModel.longitude = form.longitude;
    this.branchModel.region = form.region;
    this.branchModel.province = form.province;
    this.branchModel.city = form.city;
    this.branchModel.sub_district = form.subDistrict;
    this.branchModel.district = form.district;
    this.branchModel.address = form.address;
    this.branchModel.postal_code = form.postalCode;
    this.branchModel.cr_sim_area_code = form.areaCode;
    this.branchService.createBranch(this.branchModel)
      .subscribe(
        (data: any) => {
          this.handleUpdateCreateSuccess('branchDetailsScreen.succesCreated', data)
        },
        error => {
          this.handleUpdateCreateError('branchDetailsScreen.createFailed', error)
        }
      )
  }

  // handle general api error to stop loading and show error snackbar
  handleUpdateCreateError(errorTitle, apiError) {
    console.log('BranchDetailsComponent | handleApiError');
    console.table(apiError);
    this.onSubmittingForm = false;
    this.authService.handleApiError(errorTitle, apiError)
  }

  // handling update create banner success
  handleUpdateCreateSuccess(successText, response) {
    console.log('BranchDetailsComponent | handleUpdateCreateSuccess');
    try {
      console.table(response);
      this.onSubmittingForm = false;
      let snackbarSucess = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: {
          title: 'success',
          content: {
            text: successText,
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
  }

}
