import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileOpener } from '@ionic-native/file-opener/ngx'
import { ChartsModule } from 'ng2-charts';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from "@angular/common";
import { Injector, APP_INITIALIZER } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LOCATION_INITIALIZED } from '@angular/common';

export function HttpLoaderFactory(http: HttpClient)
{
  return new TranslateHttpLoader(http)
}

export function appInitializerFactory(translate: TranslateService, injector: Injector) {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    const browserLang = translate.getBrowserLang();
    locationInitialized.then(() => {
      const langToSet = browserLang.match(/en|fr|de|pt|es/) ? browserLang : 'en';
      translate.setDefaultLang(browserLang.match(/en|fr|de|pt|es/) ? browserLang : 'en');
      translate.use(langToSet).subscribe(() => {
        console.info(`Successfully initialized '${langToSet}' language.'`);
      }, err => {
        console.error(`Problem with '${langToSet}' language initialization.'`);
      }, () => {
        resolve(null);
      });
    });
  });
}

@NgModule({
  declarations: [
    AppComponent, 
  ],
  // entryComponents: [ModalComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ChartsModule,
    HttpClientModule,
    CommonModule,
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
  providers: 
  [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FileOpener,
    Geolocation,
    { provide: APP_INITIALIZER, 
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector],
      multi: true
    }
    // ModalComponent
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule {}
