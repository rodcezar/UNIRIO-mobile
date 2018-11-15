import { Injectable } from '@angular/core';
import { LoadingController  } from 'ionic-angular';

@Injectable()
export class LoadingProvider {

  loadingComponent: any;

  constructor(public loadingCtrl: LoadingController) {
    console.log("LoadingProvider");
  }

  public initLoader(){
    this.loadingComponent = this.loadingCtrl.create({
      showBackdrop: true,
      content: 'Carregando...',
      dismissOnPageChange: true});
  }

  public presentLoading(){
    this.loadingComponent.present();
  }

  public dismissLoading(){
    this.loadingComponent.dismiss();
  }

}