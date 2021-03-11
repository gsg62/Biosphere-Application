import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManualCoordsPageRoutingModule } from './manual-coords-routing.module';

import { ManualCoordsPage } from './manual-coords.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManualCoordsPageRoutingModule,
    TranslateModule
  ],
  declarations: [ManualCoordsPage]
})
export class ManualCoordsPageModule {}
