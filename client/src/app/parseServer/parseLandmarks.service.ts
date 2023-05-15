import { Injectable } from "@angular/core";
import { ParseService } from "./parseServer.service";
import { LandmarkData, Landmark } from "../../app/landmark/landmark.model";
import { FILE_MAX_SIZE, QUERY_LIMIT } from "../shared/constants";

@Injectable({
  providedIn: "root",
})
export class ParseLandmarksService extends ParseService {
  private Landmark: any;
  constructor() {
    super();
    this.Landmark = this.Parse.Object.extend("Landmark");
  }

  /**
   * Creates a new landmark in DB.
   * @param {string} sessionToken The user's session token
   * @param {LandmarkData} landmarkData The landmarks's data.
   */
  async createLandMark(sessionToken: string, landmarkData: LandmarkData) {
    this.checkFileSize(landmarkData.file);
    const landmark = new this.Landmark();
    const parseFile = new this.Parse.File(
      landmarkData.fileName,
      landmarkData.file
    );
    landmarkData.file = parseFile;
    await landmark.save({ ...landmarkData }, { sessionToken });
  }

  /**
   * Creates a Parse query.
   * @returns {object} The Parse query
   */
  private createNewQuery() {
    return new this.Parse.Query("Landmark");
  }

  /**
   * Updates a landmark in DB.
   * @param {string} sessionToken The user's session token.
   * @param {id} id The landmark's id.
   * @param {LandmarkData} landmarkData The landmarks's data.
   */
  async updateLandmark(
    sessionToken: string,
    id: string,
    landmarkData: LandmarkData
  ) {
    const query = this.createNewQuery();
    query.equalTo("objectId", id);
    const landmark = await query.first();
    if (!landmark) return;
    if (landmarkData.file) {
      this.checkFileSize(landmarkData.file);
      const parseFile = new this.Parse.File(
        landmarkData.fileName,
        landmarkData.file
      );
      landmarkData.file = parseFile;
    }
    await landmark.save({ ...landmarkData }, { sessionToken });
  }

  /**
   * Counts the landmark items in DB.
   * @returns {number} The landmarks number.
   */
  async count() {
    const query = this.createNewQuery();
    return await query.count();
  }

  /**
   * Gets the landmarks from DB.
   * @param {number} skip The landmarks to skip in the query.
   * @param {string} sortBy The sort field.
   * @param {boolean} ascendingOrder The order of the result to be returned.
   * @returns {Landmark[]} The landmarks.
   */
  async getLandmarks(
    skip: number = 0,
    sortBy: string = "title",
    ascendingOrder: boolean = true
  ): Promise<Landmark[]> {
    const query = this.createNewQuery();
    if (ascendingOrder) {
      query.ascending(sortBy);
    } else {
      query.descending(sortBy);
    }
    const landmarks = await query.skip(skip).limit(QUERY_LIMIT).find();
    if (!landmarks?.length) return [];
    return this.parseLandmarks(landmarks);
  }

  /**
   * Search the landmarks in DB.
   * @param {string} substring The substring to search the landmarks.
   * @param {string} sortBy The sort field.
   * @param {boolean} ascendingOrder The order of the result to be returned.
   * @returns {Landmark[]} The landmarks.
   */
  async searchLandmarks(
    substring: string,
    sortBy: string = "createdAt",
    ascendingOrder: boolean = true
  ): Promise<Landmark[]> {
    const query = this.createNewQuery();
    query.contains("title", substring);
    if (ascendingOrder) {
      query.ascending(sortBy);
    } else {
      query.descending(sortBy);
    }
    const landmarks = await query.find();
    if (!landmarks?.length) return [];
    return this.parseLandmarks(landmarks);
  }

  /**
   * Deletes a landmark from DB.
   * @param {string} sessionToken The user's session token
   * @param {string} id The landmarks's id.
   */
  async deleteLandmark(sessionToken: string, id: string) {
    const query = this.createNewQuery();
    query.equalTo("objectId", id);
    const landmark = await query.first();
    await landmark.destroy({ sessionToken });
  }

  /**
   * Parses the landmarks from the Parse server response to Landmark[].
   * @param {object} landmarks The Parse server response landmarks.
   * @returns {Landmark[]} The landmarks.
   */
  parseLandmarks(landmarks: any): Landmark[] {
    return landmarks.map(({ id, attributes }) => {
      return new Landmark(id, {
        title: attributes.title,
        info: attributes.info,
        file: attributes.file,
        fileName: attributes.fileName,
        link: attributes.link,
      });
    });
  }

  /**
   * Checks the file size
   * @param {object} file The file to be checked.
   */
  checkFileSize(file: any) {
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > FILE_MAX_SIZE)
      throw new Error("File should be less than 5MB");
  }
}
