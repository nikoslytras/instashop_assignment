export interface LandmarkData {
  title?: string;
  info?: string;
  imagePath?: string;
}

export class Landmark {
  public id: string;
  public title: string;
  public info: string;
  public imagePath: string;
  public shortInfo: string;

  constructor( id: string, landmarkData: LandmarkData) {
    this.id = id;
    this.title = landmarkData.title;
    this.info = landmarkData.info;
    this.imagePath = landmarkData.imagePath;
    if (this.info.length > 20) {
      this.shortInfo = this.info.slice(0, 20);
    } else {
      this.shortInfo = this.info;
    }
  }
}
