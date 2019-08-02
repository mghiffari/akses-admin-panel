import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-group-details',
  templateUrl: './user-group-details.component.html',
  styleUrls: ['./user-group-details.component.scss']
})
export class UserGroupDetailsComponent implements OnInit {
  groupForm: FormGroup
  isSubmittingForm = false
  loading = false

  // constructor
  constructor() { 
    console.log('UserGroupDetailsComponent | constructor')
  }

  // component on init
  ngOnInit() {
    console.log('UserGroupDetailsComponent | ngOnInit')
    this.groupForm = new FormGroup({
      groupName: new FormControl('', Validators.required),
      features: new FormArray([
        new FormGroup({
          featureName: new FormControl('feature 1'),
          allowView: new FormControl(false),
          allowCreate: new FormControl(false),
          allowEdit: new FormControl(false),
          allowDelete: new FormControl(false),
          allowPublish: new FormControl(false),
          allowDownload: new FormControl(false),
        }),
        new FormGroup({
          featureName: new FormControl('feature 2'),
          allowView: new FormControl(false),
          allowCreate: new FormControl(false),
          allowEdit: new FormControl(false),
          allowDelete: new FormControl(false),
          allowPublish: new FormControl(false),
          allowDownload: new FormControl(false),
        })
      ])
    })
  }

  // groupName formControl getter
  get groupName(){
    return this.groupForm.get('groupName') 
  }

  // features formControl getter
  get features(){
    return this.groupForm.get('features') 
  }

  // featureName formControl getter
  getFeatureName(index){
    const features = this.features as FormArray;
    return features.at(index).get('featureName')
  }

  // feature allowView formControl getter
  getAllowView(index){
    const features = this.features as FormArray;
    return features.at(index).get('allowView')
  }

  // feature allowCreate formControl getter
  getAllowCreate(index){
    const features = this.features as FormArray;
    return features.at(index).get('allowCreate')
  }

  // feature allowEdit formControl getter
  getAllowEdit(index){
    const features = this.features as FormArray;
    return features.at(index).get('allowEdit')
  }

  // feature allowDelete formControl getter
  getAllowDelete(index){
    const features = this.features as FormArray;
    return features.at(index).get('allowDelete')
  }

  // feature allowPublish formControl getter
  getAllowPublish(index){
    const features = this.features as FormArray;
    return features.at(index).get('allowPublish')
  }

  // feature allowDownload formControl getter
  getAllowDownload(index){
    const features = this.features as FormArray;
    return features.at(index).get('allowDownload')
  }

  // save buton click handler
  save() {
    console.log('UserGroupDetailsComponent | save')
  }

}
