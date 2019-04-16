import { Component, Input, forwardRef, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as numeral from 'numeral';

export enum MaskedInputFormat{
  Decimal = '0,0[.][000000]',
  Percentage = '0,0[.][000000]%',
  Currency = '$0,0[.][000000]',
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
  @Input() currencySymbol?: string = null;
  @Input() locale?: string = 'id';
  private textInput: ElementRef;
  @ViewChild('textInput') set txtInput(textInput: ElementRef) {
    this.textInput = textInput;
  }
  maskedValue = '';

  ngOnInit(): void {
    console.log('MaskedNumInputComponent | ngOnInit');
    numeral.locale(this.locale)
  }

  //constructor
  constructor() { 
    console.log('MaskedNumInputComponent | constructor')
  }

  onChange: Function = () => {};
  onTouch: Function = () => {};
  disabled: boolean = false;

  handleChange(event){
    console.log('MaskedNumInputComponent | handleChange')
    this.writeValue(numeral(event.target.value).value())
  }

  // Allow Angular to set the value on the component
  writeValue(value): void {
    console.log('MaskedNumInputComponent | writeValue')
    this.onChange(value);
    this.value = value;
    if(this.value !== null){
      let newMaskValue = numeral(this.value).format(this.format, Math.floor)
      if(this.maskedValue !== newMaskValue){
        this.maskedValue = newMaskValue;
      } else {
        this.textInput.nativeElement.value = this.maskedValue;
      }
      
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
