import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StatsBarChart } from '../../assets/data/data';
import { Platform } from '@ionic/angular';
// 
import { HttpClient } from '@angular/common/http';
import { Chart, ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

// For Data Exportation
import { Filesystem, FilesystemDirectory } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


@Component
({
  selector: 'app-visualize-results',
  templateUrl: './visualize-results.page.html',
  styleUrls: ['./visualize-results.page.scss'],
})

export class VisualizeResultsPage implements OnInit 
{
  @ViewChild('barChart') barChart;
  @ViewChild('createPDFButton') createPDFButton: ElementRef;
  @ViewChild('downloadButton') downloadButton: ElementRef;

  latitudes = [];
  longitudes = [];
  values = [];
  coordinateArray = [];

  bars: any;
  new64Chart: any;
  colorArray: any;
  showCreate: boolean;
  showDownload: boolean;

  pdfObj = null;
  banner = null;
  base64Image = null;
  logoData = null;

  constructor(private navCtrl: NavController, private http: HttpClient, private plt: Platform, private fileOpener: FileOpener) 
  { 
    this.showCreate = false;
    this.showDownload = false;
    this.getData(http);
  }

  ngOnInit()
  {
    this.loadLocalAssetToBase64();
  }



  ///////////////DATA IMPORTATION SECTION//////////////////////////////////////////////////////////

  getData(http: HttpClient)
  {
    // grab the data from the json file and creates a JSON object
    this.http.get('../../assets/data/test2.json').toPromise().then(data => 
      {
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
            
            // check if key = values, if true then push current data to longitude list
            if(key == "essential_biodiversity_column_A")
            {
              this.values.push(key); // key = string
              this.values.push(data[key]); // data[key] = object
            }
          } // end of if hasOwnProperty
        } // end of for loop

        for(let i = 0; i < this.longitudes[1].length; i++)
        {
          this.coordinateArray.push(this.latitudes[1][i] + ", " + this.longitudes[1][i]);
        }
      });
  }

  envokeBarChart()
  {
    this.createBarChart(this.values, this.coordinateArray);

    this.showCreate = !this.showCreate;
    
  }
///////////////VISUALIZATION SECTION//////////////////////////////////////////////////////////

createBarChart(barChartData, barChartLabels) 
{
  this.bars = new Chart(this.barChart.nativeElement, 
    {
    type: 'bar',
    data: 
    {
      labels: barChartLabels,
      datasets: 
      [{
        label: barChartData[0],
        data: barChartData[1],
        backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
        borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
        borderWidth: 1
      }]
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
            labelString: this.latitudes[0] + ", " + this.longitudes[0]
          }
        }],
        yAxes: 
        [{
          scaleLabel: 
          {
            display: true,
            labelString: barChartData[0]
          },
          ticks: 
          {
            beginAtZero: true
          }
        }],
      }
    }
  });
}


///////////////DATA EXPORTATION SECTION//////////////////////////////////////////////////////////

  // set the image to Base64 so it can be passed through
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

  // creates a pdf object (docDefinition) with all of the items to put in the PDF
  createPDF()
  {
    const image = this.bars.toBase64Image();
    console.log(image);
    const docDefinition = 
    {
      // image logoData is 64Base string
      content: ['Exportation Text Test!', {image: image, width: 500}]
    }

    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.pdfObj.open();
    this.showDownload = !this.showDownload;
  }

  downloadPDF()
  {
    // if device is mobile (android or iOS)
    // this code was from some dude online, doesn't really work yet
    if(this.plt.is('cordova'))
    {
      this.pdfObj.getBase64(async (data) => 
      {
        try
        {
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

        catch(e) 
        {
          console.error('Unable to write file', e)
        }

      });
    }

    // normal web client, can just invoke download()
    else
    {
      this.pdfObj.download();
    }
  }


//////////////////////////////////////////////////////////////////////////////////////////

  // Navigate back to options
  backToOptions()
  {
    this.navCtrl.navigateForward('/scenario-options');
  }
}