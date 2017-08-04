import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms'

@Component({
  selector: 'app-control-state',
  templateUrl: './control-state.component.html',
  styleUrls: ['./control-state.component.scss']
})
export class ControlStateComponent implements OnInit {

  @Input()
  control: FormControl;

  constructor() { }

  ngOnInit() {

  }

}
