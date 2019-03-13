import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PredictionService } from '../_services/prediction.service';
import { PredictionStates } from '../_models/prediction-states';

@Component({
  selector: 'app-timeframe',
  templateUrl: './timeframe.component.html',
  styleUrls: ['./timeframe.component.scss']
})
export class TimeframeComponent implements OnInit {
  activeId: number;
  pState: PredictionStates = null;

  constructor(private predictionService: PredictionService) {
    this.predictionService.currentStateChange.subscribe((value) => {
      this.pState = value;
    });
  }

  ngOnInit() {
    this.activeId = 0;
  }

  onTimeframeClick(id: number, event: any = null): void {
    if (!this.isLoading()) {
      this.activeId = id;
      this.predictionService.newPrediction(id);
    }
  }

  isActive(id: number): boolean {
    return id == this.activeId;
  }

  isLoading(): boolean {
    return this.pState == PredictionStates.Loading;
  }
}
