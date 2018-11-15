import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NetworkProvider } from '../providers/network/network';

import { HomePage } from '../pages/home/home';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  networkStatus: string = "";

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, 
              public events: Events,
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public networkProvider: NetworkProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
    //  { title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      
      this.networkProvider.initializeNetworkEvents();

      // Auto refresh the network status
      setInterval(() => {
        this.updateNetworkStatus();
      },2000);

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  updateNetworkStatus(){
    if(this.networkProvider.network.type == "none"){
      this.networkStatus = "offline";
    }else{
      this.networkStatus = "online: " + this.networkProvider.network.type;
    }
  }

  exitApp(){
    this.platform.exitApp();
 }

}
