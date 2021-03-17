import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
//import { StatsBarChart } from '../../assets/data/data';
import { Platform } from '@ionic/angular';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { HttpClient } from '@angular/common/http';
import { Chart, ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { InputScenarioService } from "../../input-scenario.service";
=======

import { HttpClient } from '@angular/common/http';
import { Chart, ChartOptions, ChartType, ChartDataSets } from 'chart.js';
>>>>>>> Stashed changes
=======

import { HttpClient } from '@angular/common/http';
import { Chart, ChartOptions, ChartType, ChartDataSets } from 'chart.js';
>>>>>>> Stashed changes
=======

import { HttpClient } from '@angular/common/http';
import { Chart, ChartOptions, ChartType, ChartDataSets } from 'chart.js';
>>>>>>> Stashed changes
=======

import { HttpClient } from '@angular/common/http';
import { Chart, ChartOptions, ChartType, ChartDataSets } from 'chart.js';
>>>>>>> Stashed changes
//import { Label } from 'ng2-charts';

// For Data Exportation
import { Filesystem, FilesystemDirectory } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import * as pdfMake from "pdfmake/build/pdfmake";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { variable } from '@angular/compiler/src/output/output_ast';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


=======
//import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import {} from 'google.maps';

>>>>>>> Stashed changes
=======
//import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import {} from 'google.maps';

>>>>>>> Stashed changes
=======
//import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import {} from 'google.maps';

>>>>>>> Stashed changes
=======
//import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import {} from 'google.maps';

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  @ViewChild('data1') data1Button: ElementRef;
  @ViewChild('data2') data2Button: ElementRef;
  @ViewChild('data3') data3Button: ElementRef;
  @ViewChild('data4') data4Button: ElementRef;
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

  heatMapInput = 
  [ 
    // non weighted format
    // new google.maps.LatLng(lat, long)

    // weighted format
    // {location: new google.maps.LatLng(lat, long), weight: weightValue}
  ];

  negativeHeatMapInput = [];

  loadingIndicator:any;
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

  latitudes = [];
  longitudes = [];
  AValues = [];
  BValues = [];
  coordinateArray = [];
  
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  bars: any;
  line: any;
  new64Chart: any;
  colorArray: any;
  showCreate: boolean;
  showDownload: boolean;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  chartsCreated: boolean;
  legendMade: boolean;
  statusCode: number;
  EBVindex: number;
  sliderValue: any;


  scenarioData: any;
  madingleyData = [];

  height = 0;
=======
  map: any;
>>>>>>> Stashed changes
=======
  map: any;
>>>>>>> Stashed changes
=======
  map: any;
>>>>>>> Stashed changes
=======
  map: any;
>>>>>>> Stashed changes

  pdfObj = null;
  banner = null;
  base64Image = null;
  logoData = null;
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

  map: any;

  constructor
  (
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
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.scenarioData = this.router.getCurrentNavigation().extras.state.scenarioData;        
      }
    });
  }

  ngOnInit()
  {
    this.getMadingleyData();
    // console.log("MadingleyData: ", this.madingleyData);
  }

  private async setData() 
  {
  }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  // makes call to api to get madingley data
  private async getMadingleyData()
  {
    let allData = [];
    // start loading indicator
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Loading Madingley Data...',
    });
    await loading.present();
=======
=======
>>>>>>> Stashed changes
  ionViewDidEnter()
  {
    this.showMap();
  }
