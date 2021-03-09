import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
//import { StatsBarChart } from '../../assets/data/data';
import { Platform } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';
import { Chart, ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { ActivatedRoute, Router } from '@angular/router';

//import { Label } from 'ng2-charts';

// For Data Exportation
import { Filesystem, FilesystemDirectory } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import * as pdfMake from "pdfmake/build/pdfmake";
import { variable } from '@angular/compiler/src/output/output_ast';
//import * as pdfFonts from 'pdfmake/build/vfs_fonts';

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
  
  bars: any;
  line: any;
  new64Chart: any;
  colorArray: any;
  showCreate: boolean;
  showDownload: boolean;
  chartsCreated: boolean;

  scenarioData: any;

  height = 0;

  pdfObj = null;
  banner = null;
  base64Image = null;
  logoData = null;
  coolGradient = 
  [
    "rgba(0, 255, 255, 0)",
    "rgba(0, 255, 255, 1)",
    "rgba(0, 191, 255, 1)",
    "rgba(0, 127, 255, 1)",
    "rgba(0, 63, 255, 1)",
    "rgba(0, 0, 255, 1)",
    "rgba(0, 0, 223, 1)",
    "rgba(0, 0, 191, 1)",
    "rgba(0, 0, 159, 1)"
  ];

  map: any;

  constructor(private navCtrl: NavController, private http: HttpClient, private plt: Platform, private fileOpener: FileOpener, private route: ActivatedRoute, private router: Router  
) 
  {
    this.showCreate = false;
    this.showDownload = false;
    this.chartsCreated = false;
    this.getData(http);
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.scenarioData = this.router.getCurrentNavigation().extras.state.scenarioData;
      }
    });
  }

  ngOnInit()
  {
  }

  toggleData1()
  {
    if(this.chartsCreated)
    {
      this.bars.destroy();
      this.line.destroy();
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement);
    this.initMap(this.heatMapData[this.timeSeries[1]][this.rawKeys[3]]);
    this.envokeCharts(this.rawKeys[3]);
  }

  toggleData2()
  {
    if(this.chartsCreated)
    {
      this.bars.destroy();
      this.line.destroy();
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement);
    this.initMap(this.heatMapData[this.timeSeries[1]][this.rawKeys[4]]);
    this.envokeCharts(this.rawKeys[4]);
  }

  toggleData3()
  {
    if(this.chartsCreated)
    {
      this.bars.destroy();
      this.line.destroy();
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement);
    this.initMap(this.heatMapData[this.timeSeries[1]][this.rawKeys[5]]);
    this.envokeCharts(this.rawKeys[5]);
  }

  toggleData4()
  {
    if(this.chartsCreated)
    {
      this.bars.destroy();
      this.line.destroy();
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement);
    this.initMap(this.heatMapData[this.timeSeries[1]][this.rawKeys[6]]);
    this.envokeCharts(this.rawKeys[6]);
  }
  

  initMap(data)
  {
    var heatMapLats = [];
    var heatMapLongs = [];
    var heatMapValues = data;
    this.negativeHeatMapInput = [];
    this.heatMapInput = [];
    
    
    // push the latitudes to the list
    for (let i in this.heatMapData[this.timeSeries[1]][this.rawKeys[0]])
    {
      heatMapLats.push(this.heatMapData[this.timeSeries[1]][this.rawKeys[0]][i]);
    }

    // push the longitudes to the list
    for (let i in this.heatMapData[this.timeSeries[1]][this.rawKeys[1]])
    {
      heatMapLongs.push(this.heatMapData[this.timeSeries[1]][this.rawKeys[1]][i]);
    }

    // calculate the averages of latitudes and latitudes to center the map around it
    var latitudeMedian = 0, longitudeMedian = 0;

    // getting median, is more accurate than average
    latitudeMedian = heatMapLats[Math.round((heatMapLats.length-1)/2)];
    longitudeMedian = heatMapLongs[Math.round((heatMapLongs.length-1)/2)];

    // push each piece of heatmap data to their respective lists (negative or positive)
    for(let i = 0; i < heatMapLats.length; i++)
    {
      // the negative list is values under 0 and are colored red/purple/dark blue/blue
      if( heatMapValues[i] < 0)
      {
        this.negativeHeatMapInput.push({location: new google.maps.LatLng(heatMapLats[i], heatMapLongs[i]), weight: heatMapValues[i]*-1});
      }

      // the positive list is values under 0 and are colored red/yellow/green
      if( heatMapValues[i] >= 0)
      {
        this.heatMapInput.push({location: new google.maps.LatLng(heatMapLats[i], heatMapLongs[i]), weight: heatMapValues[i]});
      }
    }

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
    });

    // options for the cool/negative heatmap
    negativeHeatMap.setOptions
    ({
      gradient: this.coolGradient
    });

    // initializing the two heatmaps
    heatmap.setMap(this.map);
    negativeHeatMap.setMap(this.map);
  }


  ///////////////DATA IMPORTATION SECTION//////////////////////////////////////////////////////////

  getData(http: HttpClient) {
    // grab the data from the json file and creates a JSON object
    this.http.get('../../assets/data/Closest-Real-Output.json').toPromise().then(data => 
      {
        for( let key in data)
        {
          // checks if data has a key
          if (data.hasOwnProperty(key))
          {
            // check if key = latitude, if true then push current data to latitude list
            if(key == "Body")
            {
              this.bodyData.push(key);
              this.bodyData.push(data[key]);
            }

          } // end of if hasOwnProperty
        } // end of for loop

        this.bodyKeys = Object.keys(this.bodyData[1]); 
        this.rawKeys = Object.keys(this.bodyData[1][this.bodyKeys[1]]);
        this.latitudeValues = this.bodyData[1][this.bodyKeys[1]][this.rawKeys[0]];
        this.longitudeValues = this.bodyData[1][this.bodyKeys[1]][this.rawKeys[1]];
        this.timeValues = this.bodyData[1][this.bodyKeys[1]][this.rawKeys[2]];
        this.EBV1Values = this.bodyData[1][this.bodyKeys[1]][this.rawKeys[3]];
        this.heatMapData = this.bodyData[1][this.bodyKeys[3]];

        var EBVName = Object.keys(this.bodyData[1][this.bodyKeys[2]]);
        this.calculatedDataKeys = Object.keys(this.bodyData[1][this.bodyKeys[2]][EBVName[0]]);
        this.calculatedData = this.bodyData[1][this.bodyKeys[2]];


        this.timeSeries = Object.keys(this.heatMapData)

        for(let i = 0; i < this.longitudeValues.length; i++)
        {
          this.coordinateArray.push(this.latitudeValues[i] + ", " + this.longitudeValues[i]);
        }
      });
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
        borderColor: 'rgb(255, 255, 0)',
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