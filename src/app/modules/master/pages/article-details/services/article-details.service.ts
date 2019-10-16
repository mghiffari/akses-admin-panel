import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { Router } from '@angular/router';
import { LovData } from 'src/app/shared/models/lov';
import { ArticleData } from 'src/app/modules/master/models/articles';
import { ImageUpload } from 'src/app/shared/models/image-upload';
import { LovService } from 'src/app/shared/services/lov.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { FileManagementService } from 'src/app/shared/services/file-management.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { constants } from 'src/app/shared/common/constants';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';

@Injectable({
  providedIn: 'root'
})
export class ArticleDetailsService {
  vCurrentPage: string;
  vPageTitle: string;

  vLovCategoryData: Array<LovData>;
  vLovModulsData: Array<LovData>;

  vArticleData: ArticleData = new ArticleData();
  vUpdateArticleId: string;

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

  vPrivilege = null

  vImageRatio = CustomValidation.articleImg.ratio;

  vShowFooterText: boolean = false;
  vShowFooterTextModul: boolean = false;
  vShowFooterTextURL: boolean = false;
  vShowFooterImage: boolean = false;
  vShowFooterImageModul: boolean = false;
  vShowFooterImageURL: boolean = false;
  vShowFooterButton: boolean = false;
  vShowFooterButtonModul: boolean = false;
  vShowFooterButtonURL: boolean = false;

  constructor(
    private _translateService: TranslateService,
    private _ng2ImgToolsService: Ng2ImgToolsService,
    private _snackBarService: MatSnackBar,
    private _routerService: Router,
    private _lovService: LovService,
    private _articleService: ArticleService,
    private _fileMgtService: FileManagementService,
    private _authService: AuthService
  ) { }

  // get feature privilege
  getFeaturePrvg() {
    console.log('ArticleDetailsService | getFeaturePrvg');
    this.vPrivilege = this._authService.getFeaturePrivilege(constants.features.article)
  }

  // get view privilege flag
  getViewPrvg() {
    console.log('ArticleDetailsService | getFeaturePrvg');
    return this._authService.getFeatureViewPrvg(this.vPrivilege)
  }

  // get create privilege flag
  getCreatePrvg() {
    console.log('ArticleDetailsService | getCreatePrvg');
    return this._authService.getFeatureCreatePrvg(this.vPrivilege)
  }

  // get edit privilege flag
  getEditPrvg() {
    console.log('ArticleDetailsService | getEditPrvg');
    return this._authService.getFeatureEditPrvg(this.vPrivilege)
  }

  // show error snack bar if has no access
  showNoAccessSnackbar() {
    console.log('ArticleDetailsService | showNoAccessSnackbar');
    this._authService.blockOpenPage()
  }

  //get title for page (create or update)
  getPageTitle(page: string) {
    console.log('ArticleDetailsService | getPageTitle');
    this.vCurrentPage = page;
    if (page.includes("create")) {
      this.translateText('articleDetailsScreen.createArticleTitle', 'vPageTitle');
    } else {
      this.translateText('articleDetailsScreen.updateArticleTitle', 'vPageTitle');
    }
    return this.vPageTitle;
  }

