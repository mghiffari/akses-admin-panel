import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpecialOfferService } from 'src/app/shared/services/special-offer.service';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SpecialOffer } from 'src/app/shared/models/special-offer';
import { constants } from 'src/app/shared/common/constants';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';

@Component({
  selector: 'app-special-offer',
  templateUrl: './special-offer.component.html',
  styleUrls: []
})
export class SpecialOfferComponent implements OnInit {
  loading = false;
  offer: SpecialOffer
  categories = [];
  allowPublish = false;
  imageRatioPercentage = CustomValidation.specialOfferImg.ratio.height / CustomValidation.specialOfferImg.ratio.width;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offerService: SpecialOfferService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) { }

  // on init
  ngOnInit() {
    console.log('SpecialOfferComponent | ngOnInit')
    this.route.params.subscribe(params => {
      this.loading = true;
      let prvg = this.authService.getFeaturePrivilege(constants.features.specialOffer)
      this.allowPublish = this.authService.getFeaturePublishPrvg(prvg);
      if (this.authService.getFeatureViewPrvg(prvg)) {
        const id = params.id
        this.offerService.getOfferById(id).subscribe(
          response => {
            try {
              console.table(response)
              this.offer = response.data;
            } catch (error) {
              console.table(error)
            }
          }, error => {
            try {
              console.table(error);
              let errorSnackbar = this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                data: {
                  title: 'specialOfferDetailsScreen.getOfferFailed',
                  content: {
                    text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                    data: null
                  }
                }
              })
              errorSnackbar.afterDismissed().subscribe(() => {
                this.goToListScreen()
              })
            } catch (error) {
              console.log(error)
            }
          }
        ).add(() => {
          this.loading = false;
        })
      } else {
        this.authService.blockOpenPage()
      }
    })
  }

  //redirect to approval list screen
  goToListScreen = () => {
    console.log('SpecialOfferComponent | gotoListScreen')
    this.router.navigate(['/master/special-offers'])
  }

}
