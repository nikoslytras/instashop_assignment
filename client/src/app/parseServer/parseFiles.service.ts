import { Injectable } from "@angular/core";
import { ParseService } from "./parseServer.service";

@Injectable({
  providedIn: "root",
})
export class ParseFilesService extends ParseService {
  constructor() {
    super();
  }
  async uploadFile(name: string, file: any){
    const parseFile = new this.Parse.File(name, file);
    const result = await parseFile.save();
    console.log(result);
    return result;
  }
}
