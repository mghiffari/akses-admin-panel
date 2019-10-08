import { Component, OnInit } from '@angular/core';
import { BannerDetailsService } from './services/banner-details.service';
import { Router, ActivatedRoute } from '@angular/router';
import { constants } from 'src/app/shared/common/constants';

@Component({
  selector: 'app-banner-detail',
  templateUrl: './banner-details.component.html',
  styleUrls: []
})
export class BannerDetailsComponent implements OnInit {
  vCurrentPage: string;
  vId: string = "";

  vClickableChecked: boolean = false;
  
  //show URL
  vShowURL: boolean = false;
  vShowModul: boolean = false;
  vShowExternalURL: boolean = false;

  //show detail page
  vShowDetailPage: boolean = false;

  //used for default rich text editor
  tinyMceSettings = constants.tinyMceSettings;

  constructor(
    private _bannerDetailService: BannerDetailsService,
    private _routerService: Router,
    private _activatedRouteService: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getCurrentPage(); 
  }

  getShowFooterText(){
    return this.getFooter('vShowFooterText')
  }

  getShowFooterTextModul(){
    return this.getFooter('vShowFooterTextModul')
  }

  getShowFooterTextURL(){
    return this.getFooter('vShowFooterTextURL')
  }

  getShowFooterImage(){
    return this.getFooter('vShowFooterImage')
  }

  getShowFooterImageModul(){
    return this.getFooter('vShowFooterImageModul')
  }

  getShowFooterImageURL(){
    return this.getFooter('vShowFooterImageURL')
  }

  getShowFooterButton(){
    return this.getFooter('vShowFooterButton')
  }

  getShowFooterButtonModul(){
    return this.getFooter('vShowFooterButtonModul')
  }

  getShowFooterButtonURL(){
    return this.getFooter('vShowFooterButtonURL')
  }

  getFooter(variableName){
    return this._bannerDetailService[variableName];
  }

  //get current page (create or update)
  getCurrentPage() {
    console.log('BannerDetailComponent | getCurrentPage');
    this._bannerDetailService.getFeaturePrvg();
    this.vCurrentPage = this._routerService.url;
    if(this.vCurrentPage.includes("create")) {
      if(this._bannerDetailService.getCreatePrvg()){
        this._bannerDetailService.resetCreateBannerData();
        this.resetCheckBox();
        this.initData()
      } else {
        this._bannerDetailService.showNoAccessSnackbar()
      }
    } else if(this.vCurrentPage.includes("update")){
      if(this._bannerDetailService.getEditPrvg()){
        this.vId = this._activatedRouteService.snapshot.params['id'];
        this._bannerDetailService.loadBannerById(this.vId).then(response => {
          this.initiateCheckBox();
        }).catch( err =>{
          console.table(err);
        });
        this.initData()
      } else {
        this._bannerDetailService.showNoAccessSnackbar()
      }
    }
  }

  // init page form and data
  initData(){
    console.log('BannerDetailComponent | initData');
    this._bannerDetailService.resetErrorMessage();
    this._bannerDetailService.loadOrders();
    this._bannerDetailService.loadModuls();
  }

  //get title of the page (create or update) from services
  getTitle() {
    console.log('BannerDetailComponent | getTitle');
    return this._bannerDetailService.getPageTitle(this.vCurrentPage);
  }

  //get order data from services
  getOrders() {
    console.log('BannerDetailComponent | getOrders');
    return this._bannerDetailService.getOrders();
  }

  //get moduls data from services
  getModuls() {
    console.log('BannerDetailComponent | getModuls');
    return this._bannerDetailService.getModuls();
  }

  //get banner data from services
  getCreateBannerData() {
    console.log('BannerDetailComponent | getCreateBannerData');
    return this._bannerDetailService.getCreateBannerData();
  }

  //reset check box by default (all not checked)
  resetCheckBox() {
    console.log('BannerDetailComponent | resetCheckbox');
    this.vClickableChecked = false;
    this.vShowDetailPage = false;
    this.vShowURL = false;
    this._bannerDetailService.vShowFooterText = false;
    this._bannerDetailService.vShowFooterTextModul = false;
    this._bannerDetailService.vShowFooterTextURL = false;
    this._bannerDetailService.vShowFooterImage = false;
    this._bannerDetailService.vShowFooterImageModul = false;
    this._bannerDetailService.vShowFooterImageURL = false;
    this._bannerDetailService.vShowFooterButton = false;
    this._bannerDetailService.vShowFooterButtonModul = false;
    this._bannerDetailService.vShowFooterButtonURL = false;
    this.vShowExternalURL = false;
    this.vShowModul = false;
  }

