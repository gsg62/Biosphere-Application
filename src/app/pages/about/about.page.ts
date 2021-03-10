import { Component, OnInit } from '@angular/core';
//import pdfMake from 'pdfmake/build/pdfmake'
//import { PdfMakeWrapper, Img, Txt } from 'pdfmake-wrapper';

import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Filesystem, FilesystemDirectory } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';


//import * as pdfMake from "pdfmake/build/pdfmake";
//import * as pdfFonts from 'pdfmake/build/vfs_fonts';


@Component
({
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
  
  constructor( private plt: Platform, private http: HttpClient, private fileOpener: FileOpener )
  {

  }

  //title = 'angular-pdfmakewrapper'
  ngOnInit() 
  {
  }
}
