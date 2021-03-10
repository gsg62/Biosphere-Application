import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserOptionsPageRoutingModule } from './user-options-routing.module';

import { UserOptionsPage } from './user-options.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserOptionsPageRoutingModule,
    TranslateModule
  ],
  declarations: [UserOptionsPage]
})

export class UserOptionsPageModule {}
