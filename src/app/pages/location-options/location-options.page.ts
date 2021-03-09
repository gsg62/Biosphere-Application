import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Router} from '@angular/router';
import {NavigationExtras} from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-location-options',
  templateUrl: './location-options.page.html',
  styleUrls: ['./location-options.page.scss'],
})
export class LocationOptionsPage implements OnInit {
  lat: any = 0;
  lng: any = 0;
  locationSetting: any = " ";
  curlocation: any;
  showProgress: boolean;
  constructor( private navCtrl: NavController, private geolocation: Geolocation, private router: Router) {

  }

  ngOnInit() {
  }

  openMap() {
    this.geolocation.getCurrentPosition().then(
        (location) => {
          this.lat = location.coords.latitude;

          this.lng = location.coords.longitude;

          this.curlocation =
              {
                lat: this.lat,
                lng: this.lng
              };

          console.log(this.curlocation.lat);
          console.log(this.curlocation.lng);
          console.log(this.locationSetting);
          const navigationExtras: NavigationExtras =
              {
                queryParams:
                    {
                      lat: this.lat,
                      lng: this.lng,
                        locationSetting: this.locationSetting
                    }
              }
          console.log(navigationExtras);
          this.showProgress = false;
          this.router.navigate(['/map'], navigationExtras);

        }, er =>
        {alert('Error: Please turn on Location Access and try again.'); }).catch((error) => alert('error'));
  }

  useDeviceLocation() {
      // show progress bar after user clicks button
      this.showProgress = true;
    // user selected current location setting on the location options pag
      this.locationSetting = "currentLoc";
      this.openMap();
  }
  selectLocation() {
      // show progress bar after user clicks button
      this.showProgress = true;
      // user decided to select the location on the location options page
      this.locationSetting = "selectLoc";
      this.openMap();
  }
  manualLocation() {
      // don't show progress bar after user clicks button because it switches really fast
      this.showProgress = false;
        // user decided to input their own location coordinates on the location options page
      this.router.navigate(['/manual-coords']);
    }

}
