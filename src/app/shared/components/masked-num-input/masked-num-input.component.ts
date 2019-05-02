import { Component, Input, forwardRef, OnInit, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('textInput') textInput:ElementRef;
  maskedValue = '';

  ngOnInit(): void {
    console.log('MaskedNumInputComponent | ngOnInit');
    numeral.locale(this.locale)
    if(!this.prefix && this.type === MaskedInputType.Currency){
      this.prefix = 'Rp'
    }
    if(!this.suffix && this.type === MaskedInputType.Percentage){
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

  handleChange(event) {
    console.log('MaskedNumInputComponent | handleChange')
    let value = numeral(event.target.value).value()
    if (this.type === MaskedInputType.Percentage) {
      value = value / 100;
    }
    this.writeValue(value)
  }

  // Allow Angular to set the value on the component
  writeValue(value): void {
    console.log('MaskedNumInputComponent | writeValue')
    this.onChange(value);
    this.value = value;
    if (this.value !== null) {
      let maskedValue = '';
      if (this.type === MaskedInputType.Percentage) {
        maskedValue = numeral(this.value * 100).format(this.format, Math.floor);
      } else {
        maskedValue = numeral(this.value ).format(this.format, Math.floor);
      }
      this.maskedValue = maskedValue;
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
