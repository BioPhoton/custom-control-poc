import {
  Directive,
  ElementRef,
  forwardRef,
  Host,
  Inject,
  Input,
  OnInit,
  Optional,
  Renderer2,
  SkipSelf
} from '@angular/core'
import {
  AbstractControl,
  AbstractControlDirective,
  COMPOSITION_BUFFER_MODE,
  ControlContainer,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms'
import {ɵgetDOM as getDOM} from '@angular/platform-browser'
import 'rxjs/add/observable/combineLatest'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {Observable} from 'rxjs/Observable'

/**
 * We must check whether the agent is Android because composition events
 * behave differently between iOS and Android.
 */
function _isAndroid(): boolean {
  const userAgent = getDOM() ? getDOM().getUserAgent() : '';
  return /android (\d+)/.test(userAgent.toLowerCase());
}

@Directive({
  selector: '[cvaBaseImpl]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CvaBaseImplDirective),
      multi: true
    }
  ],
  host: {
    '(input)': '_handleInput($event.target.value)',
    '(blur)': 'onTouched()',
    '(compositionstart)': '_compositionStart()',
    '(compositionend)': '_compositionEnd($event.target.value)'
  }
})
export class CvaBaseImplDirective extends AbstractControlDirective implements ControlValueAccessor, OnInit {

  /*START default angular implementation of FormControlName===================================================================*/
  control: AbstractControl | any;
  /*END default angular implementation of FormControlName=====================================================================*/

  /*START default angular implementation of AbstractControlDirective==========================================================*/
  // The internal data model
  private _value: any = '';
  /*END default angular implementation of AbstractControlDirective============================================================*/


  @Input()
  private formControlName: string;

  private resetEvent$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /*START default angular implementation of AbstractControlDirective==========================================================*/

  /* Whether the user is creating a composition string (IME events). */
  private _composing = false;

  onChange = (_: any) => {
  };
  onTouched = () => {
  };
  /*END default angular implementation of AbstractControlDirective==========================================================*/
  constructor(
    /*START default angular implementation of AbstractControlDirective==========================================================*/
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
    @Optional() @Inject(COMPOSITION_BUFFER_MODE) private _compositionMode: boolean,
    /*END default angular implementation of AbstractControlDirective============================================================*/
    @Optional() @Host() @SkipSelf() private parentFormContainer: ControlContainer
  ) {
    super();
    /*START default angular implementation of AbstractControlDirective==========================================================*/
    if (this._compositionMode == null) {
      this._compositionMode = !_isAndroid();
    }
    /*END default angular implementation of AbstractControlDirective============================================================*/
  }

  /*START default angular implementation of AbstractControlDirective==========================================================*/
  writeValue(value: any): void {
    this.setViewValue(value)
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.setViewDisabled(isDisabled);
  }

  _handleInput(value: any): void {
    if (!this._compositionMode || (this._compositionMode && !this._composing)) {
      this.writeValueFromViewToModel(value);
    }
  }

  _compositionStart(): void {
    this._composing = true;
  }

  _compositionEnd(value: any): void {
    this._composing = false;
    if (this._compositionMode) {
      this.onChange(value);
    }
  }

  /*END default angular implementation of AbstractControlDirective============================================================*/

  ngOnInit(): void {
    this._updateFormControlRef();
  }

  // ================================================================== CVA

  writeValueFromViewToModel(value: any) {
    if (value !== this._value) {
      this._value = value;
      this.onChange(value);
    }
  }

  setViewValue(value: any) {
    const normalizedValue = value == null ? '' : value;
    this._renderer.setProperty(this._elementRef.nativeElement, 'value', normalizedValue);
  }

  setViewDisabled(isDisabled: boolean) {
    this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
  }

  // ================================================================== FCN

  _updateFormControlRef() {
    this.control = this.parentFormContainer['form'].controls[this.formControlName];
  }

}
