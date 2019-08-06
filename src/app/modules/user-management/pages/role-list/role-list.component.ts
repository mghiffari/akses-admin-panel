import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { PageService } from 'src/app/shared/services/page.service';
import { MatSnackBar } from '@angular/material';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { Feature } from '../../models/feature';
import { RolePrivilege } from '../../models/role-privilege';
import { Privilege } from '../../models/privilege';

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

  // constructor
  constructor(
    private pageService: PageService,
    private snackBar: MatSnackBar,
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

  // roles control getter
  get roles() {
    return this.form.get('roles')
  }

  // get rolles as form array
  get rolesFormArray() {
    let formArray = this.roles as FormArray
    return formArray;
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

  // method to get view privilege form control from table element form group
  getElementFeatureView(element) {
    console.log('RoleListComponent | getElementFeatureView')
    return this.getElementFormControl(element, 'view');
  }

  // method to get create privilege form control from table element form group
  getElementFeatureCreate(element) {
    console.log('RoleListComponent | getElementFeatureCreate')
    return this.getElementFormControl(element, 'create');
  }

  // method to get edit privilege form control from table element form group
  getElementFeatureEdit(element) {
    console.log('RoleListComponent | getElementFeatureEdit')
    return this.getElementFormControl(element, 'edit');
  }

  // method to get delete privilege form control from table element form group
  getElementFeatureDelete(element) {
    console.log('RoleListComponent | getElementFeatureDelete')
    return this.getElementFormControl(element, 'delete');
  }

  // method to get publish privilege form control from table element form group
  getElementFeaturePublish(element) {
    console.log('RoleListComponent | getElementFeaturePublish')
    return this.getElementFormControl(element, 'publish');
  }

  // method to get download privilege form control from table element form group
  getElementFeatureDownload(element) {
    console.log('RoleListComponent | getElementFeatureDownload')
    return this.getElementFormControl(element, 'download');
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

  // reset the previous selected role values
  onChangeRole(prevIndex) {
    console.log('RoleListComponent | onChangeRole')
    let formArray = this.rolesFormArray
    let prevRoleForm = formArray.at(prevIndex)
    if (prevRoleForm) {
      let prevRole = prevRoleForm.value
      if (prevRole.id && prevRole.id !== '') {
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
                pageId: feature.id,
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
                pageId: feature.id,
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
            privileges: privileges
          })
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
  selectRole(index) {
    console.log('RoleListComponent | selectRole')
    if (index !== this.selectedRowIndex) {
      let prevIndex = this.selectedRowIndex
      this.selectedRowIndex = index
      this.isEditModeName = false
      this.onChangeRole(prevIndex)
    }
  }

  // enable editing selected role name
  editRole(index) {
    console.log('RoleListComponent | editRole')
    this.isEditModeName = true
    if (index !== this.selectedRowIndex) {
      let prevIndex = this.selectedRowIndex
      this.selectedRowIndex = index
      this.onChangeRole(prevIndex)
    }
  }

  // call delete role api if saved, else remove from form array
  deleteRole(index) {
    console.log('RoleListComponent | deleteRole')
    this.selectRole(index)
    let formArray = this.rolesFormArray
    let roleForm = formArray.at(index)
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

  // append new role form to form array
  addRole() {
    console.log('RoleListComponent | addRole')
    let formArray = this.rolesFormArray
    let privileges = [];
    this.featureList.forEach(feature => {
      privileges.push(new FormGroup({
        pageId: new FormControl(feature.id),
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
      privileges: new FormArray(privileges)
    }))
    this.renderTableRows()
    this.selectRole(formArray.length - 1)
    this.isEditModeName = true
  }

  // call api to get list of roles, privileges and list of features
  loadData() {
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
                  pageId: new FormControl(feature.id),
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
                  pageId: new FormControl(feature.id),
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
              privileges: new FormArray(privileges)
            }))
          })
          this.form = new FormGroup({
            roles: new FormArray(roles)
          })
          if (this.selectedRowIndex < 0) {
            if (this.roleList.length > 0) {
              this.selectedRowIndex = 0;
            }
          } else {
            if (this.roleList.length <= this.selectedRowIndex) {
              this.selectedRowIndex = this.roleList.length - 1
            }
          }
          this.renderTableRows()
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
          console.log(error)
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
