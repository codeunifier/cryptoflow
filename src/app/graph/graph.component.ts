import { Component, OnInit, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';
import { GraphData } from '../_models/graph-data';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
  @Input() data: GraphData;
  days: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  graph: Chart;

  constructor() { }

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
        this.updateGraph();
    }
  }

    private updateGraph(): void {
        if (this.data != null) {
            var ctx = document.getElementById("canvas");
            let labels: string[] = [];
            let prices: number[] = [];

            let _this = this;

            this.data.historical.forEach(function (value, key) {
                //there is a bug here - the date format 2019-02-17 is creating a date for Feb. 16 2019
                let index = -1;
                if (new Date(key).getDay() == 6) {
                    index = 0;
                } else {
                    index = new Date(key).getDay() + 1;
                }
                labels.push(_this.days[index]);
                prices.push(value);
            });

            // labels.push(this.days[new Date().getDay()]);
            labels.push("Today");
            prices.push(this.data.current);

            // labels.push(this.days[new Date().getDay() + 1]);
            labels.push("Tomorrow");
            prices.push(this.data.prediction);

            let pricesWithToday = Object.assign([], prices);
            pricesWithToday.push(this.data.current);

            this.graph = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'historical price',
                            data: prices,
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
}
