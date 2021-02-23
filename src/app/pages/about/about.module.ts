import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AboutPageRoutingModule } from './about-routing.module';

import { AboutPage } from './about.page';

// pdfMakers
//import { PdfMakeWrapper } from 'pdfmake-wrapper';
//import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Set the fonts to use
//PdfMakeWrapper.setFonts(pdfFonts);



@NgModule
({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AboutPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AboutPage]
})


export class AboutPageModule {}
