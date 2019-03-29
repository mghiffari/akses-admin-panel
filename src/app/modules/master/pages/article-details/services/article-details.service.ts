import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { LovData } from 'src/app/shared/models/lov';
import { ArticleData } from 'src/app/modules/master/models/articles';
import { ImageUpload } from 'src/app/shared/models/image-upload';
import { LovService } from 'src/app/shared/services/lov.service';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class ArticleDetailsService {
  vCurrentPage: string;
  vPageTitle: string;

  vLovCategoryData: Array<{
    id: string,
    name: string
  }>;

  vLovModulsData: Array<LovData>;

  vArticleData: ArticleData = new ArticleData();

  vArticleImageUpload: ImageUpload = new ImageUpload();
  vFooterUpload: ImageUpload = new ImageUpload();
  vUpdateAricleImageURL: string;
  vUpdateFooterURL: string

  vLoadingFormStatus: boolean;
  vLoadingStatus: boolean;

  vRegexURL: any = /^(http?|https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|io|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;

  vErrorMessage: {
    imageArticle: string;
    imageFooter: string;
    extUrlShow: string;
    extUrlFooterText: string;
    extUrlFooterImage: string;
    extUrlFooterButton: string;
  }

  constructor(
    private _translateService: TranslateService,
    private _ng2ImgToolsService: Ng2ImgToolsService,
    private _lovService: LovService,
    private _snackBarService: MatSnackBar
  ) { }

  //get title for page (create or update)
  getPageTitle(page: string) {
    console.log('ArticleDetailsService | getPageTitle');
    this.vCurrentPage = page;
    if(page.includes("create")){
      this.translateText('articleDetailsScreen.createArticleTitle', 'vPageTitle');
    } else {
      this.translateText('articleDetailsScreen.updateArticleTitle', 'vPageTitle');
    }
    return this.vPageTitle;
  }

  getArticleData() {
    console.log('ArticleDetailsService | getArticleData');
    return this.vArticleData;
  }

  //used to get moduls object
  getModuls() {
    console.log('ArticleDetailsService | getModuls');
    return this.vLovModulsData;
  }

  //get category data for component
  getCategoryData() {
    console.log('ArticleDetailsService | getCategoryData');
    return this.vLovCategoryData;
  }

  //used to get error message object
  getErrorMessage() {
    console.log('ArticleDetailsService | getErrorMessage');
    return this.vErrorMessage;
  }

  //used to get loading status on button save
  isLoading() {
    console.log('ArticleDetailsService | isLoading');
    return this.vLoadingStatus;
  }

  //used to get loading status on form section
  isLoadingForm() {
    console.log('ArticleDetailsService | isLoadingForm');
    return this.vLoadingFormStatus;
  }

  //used to reset article data object
  resetArticleData(){
    console.log('ArticleDetailsService | resetArticleData');
    this.vArticleData = {
      category: "",
      title: "",
      content: "",
      article_image: "",
      title_order: 0,
      unique_tag: "",
      foot_text_flg: "",
      foot_text_content: "",
      foot_text_redirect: "",
      foot_image_flg: "",
      foot_image_content: "",
      foot_button_redirect: "",
      foot_button_flg: "",
      foot_button_content: "",
      foot_image_redirect: ""
    }
  }

  resetErrorMessage() {
    console.log('ArticleDetailsService | resetErrorMessage');
    this.vErrorMessage = {
      imageArticle: "",
      imageFooter: "",
      extUrlShow: "",
      extUrlFooterText: "",
      extUrlFooterImage: "",
      extUrlFooterButton: ""
    }
  }

  //used to reset article data when footer text check box clicked
  resetFootText(foot_text_flg: string, foot_text_content: string, foot_text_redirect: string) {
    console.log('ArticleDetailsService | resetFootText');
    this.vArticleData.foot_text_flg = foot_text_flg;
    this.vArticleData.foot_text_content = foot_text_content;
    this.vArticleData.foot_text_redirect = foot_text_redirect;
  }

  //used to reset article data when footer image check box clicked
  resetFootImage(foot_image_flg: string, foot_image_content:string, foot_image_redirect: string){
    console.log('ArticleDetailsService | resetFootImage');
    this.vArticleData.foot_image_flg = foot_image_flg;
    this.vArticleData.foot_image_content = foot_image_content;
    this.vArticleData.foot_image_redirect = foot_image_redirect;
  }

  //used to reset article data when foot button check box clicked
  resetFootButton(foot_button_flg: string, foot_button_content:string, foot_button_redirect:string){
    console.log('ArticleDetailsService | resetFootButton');
    this.vArticleData.foot_button_flg = foot_button_flg;
    this.vArticleData.foot_button_content = foot_button_content;
    this.vArticleData.foot_button_redirect = foot_button_redirect;
  }

  //used to preview article image when user choose image from the galery
  previewImage(component:string, files) {
    console.log('ArticleDetailsService | previewImage');
    var image: File = null;
    image = files;
    this.resetErrorMessage();
    if (files.length === 0)
      return;
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this._translateService.get('forms.articlePicture.errorType').subscribe(res => {
        if(component === "article") {
          this.vErrorMessage.imageArticle = res;
        } else {
          this.vErrorMessage.imageFooter = res;
        }
      });
      return;
    }
    var reader = new FileReader();
    reader.onload = (_event) => {
      var img = new Image();
      img.src = reader.result.toString();
      if(component === "article") {
        this.vArticleData.article_image = img.src;
      } else {
        this.vArticleData.foot_image_content = img.src;
      }
      // this.compressImage(component, image[0]);
    }
    reader.readAsDataURL(files[0]);
  }

  // used to compress image when user choose image from galery
  compressImage(component:string, file:File){
    console.log('ArticleDetailsService | compressImage');
    var compressedImage: File = null;
    this._ng2ImgToolsService.compress([file], 0.2).subscribe( result =>{
        compressedImage = result;
        this.vArticleImageUpload.component = "Article";
        this.vArticleImageUpload.file = compressedImage;
        this.vArticleImageUpload.url = this.vUpdateAricleImageURL;
       }, error => {
          console.error("Compression error:", error);
          if(component === "article") {
            this.vErrorMessage.imageArticle = error;
          } else {
            this.vErrorMessage.imageFooter = error;
          }
       }
    );
  }

  //used to disable save button
  isDisableCreateArticle(){
    console.log('ArticleDetailsService | isDisableCreateArticle');
    this.resetErrorMessage();
    if(this.vArticleData.category === undefined || this.vArticleData.category === ''){
      return true;
    } else if(this.vArticleData.title === undefined || this.vArticleData.title === ''){
      return true;
    } else if(this.vArticleData.article_image === undefined || this.vArticleData.article_image === null || this.vArticleData.article_image == ''){
      return true;
    } else if(this.vErrorMessage.imageArticle !== "") {
      return true;
    } else if(this.vArticleData.unique_tag === undefined || this.vArticleData.unique_tag === ''){
      return true;
    } else if(this.vArticleData.content === undefined || this.vArticleData.content === ''){
      return true;
    } else {
      if(this.vArticleData.foot_text_flg.length > 0) {
        if(this.vArticleData.foot_text_content === undefined || this.vArticleData.foot_text_content === '') {
          return true;
        } else if(this.vArticleData.foot_text_redirect === undefined || this.vArticleData.foot_text_redirect === ''){
          return true;
        } else if(!this.vRegexURL.test(this.vArticleData.foot_text_redirect) && this.vArticleData.foot_text_flg == "ext") {
          this._translateService.get('bannersDetailScreen.urlNotValid').subscribe(res => {
            this.vErrorMessage.extUrlFooterText = res;
          })
          return true;
        }
      }
      if(this.vArticleData.foot_image_flg.length > 0) {
        if(this.vArticleData.foot_image_content === undefined || this.vArticleData.foot_image_content === null) {
          return true;
        } else if(this.vErrorMessage.imageFooter != "") {
          return true;
        } else if(this.vArticleData.foot_image_redirect === undefined || this.vArticleData.foot_image_redirect === ''){
          return true;
        } else if(!this.vRegexURL.test(this.vArticleData.foot_image_redirect) && this.vArticleData.foot_image_flg == "ext"){
          this._translateService.get('bannersDetailScreen.urlNotValid').subscribe(res => {
            this.vErrorMessage.extUrlFooterImage = res;
          })
          return true;
        }
      }
      if(this.vArticleData.foot_button_flg.length > 0) {
        if(this.vArticleData.foot_button_content === undefined || this.vArticleData.foot_button_content === '') {
          return true;
        } else if(this.vArticleData.foot_button_redirect === undefined || this.vArticleData.foot_button_redirect === ''){
          return true;
        } else if(!this.vRegexURL.test(this.vArticleData.foot_button_redirect) && this.vArticleData.foot_button_flg == "ext") {
          this._translateService.get('bannersDetailScreen.urlNotValid').subscribe(res => {
            this.vErrorMessage.extUrlFooterButton = res;
          })
          return true;
        }
      }
      this.resetErrorMessage();
      return false;
    }
    this.resetErrorMessage();
    return false;
  }

  //load category data from LOV API
  loadCategoryData() {
    console.log('ArticleDetailsService | loadCategoryData');
    this.vLovCategoryData = [
      {id: 'category-0', name: 'About Adira'},
      {id: 'category-1', name: 'Product Information'},
    ];
  }

  //used to load moduls data
  loadModuls() {
    console.log('ArticleDetailsService | loadModuls');
    this.vLoadingFormStatus = true;
    this._lovService.getModuls()
    .subscribe(
      (data: any) => {
        try {
          console.table(data);
          this.vLoadingFormStatus = false;
          this.vLovModulsData = data.data[0].aks_adm_lovs;  
        } catch (error) {
          console.table(error);
        }
      },
      error => {
        try {
          this.vLoadingFormStatus = false;
          console.error(error);
          this._snackBarService.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'articleListScreen.loadFailed',
              content: {
                text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                data: null
              }
            }
          });
        } catch (error) {
          console.error(error);
        }
      }
    );
  }

  //used to translate text using localization
  translateText(text: string, variableToAssign: string){
    console.log('ArticleDetailsService | translateText');
    return this._translateService.get(text).subscribe(res => {
      this[variableToAssign] = res;
    })
  }
}
