import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LovService } from 'src/app/shared/services/lov.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { Observable } from 'rxjs';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { FileManagementService } from 'src/app/shared/services/file-management.service';
import { InstructionList } from '../../models/instruction-list';
import { PayInstService } from '../../services/pay-inst.service';
import { InstructionDetails } from '../../models/instruction-details';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';

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
  actionSuccess = false;
  instructionValidation = CustomValidation.instructionSteps;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lovService: LovService,
    private snackBar: MatSnackBar,
    private modalConfirmation: MatDialog,
    private payInstService: PayInstService,
    private fileMgtService: FileManagementService
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

  //  id formControl getter
  get id() {
    return this.instructionForm.get('id')
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
          id: new FormControl(''),
          icon: new FormControl('', Validators.required),
          // validate file size, file type
          iconFile: new FormControl(null, [
            CustomValidation.type(['jpg', 'jpeg', 'png'])
          ]),
          oldIcon: new FormControl(''),
          grpTitle: new FormControl('', Validators.required),
          instructions: new FormArray([], [
            Validators.required, 
            Validators.maxLength(this.instructionValidation.maxLength)]),
          order: new FormControl(null),
          instructionType: new FormControl(null)
        })
        if (this.router.url.includes('update')) {
          this.isCreate = false;
          let id = params.id;
          this.getInstructionById(id);
        } else {
          this.isCreate = true;
          let paymentType = params.paymentType;
          this.checkPaymentType(paymentType)
        }
      } catch (error) {
        console.table(error)
        this.loading = false;
      }

    })
  }

  // call get payment types api to check payment type param
  checkPaymentType(paymentType) {
    console.log('PIDetailsComponent | checkPaymentType')
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
                title: 'error',
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

  getInstructionById(id) {
    console.log('PIDetailsComponent | getInstructionById')
    this.payInstService.getListById(id).subscribe(
      response => {
        try {
          console.table(response);
          let data = response.data;
          this.getInstructionSteps(data);
        } catch (error) {
          this.loading = false;
          console.table(error)
        }
      }, error => {
        try {
          console.table(error);
          this.loading = false;
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'paymentInstructionDetailsScreen.getInstructionFailed',
              content: {
                text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                data: null
              }
            }
          })
          this.goToListScreen()
        } catch (error) {
          console.table(error)
        }
      }
    )
  }

  // get instruction steps
  getInstructionSteps(instruction) {
    console.log('PIDetailsComponent | getInstructionSteps')
    this.payInstService.getListDetails(instruction.id).subscribe(
      response => {
        try {
          console.table(response)
          this.loading = false;
          let steps = this.instructions as FormArray;
          for (let step of response.data) {
            steps.push(
              new FormGroup({
                content: new FormControl(step.content, [Validators.required]),
                showPreview: new FormControl(false)
              })
            )
          }
          this.instructionForm.patchValue({
            id: instruction.id,
            icon: instruction.icon,
            oldIcon: instruction.icon,
            grpTitle: instruction.grp_title,
            order: instruction.order,
            instructionType: instruction.instruction_type
          })
        } catch (error) {
          console.table(error)
        }
      }, error => {
        try {
          console.table(error)
          this.loading = false;
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'paymentInstructionDetailsScreen.getStepsFailed',
              content: {
                text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                data: null
              }
            }
          })
          this.goToListScreen()
        } catch (error) {
          console.table(error)
        }
      }
    )
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

  // delete step from form array
  deleteStep(index) {
    let instructions = this.instructions as FormArray
    instructions.removeAt(index)
    this.instructions.markAsDirty();
  }

  // toggle show preview flag
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
    if (this.isCreate) {
      this.onSubmittingForm = true;
      let formData = new FormData()
      formData.append("file", this.iconFile.value)
      formData.append("component", "payment-instruction")
      this.uploadIcon(formData);
    } else {
      if (this.oldIcon.value === this.icon.value) {
        let instructionDetails = [];
        let stepsForm = this.instructions.value;
        let instObject = {
          grp_title: this.grpTitle.value,
          icon: this.icon.value
        }
        for (let i = 0; i < stepsForm.length; i++) {
          let form = stepsForm[i]
          let step = new InstructionDetails();
          step.list_id = this.id.value;
          step.content = form.content;
          step.order = i + 1;
          instructionDetails.push(Object.assign(step, instObject))
        }
        this.updateInstructionDetails(instructionDetails, false)
      } else {
        let formData = new FormData()
        formData.append("file", this.iconFile.value)
        formData.append("component", "payment-instruction")
        this.uploadIcon(formData);
      }
    }
  }

  // call upload icon
  uploadIcon(iconFormData) {
    console.log('PIDetailsComponent | uploadIcon')
    this.fileMgtService.uploadFile(iconFormData).subscribe(
      response => {
        try {
          console.table(response)
          if (this.isCreate) {
            let newInstructionList = new InstructionList();
            newInstructionList.grp_title = this.grpTitle.value;
            newInstructionList.icon = response.data.url;
            newInstructionList.instruction_type = this.instructionType.value;
            this.insertNewInstruction(newInstructionList)
          } else {
            let instructionDetails = [];
            let stepsForm = this.instructions.value;
            let instObject = {
              grp_title: this.grpTitle.value,
              icon: response.data.url
            }
            for (let i = 0; i < stepsForm.length; i++) {
              let form = stepsForm[i]
              let step = new InstructionDetails();
              step.list_id = this.id.value;
              step.content = form.content;
              step.order = i + 1;
              instructionDetails.push(Object.assign(step, instObject))
            }
            this.updateInstructionDetails(instructionDetails, true)
          }
        } catch (error) {
          console.table(error)
          this.onSubmittingForm = false;
        }
      }, error => {
        try {
          console.table(error)
          this.onSubmittingForm = false;
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'paymentInstructionDetailsScreen.uploadIconFailed',
              content: {
                text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                data: null
              }
            }
          })
        } catch (error) {
          console.table(error)
        }
      }
    )
  }

  // call upload icon
  insertNewInstruction(newInstruction) {
    console.log('PIDetailsComponent | uploadIcon')
    this.payInstService.createList(newInstruction).subscribe(
      response => {
        try {
          console.table(response)
          newInstruction.id = response.data.id;
          this.insertInstructionSteps(newInstruction)
        } catch (error) {
          this.onSubmittingForm = false;
          console.table(error)
        }
      }, error => {
        try {
          console.table(error)
          this.onSubmittingForm = false;
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'paymentInstructionDetailsScreen.insertInstructionFailed',
              content: {
                text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                data: null
              }
            }
          })
        } catch (error) {
          console.table(error)
        }
      }
    )
  }

  // insert instruction steps
  insertInstructionSteps(instructionList) {
    console.log('PIDetailsComponent | insertInstructionSteps');
    let stepsForm = this.instructions.value;
    let steps = [];
    for (let i = 0; i < stepsForm.length; i++) {
      let form = stepsForm[i]
      let step = new InstructionDetails();
      step.list_id = instructionList.id;
      step.content = form.content;
      step.order = i + 1;
      steps.push(step)
    }
    this.payInstService.createListDetails(steps).subscribe(
      response => {
        this.onSubmittingForm = false;
        let snackbarSucess = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: {
            title: 'success',
            content: {
              text: 'paymentInstructionDetailsScreen.succesCreated',
              data: null
            }
          }
        })
        snackbarSucess.afterDismissed().subscribe(() => {
          this.goToListScreen();
        })
      }, error => {
        try {
          console.table(error)
          this.onSubmittingForm = false;
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'paymentInstructionDetailsScreen.insertStepsFailed',
              content: {
                text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                data: null
              }
            }
          })
        } catch (error) {
          console.table(error)
        }
      }
    )
  }

  updateInstructionDetails(instructionDetails, shouldDeleteIcon) {
    console.log('PIDetailsComponent | updateInstructionDetails');
    this.payInstService.updatePaymentInstructions(instructionDetails).subscribe(
      response => {
        console.table(response)
        if (shouldDeleteIcon) {
          this.deleteIcon(instructionDetails[0].icon)
        } else {
          this.onSubmittingForm = false;
          let snackbarSucess = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
            data: {
              title: 'success',
              content: {
                text: 'paymentInstructionDetailsScreen.succesUpdated',
                data: null
              }
            }
          })
          snackbarSucess.afterDismissed().subscribe(() => {
            this.goToListScreen();
          })
        }
      }, error => {
        try {
          console.table(error)
          this.onSubmittingForm = false;
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'paymentInstructionDetailsScreen.updateFailed',
              content: {
                text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                data: null
              }
            }
          })
        } catch (error) {
          console.table(error)
        }
      }
    )
  }

  // call delete file api
  deleteIcon(url) {
    console.log('PIDetailsComponent | deleteIcon');
    let split = url.split('/')
    let name = url
    if(split.length >= 2){
      name = split.pop()
      name = split.pop() + '/' + name;
    }
    let data = {
      name: name
    }
    this.fileMgtService.deleteFile(data).subscribe(
      response => {
        console.table(response);
        let snackbarSucess = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: {
            title: 'success',
            content: {
              text: 'paymentInstructionDetailsScreen.succesUpdated',
              data: null
            }
          }
        })
        snackbarSucess.afterDismissed().subscribe(() => {
          this.goToListScreen();
        })
      }, error => {
        try {
          console.table(error)
          this.onSubmittingForm = false;
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'paymentInstructionDetailsScreen.deleteIconFailed',
              content: {
                text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                data: null
              }
            }
          })
        } catch (error) {
          console.table(error)
        }
      }
    )
  }

  //redirect to payment instructions list screen
  goToListScreen = () => {
    console.log('PIDetailsComponent | goToListScreen')
    this.instructionForm.reset()
    this.router.navigate(['/payment-instructions'])
  }
}
