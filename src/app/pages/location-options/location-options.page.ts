import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';

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
  scenarioData: any;

  constructor(
    private geolocation: Geolocation,
    private router: Router,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.scenarioData = this.router.getCurrentNavigation().extras.state.scenarioData;
        console.log("scenrioData from location-options: ", this.scenarioData);
      }
    });

  }

  ngOnInit() {
  }

  openMap() {
      if (this.locationSetting === "currentLoc") {
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
                                  locationSetting: this.locationSetting,
                                  scenarioData: this.scenarioData
                              },
                          state: {
                              scenarioData: this.scenarioData
                          }
                      }
                  console.log(navigationExtras);
                  this.router.navigate(['/map'], navigationExtras);
                  this.showProgress = false;

              }, er => {
                  alert('Please turn on Location Access and try again. \n\n' +
                      'If you do NOT want to access your current location, please use the select location on map button.');
                  this.showProgress = false;
              }).catch((error) => alert('error'));
      }
      else if (this.locationSetting === "selectLoc") {
          const navigationExtras: NavigationExtras =
              {
                  queryParams:
                      {
                          // DEFAULT location is Flagstaff, AZ for the select location page
                          lat: 35.198284,
                          lng: -111.651299,
                          locationSetting: this.locationSetting,
                          scenarioData: this.scenarioData
                      },
                  state: {
                      scenarioData: this.scenarioData
                  }
              }
          console.log(navigationExtras);
          this.router.navigate(['/map'], navigationExtras);
      }
  }

  useDeviceLocation() {
    // show progress bar after user clicks button
    this.showProgress = true;
    // user selected current location setting on the location options pag
    this.locationSetting = "currentLoc";
    this.openMap();
  }
  selectLocation() {
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
