import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AboutTeamPageRoutingModule } from './about-team-routing.module';

import { AboutTeamPage } from './about-team.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AboutTeamPageRoutingModule,
    TranslateModule
  ],
  declarations: [AboutTeamPage]
})
export class AboutTeamPageModule {}
