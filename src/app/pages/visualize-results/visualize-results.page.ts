import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { InputScenarioService } from "../../input-scenario.service";

// For Data Exportation
import { Filesystem, FilesystemDirectory } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

declare var google: any;

@Component
  ({
    selector: 'app-visualize-results',
    templateUrl: './visualize-results.page.html',
    styleUrls: ['./visualize-results.page.scss'],
  })

export class VisualizeResultsPage implements OnInit {
  @ViewChild('barChart') barChart;
  @ViewChild('lineChart') lineChart;
  @ViewChild('createPDFButton') createPDFButton: ElementRef;
  @ViewChild('downloadButton') downloadButton: ElementRef;
  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;
  @ViewChild('data1') data1Button: ElementRef;
  @ViewChild('myRange') slider: ElementRef;

  bodyKeys = [];
  bodyData = [];

  latitudeValues = [];
  longitudeValues = [];
  timeValues = [];
  EBV1Values = [];
  coordinateArray = [];
  heatMapKeys = [];
  timeSeries = [];
  rawKeys = [];
  calculatedData = [];
  calculatedDataKeys = [];
  EBVList = [];
  requestArray = [];
  madingleyData = [];
  totalData = [];
  EBVUnits = [];
  requestIndexDict = {};
  buttonIndexDict = {};
  globalGraphData = [];
  timeFrame = [];

  heatMapInput = 
  [ 
    // non weighted format
    // new google.maps.LatLng(lat, long)

    // weighted format
    // {location: new google.maps.LatLng(lat, long), weight: weightValue}
  ];

  negativeHeatMapInput = [];

  loadingIndicator:any;
  bars: any;
  line: any;
  new64Chart: any;
  colorArray: any;
  showCreate: boolean;
  showDownload: boolean;
  chartsCreated: boolean;
  legendMade: boolean;
  transparentOn: boolean;
  statusCode: number;
  EBVindex: number;
  sliderValue: any;
  img: any;
  positiveHeatMap: any;
  negativeHeatMap: any;
  map: any;
  scenarioData: any;
  requestNumber: any;
  globalCurrentUnit: any;
  totalYears: any;

  pdfObj = null;
  banner = null;
  base64Image = null;
  logoData = null;
  height = 0;

  coolGradient = 
  [
    "rgba(255, 255, 255, 0)",
    "rgba(0, 255, 125, 1)",
    "rgba(0, 255, 255, 1)",
    "rgba(0, 125, 255, 1)",
    "rgba(0, 0, 255, 1)"
  ];

  warmGradient = 
  [
    "rgba(255, 255, 255, 0)",
    "rgba(125, 255, 0, 1)",
    "rgba(255, 255, 0, 1)",
    "rgba(255, 125, 0, 1)",
    "rgba(255, 0, 0, 1)"
  ];

  resultsFetched = false;

