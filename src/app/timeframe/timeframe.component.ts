import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PredictionService } from '../_services/prediction.service';

@Component({
  selector: 'app-timeframe',
  templateUrl: './timeframe.component.html',
  styleUrls: ['./timeframe.component.scss']
})
export class TimeframeComponent implements OnInit {
  activeId: number;

  constructor(private predictionService: PredictionService) { }

  ngOnInit() {
    this.activeId = 1;
  }

  onTimeframeClick(id: number): void {
    this.activeId = id;
    this.predictionService.newPrediction(id);
  }

  getActiveClass(id: number): string {
    return id == this.activeId ? "active" : "";
  }
}
