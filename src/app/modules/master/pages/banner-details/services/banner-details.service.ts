import { Injectable } from '@angular/core';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { UpdateBannerData, BannerData } from 'src/app/modules/master/models/banner-detail';
import { ImageUpload } from 'src/app/shared/models/image-upload';
import { LovData } from 'src/app/shared/models/lov';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { BannerService } from 'src/app/modules/master/services/banner.service';
import { LovService } from 'src/app/shared/services/lov.service';
import { FileManagementService } from 'src/app/shared/services/file-management.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { constants } from 'src/app/shared/common/constants';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';

@Injectable()
export class BannerDetailsService {
  vPageTitle: string;
  vCurrentPage: string;

  vBannerData: BannerData = new BannerData();
  vUpdateBannerData: UpdateBannerData = new UpdateBannerData();

  vOrders: Array<{
    value: string;
    viewValue: number;
  }>;

  vLovModulsData: Array<LovData>;

  vBannerUpload: ImageUpload = new ImageUpload();
  vFooterUpload: ImageUpload = new ImageUpload();
  vUpdateBannerURL: string;
  vUpdateFooterURL: string;

  vErrorMessage: {
    imageBanner: string;
    imageFooter: string;
    extUrlShow: string;
    extUrlFooterText: string;
    extUrlFooterImage: string;
    extUrlFooterButton: string;
  }

  vLoadingStatus: boolean;
  vLoadingFormStatus: boolean;

