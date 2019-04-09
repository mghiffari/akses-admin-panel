import { Component, OnInit } from '@angular/core';
import { BannerDetailsService } from './services/banner-details.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

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

  //footer
  vShowFooterText: boolean = false;
  vShowFooterTextModul: boolean = false;
  vShowFooterTextURL: boolean = false;
  vShowFooterImage: boolean = false;
  vShowFooterImageModul: boolean = false;
  vShowFooterImageURL: boolean = false;
  vShowFooterButton: boolean = false;
  vShowFooterButtonModul: boolean = false;
  vShowFooterButtonURL: boolean = false;

  //used for default rich text editor
  tinyMceSettings = environment.tinyMceSettings;

  constructor(
    private _bannerDetailService: BannerDetailsService,
    private _routerService: Router,
    private _activatedRouteService: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getCurrentPage();
    this._bannerDetailService.resetErrorMessage();
    this._bannerDetailService.loadOrders();
    this._bannerDetailService.loadModuls();
  }

  //get current page (create or update)
  getCurrentPage() {
    console.log('BannerDetailComponent | getCurrentPage');
    this.vCurrentPage = this._routerService.url;
    if(this.vCurrentPage.includes("create")) {
      this._bannerDetailService.resetCreateBannerData();
      this.resetCheckBox();
    } else if(this.vCurrentPage.includes("update")){
      this.vId = this._activatedRouteService.snapshot.params['id'];
      this._bannerDetailService.loadBannerById(this.vId).then(response => {
        this.initiateCheckBox();
      }).catch( err =>{
        console.table(err);
      });
    }
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
    this.vShowFooterText = false;
    this.vShowFooterTextModul = false;
    this.vShowFooterTextURL = false;
    this.vShowFooterImage = false;
    this.vShowFooterImageModul = false;
    this.vShowFooterImageURL = false;
    this.vShowFooterButton = false;
    this.vShowFooterButtonModul = false;
    this.vShowFooterButtonURL = false;
    this.vShowExternalURL = false;
    this.vShowModul = false;
  }

  //initiate check box for update component
  initiateCheckBox() {
    console.log('BannerDetailComponent | initiateCheckBox');
    this.vClickableChecked = this.getCreateBannerData().clickable_flg;
    this.vShowDetailPage = this.getCreateBannerData().clickable_is_detail;
    this.vShowURL = this.getCreateBannerData().clickable_flg && !this.getCreateBannerData().clickable_is_detail;
    this.vShowFooterText = this.getCreateBannerData().foot_text_content != "";
    this.vShowFooterTextModul = this.getCreateBannerData().foot_text_flg === "int";
    this.vShowFooterTextURL = this.getCreateBannerData().foot_text_flg == "ext";
    this.vShowFooterImage = this.getCreateBannerData().foot_image_content != "" && this.getCreateBannerData().foot_image_content !== undefined && this.getCreateBannerData().foot_image_content !== null;
    this.vShowFooterImageModul = this.getCreateBannerData().foot_image_flg == "int";
    this.vShowFooterImageURL = this.getCreateBannerData().foot_image_flg == "ext";
    this.vShowFooterButton = this.getCreateBannerData().foot_button_content != "";
    this.vShowFooterButtonModul = this.getCreateBannerData().foot_button_flg == "int";
    this.vShowFooterButtonURL = this.getCreateBannerData().foot_button_flg == "ext";
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
    this.vShowFooterText = false;
    this.vShowFooterImage = false;
    this.vShowFooterButton = false;
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
    this.vShowFooterText = !this.vShowFooterText;
    if(!this.vShowFooterText) {
      this.vShowFooterTextURL = false;
      this.vShowFooterTextModul = false;
      this._bannerDetailService.resetFootText("","","");
    }
  }

  //triggered when radio button akses page on footer text clicked
  showFooterTextModul() {
    console.log('BannerDetailComponent | showFooterTextModul');
    this.vShowFooterTextModul = true;
    this.vShowFooterTextURL = false;
    this._bannerDetailService.resetFootText(this.getCreateBannerData().foot_text_flg,this.getCreateBannerData().foot_text_content,"");
  }
  
  //triggered when radio button external url on footer text clicked 
  showFooterTextURL() {
    console.log('BannerDetailComponent | showFooterTextURL')
    this.vShowFooterTextModul = false;
    this.vShowFooterTextURL = true;
    this._bannerDetailService.resetFootText(this.getCreateBannerData().foot_text_flg,this.getCreateBannerData().foot_text_content,"");
  }

  //triggered when check box footer image clicked
  showFooterImage() {
    console.log('BannerDetailComponent | showFooterImage');
    this.vShowFooterImage = !this.vShowFooterImage;
    if(!this.vShowFooterImage) {
      this.vShowFooterImageModul = false;
      this.vShowFooterImageURL = false;
      this._bannerDetailService.resetFootImage(null,"","");
    }
  }

  //triggered when radio button access page on footer image clicked
  showFooterImageModul() {
    console.log('BannerDetailComponent | showFooterImageModul');
    this.vShowFooterImageModul = true;
    this.vShowFooterImageURL = false;
    this._bannerDetailService.resetFootImage(this.getCreateBannerData().foot_image_flg,this.getCreateBannerData().foot_image_content,"");
  }

  //triggered when radio button external url on footer image clicked
  showFooterImageURL() {
    console.log('BannerDetailComponent | showFooterImageURL');
    this.vShowFooterImageModul = false;
    this.vShowFooterImageURL = true;
    this._bannerDetailService.resetFootImage(this.getCreateBannerData().foot_image_flg,this.getCreateBannerData().foot_image_content,"");
  }

  //triggered when check box footer button clicked
  showFooterButton() {
    console.log('BannerDetailComponent | showFooterButton');
    this.vShowFooterButton = !this.vShowFooterButton;
    if(!this.vShowFooterButton) {
      this.vShowFooterButtonModul = true;
      this.vShowFooterButtonURL = false;
      this._bannerDetailService.resetFootButton("","","");
    }
  }

  //triggered when radio button access page on footer button clicked
  showFooterButtonModul() {
    console.log('BannerDetailComponent | showFooterButtonModul');
    this.vShowFooterButtonModul = true;
    this.vShowFooterButtonURL = false;
    this._bannerDetailService.resetFootButton(this.getCreateBannerData().foot_button_flg,this.getCreateBannerData().foot_button_content,"");
  }

  //triggered when radio button external url on footer button clicked
  showFooterButtonURL() {
    console.log('BannerDetailComponent | showFooterButtonURL');
    this.vShowFooterButtonModul = false;
    this.vShowFooterButtonURL = true;
    this._bannerDetailService.resetFootButton(this.getCreateBannerData().foot_button_flg,this.getCreateBannerData().foot_button_content,"");
  }
}
