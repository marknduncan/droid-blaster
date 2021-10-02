import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import Phaser from 'phaser';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  phaserGame: Phaser.Game;
  phaserConfig: Phaser.Types.Core.GameConfig;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //initialize phaser
      this.initializePhaser();
    });
  }

  initializePhaser(){
    this.phaserConfig = {
      type: Phaser.AUTO,
      width: 1200,
      height: 600,
      physics: {
          default: 'arcade',
          arcade: {
              gravity: { y: 0 },
              debug: false
          }
      },
      audio: {
          disableWebAudio: true,
          noAudio: false
      }
    };
      // },
      // scene: {
      //     preload: preload,
      //     create: create,
      //     update: update
      // }};
    this.phaserGame = new Phaser.Game(this.phaserConfig);
  }
}
