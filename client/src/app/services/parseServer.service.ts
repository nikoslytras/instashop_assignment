import { Injectable } from "@angular/core";
import Parse from "parse";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ParseService {
  constructor() {
    Parse.initialize(environment.APP_ID);
    Parse.serverURL = environment.SERVER_URL;
  }

  async signup(username: string, password: string) {
    // signup user
    const user = await Parse.User.signUp(username, password);
    //return the "objectId" of the user.
    return {
      objectId: user.id,
    };
  }

  async login(username: string, password: string) {
    // login user
    const user = await Parse.User.logIn(username, password);
    
    //return the "objectId" and the "sessionToken" of the user.
    return {
      objectId: user.id,
      sessionToken: user.getSessionToken(),
    };
  }

  async logout() {
    // logout user
    await Parse.User.logOut();
  }

  getCurrentUser() {
    return Parse.User.current();
  }
}
