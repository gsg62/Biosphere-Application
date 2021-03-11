import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { NavParams } from '@ionic/angular';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-intensity-modal',
  templateUrl: './intensity-modal.component.html',
  styleUrls: ['./intensity-modal.component.scss'],
})


export class IntensityModalComponent implements OnInit {

  // button labels
  label1: string;
  label2: string;
  label3: string;
  scenarioData: any;
  deforestation = false;

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    public navParams: NavParams,

  ) {
    // set button labels
    this.label1 = navParams.get('scenarioOptions')[0];
    this.label2 = navParams.get('scenarioOptions')[1];
    this.label3 = navParams.get('scenarioOptions')[2];
    this.scenarioData = navParams.get('scenarioData');
    // if(this.scenarioData.scenario)
  }

  ngOnInit() { }

  private async runSimulation(intensity: number) {

    if (this.navParams.get('scenarioType') == 'DEFORESTATION' 
      && intensity == 2) {
      alert('Please select a valid intensity');
      this.deforestation = true;
    }
    else {
      console.log("scenarioData from modal: ", this.scenarioData);

      // pass scenario values and navigate to visualize results page
      let navigationExtras: NavigationExtras = {
        state: {
          scenarioData: {
            userType: this.scenarioData.userType,
            center: {
              lat: this.scenarioData.center.lat,
              lng: this.scenarioData.center.lng
            },
            radius: this.scenarioData.radius,

            scenario1stVal: this.navParams.get('scenarioType'),
            scenario2ndVal: this.navParams.get('scenarioOptions')[intensity]
          }
        }
      };

      console.log("data to visualize results: ", navigationExtras);

      // pass scenario data to visualize results page via neavigation extras
      await this.router.navigate(['visualize-results'], navigationExtras);

      // dismiss modal after data is passed to results page
      this.modalCtrl.dismiss();
    }
  }

  private dismissModal() {
    this.modalCtrl.dismiss();
  }
}