<<<<<<< Updated upstream
=======

  showMap()
  {
    const location = new google.maps.LatLng(-17.824858, 31.053028);
    const options = 
    {
      center: location,
      zoom: 15,
      disableDefaultUI: true
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
  }
>>>>>>> Stashed changes

  showMap()
  {
    const location = new google.maps.LatLng(-17.824858, 31.053028);
    const options = 
    {
      center: location,
      zoom: 15,
      disableDefaultUI: true
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
  }
>>>>>>> Stashed changes

    let requestArray = [];
    const requestData = this.generateRequest(0, this.scenarioData.radius);
=======
  ionViewDidEnter()
  {
    this.showMap();
  }

  showMap()
  {
    const location = new google.maps.LatLng(-17.824858, 31.053028);
    const options = 
    {
      center: location,
      zoom: 15,
      disableDefaultUI: true
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
  }
>>>>>>> Stashed changes

    // checks if necessary to split up request
    if(this.scenarioData.radius >= 800000)
    {
      requestArray = this.makeOnionRings(requestData);
    }

    // assume radius smaller than 800,000 and make API call
    else 
    {
      requestArray.push(requestData);
    }    
    //console.log("requestArray: ", requestArray);
    
    // make requests and save data
    requestArray.forEach(element => {
      this.inputService.getMadingleyData(element).subscribe(
        (res) => {
          this.madingleyData.push(JSON.parse(res.body));
          loading.dismiss();
          console.log("response(s): ", JSON.parse(res.body));
        }
      );
    });
  }

  // splits requests into onion rings
  private makeOnionRings(originalRequest: any)
  {
    //console.log("scenarioData from parseR: ", originalRequest);
    let requestArray = [];
    let currentMax = 0;
    let requestCopy = {};
    const increment = 800000;

    // loop until newMax
    while (currentMax <= originalRequest.max_distance)
    {
      // check to not exceed max distance
      if ((currentMax + increment) <= originalRequest.max_distance)
      {
<<<<<<< Updated upstream
        requestCopy = this.generateRequest(currentMax, currentMax + increment);
        requestArray.push(requestCopy);  
        currentMax += increment;
      }
      // assume larger and subtract max_distance from max for min and keep max the same
      else {
        requestCopy = this.generateRequest(currentMax, originalRequest.max_distance)
        requestArray.push(requestCopy);
        currentMax += increment;
      }
    }
    return requestArray;
  }

  // helper function used to generate a request for specified min and max
  private generateRequest( min:number, max: number)
  {
    let request = {
      lat: this.scenarioData.center.lat,
      lng: this.scenarioData.center.lng,
      min_distance: min,      
      max_distance: max,
      scenario: this.scenarioData.scenario1stVal,
      scenario_option: this.scenarioData.scenario2ndVal,
      user_type: this.scenarioData.userType    
    }
    return request;
  }

<<<<<<< Updated upstream
  toggleData1()
  {
    this.getValues(3, this.sliderValue);
  }

  toggleData2()
  {
    this.getValues(4, this.sliderValue);
  }

  toggleData3()
  {
    this.getValues(5, this.sliderValue);
  }

  toggleData4()
  {
    this.getValues(6, this.sliderValue);
  }

  updateValues(event)
  {
    var heatIndex;
    heatIndex = event.target.value;
=======
  ionViewDidEnter()
  {
    this.showMap();
  }

  showMap()
  {
    const location = new google.maps.LatLng(-17.824858, 31.053028);
    const options = 
    {
      center: location,
      zoom: 15,
      disableDefaultUI: true
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
  }
>>>>>>> Stashed changes

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
    this.heatMapKeys = Object.keys(this.bodyData[this.bodyKeys[3]]);
    
    // this.bodyKeys[3] is = Heat Map
    // timePeriod is = One Heat Map Value, ranges from ["0.0" -> "20.0"]

    for(let outerindex=0; outerindex < this.madingleyData.length; outerindex++)
    {
      this.bodyData = this.madingleyData[outerindex];

      for(let index=0; index < this.bodyData[this.bodyKeys[3]][timePeriod][latitudeString].length; index++)
      {
        this.latitudeValues.push(this.bodyData[this.bodyKeys[3]][timePeriod][latitudeString][index]);
        this.longitudeValues.push(this.bodyData[this.bodyKeys[3]][timePeriod][longitudeString][index]);
        heatData.push(this.bodyData[this.bodyKeys[3]][timePeriod][dataString][index]);
      }
    }


    if(this.chartsCreated)
    {
      this.bars.destroy();
      this.line.destroy();
    }

    this.initMap(heatData);

    ///////////////// GRAPH SETUP /////////////
    // bodyData -> timeSeries -> the dataString
    this.bodyData = this.madingleyData[0];
    var indexStrings = Object.keys(this.bodyData[this.bodyKeys[2]][dataString]);
    var graphData = [];

    // loop through each of the madingleyData items from each JSON file
    for(let index = 0; index < this.madingleyData.length; index++)
    {
      // set the bodyData to this madingley index
      this.bodyData = this.madingleyData[index];
      for(let index2 = 0; index2 < indexStrings.length; index2++)
      {
        if(graphData[index2] === null || graphData[index2] === undefined) 
=======
        for( let key in data)
        {
          // checks if data has a key
          if (data.hasOwnProperty(key))
          {
            // check if key = latitude, if true then push current data to latitude list
            if(key == "latitude")
            {
              this.latitudes.push(key);
              this.latitudes.push(data[key]);
            }
  
            // check if key = longitude, if true then push current data to longitude list
            if(key == "longitude")
            {
              this.longitudes.push(key); // key = string
              this.longitudes.push(data[key]); // data[key] = object
            }
            
            // check if key = A, if true then push current data to longitude list
            if(key == "essential_biodiversity_column_A")
            {
              this.AValues.push(key); // key = string
              this.AValues.push(data[key]); // data[key] = object
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            }

            // check if key = A, if true then push current data to longitude list
            if(key == "essential_biodiversity_column_B")
            {
              this.BValues.push(key); // key = string
              this.BValues.push(data[key]); // data[key] = object
            }

=======
            }

            // check if key = A, if true then push current data to longitude list
            if(key == "essential_biodiversity_column_B")
            {
              this.BValues.push(key); // key = string
              this.BValues.push(data[key]); // data[key] = object
            }

>>>>>>> Stashed changes
=======
            }

            // check if key = A, if true then push current data to longitude list
            if(key == "essential_biodiversity_column_B")
            {
              this.BValues.push(key); // key = string
              this.BValues.push(data[key]); // data[key] = object
            }

>>>>>>> Stashed changes
=======
            }

            // check if key = A, if true then push current data to longitude list
            if(key == "essential_biodiversity_column_B")
            {
              this.BValues.push(key); // key = string
              this.BValues.push(data[key]); // data[key] = object
            }

>>>>>>> Stashed changes
          } // end of if hasOwnProperty
        } // end of for loop

        for(let i = 0; i < this.longitudes[1].length; i++)
>>>>>>> Stashed changes
        {
          graphData[index2] = 0; 
        }

        graphData[index2] += this.bodyData[this.bodyKeys[2]][dataString][indexStrings[index2]];
      }
      console.log(graphData);
    }

    // loop to now divide to average each item by the madingley data
    for(let index = 0; index < indexStrings.length; index++)
    {
      graphData[index] = graphData[index]/this.madingleyData.length;
    }
    console.log(graphData);
    // dataString = the EBV string name
    // graphData = [Averaged EBV Values]
    // indexStrings = ["0.0" to "20.0"]
    this.createCharts(dataString, graphData, indexStrings);
  }
  

  initMap(data)
  {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
    htmlNeg.textContent = Math.round(maxNeg).toString();
    
    let htmlPos = document.getElementById('maximum');
    htmlPos.textContent = Math.round(maxPos).toString();

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
    var heatmap = new google.maps.visualization.HeatmapLayer
    ({
      data: this.heatMapInput
    });

    // negative value heatmap layer (blue/purple)
    var negativeHeatMap = new google.maps.visualization.HeatmapLayer
    ({
      data: this.negativeHeatMapInput
    });
    
    // options for the normal heatmap
    heatmap.setOptions
    ({
      gradient: this.warmGradient/*,
      maxintensity: 100,
      dissipating: true*/
    });

    // options for the cool/negative heatmap
    negativeHeatMap.setOptions
    ({
      gradient: this.coolGradient/*,
      maxintensity: 100,
      dissipating: true*/
    });

    // initializing the two heatmaps
    negativeHeatMap.setMap(this.map);
    heatmap.setMap(this.map);
    
    //var poslegend = document.getElementById("poslegend") as HTMLElement;
    //var neglegend = document.getElementById("neglegend") as HTMLElement;
  
    //this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(poslegend);
    //this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(neglegend);
  

    //const div = document.createElement("div");
    //div.innerHTML = '<div id="negativegrad"> t</div>';
    //legend.appendChild(div);

    /*
    const infowindow = new google.maps.InfoWindow({
      content: "Change the zoom level",
    });
    this.map.addListener("zoom_changed", () => {
      infowindow.setContent("Zoom: " + this.map.getZoom()!);
    });
    */
=======
    this.createBarChart(this.AValues, this.coordinateArray);
    this.showCreate = true;
>>>>>>> Stashed changes
=======
    this.createBarChart(this.AValues, this.coordinateArray);
    this.showCreate = true;
>>>>>>> Stashed changes
=======
    this.createBarChart(this.AValues, this.coordinateArray);
    this.showCreate = true;
>>>>>>> Stashed changes
=======
    this.createBarChart(this.AValues, this.coordinateArray);
    this.showCreate = true;
>>>>>>> Stashed changes
  }

