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
import { AuthService } from 'src/app/shared/services/auth.service';
import { constants } from 'src/app/shared/common/constants';

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
  allowCreate = false;
  allowDelete = false;
  allowEdit = false;

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
    private modal: MatDialog,
    private authService: AuthService
  ) {
    console.log('RoleListComponent | constructor')
  }

  // on component init
  ngOnInit() {
    console.log('RoleListComponent | ngOnInit')
    let prvg = this.authService.getFeaturePrivilege(constants.features.role)
    if (this.authService.getFeatureViewPrvg(prvg)) {
      this.allowCreate = this.authService.getFeatureCreatePrvg(prvg)
      this.allowEdit = this.authService.getFeatureEditPrvg(prvg)
      this.allowDelete = this.authService.getFeatureDeletePrvg(prvg)
      this.form = new FormGroup({
        roles: new FormArray([])
      })
      this.isEditModeName = false
      this.selectedRowIndex = -1
      this.loadData()
    } else {
      this.authService.blockOpenPage()
    }
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

  // check if all feature privileges are checked
  isCheckedAllFeature(){
    let formArray = this.getPrivilegesFormArray()
    if(formArray){
      const controls = (formArray as FormArray).controls
      let isAllSelected = true
      for(let featureForm of controls){
        isAllSelected = isAllSelected && this.isCheckedAllPrvg(featureForm as FormGroup)
        if(!isAllSelected){
          break;
        }
      }
      return isAllSelected
    } else {
      return false
    }
  }

  // check if all privileges partially selected
  isIndeterminateAllFeature(){
    let formArray = this.getPrivilegesFormArray()
    if(formArray){
      const features = formArray.value
      let foundCheck = false
      let foundUncheck = false
      for(let feature of features){
        if(foundCheck){
          if(foundUncheck){
            break;
          } else {
            foundUncheck = !(feature.view && feature.edit && feature.delete && feature.publish && feature.download && feature.create)
            if(foundUncheck){
              break;
            }
          }
        } else {
          foundCheck = foundCheck || (feature.view || feature.edit || feature.delete || feature.publish || feature.download || feature.create)
          if(!foundUncheck){
            foundUncheck = !(feature.view && feature.edit && feature.delete && feature.publish && feature.download && feature.create)
          }
        }
      }
      return foundCheck && foundUncheck
    } else {
      return false
    }
  }

  // toggle check all feature
  checkedAllFeature(e){
    let formArray = this.getPrivilegesFormArray()
    if(formArray){
      const controls = (formArray as FormArray).controls
      for(let featureForm of controls){
        this.checkedAllPrvg(e, featureForm as FormGroup)
      }
    }
  }

  // check if a feature privileges are checked
  isCheckedAllPrvg(form: FormGroup){
    let formValue = form.value
    return formValue.view && formValue.edit && formValue.delete && formValue.publish && formValue.download && formValue.create
  }

  // check if a feature privileges are indeterminate
  isIndeterminateAllPrvg(form: FormGroup){
    let formValue = form.value
    return formValue.view && !(formValue.edit && formValue.delete && formValue.publish && formValue.download && formValue.create)
  }

  // toggle check all feature privilege
  checkedAllPrvg(e, form: FormGroup){
    if (e.checked) {
      form.patchValue({
        view: true,
        create: true,
        edit: true,
        delete: true,
        publish: true,
        download: true
      })
    } else {
      form.patchValue({
        view: false,
        create: false,
        edit: false,
        delete: false,
        publish: false,
        download: false
      })
    }
    form.markAsDirty()
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
      form.markAsDirty()
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
      form.markAsDirty()
    }
  }

  // method to get a form control from table element form group
  getElementFormControl(element, formControlName) {
    console.log('RoleListComponent | getElementFormControl');
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
    return 'features.' + this.getElementFormControl(element, 'unique_tag').value;
  }

  // method to get features
  getPrivilegesFormArray() {
    console.log('RoleListComponent | getPrivilegesFormArray')
    if (this.selectedRowIndex < 0) {
      return null
    } else {
      let form = this.rolesFormArray.at(this.selectedRowIndex)
      return form ? (form.get('privileges') as FormArray) : null
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
        if (prevRoleForm.dirty) {
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
                  unique_tag: feature.unique_tag,
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
                  unique_tag: feature.unique_tag,
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
    } else if (afterSelect) {
      afterSelect()
    }
  }

  // enable editing selected role name
  editRole(index, onSucess = null) {
    console.log('RoleListComponent | editRole')
    if (this.allowEdit) {
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
    } else {
      this.authService.blockPageAction()
    }

  }

  // call delete role api if saved, else remove from form array
  deleteRole(index) {
    console.log('RoleListComponent | deleteRole')
    if (this.allowDelete) {
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
              let selectedRole = this.roleList.find((el: RolePrivilege) => {
                return el.id === roleId
              })
              if (selectedRole) {
                this.loading = true
                let deletedRole: RolePrivilege = Object.assign(new RolePrivilege(), selectedRole)
                deletedRole.is_deleted = true
                this.pageService.updateRolePrivileges(deletedRole).subscribe(
                  response => {
                    console.table(response);
                    this.snackBar.openFromComponent(SuccessSnackbarComponent, {
                      data: {
                        title: 'success',
                        content: {
                          text: 'dataDeleted',
                          data: null
                        }
                      }
                    })
                    this.loadData()
                  },
                  error => {
                    try {
                      console.table(error);
                      this.loading = false;
                      this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                        data: {
                          title: 'failedToDelete',
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
            } else {
              if (this.rolesFormArray.length > 0) {
                this.selectedRowIndex = 0
              }
            }
          }
          this.selectRole(index, afterSelect)
        }
      })
    } else {
      this.authService.blockPageAction()
    }
  }

  // append new role form to form array
  addRole() {
    console.log('RoleListComponent | addRole')
    if (this.allowCreate) {
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
            download: new FormControl(false),
            unique_tag: new FormControl(feature.unique_tag),
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
    } else {
      this.authService.blockPageAction()
    }
  }

  // button save click handler
  save(onSuccess = null) {
    console.log('RoleListComponent | save')
    let selectedRoleFormGroup = this.selectedRole
    let selectedRole = selectedRoleFormGroup.value
    let allowSave = false
    if (selectedRole.id && selectedRole.id !== '') {
      allowSave = this.allowEdit
    } else {
      allowSave = this.allowCreate
    }
    if (allowSave) {
      if (selectedRoleFormGroup) {
        if (selectedRoleFormGroup.valid) {
  
          this.loading = true;
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
    } else {
      this.authService.blockPageAction()
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
                  unique_tag: new FormControl(feature.unique_tag),
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
                  unique_tag: new FormControl(feature.unique_tag),
                  view: new FormControl(false),
                  create: new FormControl(false),
                  edit: new FormControl(false),
                  delete: new FormControl(false),
                  publish: new FormControl(false),
                  download: new FormControl(false)
                }))
              }
            })
            let roleForm = new FormGroup({
              id: new FormControl(id),
              name: new FormControl(name, Validators.required),
              description: new FormControl(el.description),
              privileges: new FormArray(privileges)
            })
            if(!this.allowEdit){
              roleForm.disable()
            }
            roles.push(roleForm)
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