  vRegexURL: any = /^(http?|https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|io|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  vPrivilege = null
  vImageRatio = CustomValidation.articleImg.ratio;

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

  constructor(
    private _ng2ImgToolsService: Ng2ImgToolsService,
    private _bannerService: BannerService,
    private _lovService: LovService,
    private _translateService: TranslateService,
    private _snackBarService: MatSnackBar,
    private _routerService: Router,
    private _fileMgtService: FileManagementService,
    private _authService: AuthService
  ) { }

  // get feature privilege
  getFeaturePrvg(){
    console.log('BannerDetailService | getFeaturePrvg');
    this.vPrivilege = this._authService.getFeaturePrivilege(constants.features.banner)
  }

  // get view privilege flag
  getViewPrvg(){
    console.log('BannerDetailService | getFeaturePrvg');
    return this._authService.getFeatureViewPrvg(this.vPrivilege)
  }

  // get create privilege flag
  getCreatePrvg(){
    console.log('BannerDetailService | getCreatePrvg');
    return this._authService.getFeatureCreatePrvg(this.vPrivilege)
  }

  // get edit privilege flag
  getEditPrvg(){
    console.log('BannerDetailService | getEditPrvg');
    return this._authService.getFeatureEditPrvg(this.vPrivilege)
  }

  showNoAccessSnackbar(){
    console.log('ArticleDetailsService | showNoAccessSnackbar');
    this._authService.blockOpenPage()
  }

  //get title for page (create or update)
  getPageTitle(page: string) {
    console.log('BannerDetailService | getPageTitle');
    this.vCurrentPage = page;
    if (page.includes("create")) {
      this.translateText('bannersDetailScreen.createBannerTitle', 'vPageTitle');
    } else {
      this.translateText('bannersDetailScreen.updateBannerTitle', 'vPageTitle');
    }
    return this.vPageTitle;
  }

  //used to get banner data object
  getCreateBannerData() {
    console.log('BannerDetailService | getCreateBannerData')
    return this.vBannerData;
  }

  //used to get order object
  getOrders() {
    console.log('BannerDetailService | getOrders');
    return this.vOrders;
  }

  //used to get moduls object
  getModuls() {
    console.log('BannerDetailService | getModuls');
    return this.vLovModulsData;
  }

  //used to get loading status on button save
  isLoading() {
    console.log('BannerDetailService | isLoading');
    return this.vLoadingStatus;
  }

  //used to get loading status on form section
  isLoadingForm() {
    console.log('BannerDetailService | isLoadingForm');
    return this.vLoadingFormStatus;
  }

  //used to translate text using localization
  translateText(text: string, variableToAssign: string) {
    console.log('BannerDetailService | translateText');
    return this._translateService.get(text).subscribe(res => {
      this[variableToAssign] = res;
    })
  }

  //used to get error message object
  getErrorMessage() {
    console.log('BannerDetailService | getErrorMessage');
    return this.vErrorMessage;
  }

  //used to reset banner data when clickable check box clicked
  resetClickable(clickable_is_detail: boolean, clickable_is_internal: boolean, clickable_is_redirect: string) {
    console.log('BannerDetailService | resetClickable');
    this.vBannerData.clickable_is_detail = clickable_is_detail;
    this.vBannerData.clickable_is_internal = clickable_is_internal;
    this.vBannerData.clickable_redirect = clickable_is_redirect;
  }

  //used to reset banner data when detail page radio button clicked
  resetDetailPage(description: string) {
    console.log('BannerDetailService | resetDetailPage');
    this.vBannerData.description = description;
  }

  //used to reset banner data when footer text check box clicked
  resetFootText(foot_text_flg: string, foot_text_content: string, foot_text_redirect: string) {
    console.log('BannerDetailService | resetFootText');
    this.vBannerData.foot_text_flg = foot_text_flg;
    this.vBannerData.foot_text_content = foot_text_content;
    this.vBannerData.foot_text_redirect = foot_text_redirect;
  }

  //used to reset banner data when footer image check box clicked
  resetFootImage(foot_image_flg: string, foot_image_content: string, foot_image_redirect: string) {
    console.log('BannerDetailService | resetFootImage');
    this.vBannerData.foot_image_flg = foot_image_flg;
    this.vBannerData.foot_image_content = foot_image_content;
    this.vBannerData.foot_image_redirect = foot_image_redirect;
  }

  //used to reset banner data when foot button check box clicked
  resetFootButton(foot_button_flg: string, foot_button_content: string, foot_button_redirect: string) {
    console.log('BannerDetailService | resetFootButton');
    this.vBannerData.foot_button_flg = foot_button_flg;
    this.vBannerData.foot_button_content = foot_button_content;
    this.vBannerData.foot_button_redirect = foot_button_redirect;
  }

  //used to reset banner data object
  resetCreateBannerData() {
    console.log('BannerDetailService | resetCreateBannerData');
    this.vBannerData = {
      title: "",
      banner: "",
      order: 0,
      start_date: "",
      end_date: "",
      clickable_flg: false,
      clickable_is_detail: null,
      clickable_is_internal: null,
      clickable_redirect: "",
      description: "",
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

  //used to set banner data object when update banner
  setBannerData(data) {
    console.log('BannerDetailService | setBannerData');
    this.vBannerData = {
      title: data.title,
      banner: data.banner,
      order: data.order,
      start_date: data.start_date,
      end_date: data.end_date,
      clickable_flg: data.clickable_flg,
      clickable_is_detail: data.clickable_is_detail,
      clickable_is_internal: data.clickable_is_internal,
      clickable_redirect: data.clickable_redirect,
      description: data.description,
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
    this.vUpdateBannerURL = data.banner;
    this.vUpdateFooterURL = data.foot_image_content;
  }

  //used to reset error message object
  resetErrorMessage() {
    console.log('BannerDetailService | resetErrorMessage');
    this.vErrorMessage = {
      imageBanner: "",
      imageFooter: "",
      extUrlShow: "",
      extUrlFooterText: "",
      extUrlFooterImage: "",
      extUrlFooterButton: ""
    }
  }

  //used to disable save button
  isDisableCreateBanner() {
    console.log('BannerDetailService | isDisableCreateBanner');
    if (this.vBannerData.title === undefined || this.vBannerData.title === '') {
      return true;
    } else if (this.vBannerData.banner === undefined || this.vBannerData.banner === null) {
      return true;
    } else if (this.vErrorMessage.imageBanner !== "") {
      return true;
    } else if (this.vBannerData.order === undefined || this.vBannerData.order === 0) {
      return true;
    } else if (this.vBannerData.start_date === undefined || this.vBannerData.start_date === '') {
      return true;
    } else if (this.vBannerData.end_date === undefined || this.vBannerData.end_date === '') {
      return true;
    } else if (this.vBannerData.clickable_flg) {
      if (!this.vBannerData.clickable_is_detail && !this.vBannerData.clickable_is_internal) {
        return true;
      } else {
        if (!this.vBannerData.clickable_is_detail) {
          if (!this.vBannerData.clickable_is_internal) {
            return true;
          } else if (!this.vBannerData.clickable_redirect) {
            return true;
          } else if (!this.vRegexURL.test(this.vBannerData.clickable_redirect) && !this.vBannerData.clickable_is_internal) {
            this._translateService.get('bannersDetailScreen.urlNotValid').subscribe(res => {
              this.vErrorMessage.extUrlShow = res;
            })
            return true;
          }
          this.resetErrorMessage();
          return false;
        } else {
          if (!this.vBannerData.description) {
            return true;
          }
          if (this.vShowFooterText || this.vBannerData.foot_text_flg) {
            if (!this.vBannerData.foot_text_content) {
              return true;
            } else if (!this.vBannerData.foot_text_redirect) {
              return true;
            } else if (!this.vRegexURL.test(this.vBannerData.foot_text_redirect) && this.vBannerData.foot_text_flg == "ext") {
              this._translateService.get('bannersDetailScreen.urlNotValid').subscribe(res => {
                this.vErrorMessage.extUrlFooterText = res;
              })
              return true;
            }
          }
          if (this.vShowFooterImage || this.vBannerData.foot_image_flg) {
            if (!this.vBannerData.foot_image_content) {
              return true;
            } else if (this.vErrorMessage.imageFooter) {
              return true;
            } else if (!this.vBannerData.foot_image_redirect) {
              return true;
            } else if (!this.vRegexURL.test(this.vBannerData.foot_image_redirect) && this.vBannerData.foot_image_flg == "ext") {
              this._translateService.get('bannersDetailScreen.urlNotValid').subscribe(res => {
                this.vErrorMessage.extUrlFooterImage = res;
              })
              return true;
            }
          }
          if (this.vShowFooterButton || this.vBannerData.foot_button_flg) {
            if (!this.vBannerData.foot_button_content) {
              return true;
            } else if (!this.vBannerData.foot_button_redirect) {
              return true;
            } else if (!this.vRegexURL.test(this.vBannerData.foot_button_redirect) && this.vBannerData.foot_button_flg == "ext") {
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
    }
    this.resetErrorMessage();
    return false;
  }

  //used to load orders data
  loadOrders() {
    console.log('BannerDetailService | loadOrders');
    this.vOrders = [
      { value: 'order-0', viewValue: 1 },
      { value: 'order-1', viewValue: 2 },
      { value: 'order-2', viewValue: 3 },
      { value: 'order-3', viewValue: 4 },
      { value: 'order-4', viewValue: 5 },
      { value: 'order-5', viewValue: 6 },
      { value: 'order-6', viewValue: 7 },
    ];
  }

  //used to load moduls data
  loadModuls() {
    console.log('BannerDetailService | loadModuls');
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
                title: 'bannersDetailScreen.loadFailed',
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

  //used to load banner data by id from sevices
  loadBannerById(id: string) {
    console.log('BannerDetailService | loadBannerById');
    this.vUpdateBannerData.id = id;
    this.vLoadingFormStatus = true;
    let promise = new Promise((resolve, reject) => {
      this._bannerService.loadBannerById(id)
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
              this.setBannerData(data.data);
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
                  title: 'bannersDetailScreen.loadFailed',
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

  //used to preview banner image when user choose image from the galery
  previewImage(component: string, files) {
    console.log('BannerDetailService | previewImage');
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
        if (component === "banner") {
          this.vErrorMessage.imageBanner = res;
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
      if (component === "banner") {
        // Validate the File Height and Width.
        this.vBannerData.banner = img.src;
        img.onload = () => {
          try {
            const height = img.height;
            const width = img.width;
            const ratioHeight = this.vImageRatio.height
            const ratioWidth = this.vImageRatio.width
            if (width / ratioWidth !== height / ratioHeight) {
              this._translateService.get('forms.articlePicture.errorRatio', { width: ratioWidth, height: ratioHeight })
                .subscribe(res => {
                  this.vErrorMessage.imageBanner = res;
                });
            } else {
              this.vErrorMessage.imageBanner = '';
              this.compressImage(component, image[0]);
            }        
          } catch (error) {
            console.error(error)
          }
        };
      } else {
        this.vErrorMessage.imageFooter = ''
        this.vBannerData.foot_image_content = img.src;
        this.compressImage(component, image[0]);
      }
    }
    reader.readAsDataURL(files[0]);
  }

  //used to compress image when user choose image from galery
  compressImage(component: string, file: File) {
    console.log('BannerDetailService | compressImage');
    var compressedImage: File = null;
    this._ng2ImgToolsService.compress([file], 0.2, true).subscribe(result => {
      compressedImage = result;
      if (component === "banner") {
        this.vBannerUpload.component = "Banner";
        this.vBannerUpload.file = compressedImage;
        this.vBannerUpload.url = this.vUpdateBannerURL;
      } else if (component === "footer") {
        this.vFooterUpload.component = "Banner";
        this.vFooterUpload.file = compressedImage;
        this.vFooterUpload.url = this.vUpdateFooterURL;
      }
    }, error => {
      console.error("Compression error:", error);
      if (component === "banner") {
        this.vErrorMessage.imageBanner = error;
      } else {
        this.vErrorMessage.imageFooter = error;
      }
    }
    );
  }

  //used to upload image (banner and footer using same function)
  uploadImage(component: string, vImageUpload: ImageUpload) {
    console.log('BannerDetailService | uploadImage');
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
                  if (component === "banner") {
                    this.vBannerData.banner = fileUri;
                  } else {
                    this.vBannerData.foot_image_content = fileUri;
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
                    this.vErrorMessage.imageBanner = error.error.err_code;
                    this.vLoadingStatus = false;
                  } else {
                    this.vErrorMessage.imageFooter = error.error.err_code;
                    this.vLoadingStatus = false;
                  }
                  if (this.vCurrentPage.includes("create")) {
                    this._snackBarService.openFromComponent(ErrorSnackbarComponent, {
                      data: {
                        title: 'bannersDetailScreen.createFailed',
                        content: {
                          text: 'failedToProcessFile'
                        }
                      }
                    });
                  } else {
                    this._snackBarService.openFromComponent(ErrorSnackbarComponent, {
                      data: {
                        title: 'bannersDetailScreen.updateFailed',
                        content: {
                          text: 'failedToProcessFile'
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
              this.vErrorMessage.imageBanner = error.error.err_code;
              this.vLoadingStatus = false;
            } else {
              this.vErrorMessage.imageFooter = error.error.err_code;
              this.vLoadingStatus = false;
            }
            if (this.vCurrentPage.includes("create")) {
              this._snackBarService.openFromComponent(ErrorSnackbarComponent, {
                data: {
                  title: 'bannersDetailScreen.createFailed',
                  content: {
                    text: 'failedToProcessFile'
                  }
                }
              });
            } else {
              this._snackBarService.openFromComponent(ErrorSnackbarComponent, {
                data: {
                  title: 'bannersDetailScreen.updateFailed',
                  content: {
                    text: 'failedToProcessFile'
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

  //used to hit create banner API
  createBanner() {
    console.log('BannerDetailService | createBanner');
    this._bannerService.createBanner(this.vBannerData)
      .subscribe(
        (data: any) => {
          console.table(data);
          this.vLoadingStatus = false;
          let snackbarSucess = this._snackBarService.openFromComponent(SuccessSnackbarComponent, {
            data: {
              title: 'success',
              content: {
                text: 'bannersDetailScreen.successCreateBanner'
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
                title: 'bannersDetailScreen.createFailed',
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

  //used to hit update banner API
  updateBanner() {
    console.log('BannerDetailService | updateBanner');
    this.vUpdateBannerData = {
      id: this.vUpdateBannerData.id,
      title: this.vBannerData.title,
      banner: this.vBannerData.banner,
      order: this.vBannerData.order,
      start_date: this.vBannerData.start_date,
      end_date: this.vBannerData.end_date,
      clickable_flg: this.vBannerData.clickable_flg,
      clickable_is_detail: this.vBannerData.clickable_is_detail,
      clickable_is_internal: this.vBannerData.clickable_is_internal,
      clickable_redirect: this.vBannerData.clickable_redirect,
      description: this.vBannerData.description,
      foot_text_flg: this.vBannerData.foot_text_flg,
      foot_text_content: this.vBannerData.foot_text_content,
      foot_text_redirect: this.vBannerData.foot_text_redirect,
      foot_image_flg: this.vBannerData.foot_image_flg,
      foot_image_content: this.vBannerData.foot_image_content,
      foot_image_redirect: this.vBannerData.foot_image_redirect,
      foot_button_redirect: this.vBannerData.foot_button_redirect,
      foot_button_flg: this.vBannerData.foot_button_flg,
      foot_button_content: this.vBannerData.foot_button_content,
    }
    this._bannerService.updateBanner(this.vUpdateBannerData)
      .subscribe(
        (data: any) => {
          console.table(data);
          this.vLoadingStatus = false;
          let snackbarSucess = this._snackBarService.openFromComponent(SuccessSnackbarComponent, {
            data: {
              title: 'success',
              content: {
                text: 'bannersDetailScreen.successUpdateBanner'
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
                title: 'bannersDetailScreen.updateFailed',
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
    console.log('BannerDetailService | buttonSave');
    this.vLoadingStatus = true;
    if (this.vBannerData.banner.includes("data") && (this.vBannerData.foot_image_content != undefined && this.vBannerData.foot_image_content != "")) {
      if (this.vBannerData.foot_image_content.includes("data")) {
        this.uploadImage("banner", this.vBannerUpload).then(response => {
          this.uploadImage("footer", this.vFooterUpload).then(response => {
            if (this.vCurrentPage.includes("create")) {
              this.createBanner();
            } else {
              this.updateBanner()
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
    } else if (!this.vBannerData.banner.includes("data") && (this.vBannerData.foot_image_content === undefined || this.vBannerData.foot_image_content == "" || this.vBannerData.foot_image_content == null)) {
      if (this.vCurrentPage.includes("create")) {
        this.createBanner();
      } else {
        this.updateBanner()
      }
    } else {
      if (this.vBannerData.banner.includes("data")) {
        this.uploadImage("banner", this.vBannerUpload).then(response => {
          if (this.vCurrentPage.includes("create")) {
            this.createBanner();
          } else {
            this.updateBanner()
          }
        }).catch(err => {
          this.vLoadingStatus = false;
          console.table(err);
        });
      } else if (this.vBannerData.foot_image_content.includes("data")) {
        this.uploadImage("footer", this.vFooterUpload).then(response => {
          if (this.vCurrentPage.includes("create")) {
            this.createBanner();
          } else {
            this.updateBanner()
          }
        }).catch(err => {
          this.vLoadingStatus = false;
          console.table(err);
        });
      } else {
        if (this.vCurrentPage.includes("create")) {
          this.createBanner();
        } else {
          this.updateBanner()
        }
      }
    }
  }

  //used to go back to banner list page
  goToListScreen = () => {
    console.log('BannerDetailService | goToListScreen');
    this._routerService.navigate(['/master/banners'])
  }
}