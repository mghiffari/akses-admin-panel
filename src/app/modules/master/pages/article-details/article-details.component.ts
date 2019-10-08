import { Component, OnInit } from '@angular/core';
import { ArticleDetailsService } from 'src/app/modules/master/pages/article-details/services/article-details.service';
import { Router, ActivatedRoute } from '@angular/router';
import { constants } from 'src/app/shared/common/constants';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: []
})
export class ArticleDetailsComponent implements OnInit {
  vCurrentPage: string;
  vId: string;

  tinyMceSettings = constants.tinyMceSettings;

  constructor(
    private _articleDetailsService: ArticleDetailsService,
    private _routerService: Router,
    private _activatedRouteService: ActivatedRoute
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
    return this._articleDetailsService[variableName];
  }

  //get current page (create or update)
  getCurrentPage() {
    console.log('ArticleDetailComponent | getCurrentPage');
    this.vCurrentPage = this._routerService.url;
    this._articleDetailsService.getFeaturePrvg()
    if(this.vCurrentPage.includes("create")) {
      if(this._articleDetailsService.getCreatePrvg()){
        this._articleDetailsService.resetArticleData();
        this.resetCheckBox();
        this.initData();
      } else {
        this._articleDetailsService.showNoAccessSnackbar()
      }
    } else if(this.vCurrentPage.includes("update")){
      if(this._articleDetailsService.getEditPrvg()){
        this.vId = this._activatedRouteService.snapshot.params['id'];
        this._articleDetailsService.loadArticleById(this.vId).then(response => {
          this.initiateCheckBox();
        }).catch( err =>{
          console.table(err);
        });
        this.initData()
      } else {
        this._articleDetailsService.showNoAccessSnackbar()
      }
    }
  }

  // initialize form and data
  initData(){
    console.log('ArticleDetailComponent | initData');
    this._articleDetailsService.resetErrorMessage();
    this._articleDetailsService.loadModuls();
    this._articleDetailsService.loadCategoryData();
  }

  //get title of the page (create or update) from services
  getTitle() {
    console.log('ArticleDetailComponent | getTitle');
    return this._articleDetailsService.getPageTitle(this.vCurrentPage);
  }

  //get loading status for button save
  isLoading() {
    console.log('ArticleDetailComponent | isLoading');
    return this._articleDetailsService.isLoading();
  }

  //get is loading status for form (update page)
  isLoadingForm() {
    console.log('ArticleDetailComponent | isLoadingForm');
    return this._articleDetailsService.isLoadingForm();
  }

  //initiate check box for update component
  initiateCheckBox() {
    console.log('ArticleDetailComponent | initiateCheckBox');
    this._articleDetailsService.vShowFooterText = this.getArticleData().foot_text_content != "";
    this._articleDetailsService.vShowFooterTextModul = this.getArticleData().foot_text_flg === "int";
    this._articleDetailsService.vShowFooterTextURL = this.getArticleData().foot_text_flg == "ext";
    this._articleDetailsService.vShowFooterImage = this.getArticleData().foot_image_content != "" && this.getArticleData().foot_image_content !== undefined && this.getArticleData().foot_image_content !== null;
    this._articleDetailsService.vShowFooterImageModul = this.getArticleData().foot_image_flg == "int";
    this._articleDetailsService.vShowFooterImageURL = this.getArticleData().foot_image_flg == "ext";
    this._articleDetailsService.vShowFooterButton = this.getArticleData().foot_button_content != "";
    this._articleDetailsService.vShowFooterButtonModul = this.getArticleData().foot_button_flg == "int";
    this._articleDetailsService.vShowFooterButtonURL = this.getArticleData().foot_button_flg == "ext";
  }

  //get category data from services
  getCategoryData() {
    console.log('ArticleDetailComponent | getCategoryData');
    return this._articleDetailsService.getCategoryData();
  }

  //get moduls data from services
  getModuls() {
    console.log('ArticleDetailComponent | getModuls');
    return this._articleDetailsService.getModuls();
  }

  //get article data for page
  getArticleData() {
    console.log('ArticleDetailComponent | getArticleData');
    return this._articleDetailsService.getArticleData();
  }

  //get error message for input URL and image
  getErrorMessage() {
    console.log('ArticleDetailComponent | getErrorMessage');
    return this._articleDetailsService.getErrorMessage();
  }

  //reset check box by default (all not checked)
  resetCheckBox() {
    console.log('ArticleDetailComponent | resetCheckbox');
    this._articleDetailsService.vShowFooterText = false;
    this._articleDetailsService.vShowFooterTextModul = false;
    this._articleDetailsService.vShowFooterTextURL = false;
    this._articleDetailsService.vShowFooterImage = false;
    this._articleDetailsService.vShowFooterImageModul = false;
    this._articleDetailsService.vShowFooterImageURL = false;
    this._articleDetailsService.vShowFooterButton = false;
    this._articleDetailsService.vShowFooterButtonModul = false;
    this._articleDetailsService.vShowFooterButtonURL = false;
  }

