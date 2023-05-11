import { Injectable } from "@angular/core";
import Parse from "parse";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ParseService {
  public Parse: any;
  constructor() {
    Parse.initialize(environment.APP_ID);
    Parse.serverURL = environment.SERVER_URL;
    this.Parse = Parse;
  }
}
