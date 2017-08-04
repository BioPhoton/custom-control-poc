import {Component, OnInit} from '@angular/core'
import {FormBuilder, FormControl, FormGroup} from '@angular/forms'
import {isBlacklistedName} from '../../core/custom-asyncvalidators/is-blacklisted-name.validator'
import {validName} from '../../core/custom-validators/name.validator'

@Component({
  selector: 'basic-usage',
  templateUrl: './basic-usage.component.html',
  styleUrls: ['./basic-usage.component.scss']
})
export class BasicUsageComponent implements OnInit {


  basicFormGroup: FormGroup;
  nativeInput: FormControl;
  basicInput: FormControl;

  constructor(private fb: FormBuilder) {
    this.basicFormGroup = this.fb.group(
      {
        native: ['initial', [validName], [isBlacklistedName]],
        basic: ['initial', [validName], [isBlacklistedName]],
      }
    );
  }

  ngOnInit() {
    this.nativeInput = this.basicFormGroup.get('native') as FormControl
    this.basicInput = this.basicFormGroup.get('basic') as FormControl
  }

  resetWithValue(value) {
    this.basicFormGroup.reset({
      native: 'reset',
      basic: 'reset'
    })
  }

}
