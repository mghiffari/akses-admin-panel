import { Component, Input, AfterViewInit, OnDestroy, forwardRef, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { constants } from '../../common/constants';

declare var tinymce: any;

@Component({
  selector: 'app-tinymce-editor',
  templateUrl: './tinymce-editor.component.html',
  styleUrls: [],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TinymceEditorComponent),
    multi: true
  }]
})
export class TinymceEditorComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  @Input() id? = 'tinymce_' + this.makeid(10);
  value = '';
  editor;
  disabled: boolean = false;
  onChange: Function = (x) => {};
  onTouch: Function = () => {};

  constructor(
    private zone: NgZone
  ){}
  // generate random id
  makeid(length) {
    console.log('TinymceEditorComponent | makeid')
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
  // Allow Angular to set the value on the component
  writeValue(value): void {
    console.log('TinymceEditorComponent | writeValue')
    this.onChange(value);
    this.value = value;
    if(this.editor){
      if(this.editor.getContent() !== value){
        this.editor.setContent(value)
      }
    }
  }

  // Save a reference to the change function passed to us by 
  // the Angular form control
  registerOnChange(fn: Function): void {
    console.log('TinymceEditorComponent | registerOnChange')
    this.onChange = fn;
  }

  // Save a reference to the touched function passed to us by 
  // the Angular form control
  registerOnTouched(fn: Function): void {
    console.log('TinymceEditorComponent | registerOnTouched')
    this.onTouch = fn;    
  }

  // Allow the Angular form control to disable this input
  setDisabledState(disabled: boolean): void {
    console.log('TinymceEditorComponent | setDisabledState')
    this.disabled = disabled;
    if(this.editor){
      this.editor.settings.readonly = this.disabled
    } 
  }

  ngAfterViewInit() {
    console.log('TinymceEditorComponent | ngAfterViewInit')
    tinymce.init({
      readonly: this.disabled,
      selector: '#' + this.id,
      ...constants.tinyMceSettings,
      init_instance_callback: (editor) => {
        this.editor = editor;
        editor.setContent(this.value)
      },
      setup: (editor) => {
        editor.on('blur', (e) => { this.zone.run(() => { return this.onTouch() }); });
        editor.on('setcontent', (e) => {
            let content = e.content, format = e.format;
            if(format === 'html' && content ) {
              this.zone.run(() => { return this.onChange(content) });
            }
        });
        editor.on('change keyup undo redo', (e) => { 
          this.value = editor.getContent()
          this.zone.run(() => { return this.onChange(editor.getContent()) });
        });
      }
    });
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }
  
}
