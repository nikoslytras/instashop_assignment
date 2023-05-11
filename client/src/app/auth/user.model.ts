export class User {
  public username: string;
  public id: string;
  public sessionToken: string
  constructor(
    userData: UserData
  ) {
    this.username = userData.username;
    this.id = userData.id;
    this.sessionToken = userData.sessionToken;
  }
}

export interface UserData {
  username: string;
  id: string;
  sessionToken: string
}
