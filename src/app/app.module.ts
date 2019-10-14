import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { ToastrModule } from 'ngx-toastr';

const config = {
  apiKey: "AIzaSyAPOGjpkY2gOW_uL7pvsmQCE0G-CPh4b1Q",
  authDomain: "survey-255712.firebaseapp.com",
  databaseURL: "https://survey-255712.firebaseio.com",
  projectId: "survey-255712",
  storageBucket: "survey-255712.appspot.com",
  messagingSenderId: "918568266858",
  appId: "1:918568266858:web:dc7d07b8939956eb34ee13",
  measurementId: "G-HL63EVF7G4"
};

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PreTrainingComponent } from './pre-training/pre-training.component';
import { PostTrainingComponent } from './post-training/post-training.component';
import { NotExistComponent } from './not-exist/not-exist.component';
import { NavbarComponent } from './navbar/navbar.component';
import {AuthGuardService} from "./shared/service/auth-guard.service";
import {AuthService} from "./shared/service/auth.service";
import {ConfigService} from "./shared/service/config.service";
import {CookieService} from "ngx-cookie-service";
import {AngularFontAwesomeModule} from "angular-font-awesome";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PreTrainingComponent,
    PostTrainingComponent,
    NotExistComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [AuthGuardService, AuthService, ConfigService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
