import { Component } from '@angular/core';
import { NavController, NavParams, Platform, Events, AlertController  } from 'ionic-angular';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

import { innerTemplate } from '../inner-template/inner-template';
import { NetworkProvider } from '../../providers/network/network';
import { LoadingProvider } from '../../providers/loading/loading';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  //loadingComponent: any;
  sectionList: Array<{title: string, url: string, showText: boolean}>;
  waitingConnection: boolean;
  url: string;
  fileName: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private fileNavigator: File, 
              public plt: Platform,
              public networkProvider: NetworkProvider, 
              public loadingProvider: LoadingProvider, 
              public events: Events,
              private transfer: FileTransfer,
              private alertCtrl: AlertController) {

    this.url = "http://www.unirio.br/prograd/aplicativo/aplicativo";
    this.fileName = "main.html";
        
    this.sectionList = [];
    this.networkProvider.initializeNetworkEvents();
    this.loadingProvider.initLoader();
    this.loadingProvider.presentLoading();
    this.loadHomePage();

  }

  loadHomePage(){
    setTimeout(() => {
      if(this.networkProvider.network.type == "none"){
        this.readLocal(this.fileName);
      }else{
        this.readOnline(this.url, this.fileName);
      };
    }, 3000);
  }

  readLocal(fileName: string){

    this.fileNavigator
    .readAsText(this.fileNavigator.dataDirectory, fileName)
      .then(entry => {
       this.ParseMainHTML(entry);
     }).catch(this.handleError1);
    
  }

  readOnline(url: string, fileName: string){

      const transf = this.transfer.create();
      transf.download(url, this.fileNavigator.dataDirectory + fileName)
      .then(() => {
        this.fileNavigator
        .readAsText(this.fileNavigator.dataDirectory, fileName)
        .then(entry => {
          this.ParseMainHTML(entry);
        }).catch(this.handleError);
    }).catch(this.handleError);

  }

  ParseMainHTML = (htmlHandler: string) => {

    let parser = new DOMParser();
    let parsedHtml = parser.parseFromString(htmlHandler, 'text/html');
    let contentCore = parsedHtml.getElementById("content-core");
    let titleCount = contentCore.getElementsByTagName("h3").length

    this.sectionList = [];
    for (let i = 0; i < titleCount; i++) {

      if(contentCore.getElementsByTagName("p")[i] != null){
        this.sectionList.push({
          title: contentCore.getElementsByTagName("h3")[i].textContent,
          url: contentCore.getElementsByTagName("p")[i].textContent,
          showText: false
        })
      }
    }
      this.loadingProvider.dismissLoading();
  };

  itemTapped(event, section) {
    this.navCtrl.push(innerTemplate, {
      section: section
    });
  }

  handleError = error => {
    console.log("error :", error);
  };

  handleError1 = error => {
    console.log("error :", error);
    this.noNetworkAlert();
    this.loadHomePage();
  };

  doRefresh(refresher) {
     refresher.complete();
  }

  noNetworkAlert() {
    let alert = this.alertCtrl.create({
      title: 'Rede indisponível',
      subTitle: 'Nota: É necessário conectar-se à rede para o primeiro acesso',
      buttons: ['OK']
    });
    alert.present();
  }

}
