import { Component, OnInit, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';
import { GraphData } from '../_models/graph-data';
import { PredictionService } from '../_services/prediction.service';
import { PredictionStates } from '../_models/prediction-states';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
  graph: Chart;
  pState: PredictionStates = null;
  data: GraphData;

  constructor(private predictionService: PredictionService) {
    this.predictionService.currentStateChange.subscribe((value) => {
        if (value == PredictionStates.Finished) {
            let prediction = this.predictionService.getPrediction();

            let ex: GraphData = new GraphData();
            ex.current = prediction.current;
            ex.prediction = prediction.prediction;

            ex.historical = new Map<string, number>();

            for (var key in prediction.historical) {
                ex.historical.set(key, prediction.historical[key]);
            }

            this.data = ex;
        } else {
            this.data = null;
        }
        
        this.updateGraph();
        this.pState = value;
    });
   }

  ngOnInit() {
    var ctx = document.getElementById("canvas");

    if (ctx) {
        this.graph = this.createBlankGraph(ctx);
    }
  }

    private updateGraph(): void {
        var ctx = document.getElementById("canvas");

        if (ctx) {
            if (this.data != null) {
                this.createGraphLabelsAndPrices();

                let pricesWithToday = Object.assign([], this.data.prices);
                pricesWithToday.push(this.data.current);

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
                    },
                    // options: {
                    //     scales: {                            
                    //         xAxes: [{
                    //             ticks: { 
                    //                 fontColor: "#FF0000"
                    //             }
                    //         }]
                    //     }
                    // }
                });
            } else {
                this.graph = this.createBlankGraph(ctx);
            }
        }
    }

    private createBlankGraph(ctx): Chart {
        return new Chart(ctx, {
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

                this.data.labels.push("Today");
                this.data.prices.push(this.data.current);

                this.data.labels.push("Tomorrow");
                this.data.prices.push(this.data.prediction);
            break;
            case 1: //1 month
                let idx: number = 0;
                this.data.historical.forEach((value, key) => {
                    if ((idx - 1) % 4 == 0) {
                        // let weekday: string = new Date(key).toLocaleDateString('en-US', {weekday: 'long'});
                        let dateString: string = new Date(key).toLocaleDateString('en-US');
                        this.data.labels.push(dateString);
                        this.data.prices.push(value);
                    }

                    idx++;
                });

                let date: Date = new Date();
                this.data.labels.push(date.toLocaleDateString('en-US'));
                this.data.prices.push(this.data.current);

                date.setDate(date.getDate() + 4);

                this.data.labels.push(date.toLocaleDateString('en-US'));
                this.data.prices.push(this.data.prediction);
                // let keys = this.data.historical.keys;
                // for (var i = 0; i < this.data.historical.size; i++) {
                //     if (i % 4 == 0) {
                //         let weekday: string = new Date(keys[i]).toLocaleDateString('en-US', {weekday: 'long'});
                //         this.data.labels.push(weekday);
                //         this.data.prices.push(this.data.historical[keys[i]]);
                //     }
                // }
            break;
            case 2: //3 months

            break;
        }        
    }
}
