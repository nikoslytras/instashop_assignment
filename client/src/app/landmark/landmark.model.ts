export interface LandmarkData {
  title: string;
  info: string;
  file: any;
  fileName: string;
  link: string;
}

export class Landmark {
  public id: string;
  public title: string;
  public info: string;
  public imagePath: string;
  public shortInfo: string;
  public file: any;
  public fileName: string;
  public link: string;

  constructor( id: string, landmarkData: LandmarkData) {
    this.id = id;
    this.title = landmarkData.title;
    this.info = landmarkData.info;
    this.file = landmarkData.file;
    this.fileName = landmarkData.fileName;
    this.link = landmarkData.link;
    this.imagePath = this.file.url();
    if (this.info.length > 20) {
      this.shortInfo = this.info.slice(0, 20) + "...";
    } else {
      this.shortInfo = this.info;
    }
  }
}
