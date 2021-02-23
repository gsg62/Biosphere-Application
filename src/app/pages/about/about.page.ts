import { Component, OnInit } from '@angular/core';
//import pdfMake from 'pdfmake/build/pdfmake'
//import { PdfMakeWrapper, Img, Txt } from 'pdfmake-wrapper';

import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Filesystem, FilesystemDirectory } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';


import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit 
{
  pdfObj = null;
  banner = null;
  base64Image = null;
  logoData = null;
  
  constructor
  (
    private plt: Platform,
    private http: HttpClient,
    private fileOpener: FileOpener
  ) {}

  //title = 'angular-pdfmakewrapper'
  ngOnInit() 
  {
    this.loadLocalAssetToBase64();
  }

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

  createPDF()
  {
    const image = this.logoData
    console.log(this.logoData);

    const docDefinition = 
    {
      // image logoData is 64Base string
      content: ['Exportation Text Test!', {image: this.logoData}]
    }

    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.pdfObj.open();
  }

  downloadPDF()
  {
    // if device is mobile (android or iOS)
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

    // web client
    else
    {
      this.pdfObj.download();
    }
  }
}
