import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth/auth.service";
import { Landmark } from "../landmark.model";
import { LandmarkService } from "../landmark.service";

@Component({
  selector: "app-landmark-list",
  templateUrl: "./landmark-list.component.html",
  styleUrls: ["./landmark-list.component.css"],
})
export class LandmarkListComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  landmarks: Landmark[];
  private subscription: Subscription;
  private userSub: Subscription;

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
    this.subscription = this.landmarkService.landmarksChanged.subscribe(
      (landmarks: Landmark[]) => {
        this.landmarks = landmarks;
        this.calculatePages();
      }
    );
    this.landmarkService.initializeLandmarks().then((landmarks)=>{
      this.landmarks = landmarks;
      this.calculatePages();
    });
  }

  async calculatePages() {
    const count = await this.landmarkService.count();
    let pages = Math.ceil(count / 3);
    this.pages = [];
    for (let index = 1; index <= pages; index++) {
      this.pages.push(index);
    }
    this.totalPages = this.pages.length;
  }

  async goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      await this.landmarkService.getLandmarks((pageNumber - 1) * 3);
      this.router.navigate(["/landmarks"]);
    }
  }

  onNewLandmark() {
    this.router.navigate(["new"], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
