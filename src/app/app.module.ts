import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphComponent } from './graph/graph.component';
import { PredictionComponent } from './prediction/prediction.component';

import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';
import { TimeframeComponent } from './timeframe/timeframe.component';

@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    PredictionComponent,
    FooterComponent,
    TimeframeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
