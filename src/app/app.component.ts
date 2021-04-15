import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Getting Started',
      url: 'getting-started',
      icon: 'rocket'
    },
    {
      title: '*SIMULATION*',
      url: 'user-options',
      icon: 'globe'
    },
    {
      title: 'Contact Us',
      url: 'contact-us',
      icon: 'mail'
    },
    {
      title: 'Resources',
      url: 'about',
      icon: 'help'
    },
    {
      title: 'About Biopshere',
      url: 'about-team',
      icon: 'people'
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
  }
}
