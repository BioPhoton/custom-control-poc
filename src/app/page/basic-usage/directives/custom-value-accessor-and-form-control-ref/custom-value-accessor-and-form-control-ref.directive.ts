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

/**
 * We must check whether the agent is Android because composition events
 * behave differently between iOS and Android.
 */
function isAndroid(): boolean {
  const userAgent = getDOM() ? getDOM().getUserAgent() : '';
  return /android (\d+)/.test(userAgent.toLowerCase());
}

@Directive({
  selector: '[customValueAccessorAndFormControlRef]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomValueAccessorAndFormControlRefDirective),
      multi: true
    }
  ],
  host: {
    /*
     * Listening to the native input event of the host element.
     * On input we call the take the value property of the target element end call
     * the handleInput function with it. This renders the new value to the view.
     */
    '(input)': 'handleInput($event.target.value)',
    /*
     * Listening to the native focus event of the host element.
     * On focus we call the internal haldleFocus function
     */
    '(focus)': 'handleFocus(true)',
    /*
     * Listening to the native blur event of the host element.
     * On blur we call the onTouched function from the formControl
     */
    '(blur)': 'handleFocus(false)'
  }
})
export class CustomValueAccessorAndFormControlRefDirective extends AbstractControlDirective implements ControlValueAccessor, OnInit {

  // Reference to the formControl
  control: AbstractControl;

  @Input()
  // The formControlName in the parent
  protected formControlName: string;

  // The internal data model
  _value: any = '';

  // The internal focus state
  focus: any = '';

  // The internal disabled state
  _disabled: any = '';

  // The internal state of composing input
  protected composing = false;

  onChange = (_: any) => {
  };
  onTouched = () => {
  };

  constructor(
    protected renderer: Renderer2, protected elementRef: ElementRef,
    @Optional() @Host() @SkipSelf() private parentFormContainer: ControlContainer
  ) {
    super();
  }

  /*
   * Handel formControl model changes
   */
  writeValue(value: any): void {
    this.renderViewValue(value)
  }

  /*
   * Registers the controls onChange function
   */
  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  /*
   * Registers the controls onTouched function
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /*
   * Sets the internal disabled state and renders it to the view
   */
  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    this.renderViewDisabled(isDisabled);
  }

  /*
   * Depending on the compositionMode and the composing state it
   * calls writeValueFromViewToModel with new value
   */
  private handleInput(value: any): void {
    this.writeValueFromViewToModel(value);
  }

  /*
   * Sets the internal focus state and renders it to the view
   * It also calls onTouch if a blur happens
   */
  private handleFocus(isFocus: boolean): void {
    this.focus = isFocus;
    if (!isFocus) {
      this.onTouched();
    }
    this.renderViewFocus(isFocus);
  }

  // Lifecycle hooks ====================================================================
  ngOnInit(): void {
    this.updateFormControlRef()
  }

  // ControlValueAccessor ==================================================================

  writeValueFromViewToModel(value: any) {
    if (value !== this._value) {
      this._value = value;
      this.onChange(value);
    }
  }

  renderViewValue(value: any) {
    const normalizedValue = value == null ? '' : value;
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', normalizedValue);
  }

  renderViewDisabled(isDisabled: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

  renderViewFocus(isFocus: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'focus', isFocus);
  }

  // FormControl ==================================================================

  updateFormControlRef() {
    this.control = this.parentFormContainer['form'].controls[this.formControlName];
  }

}
