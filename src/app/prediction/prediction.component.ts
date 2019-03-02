import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PythonService } from '../_services/python.service';
import { Subscription } from 'rxjs';
import { GraphData } from '../_models/graph-data';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit {
  @Output() predict: EventEmitter<GraphData> = new EventEmitter();
  @Output() disclaim: EventEmitter<string> = new EventEmitter();

  predictionSub: Subscription;
  prediction: number;
  current: number;
  hasErrored: boolean = false;
  historicalData: number[];
  hasLoaded: boolean = false;
  disclaimer: string;
  lookback: number = 6; //a different model is needed for each different value for the lookback

  constructor(private pyService: PythonService) { }

  ngOnInit() {
    this.makePrediction();
  }

  ngOnDestroy() {
    if (this.predictionSub) {
      this.predictionSub.unsubscribe();
    }
  }

  onPredictionRefreshClick(): void {
    this.makePrediction();
  }

  private makePrediction(): void {
    this.hasLoaded = false;
    this.prediction = null;
    this.predictionSub = this.pyService.getPrediction(this.lookback).subscribe(p => {
      this.hasErrored = p == null || p.prediction == null;
      
      if (!this.hasErrored) {
        let ex: GraphData = new GraphData();

        this.prediction = ex.prediction = p.prediction;
        this.current = ex.current = p.current;
        ex.historical = new Map<string, number>();

        for (var key in p.historical) {
          ex.historical.set(key, p.historical[key]);
        }

        this.predict.emit(ex);
        this.disclaim.emit(p.disclaimer);
      }

      this.hasLoaded = true;
    });
  }
}
