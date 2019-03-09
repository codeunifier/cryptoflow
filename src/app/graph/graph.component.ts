import { Component, OnInit, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';
import { GraphData } from '../_models/graph-data';
import { PredictionService } from '../_services/prediction.service';
import { PredictionStates } from '../_models/prediction-states';
import { Prediction } from '../_models/prediction';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
  graph: Chart;
  pState: PredictionStates = null;
  prediction: Prediction;
  data: GraphData;

  constructor(private predictionService: PredictionService) {
    this.predictionService.currentStateChange.subscribe((value) => {
        if (value == PredictionStates.Finished) {
            this.prediction = this.predictionService.getPrediction();

            let ex: GraphData = new GraphData();
            ex.current = this.prediction.current;
            ex.prediction = this.prediction.prediction;

            ex.historical = new Map<string, number>();

            for (var key in this.prediction.historical) {
                ex.historical.set(key, this.prediction.historical[key]);
            }

            this.data = ex;
            this.updateGraph();
        }
        
        this.pState = value;
    });
   }

  ngOnInit() {
    var ctx = document.getElementById("canvas");
    this.graph = new Chart(ctx, {
        type: "line",
        data: {},
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 500,
                        max: 5000
                    }
                }]
            }
        }
    });
  }

    private updateGraph(): void {
        if (this.data != null) {
            var ctx = document.getElementById("canvas");
            this.createGraphLabelsAndPrices();

            let pricesWithToday = Object.assign([], this.data.prices);
            pricesWithToday.push(this.prediction.current);

            this.graph = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: this.data.labels,
                    datasets: [
                        {
                            label: 'historical price',
                            data: this.data.prices,
                            fill: false,
                            pointRadius: 4,
                            borderColor: "#80b6f4",
                            //borderColor: "#5ff442",
                            pointBorderColor: "#f45c42",
                            pointBackgroundColor:"#f45c42",
                        }
                    ],
                }
            });
        }
    }

    private createGraphLabelsAndPrices() {
        let _this = this;
        this.data.labels = [];
        this.data.prices = [];

        //TODO: finish this and add models for a lookback of 29 and 69

        switch(this.predictionService.timeframeId) {
            case 0: //week
                this.data.historical.forEach(function (value, key) {
                    let weekday: string = new Date(key).toLocaleDateString('en-US', {weekday: 'long'});
        
                    _this.data.labels.push(weekday);
                    _this.data.prices.push(value);
                });
            break;
            case 1: //1 month
                let keys = this.data.historical.keys;
                for (var i = 0; i < this.data.historical.size; i++) {
                    if (i % 4 == 0) {
                        let weekday: string = new Date(keys[i]).toLocaleDateString('en-US', {weekday: 'long'});
                        this.data.labels.push(weekday);
                        this.data.prices.push(this.data.historical[keys[i]]);
                    }
                }
            break;
            case 2: //3 months

            break;
        }
        

        this.data.labels.push("Today");
        this.data.prices.push(this.prediction.current);

        this.data.labels.push("Tomorrow");
        this.data.prices.push(this.prediction.prediction);
    }
}
