import { Injectable } from "@angular/core";
import { ParseService } from "./parseServer.service";
import { LandmarkData, Landmark } from "../../app/landmark/landmark.model";
import { QUERY_LIMIT } from "../shared/constants";

@Injectable({
  providedIn: "root",
})
export class ParseLandmarksService extends ParseService {
  private Landmark: any;
  constructor() {
    super();
    this.Landmark = this.Parse.Object.extend("Landmark");
  }

  async createLandMark(sessionToken: string, landmarkData: LandmarkData) {
    const landmark = new this.Landmark();
    const parseFile = new this.Parse.File(
      landmarkData.fileName,
      landmarkData.file
    );
    landmarkData.file = parseFile;
    try {
      const { id } = await landmark.save({ ...landmarkData }, { sessionToken });
      return id;
    } catch (error) {
      console.log(error.message);
    }
  }

  private createNewQuery() {
    return new this.Parse.Query("Landmark");
  }

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
      const parseFile = new this.Parse.File(
        landmarkData.fileName,
        landmarkData.file
      );
      landmarkData.file = parseFile;
    }
    const response = await landmark.save({ ...landmarkData }, { sessionToken });
    return response;
  }

  async count() {
    const query = this.createNewQuery();
    return await query.count();
  }

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
    return landmarks.map(({ id, attributes }) => {
      return new Landmark(id, {
        title: attributes.title,
        info: attributes.info,
        file: attributes.file,
        fileName: attributes.fileName,
        link: attributes.link
      });
    });
  }

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
    return landmarks.map(({ id, attributes }) => {
      return new Landmark(id, {
        title: attributes.title,
        info: attributes.info,
        file: attributes.file,
        fileName: attributes.fileName,
        link: attributes.link
      });
    });
  }

  async deleteLandmark(sessionToken: string, id: string) {
    const query = this.createNewQuery();
    query.equalTo("objectId", id);
    const landmark = await query.first();
    await landmark.destroy({ sessionToken });
  }
}
