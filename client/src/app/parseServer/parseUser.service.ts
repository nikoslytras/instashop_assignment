import { Injectable } from "@angular/core";
import { ParseService } from "./parseServer.service";

@Injectable({
  providedIn: "root",
})
export class ParseUserService extends ParseService {
  constructor() {
    super();
  }
  async signup(username: string, password: string) {
    // signup user
    const user = await this.Parse.User.signUp(username, password);
    //return the "objectId" of the user.
    return {
      objectId: user.id,
    };
  }

  async login(username: string, password: string) {
    // login user
    const user = await this.Parse.User.logIn(username, password);

    //return the "objectId" and the "sessionToken" of the user.
    return {
      objectId: user.id,
      sessionToken: user.getSessionToken(),
    };
  }

  async logout() {
    // logout user
    await this.Parse.User.logOut();
  }

  getCurrentUser() {
    return this.Parse.User.current();
  }
}
