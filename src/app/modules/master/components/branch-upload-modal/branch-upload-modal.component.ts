import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { BranchService } from '../../services/branch.service';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { FileManagementService } from 'src/app/shared/services/file-management.service';
import { constants } from 'src/app/shared/common/constants';
import { AuthService } from 'src/app/shared/services/auth.service';

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
  fileUrl = constants.branchCSVFileExampleUrl;

  //constructor
  constructor(public dialogRef: MatDialogRef<BranchUploadModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private branchService: BranchService,
    private fileService: FileManagementService,
    private authService: AuthService) {
    dialogRef.disableClose = true;
  }

  //on init
  ngOnInit() {
    console.log('BranchUploadModalComponent | ngOnInit')
  }

  //event handling when file input value change
  onChangeFile(e) {
    console.log('BranchUploadModalComponent | onChangeFile')
    this.file = null;
    this.isTouchedInput = true;
    if (e.target.files && e.target.files[0]) {
      let file = e.target.files[0];
      let splits = file.name.split('.');
      if (splits.length > 1) {
        if (splits[splits.length - 1].trim() === 'csv') {
          this.isValidFile = true;
          this.file = file;
        } else {
          this.isValidFile = false;
        }
      } else {
        this.isValidFile = false;
      }
    } else {
      this.isValidFile = false
    }
  }

  //event handling when clicking upload button; call upload csv api
  onUpload() {
    console.log('BranchUploadModalComponent | onUpload')
    this.onSubmittingForm = true;
    this.fileService.fileToBase64(this.file).subscribe(
      base64String => {
        this.branchService.uploadCSV(base64String.split(',').pop()).subscribe(
          response => {
            try {
              console.table(response)
              this.onSubmittingForm = false;
              let failedCount = response.data.insert_failed.length
              let successCount = response.data.insert_success.length
              if (failedCount && failedCount > 0) {
                this.authService.openSnackbarError('uploadCSVModal.uploadFailed'
                , 'uploadCSVModal.totalFailed'
                , {
                  totalFailed: failedCount
                })
                if (successCount > 0) {
                  this.dialogRef.close(true)
                }
              } else {
                this.snackBar.openFromComponent(SuccessSnackbarComponent, {
                  data: {
                    title: 'success',
                    content: {
                      text: 'uploadCSVModal.uploadSuccess'
                    }
                  }
                })
                this.dialogRef.close(true)
              }
            } catch (error) {
              console.error(error)
            }
          },
          error => {
              console.table(error);
              this.onSubmittingForm = false;
              this.authService.handleApiError('uploadCSVModal.uploadFailed', error)
          })
      }, error => {
        console.error(error)
        this.onSubmittingForm = false;
        this.authService.openSnackbarError('uploadCSVModal.uploadFailed', 'failedToProcessFile')
      }
    )
  }

}
