import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { LandmarkData, Landmark } from "./landmark.model";
import { ParseLandmarksService } from "../parseServer/parseLandmarks.service";
import { ParseFilesService } from "../parseServer/parseFiles.service";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class LandmarkService {
  landmarksChanged = new Subject<Landmark[]>();

  private landmarks: Landmark[] = [];

  constructor(
    private parseLandmarksService: ParseLandmarksService,
    private authService: AuthService,
    private parseFilesService: ParseFilesService
  ) {}

  get landmarks_() {
    return this.landmarks;
  }

  async initializeLandmarks(){
    const landmarks = await this.parseLandmarksService.getLandmarks();
    this.landmarks = landmarks;
    return landmarks;
  }

  async getLandmarks(skip?: number, sortBy?: string, ascendingOrder?: boolean) {
    const landmarks = await this.parseLandmarksService.getLandmarks(skip, sortBy, ascendingOrder);
    this.landmarks = landmarks;
    this.landmarksChanged.next(landmarks);
    return landmarks;
  }

  getLandmark(id: string) {
    const landmark = this.landmarks.find((l) => l.id === id);
    if (landmark) return landmark;
  }

  async addLandmark(landmark: LandmarkData) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) throw new Error("Not authorized");
    await this.parseLandmarksService.createLandMark(
      currentUser.getSessionToken(),
      landmark
    );
    await this.getLandmarks();
  }

  async updateLandmark(id: string, dataToUpdate: LandmarkData) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) throw new Error("Not authorized");
    await this.parseLandmarksService.updateLandmark(
      currentUser.getSessionToken(),
      id,
      dataToUpdate
    );
    await this.getLandmarks();
  }

  async deleteLandmark(id: string) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) throw new Error("Not authorized");
    await this.parseLandmarksService.deleteLandmark(
      currentUser.getSessionToken(),
      id
    );
    await this.getLandmarks();
  }

  async searchLandmarks(searchText: string, sortBy: string, ascendingOrder: boolean) {
    if (searchText.trim()) {
      const landmarks = await this.parseLandmarksService.searchLandmarks(searchText, sortBy, ascendingOrder);
      this.landmarks = landmarks;
      this.landmarksChanged.next(landmarks);
    } else {
      await this.getLandmarks(0, sortBy, ascendingOrder);
    }
  }

  async count(){
    return await this.parseLandmarksService.count();
  }

  async uploadFile(name: string, file: any){
    return await this.parseFilesService.uploadFile(name, file);
  }
}
