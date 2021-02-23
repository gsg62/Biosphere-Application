import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { VisualizeResultsPageRoutingModule } from './visualize-results-routing.module';

import { VisualizeResultsPage } from './visualize-results.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisualizeResultsPageRoutingModule,
    HttpClientModule
  ],
  declarations: [VisualizeResultsPage]
})
export class VisualizeResultsPageModule {}
