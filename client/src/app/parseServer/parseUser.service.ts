import { Injectable } from "@angular/core";
import { ParseService } from "./parseServer.service";

@Injectable({
  providedIn: "root",
})
export class ParseUserService extends ParseService {
  constructor() {
    super();
  }

  /**
   * Creates a new user in DB.
   * @param {string} username The username.
   * @param {string} password The password.
   * @returns {object} The id of the user.
   */
  async signup(username: string, password: string) {
    // signup user
    const user = await this.Parse.User.signUp(username, password);
    //return the "objectId" of the user.
    return {
      objectId: user.id,
    };
  }

  /**
   * Logins a user
   * @param {string} username The username.
   * @param {string} password The password.
   * @returns {object} The id and session token of the user.
   */
  async login(username: string, password: string) {
    const user = await this.Parse.User.logIn(username, password);

    return {
      objectId: user.id,
      sessionToken: user.getSessionToken(),
    };
  }

  /**
   * Logout the current user
   */
  async logout() {
    await this.Parse.User.logOut();
  }

  /**
   * Returns the current logged in user.
   * @returns {object} The the user.
   */
  getCurrentUser() {
    return this.Parse.User.current();
  }
}
