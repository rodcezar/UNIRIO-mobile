import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController  } from 'ionic-angular';

import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

import { NetworkProvider } from '../../providers/network/network';
import { LoadingProvider } from '../../providers/loading/loading';

import { CalloutDetailPage } from '../callout-detail/callout-detail';

@Component({
  selector: 'page-inner-template',
  templateUrl: 'inner-template.html'
})  

export class innerTemplate {

  //loadingComponent: any;
  
  sectionList: Array<{titleValue: string, 
                      textValue: string, 
                      showText: boolean, 
                      isHTML: boolean,
                      from: number,
                      to: number}>;

  section: {title: string, url: string, showText: boolean};
  
  constructor(public navCtrl: NavController , public navParams: NavParams, 
              private fileNavigator: File, public plt: Platform, 
              private transfer: FileTransfer,
              public networkProvider: NetworkProvider,
              public loadingProvider: LoadingProvider, 
              private alertCtrl: AlertController) {

  this.section = navParams.get('section');

  this.networkProvider.initializeNetworkEvents();
  this.loadingProvider.initLoader();
  this.loadingProvider.presentLoading();

  if(this.networkProvider.network.type == "none"){
    this.readLocal(this.section.title + ".html");
   }else{
    this.readOnline(this.section.url, this.section.title + ".html");
  };

}

  readLocal(fileName: string){

    this.fileNavigator
    .readAsText(this.fileNavigator.dataDirectory, fileName)
    .then(entry => {
      this.Parser3(entry);
    }).catch(this.handleError);
    
  }

  readOnline(url: string, fileName: string){

      const transf = this.transfer.create();
      transf.download(url, this.fileNavigator.dataDirectory + fileName)
      .then(() => {
        this.fileNavigator
        .readAsText(this.fileNavigator.dataDirectory, fileName)
        .then(entry => {
          this.Parser3(entry);
        }).catch(this.handleError);
    }).catch(this.handleError);

  }

  Parser1(htmlHandler){
    //parse innerHTML content to page
    let parser = new DOMParser();
    let parsedHtml = parser.parseFromString(htmlHandler, 'text/html');
    this.sectionList = [];
    let idElement = "content-core";

    if(parsedHtml.getElementById("content-core") == null){
      idElement = "divResultado";
    }
    
      this.sectionList.push({
        titleValue: null,
        textValue: parsedHtml.getElementById(idElement).innerHTML,
        showText: false,
        isHTML: true,
        from: 0,
        to : 0
      })
  };

  Parser3(htmlHandler){
    // HTML with callouts parser (working one)
    let parser = new DOMParser();
    this.sectionList = [];

    let parsedHtml = parser.parseFromString(htmlHandler, 'text/html');
    let contentCore = parsedHtml.getElementById("content-core");

    let calloutLength = parsedHtml.getElementsByClassName("callout").length;

    if (calloutLength > 0){ 

      let indexFrom: number;
      let indexTo: number;

      indexFrom = 1;
      indexTo = contentCore.innerHTML.indexOf("callout");

      this.sectionList.push({
        /* loads the first section of this HTML (everything before the first callout) 
           in the current page */
        titleValue: null,
        textValue: contentCore.innerHTML.substr(indexFrom, indexTo),
        showText: false,
        isHTML: true,
        from: indexFrom,
        to: indexTo
      })
    
      for (let i = 0; i <= calloutLength; i++) {

        indexFrom = indexTo;
        indexFrom = contentCore.innerHTML.indexOf("</p>", indexFrom);
        indexTo = contentCore.innerHTML.indexOf("callout", indexFrom);

        if(indexTo < 0){
          // last callout tag was reached
          indexTo = contentCore.innerHTML.indexOf("</div>", indexFrom);
        }

        this.sectionList.push({
          titleValue: parsedHtml.getElementsByClassName("callout")[i].textContent,
          textValue: contentCore.innerHTML.substr(indexFrom, indexTo - indexFrom),
          showText: false,
          isHTML: false,
          from: indexFrom,
          to: indexTo
        })
      } 
    }else{
      //there's no callout in this HTML
      this.Parser1(htmlHandler);
    }
    this.loadingProvider.dismissLoading();
  };

  itemTapped(event, section) {
    this.navCtrl.push(CalloutDetailPage, {
      section: section
    });
  }

  handleError = error => {
    console.log("error :", error);
  };

  handleError1 = error => {
    console.log("error :", error);
  //  this.noNetworkAlert(error);
  };

  noNetworkAlert(error) {
    let alert = this.alertCtrl.create({
      title: 'Rede indisponível',
      subTitle: error,
      buttons: ['OK']
    });
    alert.present();
  }

  /*
  ShowFiles(){
    this.listDir(this.fileNavigator.dataDirectory, '');
  };

  ClearFileList(){
    //aux
    this.fileList = null;
    this.textFileHandler = null;
  };

  listDir = (path, dirName) => {
    //aux
    this.fileNavigator
      .listDir(path, dirName)
      .then(entries => { this.fileList = entries; })
      .catch(this.handleError);
  };

  RemoveFile = item => {
    //aux
    this.fileNavigator
    .removeFile(this.fileNavigator.dataDirectory, item.name)
      .then(entry => {
        this.textFileHandler = entry;
      })
      .catch(this.handleError);
  };

  */
  
}
