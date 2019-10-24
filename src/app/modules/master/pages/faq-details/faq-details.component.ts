import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FAQ } from '../../models/faq';
import { FAQService } from '../../services/faq.service';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { LovData } from 'src/app/shared/models/lov';
import { LovService } from 'src/app/shared/services/lov.service';
import { constants } from 'src/app/shared/common/constants';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-faq-details',
  templateUrl: './faq-details.component.html',
  styleUrls: []
})
export class FAQDetailsComponent implements OnInit {
  faqForm: FormGroup;
  faqModel: FAQ;
  categories: LovData[] = [];
  onSubmittingForm = false;
  id;
  isCreate = true;
  loading = true;
  tinyMceSettings = constants.tinyMceSettings;
  allowCreate = false;
  allowEdit = false;

  //constructor
  constructor(
    private faqService: FAQService,
    private lovService: LovService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    console.log("FAQDetailsComponent | constructor")
  }

  // category formControl getter
  get category() {
    return this.faqForm.get('category');
  }

  // title formControl getter
  get title() {
    return this.faqForm.get('title');
  }

  // title_order formControl getter
  get titleOrder() {
    return this.faqForm.get('titleOrder');
  }

  // category formControl getter
  get uniqueTag() {
    return this.faqForm.get('uniqueTag');
  }

  // content formControl getter
  get content() {
    return this.faqForm.get('content');
  }

  // bookmark formControl getter
  get bookmark() {
    return this.faqForm.get('bookmark');
  }

  //component on init
  ngOnInit() {
    console.log("FAQDetailsComponent | OnInit")
    this.loading = true;
    let prvg = this.authService.getFeaturePrivilege(constants.features.faq)
    this.allowCreate = this.authService.getFeatureCreatePrvg(prvg);
    this.allowEdit = this.authService.getFeatureEditPrvg(prvg);
    if (this.router.url.includes('update')) {
      if (this.allowEdit) {
        this.isCreate = false;
        this.id = this.route.snapshot.params['id'];
        this.faqService.getFaqById(this.id).subscribe(
          data => {
            try {
              let editedFAQ: FAQ = data.data;
              this.faqForm = new FormGroup({
                category: new FormControl(editedFAQ.category, [Validators.required]),
                title: new FormControl(editedFAQ.title, [Validators.required]),
                titleOrder: new FormControl(editedFAQ.title_order, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]),
                uniqueTag: new FormControl(editedFAQ.unique_tag, [Validators.required]),
                content: new FormControl(editedFAQ.content, [Validators.required]),
                bookmark: new FormControl(editedFAQ.bookmark)
              })
              this.getCategories();
            } catch (error) {
              console.table(error)
            }
          }, error => {
            console.table(error);
            let errorSnackbar = this.authService.handleApiError('faqDetailsScreen.getFaqFailed', error)
            if (errorSnackbar) {
              errorSnackbar.afterDismissed().subscribe(() => {
                this.goToListScreen()
              })
            }
          })
      } else {
        this.authService.blockOpenPage()
      }
    } else {
      if (this.allowCreate) {
        this.faqForm = new FormGroup({
          category: new FormControl('', [Validators.required]),
          title: new FormControl('', [Validators.required]),
          titleOrder: new FormControl(null, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]),
          uniqueTag: new FormControl('', [Validators.required]),
          content: new FormControl('', [Validators.required]),
          bookmark: new FormControl(false)
        })
        this.getCategories()
      } else {
        this.authService.blockOpenPage()
      }
    }
  }

  //call service to get faq categories lov
  getCategories() {
    console.log('FAQDetailsComponent | getCategories')
    this.loading = true;
    this.lovService.getFAQCategory().subscribe(
      data => {
        try {
          console.table(data);
          this.categories = data.data[0].aks_adm_lovs;
        } catch (error) {
          console.table(error)
        }
      },
      error => {
        console.table(error);
        this.authService.handleApiError('faqDetailsScreen.getFaqCategoriesFailed', error);
      }
    ).add(() => {
      this.loading = false;
    })
  }

  //save button click event handler
  save() {
    console.log('FAQDetailsComponent | save')
    this.onSubmittingForm = true;
    let form = this.faqForm.value;
    this.faqModel = new FAQ();
    this.faqModel.category = form.category;
    this.faqModel.title = form.title;
    this.faqModel.title_order = form.titleOrder;
    this.faqModel.unique_tag = form.uniqueTag;
    this.faqModel.content = form.content;
    this.faqModel.bookmark = form.bookmark;
    if (this.isCreate) {
      if (this.allowCreate) {
        this.faqService.createFaq(this.faqModel)
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
      } else {
        this.authService.blockPageAction()
      }
    } else {
      if (this.allowEdit) {
        this.faqModel.id = this.id;
        this.onSubmittingForm = true;
        this.faqService.updateFaq(this.faqModel).subscribe(
          (data: any) => {
            this.handleUpdateCreateSuccess('faqDetailsScreen.succesUpdate', data)
          },
          error => {
            this.handleUpdateCreateFailed('faqDetailsScreen.updateFailed', error)
          }
        )
      } else {
        this.authService.blockPageAction()
      }
    }

  }

  //redirect to faq list screen
  goToListScreen = () => {
    console.log('FAQDetailsComponent | gotoListScreen')
    this.router.navigate(['/master/faqs'])
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
