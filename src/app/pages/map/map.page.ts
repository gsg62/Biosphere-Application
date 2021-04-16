import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
// import { NavParams } from '@ionic/angular';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  latitude: any;
  longitude: any;
  map: any;
  data: any;
  userType: any;
  areaOfInterest: any;

  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    // public navParams: NavParams
  ) {
    this.route.queryParams.subscribe(params => {
      this.userType = this.router.getCurrentNavigation().extras.state.scenarioData.userType;
    });
  }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.setLocation();
  }
  submitLocation(controlDiv, map) {
    // Set CSS for the control border.
    const submitUI = document.createElement('div');
    submitUI.style.backgroundColor = '#FFE047';
    submitUI.style.border = '2px solid #000000';
    submitUI.style.borderRadius = '3px';
    submitUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    submitUI.style.cursor = 'pointer';
    submitUI.style.marginBottom = '22px';
    submitUI.style.textAlign = 'center';
    submitUI.title = 'Click to submit your current location';
    controlDiv.appendChild(submitUI);
    // Set CSS for the control interior.
    const submitText = document.createElement('div');
    submitText.style.color = '#000000';
    submitText.style.fontFamily = 'Roboto,Arial,sans-serif';
    submitText.style.fontSize = '16px';
    submitText.style.lineHeight = '38px';
    submitText.style.paddingLeft = '5px';
    submitText.style.paddingRight = '5px';
    submitText.innerHTML = 'Submit Location';
    submitUI.appendChild(submitText);



    // Setup the click event listeners: user submits location.
    submitUI.addEventListener('click', () => {
      let navigationExtras: NavigationExtras = {
        state: {
          scenarioData: {
            userType: this.userType,
            center: {
              lat: this.areaOfInterest.getCenter().lat(),
              lng: this.areaOfInterest.getCenter().lng(),
            },
            radius: this.areaOfInterest.radius
          }
        }
      };
      // alert the user it might take longer than normal if the radius is larger than approximately 1/2 Earth's radius
      if (this.areaOfInterest.radius > 3180000)
      {
        alert('The radius you selected is really large, so getting results could take up to 5 minutes. ' +
            'If you do NOT want to wait that long, please restart the simulation and try again with a smaller radius.');
      }
      // The Madingley model doesn't generate data for the absolute value of latitude greater than 65 degrees
      if ( Math.abs(this.areaOfInterest.getCenter().lat()) < 65)
      {
        this.router.navigate(['scenario-options'], navigationExtras);
      }
      else
      {
        alert('Please select a region that is between 65 degrees N and 65 degrees S (move closer to the equator). ');
      }

    });

  }

  setLocation() {
    this.route.queryParams.subscribe(params => {

      if (params && params.location) {
        this.data = JSON.parse(params.location);
      }
      // CHANGE LONG and LAT HERE
      // Get current location
      const location = new google.maps.LatLng(params.lat, params.lng);
      const locationSetting = params.locationSetting;
      // let areaOfInterest;
      let options =
      {
        center: location,

        // CHANGE DEFAULT ZOOM HERE
        zoom: 6,
        mapTypeId: 'terrain',
        // Default will allow the user to move around the map
        gestureHandling: 'greedy',

        // Disable certain parts of the UI so user can't switch to street mode,
        // select the map type, or enter fullscreen mode
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      };

      // enters if the user wants to use their current location
      // there is no difference currently in map controls for current location vs select location.
      // if you want to change the map controls only for current location, do it here
      if (locationSetting === 'currentLoc') {
        this.areaOfInterest = new google.maps.Circle({
          center: location,
          // default radius, but the user can adjust in the app
          radius: 300000,
          editable: true,
          // current location DOES allow for user to move circle
          draggable: true,
          geodesic: true,
        });
        // uncomment the next line if select location should NOT allow the user to move around the map
        // options.gestureHandling = 'none';
      }

      // enters if the current wants to select their location on the map
      // there is no difference currently in map controls for current location vs select location.
      // if you want to change the map controls only for select location, do it here
      else if (locationSetting === 'selectLoc') {
        this.areaOfInterest = new google.maps.Circle({
          center: location,
          // default radius, but the user can adjust in the app
          radius: 300000,
          editable: true,
          // current location DOES allow for user to move circle
          draggable: true,
          geodesic: true,
        });
        // select location allows the user to move around the map
        options.gestureHandling = 'greedy';
      }

      this.map = new google.maps.Map(this.mapRef.nativeElement, options);

      this.areaOfInterest.setMap(this.map);

      const centerControlDiv = document.createElement('div');
      this.submitLocation(centerControlDiv, this.map);
      this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
    });

  }
}
