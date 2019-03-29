import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PythonService {
  //timeframeLookbacks: any = [6, 29, 89]; //week, one month, three months

  constructor(private http: HttpClient) { }

  public getPrediction(timeframeId: number): Observable<any> {
    // return this.http.get("/python/prediction/" + this.timeframeLookbacks[timeframeId]).pipe(map(resp => resp));
    return this.http.get("/python/prediction/" + timeframeId).pipe(map(resp => resp));
  }
}
