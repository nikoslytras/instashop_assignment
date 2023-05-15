import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { Landmark } from "../landmark.model";
import { LandmarkService } from "../landmark.service";
import { AuthService } from "../../auth/auth.service";
import { Subscription } from "rxjs";
import { PlaceholderDirective } from "src/app/shared/placeholder/placeholder.directive";
import { AlertComponent } from "src/app/shared/alert/alert.component";

@Component({
  selector: "app-landmark-detail",
  templateUrl: "./landmark-detail.component.html",
  styleUrls: ["./landmark-detail.component.css"],
})
export class LandmarkDetailComponent implements OnInit, OnDestroy {
  landmark: Landmark;
  id: string;
  isAuthenticated = false;
  private userSub: Subscription;
  error: string = null;
  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;
  private closeSub: Subscription;

  constructor(
    private landmarkService: LandmarkService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
    this.route.params.subscribe((params: Params) => {
      this.id = params["id"];
      this.landmark = this.landmarkService.getLandmark(this.id);
      if (!this.landmark) {
        this.router.navigate(["/landmarks"]);
      }
    });
  }

  /**
   * Triggers the edit process.
   */
  onEditLandmark() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  /**
   * Triggers the delete process.
   */
  async onDeleteLandmark() {
    try {
      await this.landmarkService.deleteLandmark(this.id);
      this.router.navigate(["/landmarks"]);
    } catch (error) {
      const errorMessage = error.message;
      console.log(errorMessage);
      this.error = errorMessage;
      this.showErrorAlert(errorMessage);
    }
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

  /**
   * Creates the error popup
   * @param {string} message The error to be displayed.
   */
  private showErrorAlert(message: string) {
    const alertCmpFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      this.router.navigate(["/landmarks"]);
    });
  }
}
