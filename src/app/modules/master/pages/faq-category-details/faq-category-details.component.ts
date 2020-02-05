import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LovTypeData } from 'src/app/shared/models/lov-type';
import { LovService } from 'src/app/shared/services/lov.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LOV } from '../../models/lov';
import { constants } from 'src/app/shared/common/constants';
import { MatSnackBar } from '@angular/material';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';


@Component({
  selector: 'app-faq-category-details',
  templateUrl: './faq-category-details.component.html',
  styleUrls: ['./faq-category-details.component.scss']
})
export class FaqCategoryDetailsComponent implements OnInit {
  isEdit = true;
  faqForm: FormGroup;
  lovModel: LOV;
  lovType: LovTypeData[] = [];
  loading = false;
  isFocusedInput = false;
  lovs = null;
  allowCreate = false;
  allowEdit = false;
  allowDelete = false;
  onSubmittingForm = false;

  constructor(
    private route: ActivatedRoute,
    private lovService: LovService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }


  ngOnInit() {
    this.loading = true;
    this.isEdit = this.route.snapshot.paramMap.has('id')
    let prvg = this.authService.getFeaturePrivilege(constants.features.categoryFaq)
    this.allowCreate = this.authService.getFeatureCreatePrvg(prvg);
    this.allowEdit = this.authService.getFeatureEditPrvg(prvg);
    this.faqForm = new FormGroup({
      category: new FormControl("", [Validators.required]),
      order: new FormControl("", [Validators.required])
    })

    this.lovService.getFAQCategory().subscribe(
      (data: any) => {
        this.lovs = data.data[0]
        if (this.isEdit) {
          if (this.allowEdit) {
            let id = this.route.snapshot.paramMap.get('id')
            let temp = this.lovs.aks_adm_lovs.filter(function (e) {
              return e.id === id
            });
            if (temp.length > 0) {
              let editedLOV: LOV = temp[0];
              this.faqForm = new FormGroup({
                category: new FormControl(editedLOV.value, [Validators.required]),
                order: new FormControl(editedLOV.numvalue_1 ? editedLOV.numvalue_1.toString() : '', [Validators.required])
              })
            }
          } else {
            this.authService.blockOpenPage()
          }
        }
      },
      error => {
        try {
          this.lovs = null
          this.authService.handleApiError('faqListScreen.loadFailed', error)
        } catch (error) {
          console.log(error)
        }
      }
    ).add(
      () => {
        this.loading = false;
      }
    )
  }

  // category formControl getter
  get category() {
    return this.faqForm.get('category');
  }

  // category formControl getter
  get order() {
    return this.faqForm.get('order');
  }

  onSave() {
    console.log('FAQDetailsComponent | save')
    // this.onSubmittingForm = true;
    let form = this.faqForm.value;
    this.lovModel = new LOV();
    this.lovModel.name = this.lovs.value;
    this.lovModel.value = form.category;
    this.lovModel.description = ''
    this.lovModel.lov_type_id = this.lovs.id;
    this.lovModel.numvalue_1 = form.order

    if (this.isEdit) {
      if (this.allowEdit) {
        this.lovModel.id = this.route.snapshot.paramMap.get('id')
        this.lovModel.par_id = null
        this.lovService.updateLOV(this.lovModel)
          .subscribe(
            (data: any) => {
              this.handleUpdateCreateSuccess('faqDetailsScreen.succesCreated', data);
            },
            error => {
              console.table(error);
              this.onSubmittingForm = false;
              this.authService.handleApiError('faqDetailsScreen.createFailed', error);
            }
          )

      }
    } else {
      if (this.allowCreate) {
        this.lovService.createLOV(this.lovModel)
          .subscribe(
            (data: any) => {
              this.handleUpdateCreateSuccess('faqDetailsScreen.succesCreated', data);
            },
            error => {
              console.table(error);
              this.onSubmittingForm = false;
              this.authService.handleApiError('faqDetailsScreen.createFailed', error);
            }
          )
      }
    }
  }

  //redirect to faq list screen
  goToListScreen = () => {
    console.log('FAQDetailsComponent | gotoListScreen')
    this.router.navigate(['/master/categoryfaq'])
  }

  // handle update create success
  handleUpdateCreateSuccess(successText, response) {
    console.log('FAQDetailsComponent | handleUpdateCreateSuccess');
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
      console.error(error)
    }
  }

  handleUpdateCreateFailed(errorTitle, apiError) {
    console.log('FAQDetailsComponent | handleUpdateCreateFailed');
    console.table(apiError);
    this.onSubmittingForm = false;
    this.authService.handleApiError(errorTitle, apiError)
  }
}
