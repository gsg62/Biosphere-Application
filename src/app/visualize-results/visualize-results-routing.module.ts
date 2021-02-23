import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisualizeResultsPage } from './visualize-results.page';

const routes: Routes = 
[
  {
    path: '',
    component: VisualizeResultsPage
  }
];

@NgModule
({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizeResultsPageRoutingModule {}
