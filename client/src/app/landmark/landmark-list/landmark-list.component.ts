import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth/auth.service";
import { Landmark } from "../landmark.model";
import { LandmarkService } from "../landmark.service";
import { QUERY_LIMIT } from "src/app/shared/constants";

@Component({
  selector: "app-landmark-list",
  templateUrl: "./landmark-list.component.html",
  styleUrls: ["./landmark-list.component.css"],
})
export class LandmarkListComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  landmarks: Landmark[];
  private getSubscription: Subscription;
  private searchSubscription: Subscription;
  private userSub: Subscription;
  isLoading = false;

  currentPage = 1;
  pages = [];
  totalPages = 0;

  constructor(
    private landmarkService: LandmarkService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
    this.getSubscription = this.landmarkService.landmarksChanged.subscribe(
      (landmarks: Landmark[]) => {
        this.landmarks = landmarks;
        this.calculateGetPages();
      }
    );
    this.searchSubscription =
      this.landmarkService.landmarksSearchResultChanged.subscribe(
        (landmarks: Landmark[]) => {
          this.landmarks = landmarks;
          this.currentPage = 1;
          this.pages = [];
          this.totalPages = 0;
        }
      );
    this.isLoading = true;
    this.landmarkService.initializeLandmarks().then((landmarks) => {
      this.landmarks = landmarks;
      this.calculateGetPages();
      this.isLoading = false;
    });
  }

  /**
   * Calculates the number of pagination pages.
   */
  async calculateGetPages() {
    const count = await this.landmarkService.count();
    let pages = Math.ceil(count / QUERY_LIMIT);
    this.pages = [];
    for (let index = 1; index <= pages; index++) {
      this.pages.push(index);
    }
    this.totalPages = this.pages.length;
  }

  /**
   * Handles the click of a specific page.
   */
  async goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.isLoading = true;
      await this.landmarkService.getLandmarks((pageNumber - 1) * QUERY_LIMIT);
      this.isLoading = false;
      this.router.navigate(["/landmarks"]);
    }
  }

  /**
   * Triggers the new landmark process.
   */
  onNewLandmark() {
    this.router.navigate(["new"], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.getSubscription.unsubscribe();
    this.searchSubscription.unsubscribe();
    this.userSub.unsubscribe();
  }
}
