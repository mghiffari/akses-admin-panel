import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { BranchService } from '../../services/branch.service';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-branch-upload-modal',
  templateUrl: './branch-upload-modal.component.html',
  styleUrls: []
})
export class BranchUploadModalComponent implements OnInit {
  instructions = [
    'uploadCSVModal.instructions.format',
    'uploadCSVModal.instructions.columnSequence',
    'uploadCSVModal.instructions.numberFormat',
    'uploadCSVModal.instructions.precise', 
    'uploadCSVModal.instructions.branchCode'
  ]
  isValidFile = false;
  isTouchedInput = false;
  file: File;
  onSubmittingForm = false;
  fileUrl = environment.branchCSVFileExampleUrl;

  constructor(public dialogRef: MatDialogRef<BranchUploadModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private branchService: BranchService) { 
      dialogRef.disableClose = true;
    }

  ngOnInit() {
    console.log('BranchUploadModalComponent | ngOnInit')
  }

  onChangeFile(e){
    console.log('BranchUploadModalComponent | onChangeFile')
    this.file = null;
    this.isTouchedInput = true;
    if(e.target.files && e.target.files[0]){
      let file = e.target.files[0];
      let splits = file.name.split('.');
      if(splits.length > 1){
        if(splits[splits.length - 1].trim() === 'csv'){
          this.isValidFile = true;
          this.file = file;
        } else {
          this.isValidFile = false;
        }
      } else {
        this.isValidFile = false;
      }
    }
  }

  onUpload(){
    this.onSubmittingForm = true;
    let successSnackbar = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
      data: {
        title: 'success',
        content: {
          text: 'uploadCSV.success'
        }
      }
    })
    this.dialogRef.close(true)

    console.log('BranchUploadModalComponent | onUpload')
    this.branchService.uploadCSV(this.file).subscribe(
      data => {
        this.onSubmittingForm = false;
        let successSnackbar = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: {
            title: 'success',
            content: {
              text: 'uploadCSV.success'
            }
          }
        })
        this.dialogRef.close(true)
      },
      error => {
        try {
          console.table(error);
          this.onSubmittingForm = false;
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'uploadCSV.failed',
              content: {
                text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet')
              }
            }
          })
        } catch (error) {
          console.table(error)
        }
      })
  }

}