  //get data article for page
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
  resetArticleData() {
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
      foot_image_flg: null,
      foot_image_content: "",
      foot_button_redirect: "",
      foot_button_flg: "",
      foot_button_content: "",
      foot_image_redirect: ""
    }
  }

  //used to set article data object when update article
  setArticleData(data) {
    console.log('ArticleDetailService | setArticleData');
    this.vArticleData = {
      category: data.category,
      title: data.title,
      content: data.content,
      article_image: data.article_image,
      title_order: data.title_order,
      unique_tag: data.unique_tag,
      foot_text_flg: data.foot_text_flg,
      foot_text_content: data.foot_text_content,
      foot_text_redirect: data.foot_text_redirect,
      foot_image_flg: data.foot_image_flg,
      foot_image_content: data.foot_image_content,
      foot_image_redirect: data.foot_image_redirect,
      foot_button_redirect: data.foot_button_redirect,
      foot_button_flg: data.foot_button_flg,
      foot_button_content: data.foot_button_content
    }
    this.vUpdateAricleImageURL = data.article_image;
    this.vUpdateFooterURL = data.foot_image_content;
  }

  //reset error message when done or first create or update
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
  resetFootImage(foot_image_flg: string, foot_image_content: string, foot_image_redirect: string) {
    console.log('ArticleDetailsService | resetFootImage');
    this.vArticleData.foot_image_flg = foot_image_flg;
    this.vArticleData.foot_image_content = foot_image_content;
    this.vArticleData.foot_image_redirect = foot_image_redirect;
  }

  //used to reset article data when foot button check box clicked
  resetFootButton(foot_button_flg: string, foot_button_content: string, foot_button_redirect: string) {
    console.log('ArticleDetailsService | resetFootButton');
    this.vArticleData.foot_button_flg = foot_button_flg;
    this.vArticleData.foot_button_content = foot_button_content;
    this.vArticleData.foot_button_redirect = foot_button_redirect;
  }

  //used to preview article image when user choose image from the galery
  previewImage(component: string, files) {
    console.log('ArticleDetailsService | previewImage');
    var image: File = null;
    image = files;
    if (files.length === 0)
      return;
    let types = ['jpeg', 'jpg', 'png']
    let errorType = false
    let splits = files[0].name.split('.');
    if (splits.length > 1) {
      let ext = splits[splits.length - 1].trim();
      if (!types.includes(ext)) {
        errorType = true;
      }
    } else {
      errorType = true;
    }
    if (errorType) {
      this._translateService.get('forms.articlePicture.errorType').subscribe(res => {
        if (component === "article") {
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
      //Set the Base64 string return from FileReader as source.
      img.src = _event.target['result'];
      if (component === "article") {
        // Validate the File Height and Width.
        this.vArticleData.article_image = img.src;
        img.onload = () => {
          try {
            const height = img.height;
            const width = img.width;
            const ratioHeight = this.vImageRatio.height
            const ratioWidth = this.vImageRatio.width
            if (width / ratioWidth !== height / ratioHeight) {
              this._translateService.get('forms.articlePicture.errorRatio', { width: ratioWidth, height: ratioHeight })
                .subscribe(res => {
                  this.vErrorMessage.imageArticle = res;
                });
            } else {
              this.vErrorMessage.imageArticle = '';
              this.compressImage(component, image[0]);
            }    
          } catch (error) {
            console.error(error)
          }
        };
      } else {
        this.vErrorMessage.imageFooter = ''
        this.vArticleData.foot_image_content = img.src;
        this.compressImage(component, image[0]);
      }
    }
    reader.readAsDataURL(files[0]);
  }

  // used to compress image when user choose image from galery
  compressImage(component: string, file: File) {
    console.log('ArticleDetailsService | compressImage');
    var compressedImage: File = null;
    this._ng2ImgToolsService.compress([file], 0.2, true).subscribe(result => {
      compressedImage = result;
      if (component === "article") {
        this.vArticleImageUpload.component = "Article";
        this.vArticleImageUpload.file = compressedImage;
        this.vArticleImageUpload.url = this.vUpdateAricleImageURL;
      } else if (component === "footer") {
        this.vFooterUpload.component = "Article";
        this.vFooterUpload.file = compressedImage;
        this.vFooterUpload.url = this.vUpdateFooterURL;
      }
    }, error => {
      console.error("Compression error:", error);
      if (component === "article") {
        this.vErrorMessage.imageArticle = error;
      } else {
        this.vErrorMessage.imageFooter = error;
      }
    }
    );
  }

  //used to disable save button
  isDisableCreateArticle() {
    console.log('ArticleDetailsService | isDisableCreateArticle');
    if (this.vArticleData.category === undefined || this.vArticleData.category === '') {
      return true;
    } else if (this.vArticleData.title === undefined || this.vArticleData.title === '') {
      return true;
    } else if (this.vArticleData.article_image === undefined || this.vArticleData.article_image === null || this.vArticleData.article_image == '') {
      return true;
    } else if (this.vErrorMessage.imageArticle !== "") {
      return true;
    } else if (this.vArticleData.content === undefined || this.vArticleData.content === '') {
      return true;
    } else {
      if (this.vShowFooterText || this.vArticleData.foot_text_flg) {
        if (!this.vArticleData.foot_text_content) {
          return true;
        } else if (!this.vArticleData.foot_text_redirect) {
          return true;
        } else if (!this.vRegexURL.test(this.vArticleData.foot_text_redirect) && this.vArticleData.foot_text_flg == "ext") {
          this._translateService.get('bannersDetailScreen.urlNotValid').subscribe(res => {
            this.vErrorMessage.extUrlFooterText = res;
          })
          return true;
        }
      }
      if (this.vShowFooterImage || this.vArticleData.foot_image_flg) {
        if (!this.vArticleData.foot_image_content) {
          return true;
        } else if (this.vErrorMessage.imageFooter) {
          return true;
        } else if (!this.vArticleData.foot_image_redirect) {
          return true;
        } else if (!this.vRegexURL.test(this.vArticleData.foot_image_redirect) && this.vArticleData.foot_image_flg == "ext") {
          this._translateService.get('bannersDetailScreen.urlNotValid').subscribe(res => {
            this.vErrorMessage.extUrlFooterImage = res;
          })
          return true;
        }
      }
      if (this.vShowFooterButton || this.vArticleData.foot_button_flg) {
        if (!this.vArticleData.foot_button_content) {
          return true;
        } else if (!this.vArticleData.foot_button_redirect) {
          return true;
        } else if (!this.vRegexURL.test(this.vArticleData.foot_button_redirect) && this.vArticleData.foot_button_flg == "ext") {
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
    this.vLoadingFormStatus = true;
    this._lovService.getArticleCategory()
      .subscribe(
        (data: any) => {
          try {
            console.table(data);
            this.vLoadingFormStatus = false;
            this.vLovCategoryData = data.data[0].aks_adm_lovs;
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
                  text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet')
                }
              }
            });
          } catch (error) {
            console.error(error);
          }
        }
      )
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
                  text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet')
                }
              }
            });
          } catch (error) {
            console.error(error);
          }
        }
      );
  }

  //load article data by id when first load update
  loadArticleById(id: string) {
    console.log('ArticleDetailComponent | loadArticleById');
    this.vUpdateArticleId = id;
    this.vLoadingFormStatus = true;
    let promise = new Promise((resolve, reject) => {
      this._articleService.loadArticleById(id)
        .subscribe(
          (data: any) => {
            try {
              if (data.data.clickable_flg === 1) {
                data.data.clickable_flg = true;
              } else {
                data.data.clickable_flg = false;
              }
              if (data.data.clickable_is_detail === 1) {
                data.data.clickable_is_detail = true;
              } else {
                data.data.clickable_is_detail = false;
              }
              if (data.data.clickable_is_internal === 1) {
                data.data.clickable_is_internal = true;
              } else {
                data.data.clickable_is_internal = false;
              }
              this.setArticleData(data.data);
              this.vLoadingFormStatus = false;
              resolve();
            } catch (error) {
              console.table(error);
              reject();
            }
          },
          error => {
            try {
              console.table(error);
              this.vLoadingStatus = false;
              this._snackBarService.openFromComponent(ErrorSnackbarComponent, {
                data: {
                  title: 'articleDetailsScreen.loadFailed',
                  content: {
                    text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet')
                  }
                }
              });
            } catch (error) {
              console.table(error);
              reject();
            }
          }
        )
    });
    return promise;
  }

  //used to upload image (article and footer using same function)
  uploadImage(component: string, vImageUpload: ImageUpload) {
    console.log('ArticleDetailService | uploadImage');
    let promise = new Promise((resolve, reject) => {
      this._fileMgtService.getUploadUrl(vImageUpload.file, vImageUpload.component, this.vCurrentPage.includes("update") ? vImageUpload.url : null).subscribe(
        response => {
          try {
            console.table(response)
            let url = response.data.signurl
            let fileUri = url.split('?')[0]
            this._fileMgtService.uploadFile(url, vImageUpload.file).subscribe(
              response => {
                try {
                  if (component === "article") {
                    this.vArticleData.article_image = fileUri;
                  } else {
                    this.vArticleData.foot_image_content = fileUri;
                  }
                  resolve();
                } catch (error) {
                  console.table(error);
                  reject();
                }
              }, error => {
                console.table(error)
                try {
                  if (component === "footer") {
                    this.vErrorMessage.imageArticle = error.error.err_code;
                    this.vLoadingStatus = false;
                  } else {
                    this.vErrorMessage.imageFooter = error.error.err_code;
                    this.vLoadingStatus = false;
                  }
                  if (this.vCurrentPage.includes("create")) {
                    this._snackBarService.openFromComponent(ErrorSnackbarComponent, {
                      data: {
                        title: 'articleDetailsScreen.createFailed',
                        content: {
                          text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet')
                        }
                      }
                    });
                  } else {
                    this._snackBarService.openFromComponent(ErrorSnackbarComponent, {
                      data: {
                        title: 'articleDetailsScreen.updateFailed',
                        content: {
                          text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet')
                        }
                      }
                    });
                  }
                } catch (error) {
                  console.table(error);
                } finally {
                  reject();
                }
              }
            )
          } catch (error) {
            console.error(error)
            reject()
          }
        }, error => {
          try {
            if (component === "footer") {
              this.vErrorMessage.imageArticle = error.error.err_code;
              this.vLoadingStatus = false;
            } else {
              this.vErrorMessage.imageFooter = error.error.err_code;
              this.vLoadingStatus = false;
            }
            if (this.vCurrentPage.includes("create")) {
              this._snackBarService.openFromComponent(ErrorSnackbarComponent, {
                data: {
                  title: 'articleDetailsScreen.createFailed',
                  content: {
                    text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet')
                  }
                }
              });
            } else {
              this._snackBarService.openFromComponent(ErrorSnackbarComponent, {
                data: {
                  title: 'articleDetailsScreen.updateFailed',
                  content: {
                    text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet')
                  }
                }
              });
            }
          } catch (error) {
            console.table(error);
          } finally {
            reject();
          }
        }
      )
    });
    return promise;
  }

  //used to hit create article API
  createArticle() {
    console.log('ArticleDetailsService | createArticle');
    this._articleService.createArticle(this.vArticleData)
      .subscribe(
        (data: any) => {
          console.table(data);
          this.vLoadingStatus = false;
          let snackbarSucess = this._snackBarService.openFromComponent(SuccessSnackbarComponent, {
            data: {
              title: 'success',
              content: {
                text: 'articleDetailsScreen.successCreateArticle'
              }
            }
          })
          snackbarSucess.afterDismissed().subscribe(() => {
            this.goToListScreen();
          })
        },
        error => {
          try {
            console.table(error);
            this.vLoadingStatus = false;
            this._snackBarService.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: 'articleDetailsScreen.createFailed',
                content: {
                  text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet')
                }
              }
            });
          } catch (error) {
            console.table(error);
          }
        }
      );
  }

  //used to hit update article API
  updateArticle() {
    console.log('ArticleDetailService | updateArticle');
    let vUpdateArticleData = {
      id: this.vUpdateArticleId,
      category: this.vArticleData.category,
      title: this.vArticleData.title,
      content: this.vArticleData.content,
      article_image: this.vArticleData.article_image,
      title_order: this.vArticleData.title_order,
      unique_tag: this.vArticleData.unique_tag,
      foot_text_flg: this.vArticleData.foot_text_flg,
      foot_text_content: this.vArticleData.foot_text_content,
      foot_text_redirect: this.vArticleData.foot_text_redirect,
      foot_image_flg: this.vArticleData.foot_image_flg,
      foot_image_content: this.vArticleData.foot_image_content,
      foot_image_redirect: this.vArticleData.foot_image_redirect,
      foot_button_redirect: this.vArticleData.foot_button_redirect,
      foot_button_flg: this.vArticleData.foot_button_flg,
      foot_button_content: this.vArticleData.foot_button_content,
    }
    this._articleService.updateArticle(vUpdateArticleData)
      .subscribe(
        (data: any) => {
          console.table(data);
          this.vLoadingStatus = false;
          let snackbarSucess = this._snackBarService.openFromComponent(SuccessSnackbarComponent, {
            data: {
              title: 'success',
              content: {
                text: 'articleDetailsScreen.successUpdateArticle'
              }
            }
          })
          snackbarSucess.afterDismissed().subscribe(() => {
            this.goToListScreen();
          })
        },
        error => {
          try {
            this.vLoadingStatus = false;
            this._snackBarService.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: 'articleDetailsScreen.updateFailed',
                content: {
                  text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet')
                }
              }
            });
          } catch (error) {
            console.table(error);
          }
        }
      );
  }

  //used when button save clicked
  buttonSave() {
    console.log('ArticleDetailService | buttonSave');
    this.vLoadingStatus = true;
    if (this.vArticleData.article_image.includes("data") && (this.vArticleData.foot_image_content != undefined && this.vArticleData.foot_image_content != "")) {
      if (this.vArticleData.foot_image_content.includes("data")) {
        this.uploadImage("article", this.vArticleImageUpload).then(response => {
          this.uploadImage("footer", this.vFooterUpload).then(response => {
            if (this.vCurrentPage.includes("create")) {
              this.createArticle();
            } else {
              // this.updateArticle();
            }
          }).catch(err => {
            this.vLoadingStatus = false;
            console.table(err);
          });
        }).catch(err => {
          this.vLoadingStatus = false;
          console.table(err);
        });
      }
    } else if (!this.vArticleData.article_image.includes("data") && (this.vArticleData.foot_image_content === undefined || this.vArticleData.foot_image_content == "" || this.vArticleData.foot_image_content == null)) {
      if (this.vCurrentPage.includes("create")) {
        this.createArticle();
      } else {
        this.updateArticle();
      }
    } else {
      if (this.vArticleData.article_image.includes("data")) {
        this.uploadImage("article", this.vArticleImageUpload).then(response => {
          if (this.vCurrentPage.includes("create")) {
            this.createArticle();
          } else {
            this.updateArticle();
          }
        }).catch(err => {
          this.vLoadingStatus = false;
          console.table(err);
        });
      } else if (this.vArticleData.foot_image_content.includes("data")) {
        this.uploadImage("footer", this.vFooterUpload).then(response => {
          if (this.vCurrentPage.includes("create")) {
            this.createArticle();
          } else {
            this.updateArticle();
          }
        }).catch(err => {
          this.vLoadingStatus = false;
          console.table(err);
        });
      } else {
        if (this.vCurrentPage.includes("create")) {
          this.createArticle();
        } else {
          this.updateArticle();
        }
      }
    }
  }

  //used to translate text using localization
  translateText(text: string, variableToAssign: string) {
    console.log('ArticleDetailsService | translateText');
    return this._translateService.get(text).subscribe(res => {
      this[variableToAssign] = res;
    })
  }

  //used to go back to article list page
  goToListScreen = () => {
    console.log('ArticleDetailService | goToListScreen');
    this._routerService.navigate(['/master/articles'])
  }
}
