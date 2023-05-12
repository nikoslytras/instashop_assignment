import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { LandmarkData, Landmark } from "./landmark.model";
import { ParseLandmarksService } from "../parseServer/parseLandmarks.service";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class LandmarkService {
  landmarksChanged = new Subject<Landmark[]>();

  private landmarks: Landmark[] = [];

  constructor(
    private parseLandmarksService: ParseLandmarksService,
    private authService: AuthService
  ) {}

  get landmarks_() {
    return this.landmarks;
  }

  async getLandmarks() {
    const landmarks = await this.parseLandmarksService.getLandmarks();
    this.landmarks = landmarks;
    return landmarks;
  }

  getLandmark(id: string) {
    const landmark = this.landmarks.find((l) => l.id === id);
    if (landmark) return landmark;
  }

  async addLandmark(landmark: LandmarkData) {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const id = await this.parseLandmarksService.createLandMark(
        currentUser.getSessionToken(),
        landmark
      );
      if (id) {
        this.landmarks.push(new Landmark(id, landmark));
        this.landmarksChanged.next(this.landmarks.slice());
      }
    }
  }

  async updateLandmark(id: string, dataToUpdate: LandmarkData) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) throw new Error("Not authorized");
    await this.parseLandmarksService.updateLandmark(
      currentUser.getSessionToken(),
      id,
      dataToUpdate
    );
    const updatedLandmarks = await this.getLandmarks();
    this.landmarksChanged.next(updatedLandmarks);
  }

  async deleteLandmark(id: string) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) throw new Error("Not authorized");
    await this.parseLandmarksService.deleteLandmark(currentUser.getSessionToken(), id);
    const updatedLandmarks = await this.getLandmarks();
    this.landmarksChanged.next(updatedLandmarks);
  }

  async searchLandmarks(searchText: string){
    let landmarks: Landmark[];
    if(searchText.trim()){
      landmarks = await this.parseLandmarksService.searchLandmarks(searchText);
    }else{
      landmarks = await this.getLandmarks();
    }
    this.landmarks = landmarks;
    this.landmarksChanged.next(landmarks);
  }
}