    ////////////////// constants for double onion algo /////////////////////
    radiusIncrement = 400000; 
    fileIncrement = 3;
    numberOfFiles = 22;

  
  constructor(
    private navCtrl: NavController, 
    private http: HttpClient, 
    private plt: Platform, 
    private fileOpener: FileOpener, 
    private route: ActivatedRoute, 
    private router: Router,
    private inputService: InputScenarioService,
    public loadingController: LoadingController
  ){
    this.showCreate = false;
    this.showDownload = false;
    this.chartsCreated = false;
    this.sliderValue = "0.0";
    this.legendMade = false;
    this.transparentOn = false;
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.scenarioData = this.router.getCurrentNavigation().extras.state.scenarioData;        
      }
    });
  }

  ngOnInit()
  {
    this.getMadingleyData();
  }

  // makes call to api to get madingley data
  private async getMadingleyData()
  {
    const requestData = this.generateRequest(0, this.scenarioData.radius, 0, 0);
    // checks if necessary to split up request into double onion
    if(this.scenarioData.radius >= this.radiusIncrement 
      || this.getMaxFiles() <= this.fileIncrement)
    {
      this.makeOnionRings(requestData);
    }
    // assume radius smaller than 800,000 and go straight to form inner onion
    else 
    {
      // send to file increment
      this.generateInnerOnion(requestData.min_distance, requestData.max_distance);
    }    

    // for testing purposes
    const startTime = Date.now();
    console.log("requestArray: ", this.requestArray);

    // calculate wait time - estimate based off of what was closest to actual wait times
    const waitTime = 20 + (this.getMaxFiles() / this.fileIncrement) * 
      (this.scenarioData.radius / this.radiusIncrement ) + this.requestArray.length * 1.7;
    
    // start loading indicator
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Loading Madingley Data...\nApproximate loading time:\n' 
                //+ Math.round(waitTime).toString() 
                + "20 - 30"
                + ' seconds',
    });
    await loading.present();


    let counter = 1;
    let requestFailed = false;
    const makeRequests = new Promise<string>((resolve, reject) => {
      this.requestArray.forEach(element => {
        this.inputService.getMadingleyData(element).subscribe(
          (res) => {
            this.madingleyData.push(JSON.parse(res.body));        
            // check if at last response to resolve
            if(counter == this.requestArray.length) {
              resolve(res);
            }
            counter++;            
          }, 
          (err) => {
            requestFailed = true;
            console.log("error: ", err);
            // check if at last response to reject b'c we just need to know of one bad response, not actual err message 
            if(counter == this.requestArray.length) {
              reject(err);
            }
            counter++;            
          }
        );
      });
      }
    );
    makeRequests.then(value => {
      loading.dismiss();

      // testing purposes
      console.log("actual request time: ", (Date.now() - startTime) / 1000);
      console.log("calculated wait time: ", waitTime);      
      console.log("responses from API: ", this.madingleyData);
      
      // check if any requests failed
      if(requestFailed) {
        alert("One or more of the API requests has timed out");
      }
      // otherwise save results to proper format
      else 
      {
        this.resultsFetched = true;
        let indexCounter = 0;

        let coordsCopied = false;
        // GO THROUGH EACH REQUEST
        for(let madingleyIndex = 0; madingleyIndex < this.madingleyData.length; madingleyIndex++)
        {
          let isDuplicate = false;
          coordsCopied = false;
          // check each request's keys for any non-latitude/longitude (EBV)keys

          // GO THROUGH EACH KEY OF EACH REQUEST
          for(let EBVIndex = 3; EBVIndex < this.madingleyData[madingleyIndex]["Keys"].length; EBVIndex++)
          {
            isDuplicate = false;
            let duplicateIndex = 0;
            // Loop through the currently established EBV List to check for duplicates
            for (let EBVListIndex = 0; EBVListIndex < this.EBVList.length; EBVListIndex++)
            {
              // Check if the current EBV is a duplicate
              if(this.EBVList[EBVListIndex]["name"] == this.madingleyData[madingleyIndex]["Keys"][EBVIndex])
              {
                //console.log(this.EBVList[EBVListIndex]["name"], " vs ", this.madingleyData[madingleyIndex]["Keys"][EBVIndex])
                isDuplicate = true;
                duplicateIndex = EBVListIndex;
              }
            }

            // is not a duplicate EBV, original one found in requests array
            if(isDuplicate == false)
            {
              let EBVName = this.madingleyData[madingleyIndex]["Keys"][EBVIndex];
              let heatMapKeys = Object.keys(this.madingleyData[madingleyIndex]["Heat Map"]);

              let heatData = [];

              // create heatmap for the EBV List element
              for(let heatMapIndex = 0; heatMapIndex < heatMapKeys.length; heatMapIndex++)
              {
                let latitude = [];
                let longitude = [];
                let values = [];
                for(let tempIndex = 0; tempIndex < this.madingleyData[madingleyIndex]["Heat Map"][heatMapKeys[heatMapIndex]][EBVName].length; tempIndex++)
                {
                  latitude.push(this.madingleyData[madingleyIndex]["Heat Map"][heatMapKeys[heatMapIndex]]["Latitude"][tempIndex]);
                  longitude.push(this.madingleyData[madingleyIndex]["Heat Map"][heatMapKeys[heatMapIndex]]["Longitude"][tempIndex]);
                  values.push(this.madingleyData[madingleyIndex]["Heat Map"][heatMapKeys[heatMapIndex]][EBVName][tempIndex]);
                }
                let heatYear = [latitude, longitude, values];
                heatData.push(heatYear);
              }

              // create timeSeries for the EBV List element
              let timeSeriesKeys = Object.keys(this.madingleyData[madingleyIndex]["Time Series"][EBVName]);
              let timeSeriesList = [];
              for(let timeSeriesIndex = 0; timeSeriesIndex < timeSeriesKeys.length; timeSeriesIndex++)
              {
                timeSeriesList.push(this.madingleyData[madingleyIndex]["Time Series"][EBVName][timeSeriesKeys[timeSeriesIndex]]);
              }
              
              // create the new item in the EBVList
              this.EBVList.push({name: this.madingleyData[madingleyIndex]["Keys"][EBVIndex],
                                 index: indexCounter,
                                 heatmap: heatData,
                                 units: this.madingleyData[madingleyIndex]["Units"][EBVIndex],
                                 series: timeSeriesList,
                                 requestsFound: 1
                                });
              this.requestIndexDict[indexCounter] = madingleyIndex;
              this.buttonIndexDict[indexCounter] = this.madingleyData[madingleyIndex]["Keys"][EBVIndex];
              indexCounter++; 
            }

            // does not exist in the ebv list yet
            else if(isDuplicate == true)
            {
              let heatMapKeys = Object.keys(this.madingleyData[madingleyIndex]["Heat Map"]);
              let EBVName = this.madingleyData[madingleyIndex]["Keys"][EBVIndex];

              // go through each heatmap time period (0 -> 12? 20?)
              for(let heatMapIndex = 0; heatMapIndex < heatMapKeys.length; heatMapIndex++)
              {
                // manually push each item from the madingley structure to the list format, for some reason I had it equal to the arrays themselves
                // and it registered the variable as a pointer to the madingley structure, so no more of that
                for(let innerIndex = 0; innerIndex < this.madingleyData[madingleyIndex]["Heat Map"][heatMapKeys[heatMapIndex]][EBVName].length; innerIndex++)
                {
                  this.EBVList[duplicateIndex]["heatmap"][heatMapIndex][0].push(this.madingleyData[madingleyIndex]["Heat Map"][heatMapKeys[heatMapIndex]]["Latitude"][innerIndex]);
                  this.EBVList[duplicateIndex]["heatmap"][heatMapIndex][1].push(this.madingleyData[madingleyIndex]["Heat Map"][heatMapKeys[heatMapIndex]]["Longitude"][innerIndex]);
                  this.EBVList[duplicateIndex]["heatmap"][heatMapIndex][2].push(this.madingleyData[madingleyIndex]["Heat Map"][heatMapKeys[heatMapIndex]][EBVName][innerIndex]);
                }
              }

              // sum up all of the timeseries values of this new duplicate found in the requests
              let timeSeriesKeys = Object.keys(this.madingleyData[madingleyIndex]["Time Series"][EBVName]);
              let timeSeriesList = [];

              this.totalYears = timeSeriesKeys.length-1;
              
              // increment the requestsFound since this is one additional request found with that specific EBV
              this.EBVList[duplicateIndex]["requestsFound"] += 1;

              for(let timeSeriesIndex = 0; timeSeriesIndex < timeSeriesKeys.length; timeSeriesIndex++)
              {
                this.EBVList[duplicateIndex]["series"][timeSeriesIndex] += this.madingleyData[madingleyIndex]["Time Series"][EBVName][timeSeriesKeys[timeSeriesIndex]];
              }
            }
          }

          // sets the Units into the list, does not touch the raw data
          for(let unitindex = 3; unitindex < this.madingleyData[madingleyIndex]["Units"].length; unitindex++)
          {
            this.EBVUnits.push(this.madingleyData[madingleyIndex]["Units"][unitindex]);
          }
        }
      }
      
    });
  }

  /**
   * pushed all requests to array using double onion algorithm 
   * (splits by request up into layers by radius and then file increment)
   */ 
  private makeOnionRings(originalRequest: any)
  {
    let currentMax = 0;

    // loop until newMax
    while (currentMax < originalRequest.max_distance)
    {
      // check to not exceed max distance
      if ((currentMax + this.radiusIncrement) <= originalRequest.max_distance)
      {
        this.generateInnerOnion(currentMax, currentMax + this.radiusIncrement);
      }
      // assume larger and subtract max_distance from max for min and keep max the same
      else {
        this.generateInnerOnion(currentMax, originalRequest.max_distance);
      }
      currentMax += this.radiusIncrement;
    }
  }

  /**
   *  helper funciton that pushes designated extra requests to requests array based on userType
   *  for whatever min and max distances is specified 
   */
  private generateInnerOnion(minDistance: number, maxDistance: number) {
    let currentFileStart = 0;
    const MAX_FILES = this.getMaxFiles();
    if(this.scenarioData.userType == 'public' && this.fileIncrement > MAX_FILES){
      this.requestArray.push(this.generateRequest(minDistance, maxDistance, 0, MAX_FILES + 1));
    }
    else {
      while (currentFileStart <= MAX_FILES) {
        currentFileStart++;
        // check to not exceed max files
        if ((currentFileStart + this.fileIncrement) < MAX_FILES)
        {
          this.requestArray.push(this.generateRequest(
            minDistance, maxDistance, currentFileStart - 1, currentFileStart + this.fileIncrement));
        }
        // check if equal
        else if(currentFileStart - 1 == MAX_FILES) {
          this.requestArray.push(this.generateRequest(
            minDistance, maxDistance, currentFileStart - 2, currentFileStart - 1));
        }
        // assume larger and subtract max files from max for min and keep max the same
        else {
          this.requestArray.push(
            this.generateRequest(
              minDistance, maxDistance, currentFileStart - 1, currentFileStart + this.fileIncrement - 1));
          }  
        currentFileStart += this.fileIncrement;
      }
    }
    
  }

  private getMaxFiles() {
    switch (this.scenarioData.userType) {
      case 'public': return 4;        
      case 'policy_maker': return 10;
      case 'scientist': return 19;
    }
  }



  // helper function used to generate a request for specified min and max distances
  private generateRequest( min:number, max: number, fileStart: number, fileEnd: number)
  {
    let request = {
      lat: this.scenarioData.center.lat,
      lng: this.scenarioData.center.lng,
      min_distance: min,      
      max_distance: max,
      file_start: fileStart,
      file_end: fileEnd,
      scenario: this.scenarioData.scenario1stVal,
      scenario_option: this.scenarioData.scenario2ndVal,
      user_type: this.scenarioData.userType    
    }
    return request;
  }


  toggleData(EBVIndex)
  {
    //console.log(EBVIndex)
    //console.log(this.totalData)
    for(let index = 0; index < this.EBVList.length; index++)
    {
      var otherElement = document.getElementById('EBV' + index);
      otherElement.setAttribute('color', 'primary');
    }

    var EBVElement = document.getElementById('EBV' + EBVIndex);
    EBVElement.setAttribute('color', 'tertiary');

    if(this.transparentOn == true)
    {
      var opacityButton = document.getElementById('opacityButton');
      opacityButton.setAttribute('color', 'primary');
      opacityButton.textContent = "CHANGE OPACITY: TRANSPARENCY CURRENTLY OFF";
      this.transparentOn = false;
    }

    this.getValues(EBVIndex, this.sliderValue);
  }

  updateValues(event)
  {
    var heatIndex;
    heatIndex = event.target.value;

    this.sliderValue = this.heatMapKeys[heatIndex];
    
    let currentYear = document.getElementById('currentYear');
    currentYear.textContent = (1900+(heatIndex*5)).toString();

    this.getValues(this.EBVindex, this.sliderValue);
  }

  getValues(buttonNumber, timePeriod)
  {
    //console.log(this.EBVList);
    this.EBVindex = buttonNumber;
    var InttimePeriod: number = +timePeriod;
    
    this.bodyData = this.madingleyData[this.requestIndexDict[buttonNumber]];
    this.bodyKeys = Object.keys(this.bodyData);
    //console.log(this.bodyData);
    //console.log("bodyKeys", this.bodyKeys)

    this.latitudeValues = [];
    this.longitudeValues = [];
    this.heatMapKeys = [];

    // this.bodyKeys[0] is = "Keys"
    var EBVKeys = this.bodyData[this.bodyKeys[0]];
    //var latitudeString = EBVKeys[0];
    //var longitudeString = EBVKeys[1];
    var dataString = this.buttonIndexDict[buttonNumber]//EBVKeys[buttonNumber+3];
    console.log("Button Number", buttonNumber);
    console.log("DataString", dataString);

    var heatData = [];

    // bodyKeys[4] is heatmap
    this.heatMapKeys = Object.keys(this.bodyData[this.bodyKeys[4]]);
    
    // this.bodyKeys[3] is = Heat Map
    // timePeriod is = One Heat Map Value, ranges from ["0.0" -> "20.0"]

    this.bodyData = this.madingleyData[this.requestIndexDict[buttonNumber]];
    //console.log(this.EBVList);
    //console.log(InttimePeriod);

    this.latitudeValues = this.EBVList[this.EBVindex]["heatmap"][InttimePeriod][0];
    this.longitudeValues = this.EBVList[this.EBVindex]["heatmap"][InttimePeriod][1];
    heatData = this.EBVList[this.EBVindex]["heatmap"][InttimePeriod][2];

    if(this.chartsCreated)
    {
      this.line.destroy();
    }

    this.initMap(heatData);

    ///////////////// GRAPH SETUP /////////////
    // bodyData -> timeSeries -> the dataString
    this.bodyData = this.madingleyData[this.requestIndexDict[buttonNumber]];
    var indexStrings = Object.keys(this.bodyData[this.bodyKeys[3]][dataString]);
    //console.log(indexStrings)
    let graphData = this.EBVList[this.EBVindex]["series"];
    let requests = this.EBVList[this.EBVindex]["requestsFound"];
    //console.log("GRAPH DATA", graphData);
    //console.log("REQUESTS FOUND", this.EBVList[this.EBVindex]["requestsFound"]);

    console.log(this.EBVList);
    // averaging the graph data using the amount of requests stored in each EBVList value
    for(let index = 0; index < graphData.length; index++)
    {
      graphData[index] = graphData[index]/requests;
    }

    this.globalGraphData = [];

    // setting up the table
    this.timeFrame = Object.keys(graphData);
    for(let index = 0; index < this.timeFrame.length; index++)
    {
      let timeNum: number = +this.timeFrame[index];
      timeNum = timeNum*5;
      this.timeFrame[index] = timeNum;
      this.globalGraphData.push({time: timeNum, value: graphData[index]});
    }

    this.globalCurrentUnit = this.EBVList[this.EBVindex]["units"];
    

    //console.log("NEW GRAPH DATA", graphData);

    // dataString = the EBV string name
    // graphData = [Averaged EBV Values]
    // indexStrings = ["0.0" to "20.0"]
    this.createCharts(dataString, graphData, indexStrings);
  }
  
