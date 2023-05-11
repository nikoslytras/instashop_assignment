import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { Landmark } from '../landmark/landmark.model';
import { LandmarkService } from '../landmark/landmark.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private landmarkService: LandmarkService
  ) {}

  storeLandmarks() {
    const landmarks = this.landmarkService.getLandmarks();
    this.http
      .put(
        'https://ng-course-landmark-book-65f10.firebaseio.com/landmarks.json',
        landmarks
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchLandmarks() {
    return this.http
      .get<Landmark[]>(
        'https://ng-course-landmark-book-65f10.firebaseio.com/landmarks.json'
      )
      .pipe(
        map(landmarks => {
          return landmarks.map(landmark => {
            return {
              ...landmark
            };
          });
        }),
        tap(landmarks => {
          this.landmarkService.setLandmarks(landmarks);
        })
      );
  }
}