  //initiate check box for update component
  initiateCheckBox() {
    console.log('BannerDetailComponent | initiateCheckBox');
    this.vClickableChecked = this.getCreateBannerData().clickable_flg;
    this.vShowDetailPage = this.getCreateBannerData().clickable_is_detail;
    this.vShowURL = this.getCreateBannerData().clickable_flg && !this.getCreateBannerData().clickable_is_detail;
    this._bannerDetailService.vShowFooterText = this.getCreateBannerData().foot_text_content != "";
    this._bannerDetailService.vShowFooterTextModul = this.getCreateBannerData().foot_text_flg === "int";
    this._bannerDetailService.vShowFooterTextURL = this.getCreateBannerData().foot_text_flg == "ext";
    this._bannerDetailService.vShowFooterImage = this.getCreateBannerData().foot_image_content != "" && this.getCreateBannerData().foot_image_content !== undefined && this.getCreateBannerData().foot_image_content !== null;
    this._bannerDetailService.vShowFooterImageModul = this.getCreateBannerData().foot_image_flg == "int";
    this._bannerDetailService.vShowFooterImageURL = this.getCreateBannerData().foot_image_flg == "ext";
    this._bannerDetailService.vShowFooterButton = this.getCreateBannerData().foot_button_content != "";
    this._bannerDetailService.vShowFooterButtonModul = this.getCreateBannerData().foot_button_flg == "int";
    this._bannerDetailService.vShowFooterButtonURL = this.getCreateBannerData().foot_button_flg == "ext";
    this.vShowExternalURL = this.getCreateBannerData().clickable_flg && !this.getCreateBannerData().clickable_is_internal;
    this.vShowModul = this.getCreateBannerData().clickable_is_internal;
    // console.log("initiate check box: ", this.vClickableChecked, this.vShowDetailPage, this.vShowURL, this.vShowFooterText,
    // this.vShowFooterTextModul, this.vShowFooterTextURL, this.vShowFooterImage, this.vShowFooterImageModul,
    // this.vShowFooterImageURL, this.vShowFooterButton, this.vShowFooterButtonModul, this.vShowFooterButtonURL,
    // this.vShowExternalURL, this.vShowModul);
  }

  //check button save disable or not
  isDisableCreateBanner(){
    console.log('BannerDetailComponent | isDisableCreateBanner');
    return this._bannerDetailService.isDisableCreateBanner();
  }

  //get error message for input URL and image
  getErrorMessage() {
    console.log('BannerDetailComponent | getErrorMessage');
    return this._bannerDetailService.getErrorMessage();
  }

  //get loading status for button save
  isLoading() {
    console.log('BannerDetailComponent | isLoading');
    return this._bannerDetailService.isLoading();
  }

  //get is loading status for form (update page)
  isLoadingForm() {
    console.log('BannerDetailComponent | isLoadingForm');
    return this._bannerDetailService.isLoadingForm();
  }

  //preview and compress image process when image choosen
  uploadImage(component: string, files){
    console.log('BannerDetailComponent | uploadImage');
    this._bannerDetailService.previewImage(component, files);
  }

  //triggered when button save clicked
  createBanner(){
    console.log('BannerDetailComponent | createBanner');
    if(this.vCurrentPage.includes("create")) {
      this.resetCheckBox();
    }
    this._bannerDetailService.buttonSave();
  }

  //triggered when checkbox (clickable) clicked
  doCheck() {
    console.log('BannerDetailComponent | doCheck');
    this.vClickableChecked = !this.vClickableChecked;
    this.vShowDetailPage = false;
    this.vShowURL = false;
    this._bannerDetailService.resetClickable(null, null,"");
    this._bannerDetailService.resetDetailPage("");
    this._bannerDetailService.resetFootText("","","");
    this._bannerDetailService.resetFootImage(null,"","");
    this._bannerDetailService.resetFootButton("","","");
  }

  //triggered when radio button detail page clicked
  showDetailPage() {
    console.log('BannerDetailComponent | showDetailPage');
    this.vShowDetailPage = true;
    this.vShowURL = false;
    this.vShowModul = false;
    this.vShowExternalURL = false;
    this._bannerDetailService.getCreateBannerData().clickable_is_detail = true;
    this._bannerDetailService.resetClickable(true, null,"");
  }

  //triggered when radio button URL Option clicked
  showURL() {
    console.log('BannerDetailComponent | showURL');
    this.vShowURL = true;
    this.vShowDetailPage = false;
    this._bannerDetailService.vShowFooterText = false;
    this._bannerDetailService.vShowFooterImage = false;
    this._bannerDetailService.vShowFooterButton = false;
    this._bannerDetailService.getCreateBannerData().clickable_is_detail = false;
    this._bannerDetailService.resetDetailPage("");
    this._bannerDetailService.resetFootText("","","");
    this._bannerDetailService.resetFootImage(null,"","");
    this._bannerDetailService.resetFootButton("","","");
  }

