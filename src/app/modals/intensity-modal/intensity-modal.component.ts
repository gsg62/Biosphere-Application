import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { NavParams } from '@ionic/angular';

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

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    public navParams: NavParams
  ) {
    // set button labels
    this.label1 = navParams.get('scenarioOptions')[0];
    this.label2 = navParams.get('scenarioOptions')[1];
    this.label3 = navParams.get('scenarioOptions')[2];
  }

  ngOnInit() { }

  private async runSimulation(intensity: number) {

    // pass scenario values and navigate to visualize results page
    let navigationExtras: NavigationExtras = {
      state: {
        scenarioData: {
          scenario1stVal: this.navParams.get('scenarioType'),
          scenario2ndVal: {
            value: this.navParams.get('scenarioOptions')[intensity]
          }
        }
      }
    };

    // pass scenario data to visualize results page via neavigation extras
    await this.router.navigate(['visualize-results'], navigationExtras);

    // dismiss modal after data is passed to results page
    this.modalCtrl.dismiss();
  }

  private dismissModal() {
    this.modalCtrl.dismiss();
  }
}
