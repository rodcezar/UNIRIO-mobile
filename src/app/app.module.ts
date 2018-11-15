import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { AlertController } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { innerTemplate } from '../pages/inner-template/inner-template';
import { CalloutDetailPage } from '../pages/callout-detail/callout-detail';
import { NetworkProvider } from '../providers/network/network';
import { LoadingProvider } from '../providers/loading/loading';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    innerTemplate,
    CalloutDetailPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    innerTemplate,
    CalloutDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    FileTransfer,
    FileTransferObject,
    Network,
    NetworkProvider,
    LoadingProvider,
    AlertController,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