///////////////VISUALIZATION SECTION//////////////////////////////////////////////////////////

createCharts(variableName, graphData, graphLabels) 
{
  /////////////////BAR CHART//////////////////////////
  this.bars = new Chart(this.barChart.nativeElement, 
    {
    type: 'bar',
    data: 
    {
      labels: graphLabels,
      datasets: 
      [
        {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        label: variableName,
        data: graphData,
        backgroundColor: 'rgb(52, 235, 103)', // array should have same number of elements as number of dataset
        borderColor: 'rgb(52, 235, 103)',// array should have same number of elements as number of dataset
        borderWidth: 1
        }/*,
=======
=======
>>>>>>> Stashed changes
        label: this.AValues[0],
        data: this.AValues[1],
        backgroundColor: 'rgb(52, 235, 103)', // array should have same number of elements as number of dataset
        borderColor: 'rgb(52, 235, 103)',// array should have same number of elements as number of dataset
        borderWidth: 1
        },
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
        label: this.AValues[0],
        data: this.AValues[1],
        backgroundColor: 'rgb(52, 235, 103)', // array should have same number of elements as number of dataset
        borderColor: 'rgb(52, 235, 103)',// array should have same number of elements as number of dataset
        borderWidth: 1
        },
>>>>>>> Stashed changes
=======
        label: this.AValues[0],
        data: this.AValues[1],
        backgroundColor: 'rgb(52, 235, 103)', // array should have same number of elements as number of dataset
        borderColor: 'rgb(52, 235, 103)',// array should have same number of elements as number of dataset
        borderWidth: 1
        },
>>>>>>> Stashed changes
        {
          label: this.BValues[0],
          data: this.BValues[1],
          backgroundColor: 'rgb(52, 195, 235)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(52, 195, 235)',// array should have same number of elements as number of dataset
          borderWidth: 1
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        }*/
=======
        }
>>>>>>> Stashed changes
=======
        }
>>>>>>> Stashed changes
=======
        }
>>>>>>> Stashed changes
=======
        }
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            labelString: "EBV Units"
=======
            labelString: "X Units of X Measurement"
>>>>>>> Stashed changes
=======
            labelString: "X Units of X Measurement"
>>>>>>> Stashed changes
=======
            labelString: "X Units of X Measurement"
>>>>>>> Stashed changes
=======
            labelString: "X Units of X Measurement"
>>>>>>> Stashed changes
          },
          ticks: 
          {
            beginAtZero: true
          }
        }],
      }
    }
  });

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
            labelString: "EBV Units"
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      content: ['Bar Graph', {image: barGraph, width: 500}, 'Line Graph', {image: lineGraph, width: 500}]
=======
      content: ['Bar Graph of', this.AValues[0] , "and ", this.BValues[0] , {image: image, width: 500}]
>>>>>>> Stashed changes
=======
      content: ['Bar Graph of', this.AValues[0] , "and ", this.BValues[0] , {image: image, width: 500}]
>>>>>>> Stashed changes
=======
      content: ['Bar Graph of', this.AValues[0] , "and ", this.BValues[0] , {image: image, width: 500}]
>>>>>>> Stashed changes
=======
      content: ['Bar Graph of', this.AValues[0] , "and ", this.BValues[0] , {image: image, width: 500}]
>>>>>>> Stashed changes
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