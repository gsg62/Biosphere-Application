import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";

@Component({
  selector: 'app-manual-coords',
  templateUrl: './manual-coords.page.html',
  styleUrls: ['./manual-coords.page.scss'],
})
export class ManualCoordsPage implements OnInit {

  scenarioData: any;
  location: FormGroup;

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private route: ActivatedRoute,
    public formBuilder: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.scenarioData = this.router.getCurrentNavigation().extras.state.scenarioData;
        console.log("scenrioData from manual-coords: ", this.scenarioData);
      }
    });
    this.location = new FormGroup({
      lat: new FormControl(),
      lng: new FormControl(),
      radius: new FormControl()
    });

  }

  ngOnInit() {
  }
  submitCoords() {
    console.log(this.location.value);
    let navigationExtras: NavigationExtras = {
      state: {
        scenarioData: {
          userType: this.scenarioData.userType,
          center: {
            lat: this.location.value.lat,
            lng: this.location.value.lng,
          },
          radius: this.location.value.radius
        }
      }
    };
    this.router.navigate(['scenario-options'], navigationExtras);
  // this.navCtrl.navigateForward('/scenario-options');
  }

}