//////////////////////////////////////////////////////////////////////////////////////////////////////

  initMap(data)
  {
    var heatMapLats = this.latitudeValues;
    var heatMapLongs = this.longitudeValues;
    var heatMapValues = data;
    this.negativeHeatMapInput = [];
    this.heatMapInput = [];

    // calculate the medians of latitudes and latitudes to center the map around it
    var latitudeMedian = 0, longitudeMedian = 0;

    // getting median, is more accurate than average
    latitudeMedian = heatMapLats[Math.round((heatMapLats.length-1)/2)];
    longitudeMedian = heatMapLongs[Math.round((heatMapLongs.length-1)/2)];
    var maxNeg = heatMapValues[0];
    var maxPos = heatMapValues[0];

    // start average at 0 then total up all the values
    var sum = 0;
    
    for(let i = 0; i < heatMapValues.length; i++)
    {
      if(heatMapValues[i] > maxPos)
      {
        maxPos = heatMapValues[i];
      }

      if(heatMapValues[i] < maxNeg)
      {
        maxNeg = heatMapValues[i];
      }

      sum += heatMapValues[i];
    }

    // push each piece of heatmap data to their respective lists (negative or positive)
    let average = sum/heatMapValues.length;
    let difSum = 0;
    // calculate average difference
    for(let i = 0; i < heatMapValues.length; i++)
    {
      let difference = heatMapValues[i]-average;
      difSum += difference;
    }

    let difAverage = difSum/heatMapValues.length;


    let allPoints = [];
    //console.log("AVERAGE DIF: ", difAverage);
    for(let i = 0; i < heatMapValues.length; i++)
    {
      // calculate the difference between the current value and the average
      let calculatedweight = heatMapValues[i]-average;
      allPoints.push([heatMapLats[i], heatMapLongs[i]]);
      
      
      // the negative list is values under 0 and are colored blue/purple/green
      if( calculatedweight < 0)
      {
        // for cases where the heat map is so faint
        if(difAverage < 1)
        {
          calculatedweight -= 1;
        }
        calculatedweight *= -1
        this.negativeHeatMapInput.push({location: new google.maps.LatLng(heatMapLats[i], heatMapLongs[i]), weight: calculatedweight});
      }

      // the positive list is values under 0 and are colored red/yellow/green
      else if( calculatedweight >= 0)
      {
        // for cases where the heat map is so faint
        if(difAverage < 1)
        {
          calculatedweight += 1;
        }
        this.heatMapInput.push({location: new google.maps.LatLng(heatMapLats[i], heatMapLongs[i]), weight: calculatedweight});
      }
    }

    //console.log("ALL POINTS", allPoints);

    let legend = document.getElementById('legend');
    legend.style.display = "block";

    let htmlNeg = document.getElementById('minimum');
    htmlNeg.textContent = Math.round(maxNeg).toString().concat(" ", this.EBVList[this.EBVindex]["units"]);
    
    let htmlPos = document.getElementById('maximum');
    htmlPos.textContent = Math.round(maxPos).toString().concat(" ", this.EBVList[this.EBVindex]["units"]);

    let htmlAvg = document.getElementById('average');
    htmlAvg.textContent = Math.round(average).toString().concat(" ", this.EBVList[this.EBVindex]["units"]);

    // create the center of the map based on the average calculated data
    const location = new google.maps.LatLng(latitudeMedian, longitudeMedian);

    // configuration options for the map
    const options = 
    {
      center: location,
      zoom: 3,
      disableDefaultUI: true
    }
    
    // create the actual map object
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    
    // normal heat map layer (red/green)
    this.positiveHeatMap = new google.maps.visualization.HeatmapLayer
    ({
      data: this.heatMapInput
    });

    // negative value heatmap layer (blue/purple)
    this.negativeHeatMap = new google.maps.visualization.HeatmapLayer
    ({
      data: this.negativeHeatMapInput
    });
    
    // options for the normal heatmap
    this.positiveHeatMap.setOptions
    ({
      gradient: this.warmGradient
      /*,
      maxintensity: 100,
      dissipating: true*/
    });

    // options for the cool/negative heatmap
    this.negativeHeatMap.setOptions
    ({
      gradient: this.coolGradient
      /*,
      maxintensity: 100,
      dissipating: true*/
    });

    // initializing the two heatmaps
    this.negativeHeatMap.setMap(this.map);
    this.positiveHeatMap.setMap(this.map);

    //var poslegend = document.getElementById("poslegend") as HTMLElement;
    //var neglegend = document.getElementById("neglegend") as HTMLElement;
  
    //this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(poslegend);
    //this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(neglegend);

    this.map.addListener("zoom_changed", () => 
    {
      var zoomLevel = this.map.getZoom();
      var heatmapradius = zoomLevel;
      console.log("Radius is now:", heatmapradius);
      console.log("Zoom is now:", this.map.getZoom());
      
      if(zoomLevel < 4)
      {
        heatmapradius = zoomLevel*3;
        this.positiveHeatMap.set("radius", heatmapradius);
        this.negativeHeatMap.set("radius", heatmapradius);
      }

      else if(zoomLevel == 4)
      {
        heatmapradius = zoomLevel*5;
        this.positiveHeatMap.set("radius", heatmapradius);
        this.negativeHeatMap.set("radius", heatmapradius);
      }

      else if(zoomLevel == 5)
      {
        heatmapradius = zoomLevel*7;
        this.positiveHeatMap.set("radius", heatmapradius);
        this.negativeHeatMap.set("radius", heatmapradius);
      }

      else if(zoomLevel == 6)
      {
        heatmapradius = zoomLevel*10;
        this.positiveHeatMap.set("radius", heatmapradius);
        this.negativeHeatMap.set("radius", heatmapradius);
      }

      else if(zoomLevel == 7)
      {
        heatmapradius = zoomLevel*15;
        this.positiveHeatMap.set("radius", heatmapradius);
        this.negativeHeatMap.set("radius", heatmapradius);
      }
      //console.log(this.positiveHeatMap.get("radius"));
      //console.log(this.negativeHeatMap.get("radius"));
    });

  }

  // sets the opacity of both the negative and positive heatmaps to either 0.2 or 0
  changeOpacity() 
  {
    var button = document.getElementById('opacityButton');

    if(this.transparentOn == true)
    {
      button.setAttribute('color', 'primary');
      button.textContent = "CHANGE OPACITY: TRANSPARENCY CURRENTLY OFF";
      this.transparentOn = false;
    }

    else if(this.transparentOn == false)
    {
      button.setAttribute('color', 'tertiary');
      button.textContent = "CHANGE OPACITY: TRANSPARENCY CURRENTLY ON";
      this.transparentOn = true;
    }

    this.positiveHeatMap.set("opacity", this.positiveHeatMap.get("opacity") ? null : 0.2);
    this.negativeHeatMap.set("opacity", this.negativeHeatMap.get("opacity") ? null : 0.2);
  }

  togglePos()
  {
    this.positiveHeatMap.set("opacity", 0.5);
  }

  toggleNeg()
  {
    this.negativeHeatMap.set("opacity", 0.5);
  }

  togglePosOff()
  {
    this.positiveHeatMap.set("opacity", 0);
  }

  toggleNegOff()
  {
    this.negativeHeatMap.set("opacity", 0);
  }

