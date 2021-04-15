import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutTeamPage } from './about-team.page';

const routes: Routes = [
  {
    path: '',
    component: AboutTeamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutTeamPageRoutingModule {}
