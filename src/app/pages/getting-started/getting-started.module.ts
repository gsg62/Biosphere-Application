import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GettingStartedPageRoutingModule } from './getting-started-routing.module';
import { GettingStartedPage } from './getting-started.page';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http'

export function HttpLoaderFactory(http: HttpClient)
{
  return new TranslateHttpLoader(http)
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GettingStartedPageRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot
    (
      {
        loader: 
        {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }
    )
  ],
  declarations: [GettingStartedPage]
})
export class GettingStartedPageModule {}
