import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

import { IntensityModalComponent } from "../../modals/intensity-modal/intensity-modal.component";

@Component({
  selector: 'app-scenario-options',
  templateUrl: './scenario-options.page.html',
  styleUrls: ['./scenario-options.page.scss'],
})
export class ScenarioOptionsPage {

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) { }

  private async setScenario(scenarioType: string) {
    let modal;
    switch (scenarioType) {
      case 'CLIMATE':
        modal = await this.modalCtrl.create({
          component: IntensityModalComponent,
          componentProps: {
            scenarioType: 'CLIMATE',
            scenarioOptions: ['Low', 'Medium', 'High']
          }
        });
        break;
      case 'LANDUSE':
        modal = await this.modalCtrl.create({
          component: IntensityModalComponent,
          componentProps: {
            scenarioType: 'LANDUSE',
            scenarioOptions: ['Low', 'Medium', 'High']
          }
        });
        break;
      case 'DEFORESTATION':
        modal = await this.modalCtrl.create({
          component: IntensityModalComponent,
          componentProps: {
            scenarioType: 'DEFORESTATION',
            scenarioOptions: ['Selective', 'Logging', 'Normal']
          }
        });
        break;
      case 'TROPIC':
        modal = await this.modalCtrl.create({
          component: IntensityModalComponent,
          componentProps: {
            scenarioType: 'TROPIC',
            scenarioOptions: ['Remove most predators', 'Remove most herbivores', 'Rewilding']
          }
        });
        break;
      case 'EXTINCTIONS':
        modal = await this.modalCtrl.create({
          component: IntensityModalComponent,
          componentProps: {
            scenarioType: 'EXTINCTIONS',
            scenarioOptions: ['Pleistocene', 'Holocene', 'Anthropocene']
          }
        });
        break;
      default:
        console.error(scenarioType + 'is not a valid scenario');
        break;
    }
    return await modal.present();
  }
}

