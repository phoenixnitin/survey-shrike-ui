import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {AuthService} from "../shared/service/auth.service";
import {ConfigService} from "../shared/service/config.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public auth: AuthService, public config: ConfigService) {
  }

  ngOnInit() {
  }

  showLogin() {
    $('#signin-form').removeClass('hide');
    $('#signup-form').addClass('hide');
  }

  showSignup() {
    $('#signin-form').addClass('hide');
    $('#signup-form').removeClass('hide');
  }
 }
