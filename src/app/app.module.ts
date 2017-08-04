import {NgModule} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {BrowserModule} from '@angular/platform-browser'
import {AppRoutingModule} from './app-routing.module'

import {AppComponent} from './app.component'
import {CoreModule} from './core/core.module'
// Project specific imports
import {BasicUsageComponent} from './page/basic-usage/basic-usage.component'
import {ControlStateComponent} from './page/basic-usage/control-state/control-state.component'
import {CustomValueAccessorDirective} from './page/basic-usage/directives/custom-value-accessor/custom-value-accessor.directive'
import {CustomValueAccessorWithCompositionEventDirective} from './page/basic-usage/directives/custom-value-accessor-with-composition-event/custom-value-accessor-with-composition-event.directive'
import {CustomValueAccessorAndFormControlRefDirective} from './page/basic-usage/directives/custom-value-accessor-and-form-control-ref/custom-value-accessor-and-form-control-ref.directive'
import {CustomValueAccessorComponent} from './page/basic-usage/components/custom-control/custom-control.component'
@NgModule({
  declarations: [
    AppComponent,
    BasicUsageComponent,
    ControlStateComponent,
    CustomValueAccessorDirective,
    CustomValueAccessorWithCompositionEventDirective,
    CustomValueAccessorAndFormControlRefDirective,
    CustomValueAccessorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
