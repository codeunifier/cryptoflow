import { Component, OnInit } from '@angular/core';
import { PythonService } from '../_services/python.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit {
  predictionSub: Subscription;
  prediction: number;
  hasErrored: boolean = false;

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
    this.prediction = null;
    this.predictionSub = this.pyService.getPrediction().subscribe(p => {
      this.hasErrored = p == null;
      this.prediction = p;
    });
  }
}
