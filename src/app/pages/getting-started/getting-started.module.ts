import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GettingStartedPageRoutingModule } from './getting-started-routing.module';
import { GettingStartedPage } from './getting-started.page';

import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: 
  [
    CommonModule,
    FormsModule,
    IonicModule,
    GettingStartedPageRoutingModule,
    TranslateModule
  ],
  declarations: [GettingStartedPage]
})
export class GettingStartedPageModule {}
