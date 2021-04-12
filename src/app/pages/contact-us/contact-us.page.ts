import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
public name: string;
public email: string;
public message: string;
  constructor() { }

  ngOnInit() {
  }

  sendForm() {
    alert("Thanks for submitting your form. This section is still being worked on.")
     // This will be where we add code that takes the information entered by the user and sends an automated email
  }

}
