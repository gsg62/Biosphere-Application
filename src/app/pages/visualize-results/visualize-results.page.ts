import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
//import { StatsBarChart } from '../../assets/data/data';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { InputScenarioService } from "../../input-scenario.service";
//import { Label } from 'ng2-charts';

// For Data Exportation
import { Filesystem, FilesystemDirectory } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import * as pdfMake from "pdfmake/build/pdfmake";
import { variable } from '@angular/compiler/src/output/output_ast';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

//import html2canvas from 'html2canvas';
//import * as jsPDF from 'jspdf';
//import domtoimage from 'dom-to-image';

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
      message: 'Loading Madingley Data...\nApproximate loading time: ' 
                + waitTime.toString() + ' seconds',
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
      else {        
        this.resultsFetched = true;

        for(let index = 0; index < this.madingleyData.length; index++)
        {
          for(let EBVIndex = 3; EBVIndex < this.madingleyData[0]["Keys"].length; EBVIndex++)
          {
            this.EBVList.push({name: this.madingleyData[0]["Keys"][EBVIndex], index: EBVIndex});
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
      case 'scientist': return 20;
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
    for(let index = 0; index < this.EBVList.length; index++)
    {
      var otherElement = document.getElementById('EBV' + (index+3));
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
    this.EBVindex = buttonNumber;

    this.bodyData = this.madingleyData[0];
    this.bodyKeys = Object.keys(this.bodyData); 

    this.latitudeValues = [];
    this.longitudeValues = [];
    this.heatMapKeys = [];

    // this.bodyKeys[0] is = "Keys"
    var EBVKeys = this.bodyData[this.bodyKeys[0]];
    var latitudeString = EBVKeys[0];
    var longitudeString = EBVKeys[1];
    var dataString = EBVKeys[buttonNumber];

    var heatData = [];

    // bodyKeys[4] is heatmap
    this.heatMapKeys = Object.keys(this.bodyData[this.bodyKeys[4]]);
    
    // this.bodyKeys[3] is = Heat Map
    // timePeriod is = One Heat Map Value, ranges from ["0.0" -> "20.0"]

    for(let outerindex=0; outerindex < this.madingleyData.length; outerindex++)
    {
      this.bodyData = this.madingleyData[outerindex];
      for(let index=0; index < this.bodyData[this.bodyKeys[4]][timePeriod][latitudeString].length; index++)
      {
        this.latitudeValues.push(this.bodyData[this.bodyKeys[4]][timePeriod][latitudeString][index]);
        this.longitudeValues.push(this.bodyData[this.bodyKeys[4]][timePeriod][longitudeString][index]);
        heatData.push(this.bodyData[this.bodyKeys[4]][timePeriod][dataString][index]);
      }
    }


    if(this.chartsCreated)
    {
      //this.bars.destroy();
      this.line.destroy();
    }

    this.initMap(heatData);

    ///////////////// GRAPH SETUP /////////////
    // bodyData -> timeSeries -> the dataString
    this.bodyData = this.madingleyData[0];
    var indexStrings = Object.keys(this.bodyData[this.bodyKeys[3]][dataString]);
    var graphData = [];
    
    // CREATING THE BUTTONS ON THE PAGE
    //var newButton = document.createElement("ion-button");
    //div.innerHTML = '<div id="negativegrad"> t</div>';
    //legend.appendChild(div);

    // loop through each of the madingleyData items from each JSON file
    for(let index = 0; index < this.madingleyData.length; index++)
    {
      // set the bodyData to this madingley index
      this.bodyData = this.madingleyData[index];
      for(let index2 = 0; index2 < indexStrings.length; index2++)
      {
        if(graphData[index2] === null || graphData[index2] === undefined) 
        {
          graphData[index2] = 0; 
        }

        graphData[index2] += this.bodyData[this.bodyKeys[3]][dataString][indexStrings[index2]];
      }
    }

    // loop to now divide to average each item by the madingley data
    for(let index = 0; index < indexStrings.length; index++)
    {
      graphData[index] = graphData[index]/this.madingleyData.length;
    }

    // dataString = the EBV string name
    // graphData = [Averaged EBV Values]
    // indexStrings = ["0.0" to "20.0"]
    this.createCharts(dataString, graphData, indexStrings);
  }
  

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
    var maxNeg = 0;
    var maxPos = 0;

    // push each piece of heatmap data to their respective lists (negative or positive)
    var allpoints = [];
    for(let i = 0; i < heatMapLats.length; i++)
    {
      allpoints.push([heatMapLats[i], heatMapLongs[i]]);
      // the negative list is values under 0 and are colored red/purple/dark blue/blue
      if( heatMapValues[i] < 0)
      {
        this.negativeHeatMapInput.push({location: new google.maps.LatLng(heatMapLats[i], heatMapLongs[i]), weight: heatMapValues[i]*-1});
        if( heatMapValues[i] < maxNeg)
        {
          maxNeg = heatMapValues[i];
        }
      }

      // the positive list is values under 0 and are colored red/yellow/green
      if( heatMapValues[i] >= 0)
      {
        this.heatMapInput.push({location: new google.maps.LatLng(heatMapLats[i], heatMapLongs[i]), weight: heatMapValues[i]});
        if( heatMapValues[i] > maxPos)
        {
          maxPos = heatMapValues[i];
        }
      }
    }

    let legend = document.getElementById('legend');
    legend.style.display = "block";

    let htmlNeg = document.getElementById('minimum');
    htmlNeg.textContent = Math.round(maxNeg).toString().concat(" ", this.bodyData["Units"][this.EBVindex]);
    
    let htmlPos = document.getElementById('maximum');
    htmlPos.textContent = Math.round(maxPos).toString().concat(" ", this.bodyData["Units"][this.EBVindex]);

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
      gradient: this.warmGradient/*,
      maxintensity: 100,
      dissipating: true*/
    });

    // options for the cool/negative heatmap
    this.negativeHeatMap.setOptions
    ({
      gradient: this.coolGradient/*,
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
      //console.log("Radius is now:", heatmapradius);
      //console.log("Zoom is now:", this.map.getZoom());
      
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
  /////////////////BAR CHART//////////////////////////
  /*
  this.bars = new Chart(this.barChart.nativeElement, 
    {
    type: 'bar',
    data: 
    {
      labels: graphLabels,
      datasets: 
      [
        {
        label: variableName,
        data: graphData,
        backgroundColor: 'rgb(52, 235, 103)', // array should have same number of elements as number of dataset
        borderColor: 'rgb(52, 235, 103)',// array should have same number of elements as number of dataset
        borderWidth: 1
        }/*,
        {
          label: this.BValues[0],
          data: this.BValues[1],
          backgroundColor: 'rgb(52, 195, 235)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(52, 195, 235)',// array should have same number of elements as number of dataset
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
            labelString: this.bodyData[this.bodyKeys[0]][2]
          }
        }],
        yAxes: 
        [{
          scaleLabel: 
          {
            display: true,
            labelString: this.bodyData["Units"][this.EBVindex]
          },
          ticks: 
          {
            beginAtZero: true
          }
        }],
      }
    }
  });
  */
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
            labelString: this.bodyData[this.bodyKeys[0]][2]
          }
        }],
        yAxes: 
        [{
          scaleLabel: 
          {
            display: true,
            labelString: this.bodyData["Units"][this.EBVindex]
          },
          ticks: 
          {
            beginAtZero: true
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
    const barGraph = this.bars.toBase64Image();
    const lineGraph = this.line.toBase64Image();
    const docDefinition = 
    {
      // image logoData is 64Base string
      content: ['Bar Graph', {image: barGraph, width: 500}, 'Line Graph', {image: lineGraph, width: 500}]
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