  //preview and compress image process when image choosen
  uploadImage(component: string, files){
    console.log('ArticleDetailComponent | uploadImage');
    this._articleDetailsService.previewImage(component, files);
  }

  //check button save disable or not
  isDisableCreateArticle(){
    console.log('ArticleDetailComponent | isDisableCreateArticle');
    return this._articleDetailsService.isDisableCreateArticle();
  }

  //when button save clicked
  saveArticle() {
    console.log('ArticleDetailComponent | saveArticle');
    if(this.vCurrentPage.includes("create")) {
      this.resetCheckBox();
    }
    this._articleDetailsService.buttonSave();
  }

  //triggered when check box footer text clicked
  showFooterText() {
    console.log('ArticleDetailComponent | showFooterText');
    this._articleDetailsService.vShowFooterText = !this._articleDetailsService.vShowFooterText;
    if(!this._articleDetailsService.vShowFooterText) {
      this._articleDetailsService.vShowFooterTextURL = false;
      this._articleDetailsService.vShowFooterTextModul = false;
      this._articleDetailsService.resetFootText("","","");
    }
  }

  //triggered when radio button adiraku page on footer text clicked
  showFooterTextModul() {
    console.log('ArticleDetailComponent | showFooterTextModul');
    this._articleDetailsService.vShowFooterTextModul = true;
    this._articleDetailsService.vShowFooterTextURL = false;
    this._articleDetailsService.resetFootText(this.getArticleData().foot_text_flg,this.getArticleData().foot_text_content,"");
  }
  
  //triggered when radio button external url on footer text clicked 
  showFooterTextURL() {
    console.log('ArticleDetailComponent | showFooterTextURL')
    this._articleDetailsService.vShowFooterTextModul = false;
    this._articleDetailsService.vShowFooterTextURL = true;
    this._articleDetailsService.resetFootText(this.getArticleData().foot_text_flg,this.getArticleData().foot_text_content,"");
  }

  //triggered when check box footer image clicked
  showFooterImage() {
    console.log('ArticleDetailComponent | showFooterImage');
    this._articleDetailsService.vShowFooterImage = !this._articleDetailsService.vShowFooterImage;
    if(!this._articleDetailsService.vShowFooterImage) {
      this._articleDetailsService.vShowFooterImageModul = false;
      this._articleDetailsService.vShowFooterImageURL = false;
      this._articleDetailsService.resetFootImage(null,"","");
    }
  }

  //triggered when radio button access page on footer image clicked
  showFooterImageModul() {
    console.log('ArticleDetailComponent | showFooterImageModul');
    this._articleDetailsService.vShowFooterImageModul = true;
    this._articleDetailsService.vShowFooterImageURL = false;
    this._articleDetailsService.resetFootImage(this.getArticleData().foot_image_flg,this.getArticleData().foot_image_content,"");
  }

  //triggered when radio button external url on footer image clicked
  showFooterImageURL() {
    console.log('ArticleDetailComponent | showFooterImageURL');
    this._articleDetailsService.vShowFooterImageModul = false;
    this._articleDetailsService.vShowFooterImageURL = true;
    this._articleDetailsService.resetFootImage(this.getArticleData().foot_image_flg,this.getArticleData().foot_image_content,"");
  }

  //triggered when check box footer button clicked
  showFooterButton() {
    console.log('ArticleDetailComponent | showFooterButton');
    this._articleDetailsService.vShowFooterButton = !this._articleDetailsService.vShowFooterButton;
    if(!this._articleDetailsService.vShowFooterButton) {
      this._articleDetailsService.vShowFooterButtonModul = true;
      this._articleDetailsService.vShowFooterButtonURL = false;
      this._articleDetailsService.resetFootButton("","","");
    }
  }

  //triggered when radio button access page on footer button clicked
  showFooterButtonModul() {
    console.log('ArticleDetailComponent | showFooterButtonModul');
    this._articleDetailsService.vShowFooterButtonModul = true;
    this._articleDetailsService.vShowFooterButtonURL = false;
    this._articleDetailsService.resetFootButton(this.getArticleData().foot_button_flg,this.getArticleData().foot_button_content,"");
  }

  //triggered when radio button external url on footer button clicked
  showFooterButtonURL() {
    console.log('ArticleDetailComponent | showFooterButtonURL');
    this._articleDetailsService.vShowFooterButtonModul = false;
    this._articleDetailsService.vShowFooterButtonURL = true;
    this._articleDetailsService.resetFootButton(this.getArticleData().foot_button_flg,this.getArticleData().foot_button_content,"");
  }
}
