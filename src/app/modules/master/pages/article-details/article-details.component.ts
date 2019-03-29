import { Component, OnInit } from '@angular/core';
import { ArticleDetailsService } from 'src/app/modules/master/pages/article-details/services/article-details.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss']
})
export class ArticleDetailsComponent implements OnInit {
  vCurrentPage: string;
  vId: string;

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

  tinyMceSettings = {
    inline: false,
    statusbar: false,
    browser_spellcheck: true,
    height: 320,
    plugins: ["lists", "table"],
    toolbar:
      "undo redo | formatselect | bold italic | forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table",
  };

  constructor(
    private _articleDetailsService: ArticleDetailsService,
    private _routerService: Router,
    private _activatedRouteService: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getCurrentPage();
    this._articleDetailsService.resetErrorMessage();
    this._articleDetailsService.loadModuls();
    this._articleDetailsService.loadCategoryData();
  }

  //get current page (create or update)
  getCurrentPage() {
    console.log('ArticleDetailComponent | getCurrentPage');
    this.vCurrentPage = this._routerService.url;
    if(this.vCurrentPage.includes("create")) {
      this._articleDetailsService.resetArticleData();
      this.resetCheckBox();
    } else if(this.vCurrentPage.includes("update")){
      this.vId = this._activatedRouteService.snapshot.params['id'];
      // this._articleDetailsService.loadArticleById(this.vId).then(response => {
      //   this.initiateCheckBox();
      // }).catch( err =>{
      //   console.table(err);
      // });
    }
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
    this.vShowFooterText = this.getArticleData().foot_text_content != "";
    this.vShowFooterTextModul = this.getArticleData().foot_text_flg === "int";
    this.vShowFooterTextURL = this.getArticleData().foot_text_flg == "ext";
    this.vShowFooterImage = this.getArticleData().foot_image_content != "" && this.getArticleData().foot_image_content !== undefined && this.getArticleData().foot_image_content !== null;
    this.vShowFooterImageModul = this.getArticleData().foot_image_flg == "int";
    this.vShowFooterImageURL = this.getArticleData().foot_image_flg == "ext";
    this.vShowFooterButton = this.getArticleData().foot_button_content != "";
    this.vShowFooterButtonModul = this.getArticleData().foot_button_flg == "int";
    this.vShowFooterButtonURL = this.getArticleData().foot_button_flg == "ext";
    // console.log("initiate check box: ", this.vClickableChecked, this.vShowDetailPage, this.vShowURL, this.vShowFooterText,
    // this.vShowFooterTextModul, this.vShowFooterTextURL, this.vShowFooterImage, this.vShowFooterImageModul,
    // this.vShowFooterImageURL, this.vShowFooterButton, this.vShowFooterButtonModul, this.vShowFooterButtonURL,
    // this.vShowExternalURL, this.vShowModul);
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
    this.vShowFooterText = false;
    this.vShowFooterTextModul = false;
    this.vShowFooterTextURL = false;
    this.vShowFooterImage = false;
    this.vShowFooterImageModul = false;
    this.vShowFooterImageURL = false;
    this.vShowFooterButton = false;
    this.vShowFooterButtonModul = false;
    this.vShowFooterButtonURL = false;
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
    this.vShowFooterText = !this.vShowFooterText;
    if(!this.vShowFooterText) {
      this.vShowFooterTextURL = false;
      this.vShowFooterTextModul = false;
      this._articleDetailsService.resetFootText("","","");
    }
  }

  //triggered when radio button akses page on footer text clicked
  showFooterTextModul() {
    console.log('ArticleDetailComponent | showFooterTextModul');
    this.vShowFooterTextModul = true;
    this.vShowFooterTextURL = false;
    this._articleDetailsService.resetFootText(this.getArticleData().foot_text_flg,this.getArticleData().foot_text_content,"");
  }
  
  //triggered when radio button external url on footer text clicked 
  showFooterTextURL() {
    console.log('ArticleDetailComponent | showFooterTextURL')
    this.vShowFooterTextModul = false;
    this.vShowFooterTextURL = true;
    this._articleDetailsService.resetFootText(this.getArticleData().foot_text_flg,this.getArticleData().foot_text_content,"");
  }

  //triggered when check box footer image clicked
  showFooterImage() {
    console.log('ArticleDetailComponent | showFooterImage');
    this.vShowFooterImage = !this.vShowFooterImage;
    if(!this.vShowFooterImage) {
      this.vShowFooterImageModul = false;
      this.vShowFooterImageURL = false;
      this._articleDetailsService.resetFootImage(null,"","");
    }
  }

  //triggered when radio button access page on footer image clicked
  showFooterImageModul() {
    console.log('ArticleDetailComponent | showFooterImageModul');
    this.vShowFooterImageModul = true;
    this.vShowFooterImageURL = false;
    this._articleDetailsService.resetFootImage(this.getArticleData().foot_image_flg,this.getArticleData().foot_image_content,"");
  }

  //triggered when radio button external url on footer image clicked
  showFooterImageURL() {
    console.log('ArticleDetailComponent | showFooterImageURL');
    this.vShowFooterImageModul = false;
    this.vShowFooterImageURL = true;
    this._articleDetailsService.resetFootImage(this.getArticleData().foot_image_flg,this.getArticleData().foot_image_content,"");
  }

  //triggered when check box footer button clicked
  showFooterButton() {
    console.log('ArticleDetailComponent | showFooterButton');
    this.vShowFooterButton = !this.vShowFooterButton;
    if(!this.vShowFooterButton) {
      this.vShowFooterButtonModul = true;
      this.vShowFooterButtonURL = false;
      this._articleDetailsService.resetFootButton("","","");
    }
  }

  //triggered when radio button access page on footer button clicked
  showFooterButtonModul() {
    console.log('ArticleDetailComponent | showFooterButtonModul');
    this.vShowFooterButtonModul = true;
    this.vShowFooterButtonURL = false;
    this._articleDetailsService.resetFootButton(this.getArticleData().foot_button_flg,this.getArticleData().foot_button_content,"");
  }

  //triggered when radio button external url on footer button clicked
  showFooterButtonURL() {
    console.log('ArticleDetailComponent | showFooterButtonURL');
    this.vShowFooterButtonModul = false;
    this.vShowFooterButtonURL = true;
    this._articleDetailsService.resetFootButton(this.getArticleData().foot_button_flg,this.getArticleData().foot_button_content,"");
  }
}
