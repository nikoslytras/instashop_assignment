import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { LandmarkService } from '../landmark.service';

@Component({
  selector: 'app-landmark-edit',
  templateUrl: './landmark-edit.component.html',
  styleUrls: ['./landmark-edit.component.css']
})
export class LandmarkEditComponent implements OnInit {
  id: number;
  editMode = false;
  landmarkForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private landmarkService: LandmarkService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.landmarkService.updateLandmark(this.id, this.landmarkForm.value);
    } else {
      this.landmarkService.addLandmark(this.landmarkForm.value);
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private initForm() {
    let landmarkName = '';
    let landmarkImagePath = '';
    let landmarkDescription = '';

    if (this.editMode) {
      const landmark = this.landmarkService.getLandmark(this.id);
      landmarkName = landmark.name;
      landmarkImagePath = landmark.imagePath;
      landmarkDescription = landmark.description;
    }

    this.landmarkForm = new FormGroup({
      name: new FormControl(landmarkName, Validators.required),
      imagePath: new FormControl(landmarkImagePath, Validators.required),
      description: new FormControl(landmarkDescription, Validators.required)
    });
  }
}
