import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-password-toggle-input',
  templateUrl: './password-toggle-input.component.html',
  styleUrls: ['./password-toggle-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PasswordToggleInputComponent),
    multi: true
  }]
})
export class PasswordToggleInputComponent implements ControlValueAccessor {
  @Input() placeholder?: string;
  @Input() appearance?: string;
  @Input() password = '';
  hide = true;

  //constructor
  constructor() { 
    console.log('PasswordToggleInputComponent | constructor')
  }

  onChange: Function = () => {};
  onTouch: Function = () => {};
  disabled: boolean = false;

  handleChange(event){
    console.log('PasswordToggleInputComponent | handleChange')
    this.writeValue(event.target.value)
  }

  // Allow Angular to set the value on the component
  writeValue(value): void {
    console.log('PasswordToggleInputComponent | writeValue')
    this.onChange(value);
    this.password = value;
  }

  // Save a reference to the change function passed to us by 
  // the Angular form control
  registerOnChange(fn: Function): void {
    console.log('PasswordToggleInputComponent | registerOnChange')
    this.onChange = fn;
  }

  // Save a reference to the touched function passed to us by 
  // the Angular form control
  registerOnTouched(fn: Function): void {
    console.log('PasswordToggleInputComponent | registerOnTouched')
    this.onTouch = fn;    
  }

  // Allow the Angular form control to disable this input
  setDisabledState(disabled: boolean): void {
    console.log('PasswordToggleInputComponent | setDisabledState')
    this.disabled = disabled;
  }
}
