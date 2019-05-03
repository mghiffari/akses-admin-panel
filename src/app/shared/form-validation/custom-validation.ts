import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';
import { environment } from 'src/environments/environment';

export class CustomValidation {
  static nameField = {
    maxLength: 100
  }
  static password = {
    minLength: 8,
    maxLength: 20
  }
  static requestRemark = {
    maxLength: 100
  }
  static branchCode = {
    minLength: 4,
    maxLength: 4
  }
  static postalCode = {
    minLength: 5,
    maxLength: 6
  }

  static latitude = {
    integerDigitLength: 3,
    fractionDigitLength: 6
  }

  static longitude = {
    integerDigitLength: 3,
    fractionDigitLength: 6
  }

  static tenure = {
    integerDigitLength: 18,
    fractionDigitLength: 6
  }

  static instructionSteps = {
    maxLength: 15
  }

  static adiraEmailPattern = environment.enableAdiraEmailValidation ? /@adira.co.id$/ : /^/;
  static internationalNamePattern = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð,.'-]+[ ][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð,.'-]+|[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð,.'-]+$/u;

  //used to check password valid or not
  static matchPassword: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
    console.log('CustomValidation | matchPassword');
    let password = formGroup.get('newPassword'); // to get value in input tag
    let confirmPassword = formGroup.get('confirmPassword') // to get value in input tag
    if (password && confirmPassword && password.value != confirmPassword.value) {
      confirmPassword.setErrors({ matchPassword: true })
      return { 'matchPassword': true }
    } else {
      return null;
    }
  };

  //used to check patern validation
  static pattern(reg: RegExp): ValidatorFn {
    console.log('CustomValidation | pattern');
    return (control: AbstractControl): { [key: string]: any } => {
      var value = <string>control.value;
      return value.match(reg) ? null : { 'pattern': { value } };
    }
  }

  //used to check text equal
  static equal(text: string): ValidatorFn {
    console.log('CustomValidation | equal');
    return (control: AbstractControl): { [key: string]: any } => {
      var value = <string>control.value;
      return value == text ? null : { 'equal': { value } };
    }
  }

  //used to check adira email validation
  static adiraEmail(control: AbstractControl): { [key: string]: any } {
    console.log('CustomValidation | adiraEmail');
    var value = control.value ? <string>control.value : '';
    return value.match(CustomValidation.adiraEmailPattern) ? null : { 'adiraEmail': { value } };
  }

  //used to check international name inside form
  static internationalName(control: AbstractControl): { [key: string]: any } {
    console.log('CustomValidation | internationalName');
    var value = control.value ? <string>control.value : '';
    return value.match(CustomValidation.internationalNamePattern) ? null : { 'internationalname': { value } };
  }

  //used to validate number of digit before and after
  static maxDecimalLength(integerDigitMaxLength: number, fractionDigitMaxLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      console.log('CustomValidation | decimalLength');
      const value = <string>control.value;
      if (value) {
        const arr = String(value).split('.');
        let integerDigitCount = 0;
        let fractionalDigitCount = 0;
        let valid = true;

        for (let val of arr[0]) {
          if (!isNaN(val as any)) {
            integerDigitCount += 1;
            if (integerDigitCount > integerDigitMaxLength) {
              valid = false;
              break;
            }
          }
        }

        if (valid && arr.length > 1) {
          for (let val of arr[1]) {
            if (!isNaN(val as any)) {
              fractionalDigitCount += 1;
              if (fractionalDigitCount > fractionDigitMaxLength) {
                valid = false;
                break;
              }
            }
          }
        }

        return valid ? null : { 'maxdecimallength': { value } }
      } else {
        return null;
      }
    }
  }

  //change password validation pattern
  static getChangePasswordValidation() {
    return new FormGroup({
      oldPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', [Validators.required,
      Validators.minLength(CustomValidation.password.minLength),
      Validators.maxLength(CustomValidation.password.maxLength),
      Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
      ]),
      confirmPassword: new FormControl('')
    }, {
        validators: CustomValidation.matchPassword
      })
  }

  //used to validate file type
  static type(types: string | Array<string>): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      console.log('CustomValidation | type');
      const file = <File>control.value;
      if (file) {
        let splits = file.name.split('.');
        if (splits.length > 1) {
          let ext = splits[splits.length - 1].trim();
          if (types instanceof Array) {
            if (types.includes(ext)) {
              return null;
            }
          } else if (types === ext) {
            return null
          }
        }
        return { 'type': { file } }
      }
      return null;
    }
  }


  //used to validate image ratio
  static imageRatio(control: AbstractControl, widthRatio: number, heightRatio: number) {
    console.log('CustomValidation | imageRatio');
    const file = <File>control.value;
    control.setErrors(null)
    if (file) {
      let reader = new FileReader()
      reader.readAsDataURL(file);
      reader.onload = function (e) {

        //Initiate the JavaScript Image object.
        let image = new Image();

        //Set the Base64 string return from FileReader as source.
        image.src = e.target['result'];

        //Validate the File Height and Width.
        image.onload = function () {
          const height = image.height;
          const width = image.width;
          if (width / height !== widthRatio / heightRatio) {
            control.setErrors({ ratio: true })
          }
        };
      }
    }
  }
  //used to validate image ratio
  static imageMaxResolution(control: AbstractControl, maxWidth: number, maxHeight: number) {
    console.log('CustomValidation | imageMaxResolution');
    const file = <File>control.value;
    control.setErrors(null)
    if (file) {
      let reader = new FileReader()
      reader.readAsDataURL(file);
      reader.onload = function (e) {

        //Initiate the JavaScript Image object.
        let image = new Image();

        //Set the Base64 string return from FileReader as source.
        image.src = e.target['result'];

        //Validate the File Height and Width.
        image.onload = function () {
          const height = image.height;
          const width = image.width;
          if (height > maxHeight || width > maxWidth) {
            control.setErrors({ maxresolution: true })
          }
        };
      }
    }
  }
}