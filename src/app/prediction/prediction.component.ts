import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PythonService } from '../_services/python.service';
import { Subscription } from 'rxjs';
import { GraphData } from '../_models/graph-data';
import { PredictionService } from '../_services/prediction.service';
import { PredictionStates } from '../_models/prediction-states';
import { Prediction } from '../_models/prediction';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit {
  growth: number = 0;
  growthPercent: number = 0;
  pState: PredictionStates = null;
  prediction: Prediction;

  constructor(private predictionService: PredictionService) { 
    this.predictionService.currentStateChange.subscribe((value) => {
      if (value == PredictionStates.Finished) {
        this.prediction = this.predictionService.getPrediction();
        this.growth = this.prediction.prediction - this.prediction.current;
        this.growthPercent = ((this.prediction.prediction - this.prediction.current) / this.prediction.current) * 100;
      } else if (value == PredictionStates.Errored) {
        this.prediction = this.growth = this.growthPercent = null;
      }

      this.pState = value;
    });
  }

  ngOnInit() {
    this.predictionService.newPrediction();
  }

  onPredictionRefreshClick(): void {
    //this.makePrediction();
    this.predictionService.refreshPrediction();
  }

  getGrowthClass(): string {
    if (this.growth == null) {
      return "";
    } else if (this.growth < 0) {
      return "neg-growth";
    } else if (this.growth > 0) {
      return "pos-growth";
    }
  }

  getSign(): string {
    if (this.growth == null) {
      return "";
    } else if (this.growth < 0) {
      return "-";
    } else if (this.growth > 0) {
      return "+";
    }
  }

  getGrowth(): string {
    return Math.abs(this.growth).toFixed(2);
  }

  getGrowthPercent(): string {
    return Math.abs(this.growthPercent).toFixed(2);
  }

  hasLoaded(): boolean {
    return this.pState == PredictionStates.Finished 
          || this.pState == PredictionStates.Errored;
  }

  hasErrored(): boolean {
    return this.pState == PredictionStates.Errored;
  }
}
