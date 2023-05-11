import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

import { Landmark } from "../landmark.model";
import { LandmarkService } from "../landmark.service";

@Component({
  selector: "app-landmark-list",
  templateUrl: "./landmark-list.component.html",
  styleUrls: ["./landmark-list.component.css"],
})
export class LandmarkListComponent implements OnInit, OnDestroy {
  landmarks: Landmark[];
  subscription: Subscription;

  constructor(
    private landmarkService: LandmarkService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscription = this.landmarkService.landmarksChanged.subscribe(
      (landmarks: Landmark[]) => {
        this.landmarks = landmarks;
      }
    );
    this.landmarks = this.landmarkService.getLandmarks();
  }

  onNewLandmark() {
    this.router.navigate(["new"], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
