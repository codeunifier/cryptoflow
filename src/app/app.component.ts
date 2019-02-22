import { Component } from '@angular/core';
import { GraphData } from './_models/graph-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cryptoflow';
  disclaimer: string;
  cryptoData: GraphData;

  onPrediction(data: GraphData) {
    this.cryptoData = data;
  }

  onDisclaim(disclaimer: string) {
    this.disclaimer = "Disclaimer: " + disclaimer;
  }
}