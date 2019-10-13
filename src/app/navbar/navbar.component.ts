import { Component, OnInit } from '@angular/core';
import {AuthService} from "../shared/service/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

}
// <div *ngIf="auth.user$ | async as user">
//       <h3>Howdy, {{ user.displayName }}</h3>
//       <img  [src]="user.photoURL">
//       <p>UID: {{ user.uid }}</p>
//       <button (click)="auth.signOut()">Logout</button>
//     </div>
