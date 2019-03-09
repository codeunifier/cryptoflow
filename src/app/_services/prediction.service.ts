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

  private currentState: PredictionStates;
  private prediction: Prediction;

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

  private makePrediction(): void {
    this.prediction = null;
    this.pyService.getPrediction(this.timeframeId).subscribe(p => {
      if (p == null || p.prediction == null) {
        this.currentStateChange.next(PredictionStates.Errored);
      } else {
        this.prediction = p;
        this.currentStateChange.next(PredictionStates.Finished);
      }
    });
  }
}
