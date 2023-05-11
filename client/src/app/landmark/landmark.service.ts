import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Landmark } from './landmark.model';

@Injectable()
export class LandmarkService {
  landmarksChanged = new Subject<Landmark[]>();

  private landmarks: Landmark[] = [];

  constructor() {}

  setLandmarks(landmarks: Landmark[]) {
    this.landmarks = landmarks;
    this.landmarksChanged.next(this.landmarks.slice());
  }

  getLandmarks() {
    return this.landmarks.slice();
  }

  getLandmark(index: number) {
    return this.landmarks[index];
  }

  addLandmark(landmark: Landmark) {
    this.landmarks.push(landmark);
    this.landmarksChanged.next(this.landmarks.slice());
  }

  updateLandmark(index: number, newLandmark: Landmark) {
    this.landmarks[index] = newLandmark;
    this.landmarksChanged.next(this.landmarks.slice());
  }

  deleteLandmark(index: number) {
    this.landmarks.splice(index, 1);
    this.landmarksChanged.next(this.landmarks.slice());
  }
}
