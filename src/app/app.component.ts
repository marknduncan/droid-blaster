import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import Phaser, { CANVAS } from 'phaser';

// import { SplashScreenPlugin } from '@capacitor/splash-screen';
// import { StatusBarPlugin } from '@capacitor/status-bar';
// import { Style } from '@capacitor/status-bar';

import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

//scenes
import FirstScene from './Scenes/FirstScene';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreenPlugin,
    // private statusBar: StatusBarPlugin
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.setStyle({ style: Style.Default });
      // this.splashScreen.hide();

      //initialize phaser
      this.initializePhaser();
    });
  }

  initializePhaser() {

    this.config = {
      type: Phaser.CANVAS,
      scale: {
        mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1200,
        height: 600
      },
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
      },
      plugins: {
        global: [{
            key: 'rexVirtualJoystick',
            plugin: VirtualJoystickPlugin,
            start: true
        }]
      },
      scene: [FirstScene]
    };

    this.phaserGame = new Phaser.Game(this.config);

  }
}
