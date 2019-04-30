import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LovService } from 'src/app/shared/services/lov.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { Observable } from 'rxjs';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-pi-details',
  templateUrl: './pi-details.component.html',
  styleUrls: []
})
export class PIDetailsComponent implements OnInit {
  onSubmittingForm = false;
  loading = false;
  isCreate = true;
  instructionForm = new FormGroup({});

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lovService: LovService,
    private snackBar: MatSnackBar,
    private modalConfirmation: MatDialog
  ) { }

  // show prompt when routing to another page in edit mode
  canDeactivate(): Observable<boolean> | boolean {
    console.log('CreditSimulationProductComponent | canDeactivate');
    if (this.instructionForm.dirty) {
      const modalRef = this.modalConfirmation.open(ConfirmationModalComponent, {
        width: '260px',
        restoreFocus: false,
        data: {
          title: 'movePageConfirmationModal.title',
          content: {
            string: 'movePageConfirmationModal.content',
            data: null
          }
        }
      })
      return modalRef.afterClosed();
    } else {
      return true;
    }
  }

  //  icon formControl getter
  get icon() {
    return this.instructionForm.get('icon')
  }

  //  iconFile formControl getter
  get iconFile() {
    return this.instructionForm.get('iconFile')
  }

  //  oldIcon formControl getter
  get oldIcon() {
    return this.instructionForm.get('oldIcon')
  }

  //  icon formControl getter
  get grpTitle() {
    return this.instructionForm.get('grpTitle')
  }

  //  instructions formControl getter
  get instructions() {
    return this.instructionForm.get('instructions')
  }

  //  order formControl getter
  get order() {
    return this.instructionForm.get('order')
  }

  //  instructionType formControl getter
  get instructionType() {
    return this.instructionForm.get('instructionType')
  }

  // instruction step content formControl getter
  getContent(index) {
    const instructions = this.instructions as FormArray;
    return instructions.at(index).get('content')
  }

  // instruction step content preview formControl getter
  getShowPreview(index) {
    const instructions = this.instructions as FormArray;
    return instructions.at(index).get('showPreview')
  }

  ngOnInit() {
    console.log('PIDetailsComponent | ngOnInit')
    this.loading = true;
    this.route.params.subscribe(params => {
      try {
        this.instructionForm = new FormGroup({
          icon: new FormControl('', Validators.required),
          // validate file size, file type, and resolution
          iconFile: new FormControl(null, [
            CustomValidation.type(['jpg', 'jpeg', 'png'])
          ]),
          oldIcon: new FormControl(''),
          grpTitle: new FormControl('', Validators.required),
          instructions: new FormArray([], Validators.required),
          order: new FormControl(null),
          instructionType: new FormControl(null)
        })
        if (this.router.url.includes('update')) {
          this.isCreate = false;

        } else {
          this.isCreate = true;
          let paymentType = params.paymentType;
          this.lovService.getPaymentInstType().subscribe(
            response => {
              try {
                this.loading = false;
                console.table(response);
                let paymentTypes = response.data;
                let found = false;
                for (let type of paymentTypes) {
                  if (type.name.toLowerCase() === paymentType.toLowerCase()) {
                    found = true;
                    paymentType = type.name;
                    break;
                  }
                }
                if (found) {
                  this.instructionForm.patchValue({ instructionType: paymentType })
                } else {
                  this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                    data: {
                      title: 'eror',
                      content: {
                        text: 'paymentInstructionDetailsScreen.typeNotFound',
                        data: {
                          type: paymentType
                        }
                      }
                    }
                  })
                  this.goToListScreen()
                }
              } catch (error) {
                console.table(error)
              }
            }, error => {
              try {
                console.table(error);
                this.loading = false;
                this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                  data: {
                    title: 'paymentInstructionDetailsScreen.getTypeFailed',
                    content: {
                      text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                      data: null
                    }
                  }
                })
              } catch (error) {
                console.table(error)
              }
            })
        }
      } catch (error) {
        console.table(error)
        this.loading = false;
      }

    })
  }

  // handling delete icon event
  onDeleteIcon() {
    console.log('PIDetailsComponent | onDeleteIcon')
    if (this.iconFile.value || this.icon.value !== '') {
      this.iconFile.markAsDirty();
      this.icon.markAsDirty();
    }
    this.iconFile.setValue(null);
    this.icon.setValue('');
    this.iconFile.markAsTouched();
    this.icon.markAsTouched();
  }

  // handling onChangeFile event
  onChangeFile(event) {
    console.log('PIDetailsComponent | onChangeFile')
    const file = event.target.files[0];
    if (file) {
      this.onDeleteIcon();
      this.iconFile.markAsDirty();
      this.icon.markAsDirty();
      this.iconFile.setValue(file)
      if (this.iconFile.valid || !this.iconFile.errors.type) {
        let reader = new FileReader();
        reader.onload = (e) => {
          this.icon.setValue(e.target['result'])
        };

        reader.readAsDataURL(file);

        CustomValidation.imageMaxResolution(this.iconFile, 48, 48)
        CustomValidation.imageRatio(this.iconFile, 1, 1)
      } else {
        this.icon.setValue('')
      }
    }
  }

  //adding new step to instructions
  addNewStep() {
    console.log('PIDetailsComponent | addNewStep')
    const step = new FormGroup({
      content: new FormControl('', [Validators.required]),
      showPreview: new FormControl(false)
    })
    let instructions = this.instructions as FormArray
    instructions.push(step)
  }

  deleteStep(index) {
    let instructions = this.instructions as FormArray
    instructions.removeAt(index)
    this.instructions.markAsDirty();
  }

  toggleShowPreview(i) {
    this.getShowPreview(i).setValue(!this.getShowPreview(i).value)
  }

  // handling click arrow up event
  onOrderUp(index) {
    console.log("PIDetailsComponent | onOrderUp");
    let instructions = this.instructions as FormArray
    if (instructions.at(index) && instructions.at(index - 1)) {
      let selectedStep = instructions.at(index);
      this.deleteStep(index);
      instructions.insert(index - 1, selectedStep)
      this.instructions.markAsDirty();
    }
  }

  // handling click arrow down event
  onOrderDown(index) {
    console.log("PIDetailsComponent | onOrderDown");
    let instructions = this.instructions as FormArray
    if (instructions.at(index) && instructions.at(index + 1)) {
      let selectedStep = instructions.at(index);
      this.deleteStep(index);
      instructions.insert(index + 1, selectedStep)
      this.instructions.markAsDirty();
    }
  }

  // save button click handler
  save() {
    console.log('PIDetailsComponent | save')
  }

  renderContent(content: string) {
    console.log('PIDetailsComponent | renderContent')
    let openBracketStack = [];
    let boldText = '';
    let text = '';
    let i = 0;
    while (i < content.length) {
      let char = content[i];
      if (char === '[') {
        openBracketStack.push(char)
        let j = i + 1;
        let lastCloseBracketIndex = -1;
        while (j < content.length) {
          let charJ = content[j]
          if (charJ === ']') {
            lastCloseBracketIndex = j;
            if (openBracketStack.length > 0) {
              openBracketStack.pop();
            }
          } else if (charJ === '[') {
            if (lastCloseBracketIndex === -1) {
              openBracketStack.push(charJ);
            } else if (openBracketStack.length === 0) {
              break;
            }
          }
          j += 1;
        }
        if (lastCloseBracketIndex > -1) {
          openBracketStack = [];
          text += '<b>' + content.substring(i + 1, lastCloseBracketIndex) + '</b>'
          i = lastCloseBracketIndex + 1;
        } else {
          text += '[' + content.substring(i + 1, content.length)
          openBracketStack = [];
          i = content.length;
        }
      } else {
        text += char;
        i += 1;
      }
    }
    return text;
  }

  //redirect to payment instructions list screen
  goToListScreen = () => {
    console.log('PIDetailsComponent | goToListScreen')
    this.router.navigate(['/payment-instructions'])
  }
}
