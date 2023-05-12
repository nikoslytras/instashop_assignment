import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LandmarksComponent } from "./landmark/landmark.component";
import { LandmarkStartComponent } from "./landmark/landmark-start/landmark-start.component";
import { LandmarkDetailComponent } from "./landmark/landmark-detail/landmark-detail.component";
import { LandmarkEditComponent } from "./landmark/landmark-edit/landmark-edit.component";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./auth/auth.guard";

const appRoutes: Routes = [
  { path: "", redirectTo: "/landmarks", pathMatch: "full" },
  {
    path: "landmarks",
    component: LandmarksComponent,
    children: [
      { path: "", component: LandmarkStartComponent },
      {
        path: "new",
        component: LandmarkEditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: ":id",
        component: LandmarkDetailComponent,
      },
      {
        path: ":id/edit",
        component: LandmarkEditComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: "auth",
    component: AuthComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
