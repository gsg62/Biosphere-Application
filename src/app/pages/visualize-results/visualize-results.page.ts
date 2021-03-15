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
  @ViewChild('data2') data2Button: ElementRef;
  @ViewChild('data3') data3Button: ElementRef;
  @ViewChild('data4') data4Button: ElementRef;

  bodyKeys = [];
  bodyData = [];

  latitudeValues = [];
  longitudeValues = [];
  timeValues = [];
  EBV1Values = [];
  coordinateArray = [];
  heatMapData = [];
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
  bars: any;
  line: any;
  new64Chart: any;
  colorArray: any;
  showCreate: boolean;
  showDownload: boolean;
  chartsCreated: boolean;
  statusCode: number;
  nextJSON: any;

  scenarioData: any;
  madingleyData = [];

  height = 0;

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
    //this.getData(http);
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

    let requestArray = [];
    const requestData = this.generateRequest(0, this.scenarioData.radius);

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

  toggleData1()
  {
    this.getValues(3);
  }

  toggleData2()
  {
    this.getValues(4);
  }

  toggleData3()
  {
    this.getValues(5);
  }

  toggleData4()
  {
    this.getValues(6);
  }

  getValues(buttonNumber)
  {
    this.bodyData = [];
    this.bodyData.push("body");
    this.latitudeValues = [];
    this.longitudeValues = [];
    this.heatMapData = [];
    this.bodyData[1] = this.madingleyData[0];
    this.bodyKeys = Object.keys(this.bodyData[1]); 
    this.rawKeys = Object.keys(this.bodyData[1][this.bodyKeys[1]]);
    for(let i = 0; i < this.madingleyData.length; i++)
    {
      this.bodyData[1] = this.madingleyData[i];
      for(let j = 0; j < this.bodyData[1][this.bodyKeys[1]][this.rawKeys[0]].length; j++)
      {
        this.latitudeValues.push(this.bodyData[1][this.bodyKeys[1]][this.rawKeys[0]][j]);
        this.longitudeValues.push(this.bodyData[1][this.bodyKeys[1]][this.rawKeys[1]][j]);
        this.heatMapData.push(this.bodyData[1][this.bodyKeys[1]][this.rawKeys[buttonNumber]][j]);
      }
    }

    this.timeValues = this.bodyData[1][this.bodyKeys[1]][this.rawKeys[2]];

    var EBVName = Object.keys(this.bodyData[1][this.bodyKeys[2]]);
    this.calculatedDataKeys = Object.keys(this.bodyData[1][this.bodyKeys[2]][EBVName[0]]);
    this.calculatedData = this.bodyData[1][this.bodyKeys[2]];
    this.timeSeries = Object.keys(this.heatMapData);

    if(this.chartsCreated)
    {
      this.bars.destroy();
      this.line.destroy();
    }

    this.map = new google.maps.Map(this.mapRef.nativeElement);
    this.initMap(this.heatMapData);
    console.log(this.bodyData)
    console.log(this.calculatedData)
    this.envokeCharts(this.rawKeys[buttonNumber]);
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
    var totalneg = 0;
    var totalpos = 0;
    // push each piece of heatmap data to their respective lists (negative or positive)
    for(let i = 0; i < heatMapLats.length; i++)
    {
      // the negative list is values under 0 and are colored red/purple/dark blue/blue
      if( heatMapValues[i] < 0)
      {
        this.negativeHeatMapInput.push({location: new google.maps.LatLng(heatMapLats[i], heatMapLongs[i]), weight: heatMapValues[i]*-1});
        totalneg -= heatMapValues[i];
      }

      // the positive list is values under 0 and are colored red/yellow/green
      if( heatMapValues[i] >= 0)
      {
        this.heatMapInput.push({location: new google.maps.LatLng(heatMapLats[i], heatMapLongs[i]), weight: heatMapValues[i]});
        totalpos += heatMapValues[i];
      }
    }
    console.log("POSITIVE", totalpos);
    console.log("NEGATIVE", totalneg);

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
      gradient: this.warmGradient
    });

    // options for the cool/negative heatmap
    negativeHeatMap.setOptions
    ({
      gradient: this.coolGradient
    });

    // initializing the two heatmaps
    negativeHeatMap.setMap(this.map);
    heatmap.setMap(this.map);

    /*
    const infowindow = new google.maps.InfoWindow({
      content: "Change the zoom level",
    });
    this.map.addListener("zoom_changed", () => {
      infowindow.setContent("Zoom: " + this.map.getZoom()!);
    });
    */
  }

///////////////VISUALIZATION SECTION//////////////////////////////////////////////////////////

envokeCharts(variableName)
{
  var graphData = [];

  // push actual data to the 
  //console.log(this.calculatedDataKeys);
  for (let i in this.calculatedData[variableName])
  {
    graphData.push(this.calculatedData[variableName][i]);
  }

  this.createCharts(variableName, graphData, this.calculatedDataKeys);
  
  this.showCreate = true;
}

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
        }*/
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
            labelString: this.bodyData[1][this.bodyKeys[0]][2]
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
            labelString: this.bodyData[1][this.bodyKeys[0]][2]
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