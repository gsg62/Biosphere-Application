import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManualCoordsPage } from './manual-coords.page';

const routes: Routes = [
  {
    path: '',
    component: ManualCoordsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManualCoordsPageRoutingModule {}
