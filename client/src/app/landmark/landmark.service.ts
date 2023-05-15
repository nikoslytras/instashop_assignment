import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { LandmarkData, Landmark } from "./landmark.model";
import { ParseLandmarksService } from "../parseServer/parseLandmarks.service";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class LandmarkService {
  landmarksChanged = new Subject<Landmark[]>();
  landmarksSearchResultChanged = new Subject<Landmark[]>();
  private landmarks: Landmark[] = [];

  constructor(
    private parseLandmarksService: ParseLandmarksService,
    private authService: AuthService
  ) {}

  get landmarks_() {
    return this.landmarks;
  }

  /**
   * Initializes the landmarks
   * @returns {Landmark[]} The landmarks.
   */
  async initializeLandmarks() {
    const landmarks = await this.parseLandmarksService.getLandmarks();
    this.landmarks = landmarks;
    return landmarks;
  }

  /**
   * Gets the landmarks from DB.
   * @param {number} skip The landmarks to skip in the query.
   * @param {string} sortBy The sort field.
   * @param {boolean} ascendingOrder The order of the result to be returned.
   * @returns {Landmark[]} The landmarks.
   */
  async getLandmarks(skip?: number, sortBy?: string, ascendingOrder?: boolean) {
    const landmarks = await this.parseLandmarksService.getLandmarks(
      skip,
      sortBy,
      ascendingOrder
    );
    this.landmarks = landmarks;
    this.landmarksChanged.next(landmarks);
    return landmarks;
  }

  /**
   * Gets a landmark from local memory.
   * @param {number} id The landmark's id.
   * @returns {Landmark} The landmark.
   */
  getLandmark(id: string) {
    const landmark = this.landmarks.find((l) => l.id === id);
    if (landmark) return landmark;
  }

  /**
   * Creates a new landmark in DB.
   * @param {LandmarkData} landmark The landmarks's data.
   */
  async addLandmark(landmark: LandmarkData) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) throw new Error("Not authorized");
    await this.parseLandmarksService.createLandMark(
      currentUser.getSessionToken(),
      landmark
    );
    await this.getLandmarks();
  }

  /**
   * Updates a landmark in DB.
   * @param {string} sessionToken The user's session token.
   * @param {id} id The landmark's id.
   * @param {LandmarkData} dataToUpdate The landmarks's data.
   */
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

  /**
   * Deletes a landmark from DB.
   * @param {string} id The landmarks's id.
   */
  async deleteLandmark(id: string) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) throw new Error("Not authorized");
    await this.parseLandmarksService.deleteLandmark(
      currentUser.getSessionToken(),
      id
    );
    await this.getLandmarks();
  }

  /**
   * Search the landmarks in DB.
   * @param {string} searchText The substring to search the landmarks.
   * @param {string} sortBy The sort field.
   * @param {boolean} ascendingOrder The order of the result to be returned.
   * @returns {Landmark[]} The landmarks.
   */
  async searchLandmarks(
    searchText: string,
    sortBy: string,
    ascendingOrder: boolean
  ) {
    if (searchText.trim()) {
      const landmarks = await this.parseLandmarksService.searchLandmarks(
        searchText,
        sortBy,
        ascendingOrder
      );
      this.landmarks = landmarks;
      this.landmarksSearchResultChanged.next(landmarks);
    } else {
      await this.getLandmarks(0, sortBy, ascendingOrder);
    }
  }

  /**
   * Counts the landmark items in DB.
   * @returns {number} The landmarks number.
   */
  async count() {
    return await this.parseLandmarksService.count();
  }
}
