import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { disabled } from "./disabledScenarios";
import { IntensityModalComponent } from "../../modals/intensity-modal/intensity-modal.component";

@Component({
  selector: 'app-scenario-options',
  templateUrl: './scenario-options.page.html',
  styleUrls: ['./scenario-options.page.scss'],
})
export class ScenarioOptionsPage implements OnInit {

  scenarioData: any;

  disableClimate = false;
  disableLanduse = false;
  disableDeforestation = false;
  disableTropic = false;
  disableExtinctions = false;
  


  constructor(
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private router: Router) {
      this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.scenarioData = this.router.getCurrentNavigation().extras.state.scenarioData;
      }
    });
   }

   ngOnInit() {
    this.disableButtons();
  }

  private async setScenario(scenarioType: string) {
    let modal;
    // check if scenariotype is disabled
    // if(!disabled.includes(scenarioType)) {
      switch (scenarioType) {
        case 'CLIMATE':
          modal = await this.modalCtrl.create({
            component: IntensityModalComponent,
            componentProps: {
              scenarioType: 'CLIMATE',
              scenarioOptions: ['Low', 'Med', 'High'],
              scenarioData: this.scenarioData
            }
          });
          break;
        case 'LANDUSE':
          modal = await this.modalCtrl.create({
            component: IntensityModalComponent,
            componentProps: {
              scenarioType: 'LANDUSE',
              scenarioOptions: ['Low', 'Med', 'High'],
              scenarioData: this.scenarioData
            }
          });
          break;
        case 'DEFORESTATION':
          modal = await this.modalCtrl.create({
            component: IntensityModalComponent,
            componentProps: {
              scenarioType: 'DEFORESTATION',
              scenarioOptions: ['Selective Logging', 'Normal', null], 
              scenarioData: this.scenarioData
            }
          });
          // alert("We are currently still working on obatining the data required for this scenario. Please select a different Scenario to run");
          break;
        case 'TROPIC':
          modal = await this.modalCtrl.create({
            component: IntensityModalComponent,
            componentProps: {
              scenarioType: 'TROPHIC',
              scenarioOptions: ['Remove most predators', 'Remove most herbivores', 'Rewilding'],
              scenarioData: this.scenarioData
            }
          });
          break;
        case 'EXTINCTIONS':
          modal = await this.modalCtrl.create({
            component: IntensityModalComponent,
            componentProps: {
              scenarioType: 'EXTINCTIONS',
              scenarioOptions: ['Pleistocene', 'Holocene', 'Anthropocene'],
              scenarioData: this.scenarioData
            }
          });
          break;
        default:
          console.error(scenarioType + 'is not a valid scenario');
          break;
    }
    return await modal.present();  

    // else {
    //   alert("We are currently still working on obatining the data required for this scenario. Please select a different Scenario to run");
    // }
  }


  private disableButtons() {
    disabled.forEach(element => {
      switch (element) {
        case 'CLIMATE': this.disableClimate = true; break;
        case 'LANDUSE': this.disableLanduse = true; break;
        case 'DEFORESTATION': this.disableDeforestation = true; break;
        case 'TROPIC': this.disableTropic = true; break;
        case 'EXTINCTIONS': this.disableExtinctions = true; break;
      }
    });
  }
}

