import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { InputScenarioService } from "../../input-scenario.service";

@Component({
  selector: 'app-user-options',
  templateUrl: './user-options.page.html',
  styleUrls: ['./user-options.page.scss'],
})
export class UserOptionsPage implements OnInit {

  constructor(
    private router: Router,
    private inputService: InputScenarioService
  ) {
  }

  ngOnInit() {
    // this.inputService.getTestData().subscribe(
    //   (data) => {
    //     console.log('data', data);
    //   });
  }

  private async setUser(userType: string) {
    console.log("userType: ", userType);
    let navigationExtras: NavigationExtras = {
      state: { scenarioData: { userType: userType } }
    };

    // pass scenario data to visualize results page via neavigation extras
    await this.router.navigate(['location-options'], navigationExtras);

  }

}

