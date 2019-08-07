import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { PageService } from 'src/app/shared/services/page.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { Feature } from '../../models/feature';
import { RolePrivilege } from '../../models/role-privilege';
import { Privilege } from '../../models/privilege';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { Observable } from 'rxjs';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {
  loading = false;
  isEditModeName = false;
  selectedRowIndex = -1;
  roleColumns: string[] = [
    'number',
    'roleName',
    'action'
  ]

  featureColumns: string[] = [
    'featureName',
    'privileges'
  ]

  roleList: RolePrivilege[] = [];
  featureList: Feature[] = []
  form: FormGroup

  private roleTable: any;
  @ViewChild('roleTable') set roleTabl(table: ElementRef) {
    this.roleTable = table;
  }

  private featureTable: any;
  @ViewChild('featureTable') set prvgTabl(table: ElementRef) {
    this.featureTable = table;
  }

  @ViewChild('roleTableWrapper') private roleTableWrapper: ElementRef;

  // constructor
  constructor(
    private pageService: PageService,
    private snackBar: MatSnackBar,
    private modal: MatDialog
  ) {
    console.log('RoleListComponent | constructor')
  }

  // on component init
  ngOnInit() {
    console.log('RoleListComponent | ngOnInit')
    this.form = new FormGroup({
      roles: new FormArray([])
    })
    this.isEditModeName = false
    this.selectedRowIndex = -1
    this.loadData()
  }

  // show prompt when routing to another page in edit mode
  canDeactivate(): Observable<boolean> | boolean {
    console.log('SpecialOfferDetailsComponent | canDeactivate');
    if (this.selectedRole && this.selectedRole.dirty) {
      const modalRef = this.modal.open(ConfirmationModalComponent, {
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

  // roles control getter
  get roles() {
    return this.form.get('roles')
  }

  // get rolles as form array
  get rolesFormArray() {
    let formArray = this.roles as FormArray
    return formArray;
  }

  get selectedRole() {
    return this.rolesFormArray.at(this.selectedRowIndex)
  }

  // uncheck other privilege if view privilege is unchecked
  onChangeViewPrivilege(form: FormGroup) {
    console.log('RoleListComponent | onChangeViewPrivilege')
    let formValue = form.value
    if (!formValue.view) {
      form.patchValue({
        create: false,
        edit: false,
        delete: false,
        publish: false,
        download: false
      })
    }
  }

  // check view privilege if other privilege is checked
  onChangePrivilege(form: FormGroup) {
    console.log('RoleListComponent | onChangePrivilege')
    let formValue = form.value
    if (!formValue.view && (formValue.edit || formValue.delete || formValue.publish || formValue.download || formValue.create)) {
      form.patchValue({
        view: true
      })
    }
  }

  // method to get a form control from table element form group
  getElementFormControl(element, formControlName) {
    console.log('RoleListComponent | getElementFormControl')
    return element.get(formControlName);
  }

  // method to get role name form control from table element form group
  getElementRoleName(element) {
    console.log('RoleListComponent | getElementRoleName')
    return this.getElementFormControl(element, 'name');
  }

  // method to get feature name form control from table element form group
  getElementFeatureName(element) {
    console.log('RoleListComponent | getElementFeatureName')
    return this.getElementFormControl(element, 'name');
  }

  // method to get features
  getPrivilegesFormArray() {
    console.log('RoleListComponent | getPrivilegesFormArray')
    if (this.selectedRowIndex < 0) {
      return null
    } else {
      let form = this.rolesFormArray.at(this.selectedRowIndex)
      return form ? form.get('privileges') : null
    }
  }

  // show confirmation modal for change selected role
  showSaveConfirmModal() {
    console.log('RoleListComponent | showSaveConfirmModal')
    const modalRef = this.modal.open(ConfirmationModalComponent, {
      width: '260px',
      restoreFocus: false,
      data: {
        title: 'saveConfirmationModal.title',
        content: {
          string: 'saveConfirmationModal.content',
          data: null
        },
        button: {
          cancel: 'skip',
          ok: 'save'
        }
      }
    })
    return modalRef.afterClosed();
  }

  // check whether save modal should be shown 
  shouldShowSaveModal() {
    console.log('RoleListComponent | shouldShowSaveModal')
    let id = this.selectedRole.get('id').value
    return this.selectedRowIndex >= 0 && (this.selectedRole.dirty || !id || id === '')
  }

  // reset the previous selected role values
  onChangeRole(prevIndex) {
    console.log('RoleListComponent | onChangeRole')
    let formArray = this.rolesFormArray
    let prevRoleForm = formArray.at(prevIndex)
    if (prevRoleForm) {
      let prevRole = prevRoleForm.value
      if (prevRole.id && prevRole.id !== '') {
        if (prevRole.dirty) {
          let roleData: RolePrivilege = this.roleList.find((el: RolePrivilege) => {
            return el.id === prevRole.id
          })
          if (roleData) {
            let privileges = []
            this.featureList.forEach((feature: Feature) => {
              let featurePrivilege: Privilege = roleData.privileges.find((prvg: Privilege) => {
                return prvg.pages_id === feature.id
              })
              if (featurePrivilege && featurePrivilege.view) {
                privileges.push({
                  id: new FormControl(featurePrivilege.id),
                  pageId: feature.id,
                  groupId: new FormControl(prevRole.id),
                  name: feature.name,
                  view: featurePrivilege.view,
                  create: featurePrivilege.create,
                  edit: featurePrivilege.edit,
                  delete: featurePrivilege.delete,
                  publish: featurePrivilege.publish,
                  download: featurePrivilege.download
                })
              } else {
                privileges.push({
                  id: featurePrivilege ? new FormControl(featurePrivilege.id) : new FormControl(null),
                  pageId: feature.id,
                  groupId: new FormControl(prevRole.id),
                  name: feature.name,
                  view: false,
                  create: false,
                  edit: false,
                  delete: false,
                  publish: false,
                  download: false
                })
              }
            })
            prevRoleForm.setValue({
              id: roleData.id,
              name: roleData.name,
              privileges: privileges,
              description: roleData.description
            })
          }
          prevRoleForm.markAsPristine()
        }
      } else {
        if (this.selectedRowIndex >= prevIndex) {
          this.selectedRowIndex -= 1
        }
        formArray.removeAt(prevIndex)
        this.renderTableRows()
      }
    }
  }

  // select a role on the table handler
  selectRole(index, afterSelect = null) {
    console.log('RoleListComponent | selectRole')
    const select = () => {
      let prevIndex = this.selectedRowIndex
      this.selectedRowIndex = index
      this.isEditModeName = false
      this.onChangeRole(prevIndex)
      if (afterSelect) {
        afterSelect()
      }
    }
    if (index !== this.selectedRowIndex) {
      if (this.shouldShowSaveModal()) {
        this.showSaveConfirmModal().subscribe(
          result => {
            if (result) {
              this.save(select)
            } else {
              select()
            }
          }
        )
      } else {
        select()
      }
    }
  }

  // enable editing selected role name
  editRole(index, onSucess = null) {
    console.log('RoleListComponent | editRole')
    const enableEdit = () => {
      let prevIndex = this.selectedRowIndex
      this.selectedRowIndex = index
      this.onChangeRole(prevIndex)
      this.isEditModeName = true
      if (onSucess) {
        onSucess()
      }
    }

    if (index !== this.selectedRowIndex) {
      if (this.shouldShowSaveModal()) {
        this.showSaveConfirmModal().subscribe(
          result => {
            if (result) {
              this.save(enableEdit)
            } else {
              enableEdit()
            }
          }
        )
      } else {
        enableEdit()
      }
    } else {
      this.isEditModeName = true
    }
  }

  // call delete role api if saved, else remove from form array
  deleteRole(index) {
    console.log('RoleListComponent | deleteRole')
    let formArray = this.rolesFormArray
    let roleForm = formArray.at(index)
    const modalRef = this.modal.open(ConfirmationModalComponent, {
      width: '260px',
      data: {
        title: 'deleteConfirmation',
        content: {
          string: 'roleListScreen.deleteConfirmation',
          data: {
            name: this.getElementRoleName(roleForm).value
          }
        }
      }
    })
    modalRef.afterClosed().subscribe(result => {
      if (result) {
        const afterSelect = () => {
          let roleId = roleForm.value.id

          if (roleId && roleId !== '') {

          } else {
            if (index >= formArray.length - 1) {
              this.selectRole(index - 1)
            }
            formArray.removeAt(index)
            this.renderTableRows()
          }
        }
        this.selectRole(index, afterSelect)
      }
    })
  }

  // append new role form to form array
  addRole() {
    console.log('RoleListComponent | addRole')
    const onEditSelectNewRole = () => {
      let formArray = this.rolesFormArray
      let privileges = [];

      this.featureList.forEach(feature => {
        privileges.push(new FormGroup({
          id: new FormControl(null),
          pageId: new FormControl(feature.id),
          groupId: new FormControl(null),
          name: new FormControl(feature.name),
          view: new FormControl(false),
          create: new FormControl(false),
          edit: new FormControl(false),
          delete: new FormControl(false),
          publish: new FormControl(false),
          download: new FormControl(false)
        }))
      })
      formArray.push(new FormGroup({
        id: new FormControl(null),
        name: new FormControl('', Validators.required),
        description: new FormControl(null),
        privileges: new FormArray(privileges)
      }))
      this.renderTableRows()
      let prevIndex = this.selectedRowIndex
      this.selectedRowIndex = formArray.length - 1
      this.onChangeRole(prevIndex)
      this.isEditModeName = true
      this.roleTableWrapper.nativeElement.scrollTop = this.roleTableWrapper.nativeElement.scrollHeight;
    }

    if (this.shouldShowSaveModal()) {
      this.showSaveConfirmModal().subscribe(
        result => {
          if (result) {
            this.save(onEditSelectNewRole)
          } else {
            onEditSelectNewRole()
          }
        }
      )
    } else {
      onEditSelectNewRole()
    }
  }

  // button save click handler
  save(onSuccess = null) {
    console.log('RoleListComponent | save')
    let selectedRoleFormGroup = this.selectedRole
    if (selectedRoleFormGroup) {
      if (selectedRoleFormGroup.valid) {
        this.loading = true;
        let selectedRole = selectedRoleFormGroup.value
        let role = new RolePrivilege()
        role.name = selectedRole.name
        role.description = selectedRole.description
        let privilegeForm: any[] = selectedRole.privileges
        let privileges = privilegeForm.map(el => {
          let prvg = new Privilege()
          prvg.id = el.id
          prvg.name = el.name
          prvg.description = el.description
          prvg.pages_id = el.pageId
          prvg.group_id = el.groupId
          prvg.view = el.view
          prvg.create = el.create
          prvg.edit = el.edit
          prvg.delete = el.delete
          prvg.publish = el.publish
          prvg.download = el.download
          return prvg;
        })
        role.privileges = privileges

        if (selectedRole.id && selectedRole.id !== '') {
          // update
          role.id = selectedRole.id
          this.pageService.updateRolePrivileges(role).subscribe(
            response => {
              console.table(response)
              this.snackBar.openFromComponent(SuccessSnackbarComponent, {
                data: {
                  title: 'success',
                  content: {
                    text: 'roleListScreen.succesUpdated',
                    data: null
                  }
                }
              })
              this.loadData(onSuccess)
            }, error => {
              try {
                console.table(error)
                this.loading = false
                this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                  data: {
                    title: 'roleListScreen.updateFailed',
                    content: {
                      text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                      data: null
                    }
                  }
                })
              } catch (error) {
                console.error(error)
              } 
            }
          )
        } else {
          // create
          this.pageService.createRolePrivileges(role).subscribe(
            response => {
              console.table(response)
              this.snackBar.openFromComponent(SuccessSnackbarComponent, {
                data: {
                  title: 'success',
                  content: {
                    text: 'roleListScreen.succesCreated',
                    data: null
                  }
                }
              })
              this.loadData(onSuccess)
            }, error => {
              try {
                console.table(error)
                this.loading = false
                this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                  data: {
                    title: 'roleListScreen.createFailed',
                    content: {
                      text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                      data: null
                    }
                  }
                })
              } catch (error) {
                console.error(error)
              } 
            }
          )
        }
      } else {
        this.loading = false
        selectedRoleFormGroup.updateValueAndValidity()
        let errorText = ''
        if (this.getElementRoleName(selectedRoleFormGroup).errors && this.getElementRoleName(selectedRoleFormGroup).errors.required) {
          errorText = 'forms.roleName.errorRequired'
        }
        this.snackBar.openFromComponent(ErrorSnackbarComponent, {
          data: {
            title: 'invalidForm',
            content: {
              text: errorText,
              data: null
            }
          }
        })
      }
    }
  }

  // call api to get list of roles, privileges and list of features
  loadData(onSuccess = null) {
    console.log('RoleListComponent | loadData')
    this.loading = true;
    this.pageService.getRolePrivileges().subscribe(
      response => {
        try {
          console.table(response)
          this.loading = false;
          this.featureList = response.data.features;
          this.roleList = response.data.group;
          let roles = []
          this.roleList.forEach((el: RolePrivilege) => {
            let id = el.id;
            let name = el.name;
            let privileges = [];
            this.featureList.forEach((feature: Feature) => {
              let featurePrivilege: Privilege = el.privileges.find((prvg: Privilege) => {
                return prvg.pages_id === feature.id
              })
              if (featurePrivilege && featurePrivilege.view) {
                privileges.push(new FormGroup({
                  id: new FormControl(featurePrivilege.id),
                  pageId: new FormControl(feature.id),
                  groupId: new FormControl(id),
                  name: new FormControl(feature.name),
                  view: new FormControl(featurePrivilege.view),
                  create: new FormControl(featurePrivilege.create),
                  edit: new FormControl(featurePrivilege.edit),
                  delete: new FormControl(featurePrivilege.delete),
                  publish: new FormControl(featurePrivilege.publish),
                  download: new FormControl(featurePrivilege.download)
                }))
              } else {
                privileges.push(new FormGroup({
                  id: featurePrivilege ? new FormControl(featurePrivilege.id) : new FormControl(null),
                  pageId: new FormControl(feature.id),
                  groupId: new FormControl(id),
                  name: new FormControl(feature.name),
                  view: new FormControl(false),
                  create: new FormControl(false),
                  edit: new FormControl(false),
                  delete: new FormControl(false),
                  publish: new FormControl(false),
                  download: new FormControl(false)
                }))
              }
            })
            roles.push(new FormGroup({
              id: new FormControl(id),
              name: new FormControl(name, Validators.required),
              description: new FormControl(el.description),
              privileges: new FormArray(privileges)
            }))
          })
          this.form = new FormGroup({
            roles: new FormArray(roles)
          })

          this.renderTableRows()

          if (onSuccess) {
            onSuccess()
          } else {
            if (this.selectedRowIndex < 0) {
              if (this.roleList.length > 0) {
                this.selectedRowIndex = 0;
              }
            } else {
              if (this.roleList.length <= this.selectedRowIndex) {
                this.selectedRowIndex = this.roleList.length - 1
              }
            }
            this.isEditModeName = false;
          }
        } catch (error) {
          console.error(error)
        }
      }, error => {
        try {
          console.table(error);
          this.loading = false;
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'roleListScreen.loadFailed',
              content: {
                text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                data: null
              }
            }
          })
        } catch (error) {
          console.error(error)
        }
      }
    )
  }

  // render angular material table rows
  renderTableRows() {
    console.log('RoleListComponent | renderTableRows')
    if (this.roleTable) {
      this.roleTable.renderRows();
    }
    if (this.featureTable) {
      this.featureTable.renderRows();
    }
  }
}
