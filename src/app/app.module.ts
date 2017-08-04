import {NgModule} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {BrowserModule} from '@angular/platform-browser'
import {AppRoutingModule} from './app-routing.module'

import {AppComponent} from './app.component'
import {CoreModule} from './core/core.module'
// Project specific imports
import {BasicUsageComponent} from './page/basic-usage/basic-usage.component';
import { ControlStateComponent } from './page/basic-usage/control-state/control-state.component'
import {CustomValueAccessorDirective} from './page/custom-value-accessor/custom-value-accessor.directive'
@NgModule({
  declarations: [
    AppComponent,
    BasicUsageComponent,
    ControlStateComponent,
    CustomValueAccessorDirective
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
