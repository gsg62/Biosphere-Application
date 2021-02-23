import { Component, OnInit } from '@angular/core';
import { TranslateDefaultParser, TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.page.html',
  styleUrls: ['./getting-started.page.scss'],
})
export class GettingStartedPage implements OnInit {

  constructor(public translate: TranslateService) 
  { 
    translate.addLangs(['en', 'es', 'fr', 'de', 'pt']);
    translate.setDefaultLang(('en'));
    
    const browserLang = translate.getBrowserLang();

    // checks to see if default language matches one of the following
    // else default to en: english
    translate.use(browserLang.match(/en|fr|de|pt|es/) ? browserLang : 'en')
  }

  ngOnInit() {
  }

}
