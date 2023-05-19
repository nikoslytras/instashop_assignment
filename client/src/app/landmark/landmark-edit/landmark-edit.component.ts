import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PlaceholderDirective } from "../../shared/placeholder/placeholder.directive";
import { AlertComponent } from "../../shared/alert/alert.component";
import { LandmarkService } from "../landmark.service";
import { Subscription } from "rxjs";
import { FILE_MAX_SIZE } from "src/app/shared/constants";

@Component({
  selector: "app-landmark-edit",
  templateUrl: "./landmark-edit.component.html",
  styleUrls: ["./landmark-edit.component.css"],
})
export class LandmarkEditComponent implements OnInit, OnDestroy {
  id: string;
  editMode = false;
  landmarkForm: FormGroup;
  error: string = null;
  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;
  private closeSub: Subscription;

  selectedFile: any;
  fileName: string;

  constructor(
    private route: ActivatedRoute,
    private landmarkService: LandmarkService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.selectedFile = undefined;
      this.fileName = undefined;
      this.id = params["id"];
      this.editMode = params["id"] != null;
      this.initForm();
    });
  }

  /**
   * Handles the submit of the form
   */
  async onSubmit() {
    try {
      if (this.selectedFile) {
        this.landmarkForm.value.fileName = this.fileName;
      }
      if (this.editMode) {
        await this.landmarkService.updateLandmark(
          this.id,
          this.landmarkForm.value,
          this.selectedFile
        );
      } else {
        await this.landmarkService.addLandmark(this.landmarkForm.value, this.selectedFile);
      }
      this.onCancel();
    } catch (error) {
      const errorMessage = error.message;
      console.log(errorMessage);
      this.error = errorMessage;
      this.showErrorAlert(errorMessage);
    }
  }

  onCancel() {
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  /**
   * Initializes the form.
   */
  private initForm() {
    let landmarkTitle = "";
    let landmarkInfo = "";
    let landmarkLink = "";

    if (this.editMode) {
      const landmark = this.landmarkService.getLandmark(this.id);
      if (!landmark) this.router.navigate(["/landmarks"]);
      landmarkTitle = landmark.title;
      landmarkInfo = landmark.info;
      landmarkLink = landmark.link;
      this.fileName = landmark.fileName;
    }

    this.landmarkForm = new FormGroup({
      title: new FormControl(landmarkTitle, [
        Validators.required,
        Validators.maxLength(15),
      ]),
      info: new FormControl(landmarkInfo, Validators.required),
      link: new FormControl(landmarkLink, Validators.required),
    });
  }

  ngOnDestroy() {
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
      this.onCancel();
    });
  }

  /**
   * Handles the file selection.
   */
  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length) {
      this.selectedFile = event.target.files[0];
      const fileSizeInMB = this.selectedFile.size / (1024 * 1024);
      if (fileSizeInMB > FILE_MAX_SIZE) {
        this.fileName =
          this.selectedFile.name +
          " WARNING: file size should be less than 5MB";
      } else {
        this.fileName = this.selectedFile.name;
      }
    }
  }
}
