import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  branchApiUrl = environment.apiurl + 'branch/';

  //constructor
  constructor(private authService: AuthService) { 
    console.log('BranchService | constructor')
  }

  //get branch list with pagination and search
  getBranchList(page, pageSize, search) {
    let url = this.branchApiUrl + page + '/' + pageSize + '/' + search;
    console.log("BranchService | getBranchList ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  //delete branch by id
  deleteBranch(id){
    let url = this.branchApiUrl + id;
    console.log("BranchService | deleteBranch ", url);
    return this.authService.wrapTokenDeleteApi(url)
  }

  //create branch
  createBranch(data){
    console.log("BranchService | createBranch ", this.branchApiUrl);
    return this.authService.wrapTokenPostApi(this.branchApiUrl, data);
  }

  //get branch by id
  getBranchById(id){
    let url = this.branchApiUrl + id;
    console.log("BranchService | getFaqById ", url);
    return this.authService.wrapTokenGetApi(url);
  }

  //update branch by id
  updateBranch(data){
    console.log("BranchService | updateBranch ", this.branchApiUrl);
    return this.authService.wrapTokenPutApi(this.branchApiUrl, data);
  }

  //upload csv
  uploadCSV(file: File){
    let url = this.branchApiUrl + 'uploadCSV';
    console.log("BranchService | uploadCSV ", url);
    let data = new FormData();
    data.append('file', file);
    return this.authService.wrapTokenPostApi(url, data);
  }
}
