import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Landmark } from './landmark.model';
import { DataStorageService } from '../shared/data-storage.service';
import { LandmarkService } from './landmark.service';

@Injectable({ providedIn: 'root' })
export class LandmarksResolverService implements Resolve<Landmark[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private landmarksService: LandmarkService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const landmarks = this.landmarksService.getLandmarks();

    if (landmarks.length === 0) {
      return this.dataStorageService.fetchLandmarks();
    } else {
      return landmarks;
    }
  }
}
