import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user'; // optional

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {CookieService} from "ngx-cookie-service";
import {createUrlResolverWithoutPackagePrefix} from "@angular/compiler";
import {ConfigService} from "./config.service";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isloggedIn: boolean;
  checking: boolean = true;
  user$: Observable<User>;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router, private cookieService: CookieService, private config: ConfigService, private toastr: ToastrService) {
    if (this.cookieService.check('user')) {
      this.isloggedIn=true;
      this.updateUserData(JSON.parse(this.cookieService.get('user')));
    } else {
      this.isloggedIn=false;
    }
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        // Logged in
        if (user) {
          this.isloggedIn=true;
          this.config.surveyDataPreTraining.email = user.email;
          this.config.surveyDataPostTraining.email = user.email;
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          this.isloggedIn=false;
          return of(null);
        }
      })
    );
    this.afAuth.authState.pipe()
  }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.afterSignIn(credential);
  }

  async facebookSignin() {
    const provider = new auth.FacebookAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider).then(success => {
      return this.afterSignIn(success);
    }, failed => {
      this.toastr.error("Login Failed");
      return failed;
    });
  }

  async emailcreateaccount() {
    console.log('hi');
    if (this.config.userCurrentPass == this.config.userRepeatPass) {
      const credential = await this.afAuth.auth.createUserWithEmailAndPassword(this.config.userEmail, this.config.userCurrentPass);
      return this.afterSignIn(credential);
    } else {
      alert("Password do not match");
    }
  }

  async emailsignin() {
    console.log('hi');
    const credential = await this.afAuth.auth.signInWithEmailAndPassword(this.config.userEmail, this.config.userCurrentPass);
    return this.afterSignIn(credential);
  }

  afterSignIn(credential) {
    let that= this;
    this.afAuth.auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
      // console.log(idToken);
      that.isloggedIn=true;
      let currentdate = new Date();
      currentdate.setMinutes(currentdate.getMinutes() + 30);
      that.cookieService.set('user', JSON.stringify(credential.user), currentdate);
    }).catch(function(error) {
      // Handle error
      that.isloggedIn=false;
      console.log(error);
    });
    return this.updateUserData(credential.user);
  }

  isUserLoggedIn(): boolean {
    return this.isloggedIn;
  }

  updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
    this.config.surveyDataPreTraining.email = user.email;
    this.config.surveyDataPostTraining.email = user.email;
    return userRef.set(data, { merge: true })
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.isloggedIn = false;
    this.router.navigate(['/home']);
    this.config.displayName = '';
    this.config.userEmail = '';
    this.config.userRepeatPass = '';
    this.config.userCurrentPass = '';
  }
}
