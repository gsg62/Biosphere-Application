import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { disabled } from "./disabledUsertypes";

@Component({
  selector: 'app-user-options',
  templateUrl: './user-options.page.html',
  styleUrls: ['./user-options.page.scss'],
})
export class UserOptionsPage implements OnInit {

  constructor(
    private router: Router,
  ) {
  }

  disableGeneral = false;
  disablePolicy = false;
  disableScientist = false;

  ngOnInit() {
    this.disableButtons();
  }

  private async setUser(userType: string) {
    console.log("userType: ", userType);
    let navigationExtras: NavigationExtras = {
      state: { scenarioData: { userType: userType } }
    };

    // pass scenario data to visualize results page via neavigation extras
    await this.router.navigate(['location-options'], navigationExtras);
  }

  private disableButtons() {
    disabled.forEach(element => {
      switch (element) {
        case 'general_public': this.disableGeneral = true; break;
        case 'policy_maker': this.disablePolicy = true; break;
        case 'scientist': this.disableScientist = true; break;
      }
    });
  }


}

