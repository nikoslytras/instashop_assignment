import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

import { ParseUserService } from "../services/parseUser.service";

import { User, UserData } from "./user.model";

import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private router: Router, private parseUserService: ParseUserService) {}

  async signup(username: string, password: string) {
    await this.parseUserService.signup(username, password);
  }

  async login(username: string, password: string) {
    const user = await this.parseUserService.login(username, password);
    await this.handleAuthentication(username, user.objectId, user.sessionToken);
  }

  autoLogin() {
    const user = this.parseUserService.getCurrentUser();
    if (!user) return;
    const userData: UserData = {
      id: user.id,
      sessionToken: user.getSessionToken(),
      username: user.getUsername()
    }
    console.log(JSON.stringify(userData));
    
    this.user.next(new User(userData));
    this.autoLogout(+environment.LOGOUT_TIMEOUT!);
  }

  async logout() {
    this.user.next(null);
    this.router.navigate(["/auth"]);
    await this.parseUserService.logout();
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private async handleAuthentication(
    username: string,
    id: string,
    sessionToken: string
  ) {
    const userData: UserData = {
      username,
      id,
      sessionToken
    };
    const user = new User(userData);
    this.user.next(user);
    this.autoLogout(+environment.LOGOUT_TIMEOUT);
  }
}
