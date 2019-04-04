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
        let count: number = 0;
        let max: number = this.data.historical.size;
        let newHistorical: Map<string, number> = new Map<string, number>();

        switch(this.predictionService.timeframeId) {
            case 0: //1 week
                //historical contains today's value as well
                this.data.historical.forEach(function (value, key) {
                    let weekday: string = new Date(key).toLocaleDateString('en-US', {weekday: 'long'});
        
                    _this.data.labels.push(weekday);
                    _this.data.prices.push(value);
                });
        
                let d: Date = new Date();
                d.setDate(d.getDate() + 1);

                this.data.labels.push(d.toLocaleDateString('en-US', {weekday: 'long'}));
                this.data.prices.push(this.data.prediction);
            break;
            case 1: //1 month
                this.data.historical.forEach(function (value, key) {
                    count++;
                    if (max - count < 26) {
                        newHistorical.set(key, value);
                    }
                });

                this.data.historical = newHistorical;
                this.setLabelsAndPricesForData(3);
            break;
            case 2: //3 months
                this.data.historical.forEach(function (value, key) {
                    count++;
                    if (max - count < 84) {
                        newHistorical.set(key, value);
                    }
                });

                this.data.historical = newHistorical;
                this.setLabelsAndPricesForData(7);
            break;
        }        
    }

    private setLabelsAndPricesForData(increment: number): void {
        let _this = this;
        let count: number = 0;
        let date: Date = new Date();

        this.data.historical.forEach(function (value, key) {
            if (count % increment == 0) {
                date = new Date(key);
                _this.data.labels.push(date.getDate() + " " + _this.getShortMonthName(date.getMonth()) + ".");
                _this.data.prices.push(value);
            }
            count++;
        });

        this.data.labels.push("Today");
        this.data.prices.push(this.data.current);

        date = new Date();
        date.setDate(date.getDate() + increment);

        this.data.labels.push(date.getDate() + " " + this.getShortMonthName(date.getMonth()) + ".");
        this.data.prices.push(this.data.prediction);
    }

    private getShortMonthName(idx: number): string {
        let months: string[] = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        return months[idx];
    }
}
