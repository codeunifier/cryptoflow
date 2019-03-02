import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PythonService {

  constructor(private http: HttpClient) { }

  public getPrediction(lookback: number): Observable<any> {
    return this.http.get("/python/prediction/" + lookback).pipe(map(resp => resp));
  }
}
