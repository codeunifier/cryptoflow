import { Component, OnInit, Input } from '@angular/core';
import { PredictionService } from '../_services/prediction.service';
import { PredictionStates } from '../_models/prediction-states';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  disclaimer: string;

  constructor(private predictionService: PredictionService) {
    this.predictionService.currentStateChange.subscribe((value) => {
      if (value == PredictionStates.Finished) {
        this.disclaimer = this.predictionService.getDisclaimer();
      }
    });
  }

  ngOnInit() {
  }
}