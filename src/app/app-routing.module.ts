import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'getting-started',
    pathMatch: 'full'
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./pages/contact-us/contact-us.module').then( m => m.ContactUsPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'user-options',
    loadChildren: () => import('./pages/user-options/user-options.module').then( m => m.UserOptionsPageModule)
  },
  {
    path: 'getting-started',
    loadChildren: () => import('./pages/getting-started/getting-started.module').then( m => m.GettingStartedPageModule)
  },
  {
    path: 'location-options',
    loadChildren: () => import('./pages/location-options/location-options.module').then( m => m.LocationOptionsPageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./pages/map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'scenario-options',
    loadChildren: () => import('./pages/scenario-options/scenario-options.module').then( m => m.ScenarioOptionsPageModule)
  },
  {
    path: 'visualize-results',
    loadChildren: () => import('./pages/visualize-results/visualize-results.module').then( m => m.VisualizeResultsPageModule)
  },
  {
    path: 'manual-coords',
    loadChildren: () => import('./pages/manual-coords/manual-coords.module').then(m => m.ManualCoordsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
