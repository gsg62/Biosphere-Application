import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationOptionsPageRoutingModule } from './location-options-routing.module';

import { LocationOptionsPage } from './location-options.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationOptionsPageRoutingModule,
    TranslateModule
  ],
  declarations: [LocationOptionsPage]
})
export class LocationOptionsPageModule {}
