import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ScenarioOptionsPageRoutingModule } from './scenario-options-routing.module';
import { ScenarioOptionsPage } from './scenario-options.page';

import { MaterialModule } from "../../material-module";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScenarioOptionsPageRoutingModule,
    MaterialModule,
    TranslateModule
  ],
  declarations: [ScenarioOptionsPage]
})

export class ScenarioOptionsPageModule {}
