import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandmarksComponent } from './landmark/landmark.component';
import { LandmarkStartComponent } from './landmark/landmark-start/landmark-start.component';
import { LandmarkDetailComponent } from './landmark/landmark-detail/landmark-detail.component';
import { LandmarkEditComponent } from './landmark/landmark-edit/landmark-edit.component';
import { LandmarksResolverService } from './landmark/landmark-resolver.service';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';

const appRoutes: Routes = [
  { path: '', redirectTo: '/landmarks', pathMatch: 'full' },
  {
    path: 'landmarks',
    component: LandmarksComponent,
    children: [
      { path: '', component: LandmarkStartComponent },
      { path: 'new', component: LandmarkEditComponent },
      {
        path: ':id',
        component: LandmarkDetailComponent,
        resolve: [LandmarksResolverService]
      },
      {
        path: ':id/edit',
        component: LandmarkEditComponent,
        resolve: [LandmarksResolverService]
      }
    ]
  },
  { 
    path: 'auth', 
    canActivate: [AuthGuard],
    component: AuthComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
