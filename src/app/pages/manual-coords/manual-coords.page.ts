import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-manual-coords',
  templateUrl: './manual-coords.page.html',
  styleUrls: ['./manual-coords.page.scss'],
})
export class ManualCoordsPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }
  submitCoords()
  {
    this.navCtrl.navigateForward('/scenario-options');
  }
}
