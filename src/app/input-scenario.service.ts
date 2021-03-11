import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InputScenarioService {

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * 
   * This is the service we will use to pass our input variables 
   * to our Lambda function.
   * 
   * Still needs implementaiton
   * 
   **/ 

  personalDevApiEndPoint = 'https://tcox9byx8h.execute-api.us-east-2.amazonaws.com/default/test-python-lambda';
  
  biosphereSB1ApiEndpoint = 'https://jbt8pms68j.execute-api.us-west-2.amazonaws.com/default/team-biosphere-sandbox-1-lambda';
  
  biosphereSB2ApiEndpoint = 'https://jbt8pms68j.execute-api.us-west-2.amazonaws.com/default/team-biosphere-sandbox-2-lambda';

  prodEndpoint = 'https://o58lshx3rf.execute-api.us-west-2.amazonaws.com/ionic';

  testEndpoint = 'https://yapxntov4i.execute-api.us-west-2.amazonaws.com/Dev';
  
  // test function to show how a REST GET http request can be made to a specified api endpoint
  getMadingleyData(scenarioData: any): Observable<any> {

    // let data = this.http.get(this.testEndpoint); // not fully configured
    let postData = this.http.post(this.testEndpoint, scenarioData);
    return postData;
  }
}
