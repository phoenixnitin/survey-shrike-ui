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
  emailVerified = false;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router, private cookieService: CookieService, private config: ConfigService, private toastr: ToastrService) {
    this.isloggedIn = this.cookieService.check('user');
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        // Logged in
        if (user) {
          this.isloggedIn=true;
          this.config.surveyDataPreTraining.email = user.email;
          this.config.surveyDataPostTraining.email = user.email;
          this.emailVerified = user.emailVerified;
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
    const credential = await this.afAuth.auth.signInWithPopup(provider).then(
      success => {
        this.emailVerified = success.user.emailVerified;
        if (!this.emailVerified) {
          if (success.additionalUserInfo.isNewUser) {
            this.resendVerificationEmail();
          }
        }
        return success;
      }, failed => {
        this.toastr.error(failed.message, 'SignIn Failed');
      }
    );
    return this.afterSignIn(credential);
  }

  async facebookSignin() {
    const provider = new auth.FacebookAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider).then(success => {
      this.emailVerified = success.user.emailVerified;
      if (!this.emailVerified) {
        if (success.additionalUserInfo.isNewUser) {
          this.resendVerificationEmail();
        }
      }
      return this.afterSignIn(success);
    }, failed => {
      this.toastr.error(failed.message, "SignIn Failed");
      return failed;
    });
  }

  async emailcreateaccount() {
    if (this.config.displayName.trim().length > 0 && this.config.userEmail.trim().length > 0) {
      if (this.config.userCurrentPass == this.config.userRepeatPass) {
        const credential = await this.afAuth.auth.createUserWithEmailAndPassword(this.config.userEmail, this.config.userCurrentPass).then(
          success => {
            this.emailVerified = success.user.emailVerified;
            if (!this.emailVerified) {
              if (success.additionalUserInfo.isNewUser) {
                this.resendVerificationEmail();
              }
            }
            return success;
          }, failed => {
            this.toastr.error(failed.message, 'SignUp Failed');
          }
        );
        return this.afterSignIn(credential, this.config.displayName);
      } else {
        this.toastr.error("Password do not match");
      }
    } else {
      this.toastr.error("Please fill the required fields");
    }
  }

  async emailsignin() {
    // console.log('hi');
    const credential = await this.afAuth.auth.signInWithEmailAndPassword(this.config.userEmail, this.config.userCurrentPass).then(
      success => {
        this.emailVerified = success.user.emailVerified;
        return success;
      }, failed => {
        this.toastr.error(failed.message, 'Login Failed');
      }
    );
    return this.afterSignIn(credential, null, true);
  }

  afterSignIn(credential, displayname=null, emailSignIn=false) {
    let that= this;
    this.afAuth.auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
      // console.log(idToken);
      that.isloggedIn=true;
      let currentdate = new Date();
      currentdate.setMinutes(currentdate.getMinutes() + 30);
      let jsonStr = JSON.stringify(credential.user);
      if (displayname != null) {
        jsonStr = jsonStr.replace('"displayName":null', '"displayName": "'+ displayname + '"');
      }
      that.cookieService.set('user', jsonStr, currentdate);
    }).catch(function(error) {
      // Handle error
      that.isloggedIn=false;
      console.log(error);
    });
    if (emailSignIn == false) {
      if (displayname == null){
        return this.updateUserData(credential.user);
      } else {
        return this.updateUserForEmail(credential.user, displayname);
      }
    }
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
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    this.config.surveyDataPreTraining.email = user.email;
    this.config.surveyDataPostTraining.email = user.email;
    return userRef.set(data, { merge: true })
  }
  updateUserForEmail(user, displayname) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: displayname,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    this.config.surveyDataPreTraining.email = user.email;
    this.config.surveyDataPostTraining.email = user.email;
    return userRef.set(data, { merge: true })
  }

  resendVerificationEmail() {
    this.afAuth.auth.currentUser.sendEmailVerification().then(success => {
      this.toastr.success("Verification e-mail sent successfully.");
    }, failed => {
      this.toastr.error(failed.message, "Error Sending Verification E-Mail");
    });
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.isloggedIn = false;
    this.emailVerified = false;
    this.router.navigate(['/home']);
    this.config.displayName = '';
    this.config.userEmail = '';
    this.config.userRepeatPass = '';
    this.config.userCurrentPass = '';
    this.config.surveyDataPreTraining = {
      email: '',
      attend: 'yes',
      attendReason: '',
      eventReason: '',
      topic: ''
    };
    this.config.surveyDataPostTraining = {
      email: '',
      name: '',
      training: '',
      satisfiedLevel: '5',
      quality: '',
      attendBefore: 'no',
      attendReasonPost: '',
      recommend: 'yes',
      comments: ''
    };
  }
}
