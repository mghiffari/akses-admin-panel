import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from "@angular/router";
import { MatSnackBar, MatDialog } from '@angular/material';
import { LovService } from "../../../../shared/services/lov.service";
import { LOV } from '../../models/lov';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { constants } from 'src/app/shared/common/constants';

@Component({
  selector: 'app-article-category',
  templateUrl: './article-category.component.html',
  styleUrls: ['./article-category.component.scss']
})
export class ArticleCategoryComponent implements OnInit {
  paginatorProps = {
    pageSizeOptions: [10, 25, 50, 100],
    pageSize: 10,
    showFirstLastButtons: true,
    length: 0,
    pageIndex: 0
  }

  lovColumns: string[] = [
    'number',
    'value',
    // 'numvalue_1',
    'action'
  ]

  lovs: LOV[] = [];
  search = '';
  searchTexts = [];
  closeText = '';
  loading = false;
  isFocusedInput = false;
  allowCreate = false;
  allowEdit = false;
  allowDelete = false;

  private table: any;
  @ViewChild('categoryarticlesTable') set tabl(table: ElementRef) {
    this.table = table;
  }

  constructor(
    private lovService: LovService,
    private snackBar: MatSnackBar,
    private modalConfirmation: MatDialog,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.allowCreate = false;
    this.allowEdit = false;
    this.allowDelete = false;
    let prvg = this.authService.getFeaturePrivilege(constants.features.categoryArticle)
    if (this.authService.getFeatureViewPrvg(prvg)) {
      this.lazyLoadData()
      this.allowCreate = this.authService.getFeatureCreatePrvg(prvg)
      this.allowEdit = this.authService.getFeatureEditPrvg(prvg)
      this.allowDelete = this.authService.getFeatureDeletePrvg(prvg)
    } else {
      this.authService.blockOpenPage()
    }
  }

  onDelete = (element) => {
    if (this.allowDelete) {
      const modalRef = this.modalConfirmation.open(ConfirmationModalComponent, {
        width: '260px',
        data: {
          title: 'deleteConfirmation',
          content: {
            string: 'articleListScreen.deleteConfirmation',
            data: {
              title: "title"
            }
          }
        }
      })
      modalRef.afterClosed().subscribe(result => {
        if (result) {
          this.loading = true;
          let delLOV: LOV = Object.assign(new LOV(), element);
          delLOV.is_deleted = true;
          this.lovService.updateLOV(delLOV).subscribe(
            (data: any) => {
              try {
                console.table(data);
                this.snackBar.openFromComponent(SuccessSnackbarComponent, {
                  data: {
                    title: 'success',
                    content: {
                      text: 'dataDeleted',
                      data: null
                    }
                  }
                })
                this.lazyLoadData()
              } catch (error) {
                console.table(error)
              }
            },
            error => {
              console.table(error);
              this.loading = false;
              this.authService.handleApiError('failedToDelete', error);
            }
          )
        }
      })
    } else {
      this.authService.blockPageAction()
    }

  }

  gotoDetail = (element) => {
    console.log("goto: ", element)
    this.router.navigate(['master/categoryarticle/edit', element.id])
  }

  createCategory = () => {
    this.router.navigate(["/master/categoryarticle/create"])

  }

  // call api to get data based on table page, page size, and search keyword
  lazyLoadData() {
    let isFocusedInput = this.isFocusedInput;
    this.loading = true;
    this.lovService.getArticleCategory().subscribe(
      (data: any) => {
        console.log("data: ", data)
        try {
          this.lovs = data.data[0].aks_adm_lovs;
        } catch (error) {
          this.lovs = []
        }
      },
      error => {
        try {
          this.lovs = []
          this.authService.handleApiError('articleCategoryScreen.loadFailed', error)
        } catch (error) {
          console.log(error)
        }
      }
    ).add(
      () => {
        if (this.table) {
          this.table.renderRows();
        }
        this.loading = false;
      }
    )
  }
}

