import { Component } from '@angular/core';
import { NavController, NavParams  } from 'ionic-angular';

@Component({
  selector: 'page-callout-detail',
  templateUrl: 'callout-detail.html'
})  

export class CalloutDetailPage {

  section: {titleValue: string, textValue: string, showText: boolean, isHTML: boolean};

  constructor(public navCtrl: NavController , public navParams: NavParams) {

    this.section = navParams.get('section');
  
  };

 
}
