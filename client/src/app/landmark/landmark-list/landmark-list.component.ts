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

  constructor(
    private landmarkService: LandmarkService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
    this.subscription = this.landmarkService.landmarksChanged.subscribe(
      (landmarks: Landmark[]) => {
        this.landmarks = landmarks;
      }
    );
    this.landmarkService.getLandmarks().then((landmarks)=>{
      this.landmarks = landmarks
    });
  }

  onNewLandmark() {
    this.router.navigate(["new"], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
