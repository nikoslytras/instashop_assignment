import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

import { ParseUserService } from "../parseServer/parseUser.service";

import { User, UserData } from "./user.model";

import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(
    private router: Router,
    private parseUserService: ParseUserService
  ) {}

  /**
   * Creates a new user in DB.
   * @param {string} username The username.
   * @param {string} password The password.
   */
  async signup(username: string, password: string) {
    await this.parseUserService.signup(username, password);
  }

  /**
   * Logins a user
   * @param {string} username The username.
   * @param {string} password The password.
   */
  async login(username: string, password: string) {
    const user = await this.parseUserService.login(username, password);
    await this.handleAuthentication(username, user.objectId, user.sessionToken);
  }

  /**
   * Auto login functionality for the user to remain logged in even
   * when the page reloads
   */
  autoLogin() {
    const user = this.parseUserService.getCurrentUser();
    if (!user) return;
    const userData: UserData = {
      id: user.id,
      sessionToken: user.getSessionToken(),
      username: user.getUsername(),
    };
    this.parseUserService.become(userData.sessionToken).then(()=>{
      this.user.next(new User(userData));
      this.autoLogout(+environment.LOGOUT_TIMEOUT!);
    }).catch((err)=>{
      console.log(err.message);
      this.logout();
    })
  }

  /**
   * Logout a user
   */
  async logout() {
    this.user.next(null);
    this.router.navigate(["/auth"]);
    await this.parseUserService.logout();
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  /**
   * A timer to auto logout non active user.
   * @param {number} expirationDuration The time to logout the user in milliseconds.
   */
  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  /**
   * Handles the user authorization process
   * @param {string} username The username
   * @param {string} id The user's id
   * @param {string} sessionToken The user's session token.
   */
  private async handleAuthentication(
    username: string,
    id: string,
    sessionToken: string
  ) {
    const userData: UserData = {
      username,
      id,
      sessionToken,
    };
    const user = new User(userData);
    this.user.next(user);
    this.autoLogout(+environment.LOGOUT_TIMEOUT);
  }

  /**
   * Get's the current logged in Parse user instance.
   * @returns {object} The current logged in Parse user instance.
   */
  getCurrentUser() {
    return this.parseUserService.getCurrentUser();
  }
}