///////////////VISUALIZATION SECTION//////////////////////////////////////////////////////////

saveMapToDataUrl() 
{
  /*
  html2canvas(document.querySelector("#legend")).then(canvas => {
    console.log(canvas);
    console.log(canvas.toDataURL);
  */
}

createCharts(variableName, graphData, graphLabels) 
{

  for(let index = 0; index < graphLabels.length; index++)
  {
    graphLabels[index] = (parseFloat(graphLabels[index])*5).toString();
  }

  /////////////////LINE CHART//////////////////////////
  this.line = new Chart(this.lineChart.nativeElement, 
  {
    type: 'line',
    data: 
    {
      labels: graphLabels,
      datasets: 
      [
        {
        label: variableName,
        data: graphData,
        backgroundColor: 'rgba(0, 0, 0, 0)', // array should have same number of elements as number of dataset
        borderColor: 'rgb(255, 0, 0)',
        borderWidth: 1
        }
      ]
    },
    options: 
    {
      scales: 
      {
        xAxes:
        [{
          scaleLabel: 
          {
            display: true,
            labelString: "Years from Start"//this.bodyData[this.bodyKeys[0]][2]
          }
        }],
        yAxes: 
        [{
          scaleLabel: 
          {
            display: true,
            labelString: this.EBVUnits[this.EBVindex]
          },
          ticks: 
          {
            beginAtZero: false
          }
        }]
      }
    }
  });
  this.showCreate = true;
  this.chartsCreated = true;
}




