import { Injectable } from '@angular/core';
import { PythonService } from './python.service';
import { Prediction } from '../_models/prediction';
import { Subject, BehaviorSubject } from 'rxjs';
import { PredictionStates } from '../_models/prediction-states';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  currentStateChange: BehaviorSubject<PredictionStates> = new BehaviorSubject(null);
  timeframeId: number = 0;
  activeCall: boolean = false;

  private currentState: PredictionStates;
  private prediction: Prediction;
  private disclaimer: string;

  constructor(private pyService: PythonService) {
    this.currentStateChange.subscribe((value) => {
      this.currentState = value;
    });
  }

  newPrediction(tfId: number = 0): void {
    this.currentStateChange.next(PredictionStates.Loading);
    this.timeframeId = tfId;
    this.makePrediction();
  }

  refreshPrediction(): void {
    this.currentStateChange.next(PredictionStates.Refreshing);
    this.makePrediction();
  }

  getPrediction(): Prediction {
    if (this.currentState == PredictionStates.Finished) {
      return this.prediction;
    } else {
      return null;
    }
  }

  getDisclaimer(): string {
    if (this.currentState == PredictionStates.Finished) {
      return this.disclaimer;
    } else {
      return null;
    }
  }

  private makePrediction(): void {
    //add some protection so you can't spam a bunch of calls
    if (!this.activeCall) {
      this.prediction = null;
      this.activeCall = true;
      this.pyService.getPrediction(this.timeframeId).subscribe(p => {
        this.activeCall = false;
        if (p == null || p.prediction == null) {
          this.currentStateChange.next(PredictionStates.Errored);
        } else {
          this.prediction = p;
          this.prediction.timeframeId = this.timeframeId;
          //this probably should be passed down from the server call, but meh
          this.disclaimer = "Disclaimer: This data was produced from the CoinDesk Bitcoin Price Index. BPI value data returned as USD.";
          this.currentStateChange.next(PredictionStates.Finished);
        }
      });
    }
  }
}
