import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { Landmark } from "../landmark.model";
import { LandmarkService } from "../landmark.service";

@Component({
  selector: "app-landmark-detail",
  templateUrl: "./landmark-detail.component.html",
  styleUrls: ["./landmark-detail.component.css"],
})
export class LandmarkDetailComponent implements OnInit {
  landmark: Landmark;
  id: number;

  constructor(
    private landmarkService: LandmarkService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params["id"];
      this.landmark = this.landmarkService.getLandmark(this.id);
    });
  }

  onEditLandmark() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  onDeleteLandmark() {
    this.landmarkService.deleteLandmark(this.id);
    this.router.navigate(["/landmarks"]);
  }
}