///////////////DATA EXPORTATION SECTION//////////////////////////////////////////////////////////

  // set the image to Base64 so it can be passed through
  /*
  loadLocalAssetToBase64()
  {
    this.http.get('./assets/icon/LOGO.png', { responseType: 'blob'})
    .subscribe(res => 
    {
      const reader = new FileReader();
      reader.onloadend = () => { this.logoData = reader.result; }
      reader.readAsDataURL(res);
    });
  }
  */
  // creates a pdf object (docDefinition) with all of the items to put in the PDF
  createPDF()
  {
    //const barGraph = this.bars.toBase64Image();
    const lineGraph = this.line.toBase64Image();
    const docDefinition = 
    {
      // image logoData is 64Base string
      content: ['Line Graph', {image: lineGraph, width: 500}]
    }

    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.pdfObj.open();
    this.showDownload = true;
  }

  downloadPDF() {
    // if device is mobile (android or iOS)
    // this code was from some dude online, doesn't really work yet
    if (this.plt.is('cordova')) {
      this.pdfObj.getBase64(async (data) => {
        try {
          let path = `pdf/myletter_${Date.now()}.pdf`;

          const result = await Filesystem.writeFile
            ({
              path,
              data: data,
              directory: FilesystemDirectory.Documents,
              recursive: true
            });

          this.fileOpener.open(`${result.uri}`, 'application/pdf');
        }

        catch (e) {
          console.error('Unable to write file', e)
        }

      });
    }

    // normal web client, can just invoke download()
    else {
      this.pdfObj.download();
    }
  }


  //////////////////////////////////////////////////////////////////////////////////////////

  // Navigate back to options
  backToOptions() {
    this.navCtrl.navigateForward('/scenario-options');
  }
}