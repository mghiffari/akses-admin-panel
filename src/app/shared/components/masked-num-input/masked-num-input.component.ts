import { Component, Input, forwardRef, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as numeral from 'numeral';

export enum MaskedInputFormat {
  Decimal = '0,0[.][000000]',
}

export enum MaskedInputType {
  Decimal,
  Percentage,
  Currency
}

@Component({
  selector: 'app-masked-num-input',
  templateUrl: './masked-num-input.component.html',
  styleUrls: [],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MaskedNumInputComponent),
    multi: true
  }]
})
export class MaskedNumInputComponent implements ControlValueAccessor, OnInit {
  @Input() placeholder?: string = '';
  @Input() appearance?: string = 'fill';
  @Input() value?: number = 0;
  @Input() format?: MaskedInputFormat = MaskedInputFormat.Decimal;
  @Input() type?: MaskedInputType = MaskedInputType.Decimal;
  @Input() currencySymbol?: string = null;
  @Input() locale?: string = 'id';
  @Input() prefix?: string = null;
  @Input() suffix?: string = null;
  @ViewChild('textInput') textInput: ElementRef;
  @Output() keyup = new EventEmitter<any>();
  @Output() change = new EventEmitter<any>();

  maskedValue = '';

  ngOnInit(): void {
    console.log('MaskedNumInputComponent | ngOnInit');
    numeral.locale(this.locale)
    if (!this.prefix && this.type === MaskedInputType.Currency) {
      this.prefix = 'Rp'
    }
    if (!this.suffix && this.type === MaskedInputType.Percentage) {
      this.suffix = '%'
    }
  }

  //constructor
  constructor() {
    console.log('MaskedNumInputComponent | constructor')
  }

  onChange: Function = () => { };
  onTouch: Function = () => { };
  disabled: boolean = false;

  // method to get the real value of masked input
  getNumberValue(event){
    let value = null;
    if (event.target.value && event.target.value.toString().trim() !== '') {
      value = numeral(event.target.value).value()
      // not using value / 100 to avoid floating points where 199.8 become 1.998000001
      if (this.type === MaskedInputType.Percentage) {
        try {
          let numString = value.toString();
          let arrayNum = numString.split('.')
          let integerDigit = (Number(arrayNum[0])/100)
          if(integerDigit !== 0){
            if(arrayNum.length > 1){
              let intString = integerDigit.toString()
              let intStringSplit = intString.split('.')
              if(intStringSplit.length > 1){
                if(intStringSplit[1].length < 2){
                  intString += '0'
                } else if (intStringSplit[1].length > 2){
                  intString = intStringSplit[0] + '.' + intStringSplit[1].substr(0, 2)
                }
              } else {
                intString += '.00'
              }
              value = Number(intString + arrayNum[1])
            } else {
              value = integerDigit;
            }
          } else {
            if(arrayNum.length > 1){
              let sign = ((value > 0) ?  '' :  '-')
              value = Number(sign + integerDigit + '.00' + arrayNum[1])
            } else {
              value = integerDigit;
            }
          }          
        } catch (error) {
          return value
        }
      }
    }
    return value
  }

  // handle keyup
  handleKeyup(event) {
    console.log('MaskedNumInputComponent | handleKeyup')
    let value = this.getNumberValue(event)
    this.writeValue(value)
    this.keyup.emit(value)
  }

  // handle on change
  handleChange(event) {
    console.log('MaskedNumInputComponent | handleChange')
    let value = this.getNumberValue(event)
    this.writeValue(value)
    this.change.emit(value)
  }

  // handle blur
  handleBlur(event) {
    console.log('MaskedNumInputComponent | handleBlur')
    this.writeValue(this.getNumberValue(event))
  }

  // Allow Angular to set the value on the component
  writeValue(value): void {
    console.log('MaskedNumInputComponent | writeValue')
    this.onChange(value);
    this.value = value;
    if (this.value !== null) {
      let maskedValue = '';
      if (this.type === MaskedInputType.Percentage) {
        let numString = this.value.toString();
        let arrayNum = numString.split('.')
        let result = '';
        if(arrayNum.length > 1){
          let integerDigit = arrayNum[0];
          let floatingDigit = arrayNum[1];
          if(floatingDigit.length <= 2){
            let trailingZeros = '00'
            result = arrayNum[0] + floatingDigit + trailingZeros.slice(0, 2-floatingDigit.length)
          } else {
            result = arrayNum[0] + floatingDigit.substring(0, 2) + '.' 
              + floatingDigit.substring(2, floatingDigit.length)
          }
        } else {
          result = numString + '00';
        }
        maskedValue = numeral(Number(result)).format(this.format, Math.floor);
      } else {
        maskedValue = numeral(this.value).format(this.format, Math.floor);
      }
      this.maskedValue = maskedValue;
    } else {
      this.maskedValue = null;
    }
  }

  // Save a reference to the change function passed to us by 
  // the Angular form control
  registerOnChange(fn: Function): void {
    console.log('MaskedNumInputComponent | registerOnChange')
    this.onChange = fn;
  }

  // Save a reference to the touched function passed to us by 
  // the Angular form control
  registerOnTouched(fn: Function): void {
    console.log('MaskedNumInputComponent | registerOnTouched')
    this.onTouch = fn;
  }

  // Allow the Angular form control to disable this input
  setDisabledState(disabled: boolean): void {
    console.log('MaskedNumInputComponent | setDisabledState')
    this.disabled = disabled;
  }

}