  //triggered when radio button access page clicked
  showModul() {
    console.log('BannerDetailComponent | showModul');
    this.vShowModul = true;
    this.vShowExternalURL = false;
    this._bannerDetailService.resetClickable(false, true, "");
  }

  //triggered when radio button external url clicked
  showExternalURL() {
    console.log('BannerDetailComponent | showExternalURL');
    this.vShowExternalURL = true;
    this.vShowModul = false;
    this._bannerDetailService.resetClickable(false, false, "");
  }

  //triggered when check box footer text clicked
  showFooterText() {
    console.log('BannerDetailComponent | showFooterText');
    this._bannerDetailService.vShowFooterText = !this._bannerDetailService.vShowFooterText;
    if(!this._bannerDetailService.vShowFooterText) {
      this._bannerDetailService.vShowFooterTextURL = false;
      this._bannerDetailService.vShowFooterTextModul = false;
      this._bannerDetailService.resetFootText("","","");
    }
  }

  //triggered when radio button adiraku page on footer text clicked
  showFooterTextModul() {
    console.log('BannerDetailComponent | showFooterTextModul');
    this._bannerDetailService.vShowFooterTextModul = true;
    this._bannerDetailService.vShowFooterTextURL = false;
    this._bannerDetailService.resetFootText(this.getCreateBannerData().foot_text_flg,this.getCreateBannerData().foot_text_content,"");
  }
  
  //triggered when radio button external url on footer text clicked 
  showFooterTextURL() {
    console.log('BannerDetailComponent | showFooterTextURL')
    this._bannerDetailService.vShowFooterTextModul = false;
    this._bannerDetailService.vShowFooterTextURL = true;
    this._bannerDetailService.resetFootText(this.getCreateBannerData().foot_text_flg,this.getCreateBannerData().foot_text_content,"");
  }

  //triggered when check box footer image clicked
  showFooterImage() {
    console.log('BannerDetailComponent | showFooterImage');
    this._bannerDetailService.vShowFooterImage = !this._bannerDetailService.vShowFooterImage;
    if(!this._bannerDetailService.vShowFooterImage) {
      this._bannerDetailService.vShowFooterImageModul = false;
      this._bannerDetailService.vShowFooterImageURL = false;
      this._bannerDetailService.resetFootImage(null,"","");
    }
  }

  //triggered when radio button access page on footer image clicked
  showFooterImageModul() {
    console.log('BannerDetailComponent | showFooterImageModul');
    this._bannerDetailService.vShowFooterImageModul = true;
    this._bannerDetailService.vShowFooterImageURL = false;
    this._bannerDetailService.resetFootImage(this.getCreateBannerData().foot_image_flg,this.getCreateBannerData().foot_image_content,"");
  }

  //triggered when radio button external url on footer image clicked
  showFooterImageURL() {
    console.log('BannerDetailComponent | showFooterImageURL');
    this._bannerDetailService.vShowFooterImageModul = false;
    this._bannerDetailService.vShowFooterImageURL = true;
    this._bannerDetailService.resetFootImage(this.getCreateBannerData().foot_image_flg,this.getCreateBannerData().foot_image_content,"");
  }

  //triggered when check box footer button clicked
  showFooterButton() {
    console.log('BannerDetailComponent | showFooterButton');
    this._bannerDetailService.vShowFooterButton = !this._bannerDetailService.vShowFooterButton;
    if(!this._bannerDetailService.vShowFooterButton) {
      this._bannerDetailService.vShowFooterButtonModul = true;
      this._bannerDetailService.vShowFooterButtonURL = false;
      this._bannerDetailService.resetFootButton("","","");
    }
  }

  //triggered when radio button access page on footer button clicked
  showFooterButtonModul() {
    console.log('BannerDetailComponent | showFooterButtonModul');
    this._bannerDetailService.vShowFooterButtonModul = true;
    this._bannerDetailService.vShowFooterButtonURL = false;
    this._bannerDetailService.resetFootButton(this.getCreateBannerData().foot_button_flg,this.getCreateBannerData().foot_button_content,"");
  }

  //triggered when radio button external url on footer button clicked
  showFooterButtonURL() {
    console.log('BannerDetailComponent | showFooterButtonURL');
    this._bannerDetailService.vShowFooterButtonModul = false;
    this._bannerDetailService.vShowFooterButtonURL = true;
    this._bannerDetailService.resetFootButton(this.getCreateBannerData().foot_button_flg,this.getCreateBannerData().foot_button_content,"");
  }
}
