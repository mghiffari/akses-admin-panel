import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/auth.service';
import Utils from '../../../shared/common/utils';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  branchApiUrl = environment.apiurl + 'branch';
  getBranchByCodeApiUrl = this.branchApiUrl + '/q?code='
  uploadCSVApiUrl = this.branchApiUrl + '/csv';

  //constructor
  constructor(private authService: AuthService) { 
    console.log('BranchService | constructor')
  }

  //get branch list with pagination and search
  getBranchList(page, pageSize, search) {
    let url = this.branchApiUrl + '/' + page + '/' + pageSize + Utils.appendSearchKeyword(search);
    console.log("BranchService | getBranchList ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  //create branch
  createBranch(data){
    console.log("BranchService | createBranch ", this.branchApiUrl);
    return this.authService.wrapTokenPostApi(this.branchApiUrl, data);
  }

  //get branch by id
  getBranchById(id){
    let url = this.branchApiUrl + '/' + id;
    console.log("BranchService | getBranchById ", url);
    return this.authService.wrapTokenGetApi(url);
  }

  //update branch by id
  updateBranch(data){
    console.log("BranchService | updateBranch ", this.branchApiUrl);
    return this.authService.wrapTokenPutApi(this.branchApiUrl, data);
  }

  //upload csv
  uploadCSV(file){
    console.log("BranchService | uploadCSV ", this.uploadCSVApiUrl);
    let data = {
      csv: file
    }
    return this.authService.wrapTokenPostApi(this.uploadCSVApiUrl, data);
  }

  //get branch by code
  getBranchByCode(code){
    let url = this.getBranchByCodeApiUrl + code;
    console.log("BranchService | getBranchByCode ", url);
    return this.authService.wrapTokenGetApi(url);
  }
}
