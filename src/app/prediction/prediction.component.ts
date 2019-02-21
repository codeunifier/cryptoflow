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

  constructor(private pyService: PythonService) { }

  ngOnInit() {
    this.predictionSub = this.pyService.getPrediction().subscribe(p => {
      this.prediction = p;
    });
  }

  ngOnDestroy() {
    if (this.predictionSub) {
      this.predictionSub.unsubscribe();
    }
  }
}
