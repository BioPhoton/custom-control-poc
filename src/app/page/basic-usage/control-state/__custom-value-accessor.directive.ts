import {
  Directive,
  ElementRef,
  forwardRef,
  Host,
  Inject,
  Input,
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
import {Observable} from 'rxjs/Observable'

/**
 * We must check whether the agent is Android because composition events
 * behave differently between iOS and Android.
 */
function isAndroid(): boolean {
  const userAgent = getDOM() ? getDOM().getUserAgent() : '';
  return /android (\d+)/.test(userAgent.toLowerCase());
}

@Directive({
  selector: '[customControl]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AbstractCustomValueAccessorDirective),
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
    '(blur)': 'handleFocus(false)',
    /*
     * The compositionstart event is fired when the composition of a passage of text is prepared
     * (similar to keydown for a keyboard input, but fires with special characters that require
     * a sequence of keys and other inputs such as speech recognition or word suggestion on mobile).
     */
    '(compositionstart)': 'compositionStart()',
    /*
     * The compositionend event is fired when the composition of a passage of text has been completed
     * or cancelled
     * (fires with special characters that require a sequence of keys and other inputs such as
     * speech recognition or word suggestion on mobile).
     */
    '(compositionend)': 'compositionEnd($event.target.value)'
  }
})
export class AbstractCustomValueAccessorDirective extends AbstractControlDirective implements ControlValueAccessor {
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
    @Optional() @Inject(COMPOSITION_BUFFER_MODE) protected compositionMode: boolean,
    @Optional() @Host() @SkipSelf() private parentFormContainer: ControlContainer
  ) {
    super();
    if (this.compositionMode == null) {
      this.compositionMode = !isAndroid();
    }
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
    if (!this.compositionMode || (this.compositionMode && !this.composing)) {
      this.writeValueFromViewToModel(value);
    }
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

  /*
   * Is called when the compositionStart event is fired.
   * It sets the internal composing state to true
   */
  compositionStart(): void {
    this.composing = true;
  }

  /*
   * Is called when the compositionEnd event is fired
   * It sets the internal composing state to false
   * and triggers the onChange function with the new value.
   */
  compositionEnd(value: any): void {
    this.composing = false;
    if (this.compositionMode) {
      this.onChange(value);
    }
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
    this.setupResetObservable(this.control);
  }

  // ==============================================================================

  setupResetObservable(control: AbstractControl) {
    const statusChanges$ = control.statusChanges
      .map((n: string) => {
        return {
          dirty: control.dirty,
          pristine: control.pristine
        }
      });

    const valueChanges$ = control.valueChanges
      .map((n: string) => {
        return {
          valid: control.valid,
          invalid: control.invalid,
          touched: control.touched,
          untouched: control.untouched
        }
      })

    Observable.combineLatest(statusChanges$, valueChanges$, (statusState, valueState) => {
      return {...statusState, ...valueState}
    })
      .filter((controlState) => {
        const resetState = {
          dirty: false,
          pristine: true,
          touched: false,
          untouched: true
        };

        return Object
          .keys(resetState)
          .reduce((state, item) => {
            return !state ? false : controlState[item] === resetState[item];
          }, true)
      })
      .subscribe((controlState) => {
        this.onResetEvent(controlState);
      })
  }

  onResetEvent(isReset: any) {
    console.log('onReset', isReset);
  }

}
