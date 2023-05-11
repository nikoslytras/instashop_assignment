import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LandmarksComponent } from './landmark/landmark.component';
import { LandmarkListComponent } from './landmark/landmark-list/landmark-list.component';
import { LandmarkDetailComponent } from './landmark/landmark-detail/landmark-detail.component';
import { LandmarkItemComponent } from './landmark/landmark-list/landmark-item/landmark-item.component'
import { DropdownDirective } from './shared/dropdown.directive';
import { AppRoutingModule } from './app-routing.module';
import { LandmarkStartComponent } from './landmark/landmark-start/landmark-start.component';
import { LandmarkEditComponent } from './landmark/landmark-edit/landmark-edit.component';
import { LandmarkService } from './landmark/landmark.service';
import { AuthComponent } from './auth/auth.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AlertComponent } from './shared/alert/alert.component';
import { PlaceholderDirective } from './shared/placeholder/placeholder.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LandmarksComponent,
    LandmarkListComponent,
    LandmarkDetailComponent,
    LandmarkItemComponent,
    DropdownDirective,
    LandmarkStartComponent,
    LandmarkEditComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    AlertComponent,
    PlaceholderDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    LandmarkService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
