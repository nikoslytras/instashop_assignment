import { Injectable } from "@angular/core";
import { ParseService } from "./parseServer.service";
import { LandmarkData, Landmark } from "../../app/landmark/landmark.model";

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
    try {
      const { id } = await landmark.save(
        { ...landmarkData },
        { sessionToken }
      );
      return id;
    } catch (error) {
      console.log(error.message);
    }
  }

  private createNewQuery(){
    return new this.Parse.Query("Landmark")
  }

  async updateLandmark(sessionToken: string, id: string, landmarkData: LandmarkData) {
    const query = this.createNewQuery();
    query.equalTo("objectId", id);
    const landmark = await query.first();
    if (!landmark) return;
    const response = await landmark.save({ ...landmarkData }, { sessionToken });
    return response;
  }

  async getLandmarks(): Promise<Landmark[]> {
    const query = this.createNewQuery();
    const landmarks = await query.findAll();
    if (!landmarks?.length) return [];
    return landmarks.map(({id, attributes})=>{
      return new Landmark(id, {
        title: attributes.title,
        imagePath: attributes.imagePath,
        info: attributes.info
      });
    });
  }

  async getLandmark(id: string) {
    const query = this.createNewQuery();
    query.equalTo("objectId", id);
    const landmark = await query.first();
    return landmark;
  }

  async searchLandmarks(substring: string): Promise<Landmark[]> {
    const query = this.createNewQuery();
    query.contains("title", substring);
    const landmarks = await query.findAll();
    if (!landmarks?.length) return [];
    return landmarks.map(({id, attributes})=>{
      return new Landmark(id, {
        title: attributes.title,
        imagePath: attributes.imagePath,
        info: attributes.info
      });
    });

  }

  async deleteLandmark(sessionToken:string, id: string) {
    const query = this.createNewQuery();
    query.equalTo("objectId", id);
    const landmark = await query.first();
    await landmark.destroy({ sessionToken });
  }
}
