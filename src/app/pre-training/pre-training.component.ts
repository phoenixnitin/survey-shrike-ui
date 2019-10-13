import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import {ConfigService} from "../shared/service/config.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-pre-training',
  templateUrl: './pre-training.component.html',
  styleUrls: ['./pre-training.component.scss']
})
export class PreTrainingComponent implements OnInit {
  constructor(public config: ConfigService, private router: Router) { }
  ngOnInit() {
    $('#form1').submit(function (e) {
      e.preventDefault();
    });
  }
  onsubmitPage1() {
    console.log('hello');
    this.router.navigate(['post-training']);
  }
}
