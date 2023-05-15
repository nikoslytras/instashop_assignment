import { Component, OnInit, OnDestroy, ElementRef } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { LandmarkService } from "../landmark/landmark.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;
  searchText: string;
  sortBy: string;
  ascendingOrder: boolean;
  options = [
    { label: "Title", value: "title" },
    { label: "Updated At", value: "_updated_at" },
    { label: "Created At", value: "_created_at" },
  ];
  isCollapsed = true;
  constructor(
    private authService: AuthService,
    private landmarkService: LandmarkService,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
    this.sortBy = "title";
    this.searchText = "";
    this.ascendingOrder = true;
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  /**
   * Triggers the search process
   */
  async onSearch() {
    await this.landmarkService.searchLandmarks(
      this.searchText,
      this.sortBy,
      this.ascendingOrder
    );
  }

  sortDataAccenting() {
    this.ascendingOrder = true;
  }

  sortDataDescending() {
    this.ascendingOrder = false;
  }
}
